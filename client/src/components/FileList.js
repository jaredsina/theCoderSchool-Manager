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
    .filter((f) => f.programId === id || f.partnerId === id)
    .map((file) => (
      <li
        key={file.id}
        className=" border-b py-2 border-emerald-950 grid grid-cols-4"
      >
        <a
          href={file.url}
          target="_blank"
          rel="noreferrer"
          className="col-span-2 whitespace-nowrap overflow-auto"
        >
          {file.filename}
        </a>
        <a
          href={file.url}
          target="_blank"
          rel="noreferrer"
          className="col-start-3 bg-green-400 hover:bg-green-500 text-white font-bold mx-4 text-center rounded hover:scale-105 transition-all cursor-pointer"
        >
          View
        </a>
        <button
          type="button"
          onClick={() => dispatch(deleteFile(file.id))}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-1 mx-4 rounded hover:scale-105 transition-all col-start-4"
        >
          Delete
        </button>
      </li>
    ));
  return (
    <div>
      <h4 className="font-bold text-3xl">File List</h4>
      <div className="grid-cols-4 grid border-b border-emerald-950 mt-4">
        <p>File Name</p>
      </div>
      <ul>{filesList}</ul>
    </div>
  );
};

export default FileList;

FileList.propTypes = {
  id: PropTypes.string.isRequired,
};
