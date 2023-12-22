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
