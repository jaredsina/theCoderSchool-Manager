import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMatch } from "react-router-dom";
import { deleteTask, updateTask } from "../reducers/taskReducer";

const Task = () => {
  const [editMode, setEditMode] = useState(false);
  const [dueDateDiff, setDueDateDiff] = useState(0);
  const dispatch = useDispatch();
  const match = useMatch("/dashboard/:id");
  const tasks = useSelector((state) => state.tasks);
  const task = match ? tasks.find((t) => t.id === match.params.id) : null;

  if (!task) {
    return null;
  }

  // this is for handling the update of the task submission
  const handleUpdate = () => {
    // create the new task
    const name = document.getElementById("editTaskName").value;
    const description = document.getElementById("editTaskDescription").value;
    const dueDateValue = document.getElementById("editTaskDueDate").value;
    const sevenDayEmailSent = document.getElementById(
      "editTaskSevenDayEmail",
    ).checked;
    const threeDayEmailSent = document.getElementById(
      "editTaskThreeDayEmail",
    ).checked;
    const oneDayEmailSent = document.getElementById(
      "editTaskOneDayEmail",
    ).checked;
    const sameDayEmailSent = document.getElementById(
      "editTaskSameDayEmail",
    ).checked;

    // since this is not a form submission, we need to check the values manually
    if (!name || !description) {
      alert("Please fill out all the required fields (name)");
      return;
    }

    // day email statuses should only be set to false if the checkbox is checked
    const newTask = {
      name,
      description,
      dueDate: dueDateValue,
      partnerId: task.partnerId,
      programId: task.programId,
      sevenDayEmailSent: sevenDayEmailSent ? false : null,
      threeDayEmailSent: threeDayEmailSent ? false : null,
      oneDayEmailSent: oneDayEmailSent ? false : null,
      sameDayEmailSent: sameDayEmailSent ? false : null,
      id: task.id,
    };

    // update the task on the backend and in the redux store
    dispatch(updateTask(task.id, newTask));

    // set editMode to false to exit editMode
    setEditMode(false);
  };

  // this is for setting the default values and disabling the checkboxes during initial editMode
  const calculateDueDateDiff = (dueDate) => {
    // convert dueDate to a Date object to compare it to today's date
    const dueDateObject = new Date(dueDate);
    const today = new Date();
    const timeDiff = dueDateObject.getTime() - today.getTime();

    // calculate the difference in days between the due date and today
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setDueDateDiff(daysDiff);
  };

  // this is for handling the checkbox disabling and checking/unchecking when the dueDate is changed
  const handleDateChange = (e) => {
    const dueDate = e.target.value;

    // convert dueDate to a Date object to compare it to today's date
    const dueDateObject = new Date(dueDate);
    const today = new Date();
    const timeDiff = dueDateObject.getTime() - today.getTime();

    // calculate the difference in days between the due date and today
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // grab all the email checkboxes
    const sevenDayEmailCheckbox = document.getElementById(
      "editTaskSevenDayEmail",
    );
    const threeDayEmailCheckbox = document.getElementById(
      "editTaskThreeDayEmail",
    );
    const oneDayEmailCheckbox = document.getElementById("editTaskOneDayEmail");
    const sameDayEmailCheckbox = document.getElementById(
      "editTaskSameDayEmail",
    );

    // if the due date is less than 7 days away, disable the 7 day email checkbox
    if (daysDiff <= 7) {
      sevenDayEmailCheckbox.disabled = true;
      sevenDayEmailCheckbox.checked = false;
    } else {
      sevenDayEmailCheckbox.disabled = false;
      sevenDayEmailCheckbox.checked = task.sevenDayEmailSent === false;
    }

    // if the due date is less than 3 days away, disable the 3 day email checkbox
    if (daysDiff <= 3) {
      threeDayEmailCheckbox.disabled = true;
      threeDayEmailCheckbox.checked = false;
    } else {
      threeDayEmailCheckbox.disabled = false;
      threeDayEmailCheckbox.checked = task.threeDayEmailSent === false;
    }

    // if the due date is less than 1 day away, disable the 1 day email checkbox
    if (daysDiff <= 1) {
      oneDayEmailCheckbox.disabled = true;
      oneDayEmailCheckbox.checked = false;
    } else {
      oneDayEmailCheckbox.disabled = false;
      oneDayEmailCheckbox.checked = task.oneDayEmailSent === false;
    }

    // if the due date is less than 0 days away, disable the same day email checkbox
    if (daysDiff <= 0) {
      sameDayEmailCheckbox.disabled = true;
      sameDayEmailCheckbox.checked = false;
    } else {
      sameDayEmailCheckbox.disabled = false;
      sameDayEmailCheckbox.checked = task.sameDayEmailSent === false;
    }
  };

  const editButtonHandler = () => {
    setEditMode(true);
    // calculate the number of days between the due date and today for setting the checkboxes default values and disable values
    calculateDueDateDiff(task.dueDate);
  };
  return (
    <div className="lg:px-8 lg:p-4 ">
      <h1 className="font-bold text-5xl">
        {editMode ? (
          <input
            type="text"
            id="editTaskName"
            defaultValue={task.name}
            placeholder="Name of task"
            required
            className="bg-yellow-50 px-3 py-2 rounded-lg"
          />
        ) : (
          task.name
        )}
      </h1>
      <div className="grid grid-cols-2 gap-8 my-8">
        <div>
          <h2 className="font-bold text-3xl">Description</h2>
          {editMode ? (
            <textarea
              type="text"
              id="editTaskDescription"
              style={{ height: 100, width: 300 }}
              defaultValue={task.description}
              placeholder="Description"
              className="bg-yellow-50 px-3 py-2 rounded-lg"
            />
          ) : (
            <h4 className="bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {task.description}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Due Date</h2>
          {editMode ? (
            <input
              type="date"
              id="editTaskDueDate"
              defaultValue={task.dueDate ? task.dueDate.split("T")[0] : null}
              onChange={handleDateChange}
              className="bg-yellow-50 px-3 py-2 rounded-lg"
            />
          ) : (
            <h4 className="bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {task.dueDate ? task.dueDate.split("T")[0] : null}
            </h4>
          )}
        </div>
        <div className="col-span-2">
          <h2 className="font-bold text-3xl">Notification Settings:</h2>
          {editMode ? (
            <div className="grid grid-cols-2 mt-2 bg-yellow-50 px-3 py-2 rounded-lg">
              <label htmlFor="editTaskSevenDayEmail">
                Notify Seven Days Before? :{" "}
                <input
                  type="checkbox"
                  id="editTaskSevenDayEmail"
                  name="sevenDayEmail"
                  defaultChecked={task.sevenDayEmailSent === false}
                  disabled={dueDateDiff <= 7}
                />
              </label>
              <label htmlFor="editTaskThreeDayEmail">
                Notify Three Days Before? :{" "}
                <input
                  type="checkbox"
                  id="editTaskThreeDayEmail"
                  name="threeDayEmail"
                  defaultChecked={task.threeDayEmailSent === false}
                  disabled={dueDateDiff <= 3}
                />
              </label>
              <label htmlFor="editTaskOneDayEmail">
                Notify One Day Before? :{" "}
                <input
                  type="checkbox"
                  id="editTaskOneDayEmail"
                  name="oneDayEmail"
                  defaultChecked={task.oneDayEmailSent === false}
                  disabled={dueDateDiff <= 1}
                />
              </label>
              <label htmlFor="editTaskSameDayEmail">
                Notify Same Day? :{" "}
                <input
                  type="checkbox"
                  id="editTaskSameDayEmail"
                  name="sameDayEmail"
                  defaultChecked={task.sameDayEmailSent === false}
                  disabled={dueDateDiff <= 0}
                />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-2 mt-2 gap-2 bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              <div>
                <p>Notify Seven Days Before: </p>
                <p>{task.sevenDayEmailSent === false ? "Yes" : "No"}</p>
              </div>
              <div>
                <p>Notify Three Days Before: </p>
                <p>{task.threeDayEmailSent === false ? "Yes" : "No"}</p>
              </div>
              <div>
                <p>Notify One Day Before: </p>
                <p>{task.oneDayEmailSent === false ? "Yes" : "No"}</p>
              </div>
              <div>
                <p>Notify Same Day: </p>
                <p>{task.sameDayEmailSent === false ? "Yes" : "No"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 ">
        {editMode ? (
          <>
            <button
              type="button"
              onClick={() => handleUpdate()}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={editButtonHandler}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all"
          >
            Edit
          </button>
        )}
        <button
          type="button"
          onClick={() => dispatch(deleteTask(task.id))}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Task;
