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
  },
});

export const { setPrograms } = programsSlice.actions;

export default programsSlice.reducer;

export const initializePrograms = () => async (dispatch) => {
  try {
    const programs = await ProgramService.getAll();
    dispatch(setPrograms(programs));
  } catch (err) {
    dispatch(logout());
    dispatch(displayMessage("Session expired, please login again", "error", 5));
  }
};
