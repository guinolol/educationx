"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Trophy, ChevronRight,
  CheckCircle, XCircle, Star, BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  feedback: string;
  score: number;
}

interface Challenge {
  step: number;
  testedLesson: string;
  narrative: string;
  options: Option[];
}

interface Simulation {
  simulationId: number;
  title: string;
  introduction: string;
  challenges: Challenge[];
}

interface SimulationTemplateProps {
  simulation: Simulation;
  onConclude: (xpEarned: number, score: number) => void;
}

const SimpleMarkdown = ({ text }: { text: string }) => {
  if (!text) return null;
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-purple-600 dark:text-purple-400">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
  return <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: html.replace(/\n/g, '<br />') }} />;
};

const SimulationTemplate = ({ simulation, onConclude }: SimulationTemplateProps) => {
  const [view, setView] = useState<'intro' | 'challenge' | 'result'>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { value: string; score: number }>>({});
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const totalScore = Object.values(answers).reduce((sum, ans) => sum + ans.score, 0);
  const maxScore = simulation.challenges.reduce((sum, challenge) => {
    const maxOptionScore = Math.max(...challenge.options.map(o => o.score));
    return sum + maxOptionScore;
  }, 0);

  const calculateResults = () => {
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    // XP base 200, ajustado pela porcentagem
    const xpEarned = Math.round(200 * (percentage / 100)); 
    return { percentage, xpEarned };
  };

  const handleSelectOption = (option: Option) => {
    setAnswers(prev => ({ ...prev, [currentStep]: { value: option.value, score: option.score } }));
    setSelectedOption(option);
    setShowFeedback(true);
  };

  const handleNextStep = () => {
    if (currentStep < simulation.challenges.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setView('result');
    }
  };

  if (view === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4 flex items-center justify-center">
        <Card className="p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">{simulation.title}</h1>
          </div>
          <SimpleMarkdown text={simulation.introduction} />
          <Button size="lg" className="w-full mt-8" onClick={() => setView('challenge')}>
            Começar Simulação
            <ChevronRight className="ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  if (view === 'result') {
    const { percentage, xpEarned } = calculateResults();
    let resultMessage = "Bom trabalho! Continue praticando.";
    if (percentage > 80) {
      resultMessage = "Excelente! Você demonstrou um ótimo domínio das Conversas Cruciais.";
    } else if (percentage < 50) {
      resultMessage = "Você completou a simulação. Reveja os feedbacks para aprimorar suas habilidades.";
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4 flex items-center justify-center">
        <Card className="p-8 max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Simulação Concluída!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{resultMessage}</p>
          <div className="mb-8">
            <p className="text-lg font-semibold">Sua Pontuação:</p>
            <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {percentage}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Pontuação Bruta: {totalScore} / {maxScore}
            </p>
            <Badge className="mt-3 bg-amber-500 hover:bg-amber-600 text-white">+{xpEarned} XP</Badge>
            <Progress value={percentage} className="mt-4 h-3" />
          </div>
          <Button size="lg" className="w-full" onClick={() => onConclude(xpEarned, percentage)}>
            Voltar para o Dashboard
            <ChevronRight className="ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  const challenge = simulation.challenges[currentStep];
  const progress = ((currentStep + 1) / simulation.challenges.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">{simulation.title}</h1>
            <Badge variant="secondary">Decisão {currentStep + 1}/{simulation.challenges.length}</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-8">
          <Badge className="mb-4">{challenge.testedLesson}</Badge>
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <SimpleMarkdown text={challenge.narrative} />
          </div>

          <div className="space-y-4 mb-6">
            {challenge.options.map((option) => (
              <div key={option.value}>
                <input
                  type="radio"
                  id={option.value}
                  name="answer"
                  value={option.value}
                  checked={selectedOption?.value === option.value}
                  onChange={() => handleSelectOption(option)}
                  className="sr-only peer"
                  disabled={showFeedback}
                />
                <label
                  htmlFor={option.value}
                  className={cn(
                    "flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all",
                    showFeedback ? "cursor-default" : "hover:border-purple-400 dark:hover:border-purple-600",
                    selectedOption?.value === option.value && "border-purple-500 bg-purple-50 dark:bg-purple-900"
                  )}
                >
                  <span className="mr-3 mt-1 text-purple-600 font-bold">{option.value.toUpperCase()}.</span>
                  <span className="flex-1">{option.label}</span>
                </label>
              </div>
            ))}
          </div>

          {showFeedback && selectedOption && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="font-semibold mb-2 flex items-center">
                {selectedOption.score >= 3 ? <CheckCircle className="w-5 h-5 text-green-600 mr-2" /> : <XCircle className="w-5 h-5 text-red-600 mr-2" />}
                Feedback
              </h3>
              <SimpleMarkdown text={selectedOption.feedback} />
              <div className="mt-3 flex items-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className={cn("w-5 h-5", i < selectedOption.score ? "text-yellow-500 fill-yellow-500" : "text-gray-300")} />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            {showFeedback && (
              <Button size="lg" onClick={handleNextStep}>
                {currentStep < simulation.challenges.length - 1 ? "Próxima Decisão" : "Ver Resultado"}
                <ChevronRight className="ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SimulationTemplate;