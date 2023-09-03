import React, { useDebugValue, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useMatch } from "react-router-dom";
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
import Task from "./Task";
import SearchBar from "./SearchBar";
import { initializeTasks } from "../reducers/taskReducer";
import { initializeFiles } from "../reducers/fileReducer";
import Programs from "./Programs";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const match = useMatch("/dashboard/:page");
  // logging out the user and removing the programs and partners from the store
  const logoutHandler = () => {
    dispatch(logout());
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
    dispatch(initializeUser()); // check if the user is logged in, sets tokens for services
    dispatch(initializePrograms()); // fetch programs from the server
    dispatch(initializePartners()); // fetch partners from the server
    dispatch(initializeTasks()); // fetch tasks from the server
    dispatch(initializeFiles()); // fetch files from the server
  }, [dispatch]);

  return (
    <div className="flex flex-col h-full lg:flex-row bg-white lg:bg-emerald-950">
      {/* <ProgramForm />
      <PartnerForm />
      <Notification /> */}
      <div className="main bg-white flex-grow lg:order-last lg:rounded-l-3xl text-emerald-950">
        <div className="main-top flex lg:justify-between justify-end gap-8 items-center p-4 lg:p-12">
          <SearchBar />
          <button
            type="button"
            onClick={logoutHandler}
            className="logout-button text-emerald-950 bg-yellow-400 rounded-lg px-4 py-2 hover:bg-yellow-500 transition-all"
          >
            Logout
          </button>
        </div>
        <div className="p-4">
          {match.params.page === "programs" && <Programs />}
          {match.params.page === "partners" && <Partner />}
          {match.params.page === "tasks" && <Task />}
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default Dashboard;
