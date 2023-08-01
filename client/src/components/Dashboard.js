import React from "react";
import { useDispatch } from "react-redux";
import Sidebar from "./Sidebar";
import { logout } from "../reducers/authReducer";
import ProgramForm from "./ProgramForm";
import Program from "./Program";

const Dashboard = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <button type="button" onClick={() => dispatch(logout())}>
        Logout
      </button>
      <ProgramForm />
      <h1>Dashboard</h1>
      <Sidebar />
      <div className="main">
        <Program />
      </div>
    </div>
  );
};

export default Dashboard;
