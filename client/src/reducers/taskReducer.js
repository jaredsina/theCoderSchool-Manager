import { createSlice } from "@reduxjs/toolkit";
import TaskService from "../services/task";
import { displayMessage } from "./notificationReducer";

const taskSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    setTasksState: (state, action) => {
      return action.payload;
    },
    appendTaskState: (state, action) => {
      return [...state, action.payload];
    },
    deleteTaskState: (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    },
    updateTaskState: (state, action) => {
      return state.map((task) => {
        if (task.id === action.payload.id) {
          return action.payload;
        }
        return task;
      });
    },
  },
});

export const {
  setTasksState,
  appendTaskState,
  deleteTaskState,
  updateTaskState,
} = taskSlice.actions;

export default taskSlice.reducer;

export const initializeTasks = (parentId) => async (dispatch) => {
  try {
    const tasks = await TaskService.getTasksByParentId(parentId);
    dispatch(setTasksState(tasks));
  } catch (err) {
    dispatch(displayMessage(err.response.data.error, "error", 5));
  }
};

export const createTask = (task) => async (dispatch) => {
  try {
    const newTask = await TaskService.create(task);
    dispatch(displayMessage("Task created successfully", "success", 5));
    dispatch(appendTaskState(newTask));
  } catch (err) {
    dispatch(displayMessage(err.response.data.error, "error", 5));
  }
};

export const deleteTask = (id) => async (dispatch) => {
  try {
    await TaskService.deleteTask(id);
    dispatch(displayMessage("Task deleted successfully", "success", 5));
    dispatch(deleteTaskState(id));
  } catch (err) {
    dispatch(displayMessage(err.response.data.error, "error", 5));
  }
};

export const updateTask = (id, task) => async (dispatch) => {
  try {
    const updatedTask = await TaskService.update(id, task);
    dispatch(displayMessage("Task updated successfully", "success", 5));
    dispatch(updateTaskState(updatedTask));
  } catch (err) {
    dispatch(displayMessage(err.response.data.error, "error", 5));
  }
};
