import { createSlice } from "@reduxjs/toolkit";
import PartnerService from "../services/partner";
import { displayMessage } from "./notificationReducer";
import { updateProgramState } from "./programsReducer";

const partnerSlice = createSlice({
  name: "partners",
  initialState: [],
  reducers: {
    setPartnersState: (state, action) => {
      return action.payload;
    },
    appendPartnerState: (state, action) => {
      return [...state, action.payload];
    },
    removeAllPartnersState: (state, action) => {
      return [];
    },
    deletePartnerFromState: (state, action) => {
      return state.filter((partner) => partner.id !== action.payload);
    },
    updatePartnerState: (state, action) => {
      return state.map((partner) =>
        partner.id !== action.payload.id ? partner : action.payload,
      );
    },
    removeProgramFromPartnerState: (state, action) => {
      return state.map((partner) => {
        if (partner.id !== action.payload.partnerId) {
          return partner;
        }
        return {
          ...partner,
          programs: partner.programs.filter(
            (program) => program.id !== action.payload.programId,
          ),
        };
      });
    },
    addProgramToPartnerState: (state, action) => {
      return state.map((partner) => {
        if (partner.id !== action.payload.partnerId) {
          return partner;
        }
        return {
          ...partner,
          programs: [...partner.programs, action.payload.program],
        };
      });
    },
  },
});

export const {
  setPartnersState,
  appendPartnerState,
  removeAllPartnersState,
  deletePartnerFromState,
  updatePartnerState,
  removeProgramFromPartnerState,
  addProgramToPartnerState,
} = partnerSlice.actions;

export default partnerSlice.reducer;

export const initializePartners = () => async (dispatch) => {
  try {
    const partners = await PartnerService.getAll();
    dispatch(setPartnersState(partners));
  } catch (err) {
    console.log(err);
    dispatch(displayMessage("Error loading partners", "error", 5));
  }
};

export const addPartner = (partner) => async (dispatch) => {
  try {
    const newPartner = await PartnerService.create(partner);
    dispatch(appendPartnerState(newPartner));
    dispatch(displayMessage("Partner added", "success", 5));
  } catch (err) {
    dispatch(displayMessage("Error adding partner", "error", 5));
    console.log(err);
  }
};

export const removePartner = (partnerToBeDeleted) => async (dispatch) => {
  try {
    const deletedPartner = await PartnerService.deletePartner(
      partnerToBeDeleted.id,
    );
    dispatch(displayMessage("Partner deleted", "success", 5));
    dispatch(deletePartnerFromState(deletedPartner.id));
    // delete the partner from the programs that have it
    if (partnerToBeDeleted.programs) {
      partnerToBeDeleted.programs.forEach((program) => {
        dispatch(
          updateProgramState({
            ...program,
            partner: null,
          }),
        );
      });
    }
  } catch (err) {
    dispatch(displayMessage("Error deleting partner", "error", 5));
    console.log(err);
  }
};

export const updatePartner = (partner) => async (dispatch) => {
  try {
    const updatedPartner = await PartnerService.update(partner.id, partner);
    dispatch(updatePartnerState(updatedPartner));
    dispatch(
      displayMessage(`Edited ${updatedPartner.name}updated`, "success", 5),
    );
    const updatedPartnerWithoutPrograms = { ...updatedPartner };
    delete updatedPartnerWithoutPrograms.programs;

    if (updatedPartner.programs) {
      updatedPartner.programs.forEach((program) => {
        dispatch(
          updateProgramState({
            ...program,
            partner: updatedPartnerWithoutPrograms,
          }),
        );
      });
    }
  } catch (err) {
    dispatch(displayMessage("Error updating partner", "error", 5));
    console.log(err);
  }
};
