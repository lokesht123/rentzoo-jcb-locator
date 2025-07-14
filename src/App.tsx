
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Reviews from "./pages/Reviews";
import Tracking from "./pages/Tracking";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import BackToLastVersion from './components/BackToLastVersion';
import PageLoader from './components/PageLoader';
import { usePageLoader } from './hooks/usePageLoader';

const AppContent = () => {
  const isLoading = usePageLoader();

  return (
    <div className="min-h-screen relative">
      {/* Fixed persistent navbar - always visible */}
      <Navigation />
      
      {/* Page loader overlay - doesn't affect navbar */}
      {isLoading && (
        <div className="fixed inset-0 z-40">
          <PageLoader />
        </div>
      )}
      
      {/* Main content area */}
      <div className="relative">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      <BackToLastVersion />
    </div>
  );
};

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
