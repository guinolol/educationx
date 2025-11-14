import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QuizPersonalizacao from "./pages/QuizPersonalizacao";
import Recomendacoes from "./pages/Recomendacoes";
import DashboardAprendizado from "./pages/DashboardAprendizado";
import Layout from "./components/Layout";
import MicroLessonPage from "./pages/MicroLessonPage";
import SimulationPage from "./pages/SimulationPage";
import ReviewLessonPage from "./pages/ReviewLessonPage";
import Login from "./pages/Login";
import { SessionProvider } from "./components/SessionProvider";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Rotas Públicas */}
              <Route index element={<Index />} />
              <Route path="quiz" element={<QuizPersonalizacao />} />
              <Route path="recomendacoes" element={<Recomendacoes />} />
              
              {/* Rotas Protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="aprendizado" element={<DashboardAprendizado />} />
                <Route path="lesson/:lessonId" element={<MicroLessonPage />} />
                <Route path="simulation/:simulationId" element={<SimulationPage />} />
                <Route path="review/:reviewId" element={<ReviewLessonPage />} />
              </Route>
            </Route>
            <Route path="login" element={<Login />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;