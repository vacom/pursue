import React from "react";
import ReactDOM from "react-dom";
import { ConfigProvider } from "pursue";
import App from "./App";

const config = {
  mode: "dev",
  api: {
    url:
      "https://www.jsonstore.io/1edfb8953a2c5a5b1bf8c789faf45534527af44f47c906686b802bd6bee24e96",
    loginUrl: "https://www.jsonstore.io",
    headers: {
      "Content-Type": "application/json",
      "cache-control": "no-cache"
    },
    endpoints: {
      todos: "/todos",
      add: "/todos",
      sub: (name = "hound") => `/${name}/list`
    }
  }
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <ConfigProvider config={config}>
    <App />
  </ConfigProvider>,
  rootElement
);
