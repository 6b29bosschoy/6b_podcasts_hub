import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import { PushBellButton, PushPromptBanner } from "./components/PushNotificationManager";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import PodcastsPage from "./pages/PodcastsPage";
import Partnership from "./pages/Partnership";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogSubmit from "./pages/BlogSubmit";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Admin from "@/pages/Admin";
import Welcome from "@/pages/Welcome";

function Router() {
  return (
    <Switch>
      <Route path="/welcome" component={Welcome} />
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/podcasts" component={PodcastsPage} />
      <Route path="/partnership" component={Partnership} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/submit" component={BlogSubmit} />
      <Route path="/blog/:slug">
        {(params) => <BlogPost slug={params.slug} />}
      </Route>
      <Route path="/booking" component={Booking} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isWelcome = location === "/welcome" || location.startsWith("/welcome?");

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {!isWelcome && <Navbar />}
          <Router />
          {!isWelcome && <Footer />}
          {!isWelcome && <ChatBot />}
          {!isWelcome && <PushBellButton />}
          {!isWelcome && <PushPromptBanner />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
