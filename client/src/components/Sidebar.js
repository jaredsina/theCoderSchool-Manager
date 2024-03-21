import React from "react";
import {
  faHandshake,
  faDiagramProject,
  faListCheck,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useMatch } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const match = useMatch("/dashboard/:page");
  const page = match ? match.params.page : null;
  return (
    <div className="sidebar  bg-emerald-950 rounded-t-3xl lg:rounded-t-none lg:flex lg:flex-col lg:px-4 lg:p-8">
      <img
        src={logo}
        alt="logo"
        className="hidden lg:block lg:sticky lg:top-4 lg:left-4 lg:w-24 lg:bg-emerald-950 lg:p-2 lg:rounded-md"
      />
      <ul className="flex-grow flex justify-evenly lg:flex-col lg:justify-center lg:gap-4">
        <li
          className={`sidebar-icon flex justify-center items-center p-4 rounded-lg transition-all ${
            page === "partners"
              ? "bg-white lg:w-14 shadow-2xl shadow-black -translate-y-8 lg:translate-y-0 lg:translate-x-20"
              : ""
          }`}
        >
          <Link to="/dashboard/partners">
            <FontAwesomeIcon
              icon={faHandshake}
              style={{
                color:
                  page === "partners" ? "rgb(250,204,21)" : "rgb(5, 150, 105)",
                width: "1em",
              }}
            />
          </Link>
        </li>
        <li
          className={`sidebar-icon flex justify-center items-center p-4 rounded-lg transition-all ${
            page === "programs"
              ? "bg-white lg:w-14 shadow-2xl shadow-black -translate-y-8 lg:translate-y-0 lg:translate-x-20"
              : ""
          }`}
        >
          <Link to="/dashboard/programs">
            <FontAwesomeIcon
              icon={faDiagramProject}
              style={{
                color:
                  page === "programs" ? "rgb(250,204,21)" : "rgb(5, 150, 105)",
                width: "1em",
              }}
            />
          </Link>
        </li>
        <li
          className={`sidebar-icon flex justify-center items-center p-4 rounded-lg transition-all ${
            page === "tasks"
              ? "bg-white lg:w-14 shadow-2xl shadow-black -translate-y-8 lg:translate-y-0 lg:translate-x-20"
              : ""
          }`}
        >
          <Link to="/dashboard/tasks">
            <FontAwesomeIcon
              icon={faListCheck}
              style={{
                color:
                  page === "tasks" ? "rgb(250,204,21)" : "rgb(5, 150, 105)",
                width: "1em",
              }}
            />
          </Link>
        </li>
        <li
          className={`sidebar-icon flex justify-center items-center p-4 rounded-lg transition-all ${
            page === "files"
              ? "bg-white lg:w-14 shadow-2xl shadow-black -translate-y-8 lg:translate-y-0 lg:translate-x-20"
              : ""
          }`}
        >
          <Link to="/dashboard/files">
            <FontAwesomeIcon
              icon={faFile}
              style={{
                color:
                  page === "files" ? "rgb(250,204,21)" : "rgb(5, 150, 105)",
                width: "1em",
              }}
            />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
