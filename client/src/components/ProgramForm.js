import React from "react";
import { useDispatch } from "react-redux";
import { addProgram } from "../reducers/programsReducer";

const ProgramForm = () => {
  const dispatch = useDispatch();

  // when the user clicks submmit lets create a new program object and dispatch it to the backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const students = document.getElementById("students").value;
    const weeks = document.getElementById("weeks").value;
    const description = document.getElementById("description").value;
    const classes = document.getElementById("classes").value;
    const status = document.getElementById("status").value;
    const pricing = document.getElementById("pricing").value;
    const invoice = document.getElementById("invoice").value;
    const staff = document.getElementById("staff").value;
    const newProgram = {
      name,
      students,
      weeks,
      description,
      classes,
      status,
      pricing,
      invoice,
      staff,
    };
    dispatch(addProgram(newProgram));
  };
  return (
    // we are making a form for the program model used on the Backend file program.js
    <div>
      <h1>Program Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            placeholder="Name of program"
            id="name"
            name="name"
            required
          />
        </label>
        <label htmlFor="students">
          Students
          <input
            type="number"
            placeholder="300"
            id="students"
            name="students"
            required
          />
        </label>
        <label htmlFor="weeks">
          Weeks
          <input type="number" placeholder="4" id="weeks" name="weeks" />
        </label>
        <label htmlFor="description">
          Description
          <input
            type="text"
            placeholder="description"
            id="description"
            name="description"
          />
        </label>
        <label htmlFor="classes">
          Classes
          <input
            type="number"
            placeholder="classes"
            id="classes"
            name="classes"
          />
        </label>
        <label htmlFor="status">
          Active:
          <label htmlFor="status">
            True
            <input
              type="radio"
              id="status"
              name="status"
              value="true"
              defaultChecked
            />
          </label>
          <label htmlFor="status">
            False
            <input type="radio" id="status" name="status" value="false" />
          </label>
        </label>
        <label htmlFor="pricing">
          Pricing per student
          <input
            type="number"
            placeholder="25"
            id="pricing"
            name="pricing"
            required
          />
        </label>
        {/* invoice is a calender due date */}
        <label htmlFor="invoice">
          Invoice due date:
          <input type="date" id="invoice" name="invoice" />
        </label>
        <label htmlFor="staff">
          Staff
          <input type="text" placeholder="staff" id="staff" name="staff" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProgramForm;
