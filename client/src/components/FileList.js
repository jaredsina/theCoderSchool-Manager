import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteFile } from "../reducers/fileReducer";

const FileList = () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files);
  const filesList = files.map((file) => (
    <li key={file.id}>
      <Link to={`/dashboard/${file.id}`}>{file.filename}</Link>
      <button type="button" onClick={() => dispatch(deleteFile(file.id))}>
        Delete
      </button>
    </li>
  ));
  return (
    <div>
      <h1>File List</h1>
      <ul>{filesList}</ul>
    </div>
  );
};

export default FileList;
