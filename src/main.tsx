import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import "./main.css";
import "simplebar/dist/simplebar.min.css";
import { Scrollbar } from "@deskpro/deskpro-ui";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Scrollbar style={{ height: "100%", width: "100%" }}>
      <DeskproAppProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </DeskproAppProvider>
    </Scrollbar>
  </React.StrictMode>
);
