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
    appendFileState: (state, action) => {
      return [...state, action.payload];
    },
  },
});

export const { setFilesState, appendFileState } = fileSlice.actions;

export default fileSlice.reducer;

export const initializeFiles = (id) => async (dispatch) => {
  try {
    const files = await FileService.getAll(id);
    dispatch(setFilesState(files));
    console.log(files);
  } catch (err) {
    dispatch(displayMessage(err.response.data.error, "error", 5));
  }
};

export const uploadFile = (file) => async (dispatch) => {
  try {
    const newFile = await FileService.create(file);
    dispatch(displayMessage("File uploaded successfully", "success", 5));
    dispatch(appendFileState(newFile));
  } catch (err) {
    dispatch(displayMessage(err.response.data.error, "error", 5));
  }
};
