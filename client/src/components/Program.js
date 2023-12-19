import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMatch, useNavigate } from "react-router-dom";
import { removeProgram, updateProgram } from "../reducers/programsReducer";
// import { initializeFiles } from "../reducers/fileReducer";
import FileForm from "./FileForm";
import FileList from "./FileList";
import TaskForm from "./TaskForm";
import { getTasksByParentId } from "../reducers/taskReducer";
import TaskList from "./TaskList";
import Modal from "./Modal";

const Program = () => {
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const match = useMatch("/dashboard/:id");
  const programs = useSelector((state) => state.programs);
  const partners = useSelector((state) => state.partners);
  const program = match ? programs.find((p) => p.id === match.params.id) : null;

  useEffect(() => {
    // dont initialize the files if there is no program
    if (program) {
      // dispatch(initializeFiles(program.id));
      dispatch(getTasksByParentId(program.id));
    }
  }, [dispatch, program]);

  const fileFormModalRef = useRef();
  const taskFormModalRef = useRef();

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
    const invoicePaid = document.getElementById("editInvoicePaid").checked;
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
      invoicePaid,
      id: program.id,
      partner: partnerId,
    };
    // dispatch the new program to the backend
    dispatch(updateProgram(newProgram, program));
    // set edit mode to false
    setEditMode(false);
  };

  return (
    <div className="lg:m-8 lg:p-4 rounded-lg">
      <h1 className=" font-bold text-5xl">
        {editMode ? (
          <input
            type="text"
            defaultValue={program.name}
            placeholder="Name of program"
            required
            id="editName"
            className="bg-yellow-50 px-3 py-2 rounded-lg"
          />
        ) : (
          program.name
        )}
      </h1>
      <div className=" grid grid-cols-3 gap-8 my-8">
        <div>
          <h2 className="font-bold text-3xl">Description </h2>
          {editMode ? (
            <textarea
              id="editDescription"
              style={{ height: 100, width: 300 }}
              defaultValue={program.description}
              placeholder="Description of program"
              className="bg-yellow-50 px-3 py-2 rounded-lg"
            />
          ) : (
            <h4 className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {program.description ? program.description : "None"}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Partner </h2>
          {editMode ? (
            <select
              className="bg-yellow-50 px-3 py-2 rounded-lg"
              id="editPartner"
              defaultValue={program.partner ? program.partner.name : ""}
            >
              <option value="" data-key={null}>
                None
              </option>
              {partners.map((partner) => (
                <option
                  key={partner.id}
                  value={partner.name}
                  data-key={partner.id}
                >
                  {partner.name}
                </option>
              ))}
            </select>
          ) : (
            <h4
              className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit cursor-pointer hover:scale-105 transition-all "
              onClick={() => navigate(`/dashboard/${program.partner.id}`)}
            >
              {program.partner ? program.partner.name : "None"}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Active: </h2>
          {editMode ? (
            <input
              className="bg-yellow-50 px-3 py-2 rounded-lg"
              type="checkbox"
              id="editStatus"
              defaultChecked={!!program.status}
            />
          ) : (
            <h4 className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {program.status.toString()}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Invoice Due Date: </h2>
          {editMode ? (
            <input
              className="bg-yellow-50 px-3 py-2 rounded-lg"
              type="date"
              id="editInvoiceDate"
              // defaultValue of due date is the programs due date converted from a date object to a string
              defaultValue={
                program.invoice
                  ? new Date(program.invoice).toISOString().split("T")[0]
                  : ""
              }
            />
          ) : (
            <h4 className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {program.invoice ? program.invoice : "None"}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Invoice Paid: </h2>
          {editMode ? (
            <input
              type="checkbox"
              id="editInvoicePaid"
              defaultChecked={program.invoicePaid}
            />
          ) : (
            <h4 className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {program.invoicePaid.toString()}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Number of Classes: </h2>
          {editMode ? (
            <input
              type="number"
              id="editClasses"
              className="bg-yellow-50 w-24 px-3 py-2 rounded-lg"
              defaultValue={program.classes}
            />
          ) : (
            <h4 className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {program.classes ? program.classes : "0"}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Number of Students: </h2>
          {editMode ? (
            <input
              type="number"
              id="editStudents"
              className="bg-yellow-50 w-24 px-3 py-2 rounded-lg"
              defaultValue={program.students}
            />
          ) : (
            <h4 className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {program.students ? program.students : "0"}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Number of Weeks: </h2>
          {editMode ? (
            <input
              type="number"
              className="bg-yellow-50 w-24 px-3 py-2 rounded-lg"
              id="editWeeks"
              defaultValue={program.weeks}
            />
          ) : (
            <h4 className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {program.weeks ? program.weeks : "0"}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Assigned Staff: </h2>
          {editMode ? (
            <input
              type="text"
              id="editStaff"
              className="bg-yellow-50 w-64 px-3 py-2 rounded-lg"
              placeholder="Staff1, Staff2,"
              defaultValue={program.staff}
            />
          ) : (
            <h4 className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {program.staff ? program.staff : "None"}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Price Per Student: </h2>
          {editMode ? (
            <input
              type="number"
              id="editPrice"
              className="bg-yellow-50 w-24 px-3 py-2 rounded-lg"
              defaultValue={program.pricing}
            />
          ) : (
            <h4 className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              ${program.pricing}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Price Per Month: </h2>
          <h4 className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit">
            ${program.pricing * program.students}
          </h4>
        </div>
        <div>
          <h2 className="font-bold text-3xl">Program Total: </h2>
          <h4 className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit">
            ${program.pricing * program.students * program.weeks}
          </h4>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all"
          type="button"
          onClick={() => dispatch(removeProgram(program.id))}
        >
          Delete
        </button>
        {/* Button to edit the current Program */}
        <button
          className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all"
          type="button"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
        {editMode ? (
          <button
            className="savebtn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all"
            type="button"
            onClick={saveChanges}
          >
            Save
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-2 mt-8 gap-12">
        <FileList id={program.id} />
        <TaskList />
        <div className=" justify-self-center">
          <Modal ref={fileFormModalRef} header="New File Form">
            <FileForm
              type="Program"
              id={program.id}
              closeModal={() => fileFormModalRef.current.close()}
            />
          </Modal>
          <button
            type="button"
            className="fileCreateButton mt-4 bg-emerald-950 text-white rounded-lg p-2 hover:scale-105 transition-all font-bold"
            onClick={() => fileFormModalRef.current.openModal()}
          >
            Create File
          </button>
        </div>
        <div className="justify-self-center">
          <Modal ref={taskFormModalRef} header="New Task Form">
            <TaskForm
              type="Program"
              id={program.id}
              closeModal={() => taskFormModalRef.current.close()}
            />
          </Modal>
          <button
            type="button"
            className="taskCreateButton bg-emerald-950 mt-4 text-white rounded-lg p-2 hover:scale-105 transition-all font-bold"
            onClick={() => taskFormModalRef.current.openModal()}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Program;
