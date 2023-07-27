import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../reducers/authReducer";
import notificationReducer from "../reducers/notificationReducer";

const store = configureStore({
  reducer: {
    // reducers go here
    user: authReducer,
    notification: notificationReducer,
  },
});

export default store;
