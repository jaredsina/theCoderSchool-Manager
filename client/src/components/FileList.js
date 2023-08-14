import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FileList = () => {
  const files = useSelector((state) => state.files);
  const filesList = files.map((file) => (
    <li key={file.id}>
      <Link to={`/dashboard/${file.id}`}>{file.filename}</Link>
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
