import { createSlice } from "@reduxjs/toolkit";
import ProgramService from "../services/program";
import { logout } from "./authReducer";
import { displayMessage } from "./notificationReducer";
import {
  removeProgramFromPartnerState,
  addProgramToPartnerState,
} from "./partnersReducer";

const programsSlice = createSlice({
  name: "programs",
  initialState: [],
  reducers: {
    setProgramsState: (state, action) => {
      return action.payload;
    },
    appendProgramState: (state, action) => {
      return [...state, action.payload];
    },
    removeAllProgramsState: (state, action) => {
      return [];
    },
    deleteProgramState: (state, action) => {
      return state.filter((program) => program.id !== action.payload);
    },
    updateProgramState: (state, action) => {
      return state.map((program) =>
        program.id !== action.payload.id ? program : action.payload,
      );
    },
  },
});

export const {
  setProgramsState,
  appendProgramState,
  removeAllProgramsState,
  deleteProgramState,
  updateProgramState,
} = programsSlice.actions;

export default programsSlice.reducer;

export const initializePrograms = () => async (dispatch) => {
  try {
    const programs = await ProgramService.getAll();
    dispatch(setProgramsState(programs));
  } catch (err) {
    if (err.response.data.error === "token expired") {
      // if the token has expired, log the user out
      dispatch(logout());
      dispatch(removeAllProgramsState());
      dispatch(
        displayMessage("Session expired, please login again", "error", 5),
      );
    } else {
      dispatch(logout());
      dispatch(removeAllProgramsState());
    }
  }
};

export const addProgram = (program) => async (dispatch) => {
  try {
    const newProgram = await ProgramService.create(program);
    dispatch(displayMessage(`Added ${newProgram.name}`, "success", 5));
    dispatch(appendProgramState(newProgram));
    if (newProgram.partner) {
      dispatch(
        addProgramToPartnerState({
          program: newProgram,
          partnerId: newProgram.partner.id,
        }),
      );
    }
  } catch (err) {
    dispatch(displayMessage("Error adding program", "error", 5));
  }
};

export const removeProgram = (id) => async (dispatch) => {
  try {
    const deletedProgram = await ProgramService.deleteProgram(id);
    dispatch(displayMessage("Program deleted", "success", 5));
    dispatch(deleteProgramState(id));
    dispatch(
      removeProgramFromPartnerState({
        programId: deletedProgram.id,
        partnerId: deletedProgram.partner,
      }),
    );
  } catch (err) {
    dispatch(displayMessage("Error deleting program", "error", 5));
  }
};

export const updateProgram = (program, oldProgram) => async (dispatch) => {
  try {
    const editedProgram = await ProgramService.update(program.id, program);
    dispatch(displayMessage(`Edited ${editedProgram.name}`, "success", 5));
    dispatch(updateProgramState(editedProgram));

    // if updated program partner was changed, update partner state with the new program
    if (
      oldProgram.partner &&
      editedProgram.partner &&
      oldProgram.partner.id !== editedProgram.partner.id
    ) {
      const editProgramWithoutPartner = { ...editedProgram };
      delete editProgramWithoutPartner.partner;

      dispatch(
        addProgramToPartnerState({
          program: editProgramWithoutPartner,
          partnerId: editedProgram.partner.id,
        }),
      );
      dispatch(
        removeProgramFromPartnerState({
          programId: editedProgram.id,
          partnerId: oldProgram.partner.id,
        }),
      );
    } else if (!oldProgram.partner && editedProgram.partner) {
      const editProgramWithoutPartner = { ...editedProgram };
      delete editProgramWithoutPartner.partner;

      dispatch(
        addProgramToPartnerState({
          program: editProgramWithoutPartner,
          partnerId: editedProgram.partner.id,
        }),
      );
    } else if (oldProgram.partner && !editedProgram.partner) {
      dispatch(
        removeProgramFromPartnerState({
          programId: editedProgram.id,
          partnerId: oldProgram.partner.id,
        }),
      );
    } else if (oldProgram.partner.id === editedProgram.partner.id) {
      // add updated program to partner state
      const editProgramWithoutPartner = { ...editedProgram };
      delete editProgramWithoutPartner.partner;
      // remove old program from partner state
      dispatch(
        removeProgramFromPartnerState({
          programId: editedProgram.id,
          partnerId: oldProgram.partner.id,
        }),
      );
      // add updated program to partner state
      dispatch(
        addProgramToPartnerState({
          program: editProgramWithoutPartner,
          partnerId: editedProgram.partner.id,
        }),
      );
    }
  } catch (err) {
    dispatch(displayMessage("Error editing program", "error", 5));
  }
};
