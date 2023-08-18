import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteFile } from "../reducers/fileReducer";

const FileList = () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files);
  const filesList = files.map((file) => (
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
      <h1>File List</h1>
      <ul>{filesList}</ul>
    </div>
  );
};

export default FileList;
