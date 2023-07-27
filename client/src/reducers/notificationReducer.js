import { createSlice } from "@reduxjs/toolkit";

const noticationSlice = createSlice({
  name: "notitication",
  initialState: { message: null, type: null },
  reducers: {
    setNotification: (state, action) => {
      return {
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    resetNotification: (state, action) => {
      return { message: action.payload.message, type: action.payload.type };
    },
  },
});

export const { setNotification, resetNotification } = noticationSlice.actions;

export default noticationSlice.reducer;

export const displayMessage = (message, type, time) => async (dispatch) => {
  dispatch(setNotification({ message, type }));
  setTimeout(() => {
    dispatch(resetNotification({ message: null, type: null }));
  }, time * 1000);
};
