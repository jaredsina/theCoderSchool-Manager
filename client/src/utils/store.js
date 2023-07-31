import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../reducers/authReducer";
import notificationReducer from "../reducers/notificationReducer";
import programsReducer from "../reducers/programsReducer";

const store = configureStore({
  reducer: {
    // reducers go here
    user: authReducer,
    notification: notificationReducer,
    programs: programsReducer,
  },
});

export default store;
