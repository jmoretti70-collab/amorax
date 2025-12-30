import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import MapViewPage from "./pages/MapView";
import Booking from "./pages/Booking";
import ScheduleManagement from "./pages/ScheduleManagement";

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={Home} />
      
      {/* Category Listings */}
      <Route path="/mulheres" component={Listing} />
      <Route path="/homens" component={Listing} />
      <Route path="/travestis" component={Listing} />
      <Route path="/:category" component={Listing} />
      
      {/* Profile Page */}
      <Route path="/perfil/:slug" component={Profile} />
      
      {/* Booking */}
      <Route path="/agendar/:slug" component={Booking} />
      
      {/* Map View */}
      <Route path="/mapa" component={MapViewPage} />
      
      {/* Advertiser Area */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/agenda" component={ScheduleManagement} />
      <Route path="/anunciar" component={Onboarding} />
      
      {/* Auth Routes */}
      <Route path="/login" component={Dashboard} />
      
      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
