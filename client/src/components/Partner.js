import React, { useState, useEffect, useRef } from "react";
import { useMatch, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updatePartner, removePartner } from "../reducers/partnersReducer";
import FileForm from "./FileForm";
import FileList from "./FileList";
// import { initializeFiles } from "../reducers/fileReducer";
import TaskForm from "./TaskForm";
import { getTasksByParentId } from "../reducers/taskReducer";
import TaskList from "./TaskList";
import Modal from "./Modal";
import { updateProgramState } from "../reducers/programsReducer";

const Partner = () => {
  const dispatch = useDispatch();
  // setup an editMode state for this component
  const [editMode, setEditMode] = useState(false);

  // grab the matching partner from the url
  const match = useMatch("/dashboard/:id");

  // grab the partners from the redux store
  const partners = useSelector((state) => state.partners);

  const navigate = useNavigate();

  // if there is no matching partner, return null
  // otherwise, return the match partner from the partners array
  const partner = match ? partners.find((p) => p.id === match.params.id) : null;

  const partnerFileFormModalRef = useRef();
  const partnerTaskFormModalRef = useRef();

  // initialize the files for this partner
  useEffect(() => {
    // dont initialize the files if there is no partner
    if (partner) {
      // dispatch(initializeFiles(partner.id));
      dispatch(getTasksByParentId(partner.id));
    }
  }, [dispatch, partner]);

  // if there is no matching partner, return null
  if (!partner) {
    return null;
  }

  // if a partner was found, put the partners programs in a list
  const programs = partner.programs.map((program) => (
    <div
      key={program.id}
      onClick={() => navigate(`/dashboard/${program.id}`)}
      className="bg-emerald-50 shadow-md rounded-lg p-4 hover:scale-110 hover:shadow-lg transition-all cursor-pointer list-none"
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
    >
      <Link to={`/dashboard/${program.id}`}>{program.name}</Link>
    </div>
  ));

  const handleDelete = async () => {
    const deletedPartner = await dispatch(removePartner(partner));

    // delete the partner from the programs that have it
    if (deletedPartner && partner.programs) {
      partner.programs.forEach((program) => {
        dispatch(
          updateProgramState({
            ...program,
            partner: null,
          }),
        );
      });
    }
  };
  const savePartnerChanges = async () => {
    // grab the field values from the editMode items
    const partnerName = document.getElementById("editPartnerName").value;
    const partnerSchoolName = document.getElementById("editSchoolName").value;
    const partnerAddress = document.getElementById("editAddress").value;
    const partnerWebsite = document.getElementById("editWebsite").value;
    const partnerEmail = document.getElementById("editEmail").value;
    const partnerPhone = document.getElementById("editPhone").value;
    const partnerPrimaryContact =
      document.getElementById("editPrimaryContact").value;
    const partnerPrimaryContactEmail = document.getElementById(
      "editPrimaryContactEmail",
    ).value;
    const partnerPrimaryContactPhone = document.getElementById(
      "editPrimaryContactPhone",
    ).value;
    if (partnerName === "") {
      // eslint-disable-next-line no-alert
      return alert("Please enter a name for the partner");
    }
    // create a new partner object with the updated information
    const updatedPartner = {
      id: partner.id,
      name: partnerName,
      schoolname: partnerSchoolName,
      address: partnerAddress,
      website: partnerWebsite,
      email: partnerEmail,
      phone: partnerPhone,
      primarycontact: partnerPrimaryContact,
      primarycontactemail: partnerPrimaryContactEmail,
      primarycontactphone: partnerPrimaryContactPhone,
      programs: partner.programs.map((program) => program.id),
    };
    // dispatch the updated partner to the backend
    const returnedPartner = await dispatch(updatePartner(updatedPartner));

    // Prep updated partner for program state update
    const updatedPartnerWithoutPrograms = { ...returnedPartner };
    delete updatedPartnerWithoutPrograms.programs;

    // Give the updated partner to the related programs
    if (returnedPartner.programs) {
      returnedPartner.programs.forEach((program) => {
        dispatch(
          updateProgramState({
            ...program,
            partner: updatedPartnerWithoutPrograms,
          }),
        );
      });
    }

    setEditMode(false);
    return null;
  };
  // we are going to return the partner information
  // each partner will have an edit button
  // if the edit button is clicked, we will set the editMode to true
  // if the editMode is true, we will show the edit form
  // if the editMode is false, we will show the partner information
  return (
    <div className="lg:m-8 lg:p-4 rounded-lg">
      <h1 className="font-bold text-5xl">
        {editMode ? (
          <input
            type="text"
            defaultValue={partner.name}
            placeholder="Name of program"
            required
            id="editPartnerName"
          />
        ) : (
          partner.name
        )}
      </h1>
      <div className="grid grid-cols-3 gap-8 my-8">
        <div>
          <h2 className="font-bold text-3xl">School Name</h2>
          {editMode ? (
            <input
              type="text"
              defaultValue={partner.schoolname}
              placeholder="School Name"
              id="editSchoolName"
              className="bg-yellow-50 px-3 py-2 rounded-lg"
            />
          ) : (
            <h4 className=" bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {partner.schoolname}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Address</h2>
          {editMode ? (
            <input
              type="text"
              defaultValue={partner.address}
              placeholder="Address"
              id="editAddress"
              className="bg-yellow-50 px-3 py-2 rounded-lg"
            />
          ) : (
            <h4 className="bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {partner.address}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Email</h2>
          {editMode ? (
            <input
              type="text"
              defaultValue={partner.email}
              placeholder="school@email.com"
              id="editEmail"
              className="bg-yellow-50 px-3 py-2 rounded-lg"
            />
          ) : (
            <h4 className="bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {partner.email}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Website</h2>
          {editMode ? (
            <input
              type="text"
              defaultValue={partner.website}
              placeholder="Website"
              id="editWebsite"
              className="bg-yellow-50 px-3 py-2 rounded-lg"
            />
          ) : (
            <h4 className="bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {partner.website}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Phone</h2>
          {editMode ? (
            <input
              type="text"
              defaultValue={partner.phone}
              placeholder="123-456-7890"
              required
              id="editPhone"
              className="bg-yellow-50 px-3 py-2 rounded-lg"
            />
          ) : (
            <h4 className="bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {partner.phone}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Primary Contact</h2>
          {editMode ? (
            <input
              type="text"
              defaultValue={partner.primarycontact}
              placeholder="Primary Contact"
              id="editPrimaryContact"
              className="bg-yellow-50 px-3 py-2 rounded-lg"
            />
          ) : (
            <h4 className="bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {partner.primarycontact}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Primary Contact Email</h2>
          {editMode ? (
            <input
              type="text"
              defaultValue={partner.primarycontactemail}
              placeholder="name@email.com"
              id="editPrimaryContactEmail"
              className="bg-yellow-50 px-3 py-2 rounded-lg"
            />
          ) : (
            <h4 className="bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {partner.primarycontactemail}
            </h4>
          )}
        </div>
        <div>
          <h2 className="font-bold text-3xl">Primary Contact Phone</h2>
          {editMode ? (
            <input
              type="text"
              defaultValue={partner.primarycontactphone}
              placeholder="123-456-7890"
              id="editPrimaryContactPhone"
              className="bg-yellow-50 px-3 py-2 rounded-lg"
            />
          ) : (
            <h4 className="bg-emerald-50 px-3 py-2 rounded-lg w-fit">
              {partner.primarycontactphone}
            </h4>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        {editMode ? (
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all"
          >
            Cancel
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all"
            >
              Delete
            </button>
          </>
        )}
        {editMode ? (
          <button
            type="button"
            onClick={() => savePartnerChanges()}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all"
          >
            Save
          </button>
        ) : null}
      </div>
      <div>
        <h3 className="font-bold mt-8">Related Programs:</h3>
        <div className="py-2 bg-transparent overflow-y-auto overflow-x-hidden grid gap-4 grid-cols-2 lg:grid-cols-4">
          {programs}
        </div>
      </div>
      <div className="grid grid-cols-2 mt-8 gap-12">
        <FileList id={partner.id} />
        <TaskList />
        <div className=" justify-self-center">
          <Modal ref={partnerFileFormModalRef} header="New File Form">
            <FileForm
              type="Partner"
              id={partner.id}
              closeModal={() => partnerFileFormModalRef.current.close()}
            />
          </Modal>
          <button
            type="button"
            className="fileCreateButton mt-4 bg-emerald-950 text-white rounded-lg p-2 hover:scale-105 transition-all font-bold"
            onClick={() => partnerFileFormModalRef.current.openModal()}
          >
            Create File
          </button>
        </div>
        <div className="justify-self-center">
          <Modal ref={partnerTaskFormModalRef} header="New Task Form">
            <TaskForm
              type="Partner"
              id={partner.id}
              closeModal={() => partnerTaskFormModalRef.current.close()}
            />
          </Modal>
          <button
            type="button"
            className="taskCreateButton bg-emerald-950 mt-4 text-white rounded-lg p-2 hover:scale-105 transition-all font-bold"
            onClick={() => partnerTaskFormModalRef.current.openModal()}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Partner;
