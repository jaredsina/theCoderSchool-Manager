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
    deleteFileState: (state, action) => {
      return state.filter((file) => file.id !== action.payload);
    },
  },
});

export const { setFilesState, appendFileState, deleteFileState } =
  fileSlice.actions;

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

export const deleteFile = (id) => async (dispatch) => {
  try {
    await FileService.deleteFile(id);
    dispatch(displayMessage("File deleted successfully", "success", 5));
    dispatch(deleteFileState(id));
  } catch (err) {
    dispatch(displayMessage(err.response.data.error, "error", 5));
  }
};
