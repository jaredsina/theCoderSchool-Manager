import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { logout } from "../reducers/authReducer";
import ProgramForm from "./ProgramForm";
import Program from "./Program";
import Notification from "./Notification";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };
  // when the Dashboard mounts lets check if user exists the store and if not redirect to login
  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <button type="button" onClick={logoutHandler}>
        Logout
      </button>
      <ProgramForm />
      <Notification />
      <h1>Dashboard</h1>
      <Sidebar />
      <div className="main">
        <Program />
      </div>
    </div>
  );
};

export default Dashboard;
