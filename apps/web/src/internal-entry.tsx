import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { InternalApp } from "./internal-app";
import "./design-system.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InternalApp />
  </StrictMode>,
);
