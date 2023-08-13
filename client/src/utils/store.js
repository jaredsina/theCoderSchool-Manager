import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../reducers/authReducer";
import notificationReducer from "../reducers/notificationReducer";
import programsReducer from "../reducers/programsReducer";
import partnersReducer from "../reducers/partnersReducer";
import fileReducer from "../reducers/fileReducer";

const store = configureStore({
  reducer: {
    // reducers go here
    user: authReducer,
    notification: notificationReducer,
    programs: programsReducer,
    partners: partnersReducer,
    files: fileReducer,
  },
});

export default store;
