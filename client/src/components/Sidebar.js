import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const programs = useSelector((state) => state.programs);
  const programList = programs.map((program) => (
    <li key={program.id}>
      <Link to={`/dashboard/${program.id}`}>{program.name}</Link>
    </li>
  ));

  return (
    <div className="sidebar">
      <h2>Programs</h2>
      <ul>{programList}</ul>
    </div>
  );
};

export default Sidebar;
