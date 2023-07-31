import React from "react";
import { useDispatch } from "react-redux";
import Sidebar from "./Sidebar";
import { logout } from "../reducers/authReducer";

const Dashboard = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <button type="button" onClick={() => dispatch(logout())}>
        Logout
      </button>
      <h1>Dashboard</h1>
      <Sidebar />
      <div className="main">
        <h2>Program</h2>
      </div>
    </div>
  );
};

export default Dashboard;
