import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { uploadFile } from "../reducers/fileReducer";

const FileForm = ({ type, id }) => {
  const dispatch = useDispatch();
  const createFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    formData.append("file", file);
    if (type === "Program") {
      formData.append("programId", id);
    }
    if (type === "Partner") {
      formData.append("partnerId", id);
    }
    // dispatch the uploadFile action creator
    dispatch(uploadFile(formData));
  };
  if (!type || !id) {
    return null;
  }
  return (
    <div>
      <h1>File Form</h1>
      <form encType="multipart/form-data" onSubmit={createFile}>
        <input type="file" name="file" id="fileInput" />
        <button type="submit" value="Upload">
          Upload
        </button>
      </form>
    </div>
  );
};

// Type checking for props
FileForm.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default FileForm;
