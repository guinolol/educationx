"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Star, Clock, TrendingUp, CheckCircle, Sparkles } from "lucide-react";

interface SistemaRecomendacaoProps {
  resultadoQuiz: any;
  onComplete: () => void;
}

const SistemaRecomendacao = ({ resultadoQuiz, onComplete }: SistemaRecomendacaoProps) => {
  const [carregando, setCarregando] = useState(true);
  const [recomendacoes, setRecomendacoes] = useState<any[]>([]);
  const [recomendacaoSelecionada, setRecomendacaoSelecionada] = useState<any>(null);

  useEffect(() => {
    // Simular análise da IA
    setTimeout(() => {
      const recomendacoesGeradas = gerarRecomendacoes(resultadoQuiz);
      setRecomendacoes(recomendacoesGeradas);
      setCarregando(false);
    }, 3000);
  }, [resultadoQuiz]);

  const gerarRecomendacoes = (resultado: any) => {
    const baseRecomendacoes = [
      {
        id: 1,
        titulo: "Curso Intensivo: Fundamentos Essenciais",
        tipo: "curso",
        duracao: "2-4 semanas",
        dificuldade: "iniciante",
        rating: 4.8,
        recomendacao: "Baseado em seu perfil rápido",
        beneficios: ["Aprendizado acelerado", "Foco em habilidades práticas", "Certificado rápido"],
        cor: "from-blue-500 to-cyan-500"
      },
      {
        id: 2,
        titulo: "Trilha Completa: Mestre do Assunto",
        tipo: "trilha",
        duracao: "3-6 meses",
        dificuldade: "intermediario-avancado",
        rating: 4.9,
        recomendacao: "Perfeito para seu comprometimento alto",
        beneficios: ["Domínio completo", "Mentoria inclusa", "Projeto final", "Network exclusivo"],
        cor: "from-purple-500 to-pink-500"
      },
      {
        id: 3,
        titulo: "Bootcamp Prático: Skills para o Mercado",
        tipo: "bootcamp",
        duracao: "4-8 semanas",
        dificuldade: "intermediario",
        rating: 4.7,
        recomendacao: "Ideal para seu objetivo profissional",
        beneficios: ["Projetos reais", "Simulações", "Preparação para entrevistas"],
        cor: "from-green-500 to-teal-500"
      },
      {
        id: 4,
        titulo: "Microlearning: Aprenda em Pedacinhos",
        tipo: "microlearning",
        duracao: "Sempre disponível",
        dificuldade: "flexivel",
        rating: 4.6,
        recomendacao: "Se encaixa perfeitamente no seu tempo",
        beneficios: ["Flexibilidade total", "Conteúdo sempre atualizado", "Aprendizado gradual"],
        cor: "from-orange-500 to-red-500"
      }
    ];

    // Filtrar baseado no perfil
    if (resultadoQuiz.perfil === 'rapido') {
      return [baseRecomendacoes[0], baseRecomendacoes[3]];
    } else if (resultadoQuiz.perfil === 'completo') {
      return [baseRecomendacoes[1], baseRecomendacoes[2]];
    } else {
      return baseRecomendacoes;
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Analisando seu perfil...</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Nossa IA está processando milhares de recursos educacionais para encontrar os melhores para você.
          </p>
          <Progress value={66} className="h-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Escaneando base de dados de conhecimento...
          </p>
        </Card>
      </div>
    );
  }

  if (recomendacaoSelecionada) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 bg-gradient-to-r ${recomendacaoSelecionada.cor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">{recomendacaoSelecionada.titulo}</h2>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  {recomendacaoSelecionada.rating}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {recomendacaoSelecionada.duracao}
                </span>
                <Badge variant="secondary">{recomendacaoSelecionada.tipo}</Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Por que recomendamos este curso:</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {recomendacaoSelecionada.recomendacao}. Baseado em suas respostas, este é o caminho ideal para alcançar seus objetivos.
                </p>
                
                <h4 className="font-semibold mb-3">Você vai aprender:</h4>
                <ul className="space-y-2">
                  {recomendacaoSelecionada.beneficios.map((beneficio: string, index: number) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {beneficio}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h4 className="font-semibold mb-4">Estrutura do curso:</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Módulos</span>
                    <Badge>8-12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Exercícios</span>
                    <Badge>50+</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Projetos</span>
                    <Badge>3-5</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Certificado</span>
                    <Badge className="bg-green-500">Incluso</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={onComplete}
              >
                Começar Este Curso
                <TrendingUp className="ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setRecomendacaoSelecionada(null)}
              >
                Ver Outras Opções
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Recomendações Personalizadas</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Baseado em seu perfil, selecionamos os melhores cursos para você
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {recomendacoes.map((recomendacao) => (
            <Card 
              key={recomendacao.id} 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setRecomendacaoSelecionada(recomendacao)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${recomendacao.cor} rounded-lg flex items-center justify-center`}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary">{recomendacao.tipo}</Badge>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{recomendacao.titulo}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{recomendacao.recomendacao}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  {recomendacao.rating}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {recomendacao.duracao}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SistemaRecomendacao;