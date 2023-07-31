import React from "react";
import { useSelector, useDispatch } from "react-redux";

const Sidebar = () => {
  const dispatch = useDispatch();

  return (
    <div className="sidebar">
      <h2>Programs</h2>
    </div>
  );
};

export default Sidebar;
