import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";

import "core-js/stable/index";
import "regenerator-runtime/runtime";
import { BrowserRouter } from "react-router-dom";
import store from "./utils/store";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

const renderApp = () => {
  root.render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>,
  );
};

renderApp();
store.subscribe(renderApp);
