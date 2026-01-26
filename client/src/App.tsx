import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/components/LandingPage";
import AboutPage from "@/pages/about";
import PrivacyPage from "@/pages/privacy";
import DeleteAccountPage from "@/pages/delete-account";
import SponsorsPage from "@/pages/sponsors";
import SponsorsSuccessPage from "@/pages/sponsors-success";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Switch>
            <Route path="/about" component={AboutPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <Route path="/delete-account" component={DeleteAccountPage} />
            <Route path="/sponsors" component={SponsorsPage} />
            <Route path="/sponsors/success" component={SponsorsSuccessPage} />
            <Route path="/" component={LandingPage} />
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
