import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MarketingApp } from "./main";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MarketingApp />
  </StrictMode>,
);
