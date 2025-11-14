import SistemaRecomendacao from "@/components/SistemaRecomendacao";
import { useNavigate } from "react-router-dom";

const RecomendacoesPage = () => {
  const navigate = useNavigate();
  
  // Pegar resultados do localStorage
  const resultadoQuiz = JSON.parse(localStorage.getItem('resultadoQuiz') || '{}');

  const handleRecomendacoesCompleto = () => {
    // Navegar para o dashboard de aprendizado
    navigate('/aprendizado');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      <SistemaRecomendacao 
        resultadoQuiz={resultadoQuiz} 
        onComplete={handleRecomendacoesCompleto} 
      />
    </div>
  );
};

export default RecomendacoesPage;