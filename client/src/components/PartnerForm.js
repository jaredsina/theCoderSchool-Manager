import React from "react";
import { useDispatch } from "react-redux";
import { addPartner } from "../reducers/partnersReducer";

const PartnerForm = () => {
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
  };

  return (
    <div>
      <h2>Partner Form</h2>
      <form onSubmit={handlePartner}>
        <label htmlFor="partnername">
          Name*:{" "}
          <input
            type="text"
            placeholder="Name of partner"
            id="partnername"
            name="partnername"
            required
          />
        </label>
        <label htmlFor="schoolname">
          School Name
          <input
            type="text"
            placeholder="School Name"
            id="schoolname"
            name="schoolname"
          />
        </label>
        <label htmlFor="website">
          Website
          <input
            type="text"
            placeholder="Website"
            id="website"
            name="website"
          />
        </label>
        <label htmlFor="email">
          Email
          <input type="text" placeholder="Email" id="email" name="email" />
        </label>
        <label htmlFor="phone">
          Phone
          <input type="text" placeholder="Phone" id="phone" name="phone" />
        </label>
        <label htmlFor="address">
          Address
          <input
            type="text"
            placeholder="Address"
            id="address"
            name="address"
          />
        </label>
        <label htmlFor="primarycontact">
          Primary Contact
          <input
            type="text"
            placeholder="Primary Contact"
            id="primarycontact"
            name="primarycontact"
          />
        </label>
        <label htmlFor="primarycontactemail">
          Primary Contact Email
          <input
            type="text"
            placeholder="Primary Contact Email"
            id="primarycontactemail"
            name="primarycontactemail"
          />
        </label>
        <label htmlFor="primarycontactphone">
          Primary Contact Phone
          <input
            type="text"
            placeholder="Primary Contact Phone"
            id="primarycontactphone"
            name="primarycontactphone"
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PartnerForm;
