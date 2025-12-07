import { useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/components/LandingPage";
import AboutPage from "@/pages/about";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  console.log("Current wouter location:", location);
  
  if (location === "/about") {
    console.log("Rendering AboutPage");
    return <AboutPage />;
  }
  if (location === "/") {
    console.log("Rendering LandingPage");
    return <LandingPage />;
  }
  console.log("Rendering NotFound");
  return <NotFound />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
