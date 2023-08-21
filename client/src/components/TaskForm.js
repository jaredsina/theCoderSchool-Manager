import React from "react";
import PropTypes from "prop-types";

const TaskForm = ({ type, id }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("taskName").value;
    const description = document.getElementById("taskDescription").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const emailAlert = document.getElementById("taskEmailAlert").checked;
    if (!name || !description) {
      alert("Please fill out all the required fields (name, description)");
      return;
    }

    let programId = null;
    let partnerId = null;

    if (type === "Program") {
      programId = id;
    }
    if (type === "Partner") {
      partnerId = id;
    }

    const newTask = {
      name,
      description,
      dueDate,
      emailAlert,
      programId,
      partnerId,
    };
    console.log(newTask);
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
            placeholder="Due Date"
            id="taskDueDate"
            name="dueDate"
          />
        </label>
        <label htmlFor="email_alert">
          Email Alerts?:{" "}
          <input
            type="checkbox"
            placeholder="Email Alert"
            id="taskEmailAlert"
            name="emailAlert"
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
