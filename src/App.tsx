
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import About from "./pages/About";
import ChatbotNew from "./pages/ChatbotNew";
import Learn from "./pages/Learn";
import LegalAid from "./pages/LegalAid";
import Multilingual from "./pages/Multilingual";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/chatbot" element={<ChatbotNew />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/legal-aid" element={<LegalAid />} />
          <Route path="/multilingual" element={<Multilingual />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
