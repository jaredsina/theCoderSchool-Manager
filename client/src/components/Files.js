import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeFilesWithUrls } from "../reducers/fileReducer";

const Files = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (user) {
      dispatch(initializeFilesWithUrls());
    }
  }, [dispatch, user]);
  const files = useSelector((state) => state.files);
  const filesList = files.map((file) => {
    return (
      <div key={file.id} className="">
        <img src={file.url} alt={file.filename} className="" />
        <a href={file.url} target="_blank" rel="noreferrer">
          {file.filename}
        </a>
      </div>
    );
  });
  return (
    <div className="lg:px-8">
      <h4 className="font-bold text-3xl">Files</h4>
      <div className="grid grid-cols-3">{filesList}</div>
    </div>
  );
};

export default Files;
