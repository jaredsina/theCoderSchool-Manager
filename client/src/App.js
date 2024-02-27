import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import "./main.css";

const App = () => {
  const user = useSelector((state) => state.user);
  return (
    <div className="App h-screen bg-emerald-950 text-emerald-50 font-sans">
      <Routes>
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/dashboard/files" element={<Dashboard />} />
        <Route path="/dashboard/programs" element={<Dashboard />} />
        <Route path="/dashboard/tasks" element={<Dashboard />} />
        <Route path="/dashboard/partners" element={<Dashboard />} />
        {/* <Route path="/dashboard/:id" element={<Dashboard />} /> */}
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            user ? (
              <Navigate replace to="/dashboard/partners" />
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
