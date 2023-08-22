import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../reducers/authReducer";
import notificationReducer from "../reducers/notificationReducer";
import programsReducer from "../reducers/programsReducer";
import partnersReducer from "../reducers/partnersReducer";
import fileReducer from "../reducers/fileReducer";
import taskReducer from "../reducers/taskReducer";

const store = configureStore({
  reducer: {
    // reducers go here
    user: authReducer,
    notification: notificationReducer,
    programs: programsReducer,
    partners: partnersReducer,
    files: fileReducer,
    tasks: taskReducer,
  },
});

export default store;
