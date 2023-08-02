import { createSlice } from "@reduxjs/toolkit";
import ProgramService from "../services/program";
import { logout } from "./authReducer";
import { displayMessage } from "./notificationReducer";

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
  },
});

export const {
  setProgramsState,
  appendProgramState,
  removeAllProgramsState,
  deleteProgramState,
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
  } catch (err) {
    dispatch(displayMessage("Error adding program", "error", 5));
  }
};

export const removeProgram = (id) => async (dispatch) => {
  try {
    await ProgramService.deleteProgram(id);
    dispatch(displayMessage("Program deleted", "success", 5));
    dispatch(deleteProgramState(id));
  } catch (err) {
    dispatch(displayMessage("Error deleting program", "error", 5));
  }
};
