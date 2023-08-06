import { createSlice } from "@reduxjs/toolkit";
import PartnerService from "../services/partner";
import { displayMessage } from "./notificationReducer";

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
  },
});

export const {
  setPartnersState,
  appendPartnerState,
  removeAllPartnersState,
  deletePartnerFromState,
  updatePartnerState,
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

export const deletePartner = (id) => async (dispatch) => {
  try {
    await PartnerService.remove(id);
    dispatch(displayMessage("Partner deleted", "success", 5));
    dispatch(deletePartnerFromState(id));
  } catch (err) {
    dispatch(displayMessage("Error deleting partner", "error", 5));
    console.log(err);
  }
};

export const updatePartner = (partner) => async (dispatch) => {
  try {
    const updatedPartner = await PartnerService.update(partner);
    dispatch(updatePartnerState(updatedPartner));
    dispatch(displayMessage("Partner updated", "success", 5));
  } catch (err) {
    dispatch(displayMessage("Error updating partner", "error", 5));
    console.log(err);
  }
};
