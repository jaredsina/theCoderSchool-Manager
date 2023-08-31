import React from "react";
import {
  faHouse,
  faHandshake,
  faDiagramProject,
  faListCheck,
  faFile,
  faBoxArchive,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useMatch } from "react-router-dom";

const Sidebar = () => {
  const match = useMatch("/dashboard/:page");
  const page = match ? match.params.page : null;
  return (
    <div className="sidebar bg-emerald-400 rounded-t-3xl lg:rounded-t-none lg:flex lg:px-4">
      <ul className="flex justify-evenly lg:flex-col lg:justify-center lg:gap-4">
        <li
          className={`sidebar-icon flex justify-center items-center p-4 rounded-lg bg-em transition-all ${
            page === "home"
              ? "bg-white shadow-2xl shadow-black -translate-y-8 lg:translate-y-0 lg:translate-x-8"
              : ""
          }`}
        >
          <Link to="/dashboard/home">
            <FontAwesomeIcon
              icon={faHouse}
              style={{ color: "rgb(5, 150, 105)", width: "1em" }}
            />
          </Link>
        </li>
        <li
          className={`sidebar-icon flex justify-center items-center p-4 rounded-lg transition-all ${
            page === "partners"
              ? "bg-white shadow-2xl shadow-black -translate-y-8 lg:translate-y-0 lg:translate-x-8"
              : ""
          }`}
        >
          <Link to="/dashboard/partners">
            <FontAwesomeIcon
              icon={faHandshake}
              style={{ color: "rgb(5, 150, 105)", width: "1em" }}
            />
          </Link>
        </li>
        <li
          className={`sidebar-icon flex justify-center items-center p-4 rounded-lg transition-all ${
            page === "programs"
              ? "bg-white shadow-2xl shadow-black -translate-y-8 lg:translate-y-0 lg:translate-x-8"
              : ""
          }`}
        >
          <Link to="/dashboard/programs">
            <FontAwesomeIcon
              icon={faDiagramProject}
              style={{ color: "rgb(5, 150, 105)", width: "1em" }}
            />
          </Link>
        </li>
        <li
          className={`sidebar-icon flex justify-center items-center p-4 rounded-lg transition-all ${
            page === "tasks"
              ? "bg-white shadow-2xl shadow-black -translate-y-8 lg:translate-y-0 lg:translate-x-8"
              : ""
          }`}
        >
          <Link to="/dashboard/tasks">
            <FontAwesomeIcon
              icon={faListCheck}
              style={{ color: "rgb(5, 150, 105)", width: "1em" }}
            />
          </Link>
        </li>
        <li
          className={`sidebar-icon flex justify-center items-center p-4 rounded-lg transition-all ${
            page === "files"
              ? "bg-white shadow-2xl shadow-black -translate-y-8 lg:translate-y-0 lg:translate-x-8"
              : ""
          }`}
        >
          <Link to="/dashboard/files">
            <FontAwesomeIcon
              icon={faFile}
              style={{ color: "rgb(5, 150, 105)", width: "1em" }}
            />
          </Link>
        </li>
        <li
          className={`sidebar-icon flex justify-center items-center p-4 rounded-lg transition-all ${
            page === "archive"
              ? "bg-white shadow-2xl shadow-black -translate-y-8 lg:translate-y-0 lg:translate-x-8"
              : ""
          }`}
        >
          <Link to="/dashboard/archive">
            <FontAwesomeIcon
              icon={faBoxArchive}
              style={{ color: "rgb(5, 150, 105)", width: "1em" }}
            />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
