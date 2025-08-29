import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AllCalculators from "./pages/AllCalculators";
import Dashboard from "./pages/Dashboard";
import TaxEstimatorPage from "./pages/calculators/TaxEstimatorPage";
import MortgagePage from "./pages/calculators/MortgagePage";
import InvestmentPage from "./pages/calculators/InvestmentPage";
import RetirementPage from "./pages/calculators/RetirementPage";
import CompoundInterestPage from "./pages/calculators/CompoundInterestPage";
import LoanPage from "./pages/calculators/LoanPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/calculators" element={<AllCalculators />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calculators/tax-estimator" element={<TaxEstimatorPage />} />
            <Route path="/calculators/mortgage" element={<MortgagePage />} />
            <Route path="/calculators/investment" element={<InvestmentPage />} />
            <Route path="/calculators/retirement" element={<RetirementPage />} />
            <Route path="/calculators/compound-interest" element={<CompoundInterestPage />} />
            <Route path="/calculators/loan" element={<LoanPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
