import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import {dark} from "@clerk/themes"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")! as HTMLElement).render(
<ClerkProvider 
appearance={{
    theme:dark , 
    variables:{
        colorPrimary: '#4f39f6',
        colorPrimaryForeground: '#ffffff'
    }
}}
   publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>,
);
