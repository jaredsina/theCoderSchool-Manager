import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "core-js/stable/index";
import "regenerator-runtime/runtime";
import store from "./utils/store";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Provider store={store}>
        <App />
      </Provider>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

const renderApp = () => {
  root.render(<RouterProvider router={router} />);
};

renderApp();
store.subscribe(renderApp);
