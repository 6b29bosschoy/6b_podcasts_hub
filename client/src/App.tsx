import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch, useLocation } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ── Critical path: eagerly loaded (above the fold on first visit) ─────────────
import Portal from "@/pages/Portal";

// ── Lazy-loaded: split into separate chunks ────────────────────────────────────
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const PodcastsPage = lazy(() => import("./pages/PodcastsPage"));
const Partnership = lazy(() => import("./pages/Partnership"));
const MonetizationPlan = lazy(() => import("./pages/MonetizationPlan"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogSubmit = lazy(() => import("./pages/BlogSubmit"));
const Booking = lazy(() => import("./pages/Booking"));
const Contact = lazy(() => import("./pages/Contact"));
const HostRecruitment = lazy(() => import("@/pages/HostRecruitment"));
const Episodes = lazy(() => import("@/pages/Episodes"));
const Investors = lazy(() => import("@/pages/Investors"));
const Welcome = lazy(() => import("@/pages/Welcome"));

// ── Admin (largest chunk, never needed by regular users) ──────────────────────
const Admin = lazy(() => import("@/pages/Admin"));

// ── Mystic suite (heavy AI + analysis tools) ──────────────────────────────────
const MysticNavbar = lazy(() => import("@/components/MysticNavbar"));
const MysticHome = lazy(() => import("@/pages/mystic/MysticHome"));
const MysticAnalysis = lazy(() => import("@/pages/mystic/MysticAnalysis"));
const MysticMasters = lazy(() => import("@/pages/mystic/MysticMasters"));
const MysticMasterDetail = lazy(() => import("@/pages/mystic/MysticMasterDetail"));
const MysticVideos = lazy(() => import("@/pages/mystic/MysticVideos"));
const MysticArticles = lazy(() => import("@/pages/mystic/MysticArticles"));
const MysticPricing = lazy(() => import("@/pages/mystic/MysticPricing"));
const MysticBazi = lazy(() => import("@/pages/mystic/MysticBazi"));
const MysticServices = lazy(() => import("@/pages/mystic/MysticServices"));
const MysticFunnel = lazy(() => import("@/pages/mystic/MysticFunnel"));

// ── Push notifications (deferred, not needed on first paint) ──────────────────
const ChatBot = lazy(() => import("./components/ChatBot"));
const PushBellButton = lazy(() =>
  import("./components/PushNotificationManager").then((m) => ({ default: m.PushBellButton }))
);
const PushPromptBanner = lazy(() =>
  import("./components/PushNotificationManager").then((m) => ({ default: m.PushPromptBanner }))
);

// ── Minimal page-level spinner ────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "oklch(0.62 0.24 25 / 0.4)", borderTopColor: "oklch(0.62 0.24 25)" }} />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/welcome" component={Welcome} />
        <Route path="/" component={Portal} />
        <Route path="/home"><Redirect to="/" /></Route>
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/podcasts" component={PodcastsPage} />
        <Route path="/partnership" component={Partnership} />
        <Route path="/monetization-plan" component={MonetizationPlan} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/submit" component={BlogSubmit} />
        <Route path="/blog/:slug">
          {(params) => <BlogPost slug={params.slug} />}
        </Route>
        <Route path="/booking" component={Booking} />
        <Route path="/contact" component={Contact} />
        <Route path="/host-recruitment" component={HostRecruitment} />
        <Route path="/episodes" component={Episodes} />
        <Route path="/investors" component={Investors} />
        {/* Mystic routes */}
        <Route path="/mystic" component={MysticHome} />
        <Route path="/mystic/analysis" component={MysticAnalysis} />
        <Route path="/mystic/masters" component={MysticMasters} />
        <Route path="/mystic/masters/:id">
          {(params) => <MysticMasterDetail id={params.id} />}
        </Route>
        <Route path="/mystic/videos" component={MysticVideos} />
        <Route path="/mystic/articles" component={MysticArticles} />
        <Route path="/mystic/pricing" component={MysticPricing} />
        <Route path="/mystic/bazi" component={MysticBazi} />
        <Route path="/mystic/services" component={MysticServices} />
        <Route path="/mystic/funnel" component={MysticFunnel} />
        {/* Admin */}
        <Route path="/admin" component={Admin} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [location] = useLocation();
  const isWelcome = location === "/welcome" || location.startsWith("/welcome?");
  const isMystic = location.startsWith("/mystic");
  // Portal is now the unified brand homepage — show Navbar/Footer on root too
  const showMainNav = !isWelcome && !isMystic;

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {showMainNav && <Navbar />}
          {isMystic && (
            <Suspense fallback={null}>
              <MysticNavbar />
            </Suspense>
          )}
          <Router />
          {showMainNav && <Footer />}
          {showMainNav && (
            <Suspense fallback={null}>
              <ChatBot />
              <PushBellButton />
              <PushPromptBanner />
            </Suspense>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
