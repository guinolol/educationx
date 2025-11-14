import DashboardAprendizado from "@/components/DashboardAprendizado";

const DashboardPage = () => {
  // Pegar resultados do localStorage
  const resultadoQuiz = JSON.parse(localStorage.getItem('resultadoQuiz') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      <DashboardAprendizado resultadoQuiz={resultadoQuiz} />
    </div>
  );
};

export default DashboardPage;