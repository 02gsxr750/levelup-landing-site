import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import LandingPage from "./components/LandingPage";
import "./index.css";

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <LandingPage />
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
