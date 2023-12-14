import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { deleteFile, initializeParentFiles } from "../reducers/fileReducer";

const FileList = ({ id }) => {
  const dispatch = useDispatch();
  // fetch the signed google urls for the files in the program
  useEffect(() => {
    dispatch(initializeParentFiles(id));
  }, [dispatch, id]);
  const files = useSelector((state) => state.files);
  const filesList = files
    .filter((f) => {
      return f.programId === id;
    })
    .map((file) => (
      <li key={file.id}>
        <a href={file.url} target="_blank" rel="noreferrer">
          {file.filename}
        </a>
        <button type="button" onClick={() => dispatch(deleteFile(file.id))}>
          Delete
        </button>
      </li>
    ));
  return (
    <div>
      <h4 className="font-bold text-3xl">File List</h4>
      <ul>{filesList}</ul>
    </div>
  );
};

export default FileList;

FileList.propTypes = {
  id: PropTypes.string.isRequired,
};
