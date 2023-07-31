import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import { initializeUser } from "./reducers/authReducer";
import { initializePrograms } from "./reducers/programsReducer";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  // when the app is first rendered, we want to check if the user is logged in
  useEffect(() => {
    dispatch(initializeUser());
    if (user) {
      dispatch(initializePrograms());
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <LoginForm />} />
      </Routes>
    </div>
  );
};

export default App;
