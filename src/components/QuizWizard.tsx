"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, Info } from 'lucide-react';

interface QuizWizardProps {
  onComplete: (resultados: any) => void;
}

const QuizWizard = ({ onComplete }: QuizWizardProps) => {
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);

  const perguntas = [
    {
      id: '1',
      pergunta: 'Qual é o problema fundamental das conversas com clientes?',
      opcoes: [
        { valor: 'a', label: 'As pessoas não entendem o mercado', icone: <XCircle className="w-4 h-4" /> },
        { valor: 'b', label: 'Conversas com clientes são ruins por padrão', icone: <XCircle className="w-4 h-4" /> },
        { valor: 'c', label: 'Os empreendedores não sabem ouvir', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'd', label: 'As empresas não têm tempo', icone: <XCircle className="w-4 h-4" /> }
      ],
      explicacao: 'O problema fundamental é que conversas com clientes são ruins por padrão. É seu trabalho consertá-las.'
    },
    {
      id: '2',
      pergunta: 'O que é o Teste da Mãe?',
      opcoes: [
        { valor: 'a', label: 'Um conjunto de regras para elaborar boas perguntas', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'b', label: 'Um método para validar ideias de negócios', icone: <Info className="w-4 h-4" /> },
        { valor: 'c', label: 'Um framework para análise de mercado', icone: <Info className="w-4 h-4" /> },
        { valor: 'd', label: 'Um guia para apresentações de negócios', icone: <XCircle className="w-4 h-4" /> }
      ],
      explicacao: 'O Teste da Mãe é um conjunto de regras simples para elaborar boas perguntas sobre as quais nem mesmo sua mãe pode mentir.'
    },
    {
      id: '3',
      pergunta: 'Qual é a regra geral sobre conversas com clientes?',
      opcoes: [
        { valor: 'a', label: 'Quanto mais você fala, melhor está se saindo', icone: <XCircle className="w-4 h-4" /> },
        { valor: 'b', label: 'Quanto mais você ouve, melhor está se saindo', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'c', label: 'É preciso apresentar sua ideia para ganhar confiança', icone: <Info className="w-4 h-4" /> },
        { valor: 'd', label: 'É preciso ouvir mais do que falar', icone: <CheckCircle className="w-4 h-4" /> }
      ],
      explicacao: 'Regra geral: Quanto mais você fala, pior está se saindo. Você não aprende nada enquanto está falando.'
    },
    {
      id: '4',
      pergunta: 'Por que opiniões são inúteis?',
      opcoes: [
        { valor: 'a', label: 'As pessoas não sabem o que querem', icone: <XCircle className="w-4 h-4" /> },
        { valor: 'b', label: 'Apenas o mercado pode dizer se sua ideia é boa', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'c', label: 'As pessoas são egoístas', icone: <XCircle className="w-4 h-4" /> },
        { valor: 'd', label: 'As opiniões são difíceis de medir', icone: <Info className="w-4 h-4" /> }
      ],
      explicacao: 'Opiniões são inúteis. Apenas o mercado pode dizer se sua ideia é boa. Opiniões, especialmente de não especialistas, são ruído e geram falsos positivos.'
    },
    {
      id: '5',
      pergunta: 'Qual é a melhor abordagem para perguntar sobre o futuro?',
      opcoes: [
        { valor: 'a', label: 'Perguntar se a pessoa compraria algo', icone: <XCircle className="w-4 h-4" /> },
        { valor: 'b', label: 'Perguntar sobre ações passadas', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'c', label: 'Perguntar sobre desejos pessoais', icone: <Info className="w-4 h-4" /> },
        { valor: 'd', label: 'Perguntar sobre tendências do mercado', icone: <Info className="w-4 h-4" /> }
      ],
      explicacao: 'Pergunte sobre especificidades do passado, em vez de generalidades ou opiniões sobre o futuro. Ações passadas são fatos; intenções futuras são mentiras otimistas.'
    },
    {
      id: '6',
      pergunta: 'O que é "fluff" e como lidar com isso?',
      opcoes: [
        { valor: 'a', label: 'Informações vagas que devem ser ancoradas em exemplos específicos', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'b', label: 'Elogios que devem ser ignorados', icone: <Info className="w-4 h-4" /> },
        { valor: 'c', label: 'Ideias que devem ser implementadas', icone: <Info className="w-4 h-4" /> },
        { valor: 'd', label: 'Dados ruins que devem ser evitados', icone: <XCircle className="w-4 h-4" /> }
      ],
      explicacao: '"Fluff" vem em três formas: alegações genéricas, promessas futuras e possibilidades hipotéticas. Ancore essas declarações vagas em exemplos específicos do passado.'
    },
    {
      id: '7',
      pergunta: 'Como evitar pedidos de funcionalidades?',
      opcoes: [
        { valor: 'a', label: 'Ignorar os clientes', icone: <XCircle className="w-4 h-4" /> },
        { valor: 'b', label: 'Usar perguntas de aprofundamento para encontrar a causa raiz', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'c', label: 'Oferecer mais opções', icone: <Info className="w-4 h-4" /> },
        { valor: 'd', label: 'Focar em melhorar a interface', icone: <Info className="w-4 h-4" /> }
      ],
      explicacao: 'Ideias e pedidos de funcionalidades devem ser compreendidos, mas não obedecidos. Use perguntas de aprofundamento para encontrar a causa raiz.'
    },
    {
      id: '8',
      pergunta: 'Qual é a regra geral sobre busca de aprovação?',
      opcoes: [
        { valor: 'a', label: 'É importante buscar aprovação constante', icone: <XCircle className="w-4 h-4" /> },
        { valor: 'b', label: 'Se você mencionar sua ideia, as pessoas tentarão proteger seus sentimentos', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'c', label: 'É preciso sempre apresentar sua ideia', icone: <Info className="w-4 h-4" /> },
        { valor: 'd', label: 'É melhor evitar conversas com clientes', icone: <XCircle className="w-4 h-4" /> }
      ],
      explicacao: 'Se você mencionar sua ideia, as pessoas tentarão proteger seus sentimentos. Evite "pescar elogios" ou expor seu ego.'
    },
    {
      id: '9',
      pergunta: 'O que é importante em uma conversa?',
      opcoes: [
        { valor: 'a', label: 'Fazer muitas perguntas', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'b', label: 'Ouvir mais do que falar', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'c', label: 'Manter o foco na sua ideia', icone: <XCircle className="w-4 h-4" /> },
        { valor: 'd', label: 'Usar linguagem técnica', icone: <Info className="w-4 h-4" /> }
      ],
      explicacao: 'Você deve ter medo de pelo menos uma das perguntas que está fazendo em cada conversa. Perguntas importantes são aquelas cujas respostas podem mudar completamente ou invalidar seu negócio.'
    },
    {
      id: '10',
      pergunta: 'Qual é a melhor estratégia para encontrar pessoas para conversar?',
      opcoes: [
        { valor: 'a', label: 'Usar ligações frias', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'b', label: 'Organizar meetups', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'c', label: 'Criar introduções calorosas', icone: <CheckCircle className="w-4 h-4" /> },
        { valor: 'd', label: 'Todas as anteriores', icone: <CheckCircle className="w-4 h-4" /> }
      ],
      explicacao: 'Estratégias para encontrar conversas incluem ir até eles (ligações frias), trazer eles até você (meetups), ou criar introduções calorosas (contatos, conselheiros).'
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

  const handleAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(prev => prev - 1);
      setMostrarExplicacao(false);
    }
  };

  const handleMostrarExplicacao = () => {
    setMostrarExplicacao(!mostrarExplicacao);
  };

  if (mostrarResultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Quiz Concluído!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Você completou o quiz de The Mom Test. Agora você está pronto para aplicar essas técnicas em suas conversas com clientes.
          </p>
          <Button 
            size="lg" 
            onClick={() => onComplete({ respostas })}
            className="w-full"
          >
            Ver Resultados Detalhados
            <ChevronRight className="ml-2" />
          </Button>
        </Card>
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

          {respostas[pergunta.id] && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Explicação:</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{pergunta.explicacao}</p>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {perguntaAtual > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAnterior}
              >
                <ChevronLeft className="mr-2" />
                Anterior
              </Button>
            )}
            <div className="flex-1"></div>
            <Button 
              size="sm" 
              onClick={handleMostrarExplicacao}
            >
              {mostrarExplicacao ? 'Ocultar Explicação' : 'Mostrar Explicação'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizWizard;