import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMatch } from "react-router-dom";
import { removeProgram, updateProgram } from "../reducers/programsReducer";
import { initializeFiles } from "../reducers/fileReducer";
import FileForm from "./FileForm";
import FileList from "./FileList";
import TaskForm from "./TaskForm";
import { getTasksByParentId } from "../reducers/taskReducer";
import TaskList from "./TaskList";

const Program = () => {
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();
  const match = useMatch("/dashboard/:id");
  const programs = useSelector((state) => state.programs);
  const partners = useSelector((state) => state.partners);
  const program = match ? programs.find((p) => p.id === match.params.id) : null;

  useEffect(() => {
    // dont initialize the files if there is no program
    if (program) {
      dispatch(initializeFiles(program.id));
      dispatch(getTasksByParentId(program.id));
    }
  }, [dispatch, program]);

  if (!program) {
    return null;
  }
  const saveChanges = () => {
    // grab all the values from the form
    const name = document.getElementById("editName").value;
    const status = document.getElementById("editStatus").checked;
    const description = document.getElementById("editDescription").value;
    const invoice = document.getElementById("editInvoiceDate").value;
    const classes = document.getElementById("editClasses").value;
    const pricing = document.getElementById("editPrice").value;
    const staff = document.getElementById("editStaff").value;
    const weeks = document.getElementById("editWeeks").value;
    const students = document.getElementById("editStudents").value;
    const partner = document.getElementById("editPartner").value;
    const partnerId = document
      .querySelector(`option[value="${partner}"]`)
      .getAttribute("data-key");

    // make sure all the required values are there
    if (!name || !students || !pricing) {
      alert(
        "Please fill out all the required fields (name, students, pricing)",
      );
      return;
    }
    const newProgram = {
      name,
      status,
      description,
      invoice,
      classes,
      pricing,
      staff,
      weeks,
      students,
      id: program.id,
      partner: partnerId,
    };
    // dispatch the new program to the backend
    dispatch(updateProgram(newProgram, program));
    // set edit mode to false
    setEditMode(false);
  };
  return (
    <div>
      <h2>Program</h2>
      <h3>
        {editMode ? (
          <input
            type="text"
            defaultValue={program.name}
            placeholder="Name of program"
            required
            id="editName"
          />
        ) : (
          program.name
        )}
      </h3>
      Partner:{" "}
      {editMode ? (
        <select
          id="editPartner"
          defaultValue={program.partner ? program.partner.name : ""}
        >
          <option value="" data-key={null}>
            None
          </option>
          {partners.map((partner) => (
            <option key={partner.id} value={partner.name} data-key={partner.id}>
              {partner.name}
            </option>
          ))}
        </select>
      ) : (
        <h4>{program.partner ? program.partner.name : "None"}</h4>
      )}
      Active:{" "}
      {editMode ? (
        <input
          type="checkbox"
          id="editStatus"
          defaultChecked={!!program.status}
        />
      ) : (
        program.status.toString()
      )}
      <p>
        {editMode ? (
          <textarea
            id="editDescription"
            style={{ height: 100, width: 300 }}
            defaultValue={program.description}
            placeholder="Description of program"
          />
        ) : (
          program.description
        )}
      </p>
      <p>
        Invoice due date:{" "}
        {editMode ? (
          <input
            type="date"
            id="editInvoiceDate"
            defaultValue={program.invoice}
          />
        ) : (
          program.invoice
        )}
      </p>
      <p>
        Number of classes:{" "}
        {editMode ? (
          <input
            type="number"
            id="editClasses"
            defaultValue={program.classes}
          />
        ) : (
          program.classes
        )}
      </p>
      <p>
        Number of students:{" "}
        {editMode ? (
          <input
            type="number"
            id="editStudents"
            defaultValue={program.students}
          />
        ) : (
          program.students
        )}
      </p>
      <p>
        Price Per Student:{" "}
        {editMode ? (
          <input type="number" id="editPrice" defaultValue={program.pricing} />
        ) : (
          program.pricing
        )}
      </p>
      <p>Price Per month: {program.pricing * program.students}</p>
      <p>Program Total: {program.pricing * program.students * program.weeks}</p>
      <p>
        Number of weeks in the program:{" "}
        {editMode ? (
          <input type="number" id="editWeeks" defaultValue={program.weeks} />
        ) : (
          program.weeks
        )}
      </p>
      <p>
        Assigned Staff:{" "}
        {editMode ? (
          <input
            type="text"
            id="editStaff"
            placeholder="Staff1, Staff2,"
            defaultValue={program.staff}
          />
        ) : (
          program.staff
        )}
      </p>
      <p>Task Alerts: </p>
      <p>Files: </p>
      <button type="button" onClick={() => dispatch(removeProgram(program.id))}>
        Delete
      </button>
      {/* Button to edit the current Program */}
      <button type="button" onClick={() => setEditMode(!editMode)}>
        {editMode ? "Cancel" : "Edit"}
      </button>
      {editMode ? (
        <button type="button" onClick={saveChanges}>
          Save
        </button>
      ) : null}
      <FileForm type="Program" id={program.id} />
      <FileList />
      <TaskForm type="Program" id={program.id} />
      <TaskList />
    </div>
  );
};

export default Program;
