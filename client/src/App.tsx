/* ============================================================
   App.tsx — Late Night Ltd.
   Routes: Home, About, Project, Tour, Discography, Video, Shop, Contact
   ============================================================ */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Project from "./pages/News";
import Tour from "./pages/Tour";
import Discography from "./pages/Discography";
import Video from "./pages/Video";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/project" component={Project} />
      <Route path="/tour" component={Tour} />
      <Route path="/discography" component={Discography} />
      <Route path="/video" component={Video} />
      <Route path="/shop" component={Shop} />
      <Route path="/contact" component={Contact} />
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
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "oklch(0.15 0.005 285)",
                border: "1px solid oklch(1 0 0 / 10%)",
                color: "oklch(0.95 0.005 65)",
                fontFamily: '"ButlerCustom", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
                fontSize: "0.8rem",
              },
            }}
          />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
