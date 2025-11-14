"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, BookOpen, Target, Sparkles, Play, Clock, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleComecarQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Educação Inteligente
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Aprenda do seu jeito, no seu ritmo, com tecnologia de ponta
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hiper-personalização</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quiz inteligente que entende seu estilo de aprendizado e objetivos
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">IA Recomendadora</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sistema que analisa milhares de recursos para encontrar o melhor conteúdo pra você
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gamificação</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Exercícios práticos, reforços inteligentes e técnicas de retenção avançadas
              </p>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={handleComecarQuiz}
          >
            <Play className="mr-2" />
            Começar Jornada de Aprendizado
          </Button>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-orange-500 mr-3" />
              <h3 className="text-xl font-semibold">Rápido e Prático</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Para quem quer resultados imediatos e tem pouco tempo. Foco em aprendizado direcionado e curto prazo.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Quiz rápido (5 minutos)
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Recomendações instantâneas
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Foco em habilidades práticas
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-500 mr-3" />
              <h3 className="text-xl font-semibold">Completo e Aprofundado</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Para quem busca domínio total com disciplina e comprometimento. Trilha de aprendizado completa.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Análise detalhada (15-20 minutos)
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Plano de estudo personalizado
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Acompanhamento de progresso
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;