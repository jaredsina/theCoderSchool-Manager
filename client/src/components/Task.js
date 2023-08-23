import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMatch } from "react-router-dom";
import { deleteTask, updateTask } from "../reducers/taskReducer";

const Task = () => {
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();
  const match = useMatch("/dashboard/:id");
  const tasks = useSelector((state) => state.tasks);
  const task = match ? tasks.find((t) => t.id === match.params.id) : null;

  if (!task) {
    return null;
  }
  const handleUpdate = () => {
    const name = document.getElementById("editTaskName").value;
    const description = document.getElementById("editTaskDescription").value;
    const dueDate = document.getElementById("editTaskDueDate").value;
    const emailAlert = document.getElementById("editTaskEmailAlert").checked;

    if (!name) {
      alert("Please fill out all the required fields (name)");
      return;
    }
    const newTask = {
      name,
      description,
      dueDate,
      emailAlert,
      partnerId: task.partnerId,
      programId: task.programId,
      id: task.id,
    };
    dispatch(updateTask(task.id, newTask));
    setEditMode(false);
  };

  return (
    <div>
      <h1>Task</h1>
      {editMode ? (
        <>
          <button type="button" onClick={() => handleUpdate()}>
            Save
          </button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setEditMode(true)}>
          Edit
        </button>
      )}
      Task Name:{" "}
      {editMode ? (
        <input
          type="text"
          id="editTaskName"
          defaultValue={task.name}
          placeholder="Name of task"
          required
        />
      ) : (
        <h1>{task.name}</h1>
      )}
      Description:{" "}
      {editMode ? (
        <textarea
          type="text"
          id="editTaskDescription"
          style={{ height: 100, width: 300 }}
          defaultValue={task.description}
          placeholder="Description"
        />
      ) : (
        <h2>{task.description}</h2>
      )}
      Due Date:{" "}
      {editMode ? (
        <input
          type="date"
          id="editTaskDueDate"
          defaultValue={task.dueDate ? task.dueDate.split("T")[0] : null}
        />
      ) : (
        <h2>{task.dueDate ? task.dueDate.split("T")[0] : null}</h2>
      )}
      Task Email Alert:{" "}
      {editMode ? (
        <input
          type="checkbox"
          id="editTaskEmailAlert"
          defaultChecked={!!task.emailAlert}
        />
      ) : (
        <h2>{task.emailAlert.toString()}</h2>
      )}
      <button type="button" onClick={() => dispatch(deleteTask(task.id))}>
        Delete
      </button>
    </div>
  );
};

export default Task;
