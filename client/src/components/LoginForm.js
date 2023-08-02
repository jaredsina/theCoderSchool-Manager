import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { attemptLogin } from "../reducers/authReducer";
import Notification from "./Notification";

const LoginForm = () => {
  // dispatch is a function that takes an action as an argument
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    dispatch(attemptLogin(username, password));
    if (user) {
      navigate("/dashboard");
    }
  };
  // when the LoginForm mounts lets check if user exists the store and if so redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          id="username"
          name="username"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          name="password"
        />
        <button type="submit">Login</button>
      </form>
      <Notification />
    </div>
  );
};

export default LoginForm;
