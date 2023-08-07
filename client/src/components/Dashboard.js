import React, { useDebugValue, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { logout, initializeUser } from "../reducers/authReducer";
import ProgramForm from "./ProgramForm";
import Program from "./Program";
import Notification from "./Notification";
import PartnerForm from "./PartnerForm";
import {
  initializePrograms,
  removeAllProgramsState,
} from "../reducers/programsReducer";
import {
  initializePartners,
  removeAllPartnersState,
} from "../reducers/partnersReducer";
import Partner from "./Partner";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // logging out the user and removing the programs and partners from the store
  const logoutHandler = () => {
    dispatch(logout());
    dispatch(removeAllPartnersState());
    dispatch(removeAllProgramsState());
    navigate("/login");
  };
  // when the Dashboard first mounts lets check if user exists the store and if not redirect to login
  useEffect(() => {
    const userJSON = JSON.parse(window.localStorage.getItem("user"));
    if (!userJSON) {
      navigate("/login");
    }
  }, [navigate]);

  // when the app is first rendered, we want to check if the user is logged in
  // and if so, we want to fetch the programs and partners from the server to validate the token

  useEffect(() => {
    dispatch(initializeUser());
    dispatch(initializePrograms());
    dispatch(initializePartners());
  }, [dispatch]);
  return (
    <div>
      <button type="button" onClick={logoutHandler}>
        Logout
      </button>
      <ProgramForm />
      <PartnerForm />
      <Notification />

      <h1>Dashboard</h1>
      <Sidebar />
      <div className="main">
        <Program />
        <Partner />
      </div>
    </div>
  );
};

export default Dashboard;
