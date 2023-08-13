import { createSlice } from "@reduxjs/toolkit";
import FileService from "../services/file";
import { displayMessage } from "./notificationReducer";

const fileSlice = createSlice({
  name: "files",
  initialState: [],
  reducers: {
    setFilesState: (state, action) => {
      return action.payload;
    },
  },
});

export const { setFilesState } = fileSlice.actions;

export default fileSlice.reducer;

export const initializeFiles = () => async (dispatch) => {
  try {
    const files = await FileService.getAll();
    dispatch(setFilesState(files));
  } catch (err) {
    dispatch(displayMessage(err.response.data.error, "error", 5));
  }
};
