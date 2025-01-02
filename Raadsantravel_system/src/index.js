import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Login from "./scenes/login/Login";
import { BrowserRouter } from "react-router-dom";
import userstore from "./reducers/user";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={userstore}>
    <Login root={root} />
    </Provider >
    </BrowserRouter>
  </React.StrictMode>
);
