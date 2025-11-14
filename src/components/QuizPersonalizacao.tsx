"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, Clock, Brain, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuizPersonalizacaoProps {
  onComplete?: (resultados: any) => void;
}

const QuizPersonalizacao = ({ onComplete }: QuizPersonalizacaoProps) => {
  const navigate = useNavigate();
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const perguntas = [
    {
      id: 'tempo',
      pergunta: 'Quanto tempo você pode dedicar ao estudo por dia?',
      opcoes: [
        { valor: '15min', label: '15-30 minutos', icone: <Clock className="w-4 h-4" /> },
        { valor: '30min', label: '30-60 minutos', icone: <Clock className="w-4 h-4" /> },
        { valor: '1h', label: '1-2 horas', icone: <Clock className="w-4 h-4" /> },
        { valor: '2h+', label: 'Mais de 2 horas', icone: <Clock className="w-4 h-4" /> }
      ]
    },
    {
      id: 'objetivo',
      pergunta: 'Qual seu principal objetivo de aprendizado?',
      opcoes: [
        { valor: 'trabalho', label: 'Melhorar no trabalho', icone: <Target className="w-4 h-4" /> },
        { valor: 'carreira', label: 'Mudar de carreira', icone: <Target className="w-4 h-4" /> },
        { valor: 'hobby', label: 'Hobby/Pessoal', icone: <Brain className="w-4 h-4" /> },
        { valor: 'academico', label: 'Acadêmico', icone: <Brain className="w-4 h-4" /> }
      ]
    },
    {
      id: 'estilo',
      pergunta: 'Como você aprende melhor?',
      opcoes: [
        { valor: 'visual', label: 'Visual (vídeos, imagens)', icone: <Zap className="w-4 h-4" /> },
        { valor: 'leitura', label: 'Leitura e textos', icone: <Brain className="w-4 h-4" /> },
        { valor: 'pratica', label: 'Prática e exercícios', icone: <Target className="w-4 h-4" /> },
        { valor: 'audio', label: 'Áudio e podcasts', icone: <Brain className="w-4 h-4" /> }
      ]
    },
    {
      id: 'prazo',
      pergunta: 'Qual seu prazo para ver resultados?',
      opcoes: [
        { valor: 'semanas', label: 'Algumas semanas', icone: <Clock className="w-4 h-4" /> },
        { valor: 'meses', label: 'Alguns meses', icone: <Clock className="w-4 h-4" /> },
        { valor: 'ano', label: '1 ano ou mais', icone: <Clock className="w-4 h-4" /> },
        { valor: 'flexivel', label: 'Sem pressa, quero dominar', icone: <Brain className="w-4 h-4" /> }
      ]
    },
    {
      id: 'comprometimento',
      pergunta: 'Qual seu nível de comprometimento?',
      opcoes: [
        { valor: 'leve', label: 'Leve - Quero explorar', icone: <Zap className="w-4 h-4" /> },
        { valor: 'medio', label: 'Médio - Quero melhorar', icone: <Target className="w-4 h-4" /> },
        { valor: 'alto', label: 'Alto - Quero dominar', icone: <Brain className="w-4 h-4" /> },
        { valor: 'extremo', label: 'Extremo - Vou me dedicar muito', icone: <Brain className="w-4 h-4" /> }
      ]
    }
  ];

  const handleResposta = (perguntaId: string, resposta: string) => {
    setRespostas(prev => ({ ...prev, [perguntaId]: resposta }));
    
    if (perguntaAtual < perguntas.length - 1) {
      setTimeout(() => setPerguntaAtual(prev => prev + 1), 300);
    } else {
      setTimeout(() => setMostrarResultado(true), 300);
    }
  };

  const calcularPerfil = () => {
    const comprometimento = respostas.comprometimento;
    const tempo = respostas.tempo;
    const prazo = respostas.prazo;

    let perfil = 'medio';
    let titulo = 'Aprendizado Equilibrado';
    let descricao = 'Um plano de estudo equilibrado entre teoria e prática';

    if (comprometimento === 'leve' || (tempo === '15min' && prazo === 'semanas')) {
      perfil = 'rapido';
      titulo = 'Rápido e Prático';
      descricao = 'Foco em resultados imediatos com conteúdo direcionado';
    } else if (comprometimento === 'alto' || comprometimento === 'extremo' || prazo === 'ano' || prazo === 'flexivel') {
      perfil = 'completo';
      titulo = 'Completo e Aprofundado';
      descricao = 'Trilha completa para domínio total do assunto';
    }

    return { perfil, titulo, descricao };
  };

  const handleContinuar = () => {
    const perfil = calcularPerfil();
    const resultados = { perfil: perfil.perfil, respostas };
    
    if (onComplete) {
      onComplete(resultados);
    }
    
    // Salvar no localStorage e navegar
    localStorage.setItem('resultadoQuiz', JSON.stringify(resultados));
    navigate('/recomendacoes');
  };

  if (mostrarResultado) {
    const perfil = calcularPerfil();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">{perfil.titulo}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {perfil.descricao}
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4">Seu perfil de aprendizado:</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Tempo disponível:</strong> {respostas.tempo}</p>
                <p><strong>Objetivo:</strong> {respostas.objetivo}</p>
                <p><strong>Estilo:</strong> {respostas.estilo}</p>
                <p><strong>Prazo:</strong> {respostas.prazo}</p>
                <p><strong>Comprometimento:</strong> {respostas.comprometimento}</p>
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={handleContinuar}
              className="w-full"
            >
              Ver Minhas Recomendações Personalizadas
              <ChevronRight className="ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const pergunta = perguntas[perguntaAtual];
  const progresso = ((perguntaAtual + 1) / perguntas.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Progress value={progresso} className="h-2" />
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Pergunta {perguntaAtual + 1} de {perguntas.length}
          </p>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-8 text-center">{pergunta.pergunta}</h2>
          
          <RadioGroup 
            value={respostas[pergunta.id] || ''}
            onValueChange={(valor) => handleResposta(pergunta.id, valor)}
            className="space-y-4"
          >
            {pergunta.opcoes.map((opcao) => (
              <div key={opcao.valor}>
                <RadioGroupItem 
                  value={opcao.valor} 
                  id={opcao.valor} 
                  className="peer sr-only"
                />
                <Label 
                  htmlFor={opcao.valor} 
                  className="flex items-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 cursor-pointer peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-50 dark:peer-data-[state=checked]:bg-purple-900 transition-all"
                >
                  <span className="mr-3">{opcao.icone}</span>
                  {opcao.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Card>
      </div>
    </div>
  );
};

export default QuizPersonalizacao;