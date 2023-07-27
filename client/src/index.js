import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "core-js/stable/index";
import "regenerator-runtime/runtime";
import store from "./utils/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

const renderApp = () => {
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
};

renderApp();
store.subscribe(renderApp);
