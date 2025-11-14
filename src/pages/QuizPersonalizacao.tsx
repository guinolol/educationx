import QuizPersonalizacao from "@/components/QuizPersonalizacao";
import { useNavigate } from "react-router-dom";

const QuizPage = () => {
  const navigate = useNavigate();

  const handleQuizCompleto = (resultados: any) => {
    // Salvar resultados no localStorage ou state global
    localStorage.setItem('resultadoQuiz', JSON.stringify(resultados));
    // Navegar para recomendações
    navigate('/recomendacoes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      <QuizPersonalizacao onComplete={handleQuizCompleto} />
    </div>
  );
};

export default QuizPage;