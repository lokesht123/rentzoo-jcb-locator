
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Reviews from "./pages/Reviews";
import Tracking from "./pages/Tracking";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import BackToLastVersion from './components/BackToLastVersion';
import PageLoader from './components/PageLoader';
import { usePageLoader } from './hooks/usePageLoader';

const AppContent = () => {
  const isLoading = usePageLoader();

  return (
    <>
      <Navigation />
      {isLoading && <PageLoader />}
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
      <BackToLastVersion />
    </>
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
