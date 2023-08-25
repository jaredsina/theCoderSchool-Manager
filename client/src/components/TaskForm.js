import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { createTask } from "../reducers/taskReducer";

const TaskForm = ({ type, id }) => {
  const dispatch = useDispatch();

  // handleDateChange is a function that disables the email checkboxes if the due date is less than the number of days away
  const handleDateChange = (e) => {
    const dueDate = e.target.value;

    // convert dueDate to a Date object to compare it to today's date
    const dueDateObject = new Date(dueDate);
    const today = new Date();
    const timeDiff = dueDateObject.getTime() - today.getTime();

    // calculate the difference in days between the due date and today
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // grab all the email checkboxes
    const sevenDayEmailCheckbox = document.getElementById("taskSevenDayEmail");
    const threeDayEmailCheckbox = document.getElementById("taskThreeDayEmail");
    const oneDayEmailCheckbox = document.getElementById("taskOneDayEmail");
    const sameDayEmailCheckbox = document.getElementById("taskSameDayEmail");

    // if the due date is less than 7 days away, disable the 7 day email checkbox
    if (daysDiff <= 7) {
      sevenDayEmailCheckbox.disabled = true;
      sevenDayEmailCheckbox.checked = false;
    } else {
      sevenDayEmailCheckbox.disabled = false;
    }

    // if the due date is less than 3 days away, disable the 3 day email checkbox
    if (daysDiff <= 3) {
      threeDayEmailCheckbox.disabled = true;
      threeDayEmailCheckbox.checked = false;
    } else {
      threeDayEmailCheckbox.disabled = false;
    }

    // if the due date is less than 1 day away, disable the 1 day email checkbox
    if (daysDiff <= 1) {
      oneDayEmailCheckbox.disabled = true;
      oneDayEmailCheckbox.checked = false;
    } else {
      oneDayEmailCheckbox.disabled = false;
    }

    // if the due date is less than 0 days away, disable the same day email checkbox
    if (daysDiff <= 0) {
      sameDayEmailCheckbox.disabled = true;
      sameDayEmailCheckbox.checked = false;
    } else {
      sameDayEmailCheckbox.disabled = false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // get the values from the form, use the id for testing suite compatibility
    const name = document.getElementById("taskName").value;
    const description = document.getElementById("taskDescription").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const sevenDayEmail = document.getElementById("taskSevenDayEmail").checked;
    const threeDayEmail = document.getElementById("taskThreeDayEmail").checked;
    const oneDayEmail = document.getElementById("taskOneDayEmail").checked;
    const sameDayEmail = document.getElementById("taskSameDayEmail").checked;

    // set the programId or partnerId to null if the type is not Program or Partner
    const programId = type === "Program" ? id : null;
    const partnerId = type === "Partner" ? id : null;

    // create the new task object
    const newTask = {
      name,
      description,
      dueDate,
      // emailAlert,
      sevenDayEmailSent: sevenDayEmail ? false : null,
      threeDayEmailSent: threeDayEmail ? false : null,
      oneDayEmailSent: oneDayEmail ? false : null,
      sameDayEmailSent: sameDayEmail ? false : null,
      programId,
      partnerId,
    };

    // createTask is an action creator that makes a POST request to the server and adds the new task to the store
    dispatch(createTask(newTask));
  };
  return (
    <div>
      <h1>Task Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name*:{" "}
          <input
            type="text"
            placeholder="Name of task"
            id="taskName"
            name="name"
            required
          />
        </label>
        <label htmlFor="description">
          Description*:{" "}
          <textarea
            type="text"
            placeholder="Description of task"
            id="taskDescription"
            name="description"
            required
          />
        </label>
        <label htmlFor="dueDate">
          Due Date:{" "}
          <input
            type="date"
            id="taskDueDate"
            name="dueDate"
            onChange={handleDateChange}
          />
        </label>
        <label htmlFor="sevenDayEmail">
          Notify Seven Days Before? :{" "}
          <input
            type="checkbox"
            id="taskSevenDayEmail"
            name="sevenDayEmail"
            disabled
          />
        </label>
        <label htmlFor="threeDayEmail">
          Notify Three Days Before? :{" "}
          <input
            type="checkbox"
            id="taskThreeDayEmail"
            name="threeDayEmail"
            disabled
          />
        </label>
        <label htmlFor="oneDayEmail">
          Notify One Day Before? :{" "}
          <input
            type="checkbox"
            id="taskOneDayEmail"
            name="oneDayEmail"
            disabled
          />
        </label>
        <label htmlFor="sameDayEmail">
          Notify Same Day? :{" "}
          <input
            type="checkbox"
            id="taskSameDayEmail"
            name="sameDayEmail"
            disabled
          />
        </label>
        <button type="submit" value="Submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TaskForm;

TaskForm.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
