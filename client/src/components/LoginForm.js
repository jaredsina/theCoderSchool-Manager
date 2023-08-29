import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { attemptLogin } from "../reducers/authReducer";
import Notification from "./Notification";
import logo from "../assets/logo.png";

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
  };

  // when LoginForm mounts and user changes we want to redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="login h-full flex flex-col">
      <div className="login-banner p-8 lg:self-center">
        <img src={logo} alt="theCoderSchool logo" className="" />
        <h1 className="title text-2xl lg:text-4xl">Montgomery Database</h1>
      </div>
      <div className="login-form bg-white text-emerald-950 flex-grow p-8 lg:w-96 lg:flex-none lg:rounded-lg lg:mx-auto">
        <h1 className="text-3xl text-emerald-950">Welcome Back</h1>
        <p className="login-text text-sm mb-8">
          Please enter your details below
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="username" className="flex flex-col">
            Username
            <input
              className="rounded-xl border border-gray-300 py-2 px-4 max-w-sm"
              type="text"
              placeholder="username"
              id="username"
              name="username"
            />
          </label>
          <label htmlFor="password" className="flex flex-col">
            Password
            <input
              className="rounded-xl bg-transparent border border-gray-300 py-2 px-4 max-w-sm"
              type="password"
              placeholder="password"
              id="password"
              name="password"
            />
          </label>

          <label htmlFor="remember" className="">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="mr-2"
            />
            Keep me logged in
          </label>
          <button
            type="submit"
            className="login-button lg:self-center max-w-fit py-2 px-8 bg-yellow-300 rounded-md font-bold hover:bg-yellow-400 transition duration-200 ease-in-out "
          >
            Login
          </button>
        </form>
        <p className="login-notification flex justify-center lg:h-8 mt-4">
          <Notification />
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
