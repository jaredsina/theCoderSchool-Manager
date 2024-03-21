import React from "react";

// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import PropTypes from "prop-types";
import authReducer from "../reducers/authReducer";
import notificationReducer from "../reducers/notificationReducer";

function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: { user: authReducer, notification: notificationReducer },
      preloadedState,
    }),
    ...renderOptions
  } = {},
) {
  const Wrapper = ({ children }) => {
    return (
      <BrowserRouter>
        <Provider store={store}>{children}</Provider>
      </BrowserRouter>
    );
  };
  Wrapper.propTypes = {
    children: PropTypes.elementType.isRequired,
  };
  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export default renderWithProviders;
