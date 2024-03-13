import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { addPartner } from "../reducers/partnersReducer";

const PartnerForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const handlePartner = (e) => {
    e.preventDefault();
    const partnername = document.getElementById("partnername").value;
    const schoolname = document.getElementById("schoolname").value;
    const website = document.getElementById("website").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const primarycontact = document.getElementById("primarycontact").value;
    const primarycontactemail = document.getElementById(
      "primarycontactemail",
    ).value;
    const primarycontactphone = document.getElementById(
      "primarycontactphone",
    ).value;
    const newPartner = {
      name: partnername,
      schoolname,
      website,
      email,
      phone,
      address,
      primarycontact,
      primarycontactemail,
      primarycontactphone,
    };
    dispatch(addPartner(newPartner));

    closeModal();
  };

  return (
    <div>
      <form onSubmit={handlePartner}>
        <div className="lg:grid lg:grid-cols-2 lg:gap-4 gap-4">
          <label className="flex flex-col gap-2" htmlFor="partnername">
            Name*:{" "}
            <input
              className="bg-gray-50 rounded-lg p-2 border border-gray-300"
              type="text"
              placeholder="Name of partner"
              id="partnername"
              name="partnername"
              required
            />
          </label>
          <label className="flex flex-col gap-2" htmlFor="schoolname">
            School Name
            <input
              className="bg-gray-50 rounded-lg p-2 border border-gray-300"
              type="text"
              placeholder="School Name"
              id="schoolname"
              name="schoolname"
            />
          </label>
          <label className="flex flex-col gap-2" htmlFor="website">
            Website
            <input
              className="bg-gray-50 rounded-lg p-2 border border-gray-300"
              type="text"
              placeholder="Website"
              id="website"
              name="website"
            />
          </label>
          <label className="flex flex-col gap-2" htmlFor="email">
            Email
            <input
              className="bg-gray-50 rounded-lg p-2 border border-gray-300"
              type="text"
              placeholder="Email"
              id="email"
              name="email"
            />
          </label>
          <label className="flex flex-col gap-2" htmlFor="phone">
            Phone
            <input
              className="bg-gray-50 rounded-lg p-2 border border-gray-300"
              type="text"
              placeholder="Phone"
              id="phone"
              name="phone"
            />
          </label>
          <label className="flex flex-col gap-2" htmlFor="address">
            Address
            <input
              className="bg-gray-50 rounded-lg p-2 border border-gray-300"
              type="text"
              placeholder="Address"
              id="address"
              name="address"
            />
          </label>
          <label className="flex flex-col gap-2" htmlFor="primarycontact">
            Primary Contact
            <input
              className="bg-gray-50 rounded-lg p-2 border border-gray-300"
              type="text"
              placeholder="Primary Contact"
              id="primarycontact"
              name="primarycontact"
            />
          </label>
          <label className="flex flex-col gap-2" htmlFor="primarycontactemail">
            Primary Contact Email
            <input
              className="bg-gray-50 rounded-lg p-2 border border-gray-300"
              type="text"
              placeholder="Primary Contact Email"
              id="primarycontactemail"
              name="primarycontactemail"
            />
          </label>
          <label className="flex flex-col gap-2" htmlFor="primarycontactphone">
            Primary Contact Phone
            <input
              className="bg-gray-50 rounded-lg p-2 border border-gray-300"
              type="text"
              placeholder="Primary Contact Phone"
              id="primarycontactphone"
              name="primarycontactphone"
            />
          </label>
        </div>
        <button
          type="submit"
          className="max-w-fit mt-4 py-2 px-8 bg-yellow-300 rounded-md font-bold hover:bg-yellow-400 hover:scale-105 transition duration-200 ease-in-out"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PartnerForm;

PartnerForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
