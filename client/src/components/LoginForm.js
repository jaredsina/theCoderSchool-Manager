import React from "react";
import { useDispatch } from "react-redux";
import { attemptLogin } from "../reducers/authReducer";
import Notification from "./Notification";

const LoginForm = () => {
  // dispatch is a function that takes an action as an argument
  const dispatch = useDispatch();
  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target[0].value;
    const password = event.target[1].value;
    dispatch(attemptLogin(username, password));
  };
  return (
    <div>
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" />
        <input type="password" placeholder="password" />
        <button type="submit">Login</button>
      </form>
      <Notification />
    </div>
  );
};

export default LoginForm;
