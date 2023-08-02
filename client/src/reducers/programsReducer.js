import { createSlice } from "@reduxjs/toolkit";
import ProgramService from "../services/program";
import { logout } from "./authReducer";
import { displayMessage } from "./notificationReducer";

const programsSlice = createSlice({
  name: "programs",
  initialState: [],
  reducers: {
    setPrograms: (state, action) => {
      return action.payload;
    },
    appendProgram: (state, action) => {
      return [...state, action.payload];
    },
    removeAllPrograms: (state, action) => {
      return [];
    },
  },
});

export const { setPrograms, appendProgram, removeAllPrograms } =
  programsSlice.actions;

export default programsSlice.reducer;

export const initializePrograms = () => async (dispatch) => {
  try {
    const programs = await ProgramService.getAll();
    dispatch(setPrograms(programs));
  } catch (err) {
    if (err.response.data.error === "token expired") {
      // if the token has expired, log the user out
      dispatch(logout());
      dispatch(removeAllPrograms());
      dispatch(
        displayMessage("Session expired, please login again", "error", 5),
      );
    } else {
      dispatch(logout());
      dispatch(removeAllPrograms());
    }
  }
};

export const addProgram = (program) => async (dispatch) => {
  try {
    const newProgram = await ProgramService.create(program);
    dispatch(displayMessage(`Added ${newProgram.name}`, "success", 5));
    dispatch(appendProgram(newProgram));
  } catch (err) {
    dispatch(displayMessage("Error adding program", "error", 5));
  }
};
