import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { initializeFilesWithUrls, deleteFile } from "../reducers/fileReducer";

const Files = () => {
  const dispatch = useDispatch();
  const deleteFileHandler = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this file?",
    );
    if (confirm) {
      dispatch(deleteFile(id));
    }
  };
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (user) {
      dispatch(initializeFilesWithUrls());
    }
  }, [dispatch, user]);
  const files = useSelector((state) => state.files);
  const filesList = files.map((file) => {
    return (
      <div
        key={file.id}
        className=" bg-emerald-50 rounded-md p-2 hover:-translate-y-2 transition-all"
      >
        <a
          href={file.url}
          target="_blank"
          rel="noreferrer"
          className="whitespace-nowrap overflow-hidden overflow-ellipsis flex cursor-pointer"
          title={file.filename}
        >
          {file.filename}
        </a>
        <img
          src={file.url}
          alt={file.filename}
          className="mt-2 h-40 w-full object-cover rounded-md"
        />
        <button
          className=" hover:bg-red-200 w-8 h-8 mx-auto mt-2 rounded-md cursor-pointer flex justify-center items-center"
          onClick={() => deleteFileHandler(file.id)}
          type="button"
        >
          <FontAwesomeIcon
            icon={faTrashCan}
            style={{
              width: "100%",
              height: "1.5em",
              color: "rgb(239,68,68)",
            }}
            className=" "
          />
        </button>
      </div>
    );
  });
  return (
    <div className="lg:px-8">
      <h4 className="font-bold text-3xl">Files</h4>
      <div className="grid md:grid-cols-6 gap-4 mt-4">{filesList}</div>
    </div>
  );
};

export default Files;
