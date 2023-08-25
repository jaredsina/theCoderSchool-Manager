import React, { useState, useEffect } from "react";
import { useMatch, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updatePartner, removePartner } from "../reducers/partnersReducer";
import FileForm from "./FileForm";
import FileList from "./FileList";
import { initializeFiles } from "../reducers/fileReducer";
import TaskForm from "./TaskForm";
import { getTasksByParentId } from "../reducers/taskReducer";
import TaskList from "./TaskList";

const Partner = () => {
  const dispatch = useDispatch();
  // setup an editMode state for this component
  const [editMode, setEditMode] = useState(false);

  // grab the matching partner from the url
  const match = useMatch("/dashboard/:id");

  // grab the partners from the redux store
  const partners = useSelector((state) => state.partners);

  // if there is no matching partner, return null
  // otherwise, return the match partner from the partners array
  const partner = match ? partners.find((p) => p.id === match.params.id) : null;

  // initialize the files for this partner
  useEffect(() => {
    // dont initialize the files if there is no partner
    if (partner) {
      dispatch(initializeFiles(partner.id));
      dispatch(getTasksByParentId(partner.id));
    }
  }, [dispatch, partner]);

  // if there is no matching partner, return null
  if (!partner) {
    return null;
  }

  // if a partner was found, put the partners programs in a list
  const programs = partner.programs.map((program) => (
    <li key={program.id}>
      <Link to={`/dashboard/${program.id}`}>{program.name}</Link>
    </li>
  ));

  const savePartnerChanges = () => {
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

    if (partnerName === "") {
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
      programs: partner.programs.map((program) => program.id),
    };
    // dispatch the updated partner to the backend
    dispatch(updatePartner(updatedPartner));
  };
  // we are going to return the partner information
  // each partner will have an edit button
  // if the edit button is clicked, we will set the editMode to true
  // if the editMode is true, we will show the edit form
  // if the editMode is false, we will show the partner information
  return (
    <div>
      {editMode ? (
        <button type="button" onClick={() => setEditMode(false)}>
          Cancel
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => dispatch(removePartner(partner))}
          >
            Delete
          </button>
          <button type="button" onClick={() => setEditMode(true)}>
            Edit
          </button>
        </>
      )}
      {editMode ? (
        <button type="button" onClick={() => savePartnerChanges()}>
          Save
        </button>
      ) : null}
      {editMode ? (
        <input
          type="text"
          defaultValue={partner.name}
          placeholder="Name of program"
          required
          id="editPartnerName"
        />
      ) : (
        <h1>{partner.name}</h1>
      )}

      {editMode ? (
        <input
          type="text"
          defaultValue={partner.schoolname}
          placeholder="School Name"
          id="editSchoolName"
        />
      ) : (
        <h2>{partner.schoolname}</h2>
      )}
      {editMode ? (
        <input
          type="text"
          defaultValue={partner.website}
          placeholder="Website"
          id="editWebsite"
        />
      ) : (
        <h2>{partner.website}</h2>
      )}
      {editMode ? (
        <input
          type="text"
          defaultValue={partner.address}
          placeholder="Address"
          id="editAddress"
        />
      ) : (
        <h2>{partner.address}</h2>
      )}
      {editMode ? (
        <input
          type="text"
          defaultValue={partner.email}
          placeholder="school@email.com"
          id="editEmail"
        />
      ) : (
        <h2>{partner.email}</h2>
      )}
      {editMode ? (
        <input
          type="text"
          defaultValue={partner.phone}
          placeholder="123-456-7890"
          required
          id="editPhone"
        />
      ) : (
        <h2>{partner.phone}</h2>
      )}
      {editMode ? (
        <input
          type="text"
          defaultValue={partner.primarycontact}
          placeholder="Primary Contact"
          id="editPrimaryContact"
        />
      ) : (
        <h2>{partner.primarycontact}</h2>
      )}
      {editMode ? (
        <input
          type="text"
          defaultValue={partner.primarycontactemail}
          placeholder="name@email.com"
          id="editPrimaryContactEmail"
        />
      ) : (
        <h2>{partner.primarycontactemail}</h2>
      )}
      {editMode ? (
        <input
          type="text"
          defaultValue={partner.primarycontactphone}
          placeholder="123-456-7890"
          id="editPrimaryContactPhone"
        />
      ) : (
        <h2>{partner.primarycontactphone}</h2>
      )}
      <h3>Related Programs:</h3>
      {programs}
      <FileForm type="Partner" id={partner.id} />
      <FileList />
      <TaskForm type="Partner" id={partner.id} />
      <TaskList />
    </div>
  );
};

export default Partner;
