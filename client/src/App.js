import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import { initializeUser } from "./reducers/authReducer";
import { initializePrograms } from "./reducers/programsReducer";
import { initializePartners } from "./reducers/partnersReducer";
import { initializeTasks } from "./reducers/taskReducer";
import "./main.css";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  // when the app is first rendered, we want to check if the user is logged in
  // and if so, we want to fetch the programs from the server to validate the token
  useEffect(() => {
    dispatch(initializeUser());
    dispatch(initializePrograms());
    dispatch(initializePartners());
    dispatch(initializeTasks());
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            user ? (
              <Navigate replace to="/dashboard" />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
