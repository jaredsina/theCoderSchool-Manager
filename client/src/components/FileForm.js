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
      <form encType="multipart/form-data" onSubmit={createFile}>
        <input
          className="border border-gray-300 rounded-md bg-gray-100 w-1/2"
          type="file"
          name="file"
          id="fileInput"
        />
        <button
          type="submit"
          value="Upload"
          className="self-center ml-4 max-w-fit mt-4 py-2 px-8 bg-yellow-300 rounded-md font-bold hover:bg-yellow-400 hover:scale-105 transition duration-200 ease-in-out"
        >
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
