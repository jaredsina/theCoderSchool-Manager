import React, { useState } from "react";
import { useSelector } from "react-redux";

const Programs = () => {
  const [status, setStatus] = useState(false); // false = inactive, true = active

  // if status is set to false display all programs otherwise display only active programs
  const programs = useSelector((state) => {
    if (status) {
      return state.programs.filter((program) => program.status === true);
    }
    return state.programs;
  });

  const programCards = programs.map((program) => {
    return (
      <div key={program.id} className="bg-emerald-50 shadow-md rounded-lg p-4">
        <p>{program.name}</p>
        <p>{program.status ? "Active" : "Inactive"}</p>
      </div>
    );
  });

  return (
    <>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          onClick={() => setStatus(!status)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
        <span className="ml-3 text-sm font-medium text-emerald-950 dark:text-gray-200">
          Active Programs
        </span>
      </label>
      <button
        type="button"
        className="programCreateButton bg-emerald-950 text-white rounded-lg p-2"
        data-modal-toggle="addProgram-modal"
        data-modal0-target="addProgram-modal"
      >
        Create Program
      </button>
      <div className="" tabIndex="-1" id="addProgram-modal" />
      <h2 className="font-bold">Programs</h2>
      <div className="programs-list bg-transparent grid grid-flow-row gap-4">
        {programCards}
      </div>
      <div />
    </>
  );
};

export default Programs;
