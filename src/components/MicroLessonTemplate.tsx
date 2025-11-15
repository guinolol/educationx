"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Trophy, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Heart,
  Check, X, Circle, BookOpen, Lightbulb, BrainCircuit
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/ui/accordion";
import GameOverScreen from './GameOverScreen';
import { useNavigate } from 'react-router-dom';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';

export interface Question {
  id: string;
  question: string;
  options: { value: string; label: string }[];
  explanation: string;
  hint: string;
  correctAnswer: string;
  bookExample?: string;
}

interface MicroLessonTemplateProps {
  title: string;
  level1: string;
  level2: string;
  level3: string;
  questions: Question[];
  conclusionMessage: string;
  recapitulation: string[];
  practicalChecklist: string[];
  onConclude: (xpEarned: number, score: number) => void;
}

// ✨ COMPONENTE DE CONFETE ✨
const Confetti = () => {
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Cria confete de ambos os lados
      // @ts-ignore
      if (window.confetti) {
        // @ts-ignore
        window.confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        // @ts-ignore
        window.confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return null;
};

// Helper component to parse simple markdown
const SimpleMarkdown = ({ text }: { text: string }) => {
  if (!text) return null;
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-purple-600 dark:text-purple-400">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
  return <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: html.replace(/\n/g, '<br />') }} />;
};

const MicroLessonTemplate = ({
  title,
  level1,
  level2,
  level3,
  questions,
  conclusionMessage,
  recapitulation,
  practicalChecklist,
  onConclude,
}: MicroLessonTemplateProps) => {
  const navigate = useNavigate();
  const { playSuccess, playError, playGameOver, playWin } = useAudioFeedback();
  const [view, setView] = useState<'explanation' | 'quiz' | 'result' | 'gameOver'>('explanation');
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lives, setLives] = useState(3);
  const [questionsAnsweredCount, setQuestionsAnsweredCount] = useState(0);

  // ✨ CARREGA A BIBLIOTECA DE CONFETE ✨
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    setActiveQuestions([...questions]);
  }, [questions]);

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (finalAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    return {
      correctCount,
      totalQuestions: questions.length,
      scorePercentage: questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0,
      xpEarned: correctCount * 10,
    };
  };

  const handleAnswer = (questionId: string, answer: string) => {
    const currentQuestion = activeQuestions[0];
    const isCorrect = answer === currentQuestion.correctAnswer;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (isCorrect) {
      playSuccess();
      setFinalAnswers(prev => ({ ...prev, [questionId]: answer }));
      setQuestionsAnsweredCount(prev => prev + 1);
    } else {
      playError();
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          playGameOver();
          setTimeout(() => setView('gameOver'), 1000);
        }
        return newLives;
      });
    }
  };

  const handleNextQuestion = () => {
    const currentQuestion = activeQuestions[0];
    const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

    if (isCorrect) {
      setActiveQuestions(prev => {
        const [_, ...rest] = prev;
        return rest;
      });
    } else {
      setActiveQuestions(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }

    setSelectedAnswer(null);
    setShowFeedback(false);

    // ✨ QUANDO TERMINA A LIÇÃO - DISPARA CONFETE! ✨
    if (activeQuestions.length === 1 && isCorrect) {
      playWin();
      setShowConfetti(true); // Ativa o confete
      setTimeout(() => setView('result'), 300); // Pequeno delay para sincronizar
    }
  };

  const handlePrevious = () => {
    // A navegação para trás é desabilitada
  };
  
  const handleRestart = () => {
    setLives(3);
    setFinalAnswers({});
    setActiveQuestions([...questions]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuestionsAnsweredCount(0);
    setShowConfetti(false);
    setView('quiz');
  };

  const handleExit = () => {
    navigate('/aprendizado');
  };

  if (view === 'gameOver') {
    return <GameOverScreen title={title} isReview={false} onRestart={handleRestart} onExit={handleExit} />;
  }

  if (view === 'explanation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BrainCircuit className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <SimpleMarkdown text={level1} />
              </div>

              <Accordion type="single" collapsible className="w-full">
                {level2 && (
                  <AccordionItem value="level2">
                    <AccordionTrigger className="font-semibold hover:no-underline">
                      Aprofunde o conhecimento
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <SimpleMarkdown text={level2} />
                    </AccordionContent>
                  </AccordionItem>
                )}
                {level3 && (
                  <AccordionItem value="level3">
                    <AccordionTrigger className="font-semibold hover:no-underline">
                      Visão de especialista e analogias
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <SimpleMarkdown text={level3} />
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>

            <Button 
              size="lg"
              onClick={() => setView('quiz')} 
              className="mt-8 w-full"
            >
              Iniciar Exercícios
              <ChevronRight className="ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'result') {
    const { correctCount, totalQuestions, scorePercentage, xpEarned } = calculateScore();

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4">
        {/* ✨ CONFETE APARECE AQUI! ✨ */}
        {showConfetti && <Confetti />}
        
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Microlição Concluída!</h2>
              <p className="text-gray-600 dark:text-gray-300">{conclusionMessage}</p>
              
              <div className="my-6 p-6 bg-purple-50 dark:bg-purple-900/50 rounded-lg border border-purple-200 dark:border-purple-700 inline-block">
                <p className="text-lg font-semibold">Sua Pontuação:</p>
                <p className="text-5xl font-bold my-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{scorePercentage}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Você acertou {correctCount} de {totalQuestions} questões.</p>
                <Badge className="mt-3 bg-amber-500 hover:bg-amber-600 text-white">+{xpEarned} XP</Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                  O que você aprendeu
                </h3>
                <ul className="space-y-3">
                  {recapitulation.map((item, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  Checklist Prático
                </h3>
                <ul className="space-y-3">
                  {practicalChecklist.map((item, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full" 
              onClick={() => onConclude(xpEarned, scorePercentage)}
            >
              Voltar para o Dashboard
              <ChevronRight className="ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'quiz') {
    const currentQuestion = activeQuestions[0];
    const progress = (questionsAnsweredCount / questions.length) * 100;
    const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

    if (!currentQuestion) {
      return null;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">{title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, index) => (
                    <Heart 
                      key={index} 
                      className={`w-6 h-6 transition-colors duration-300 ${
                        index < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <Badge variant="secondary">
                  Progresso: {questionsAnsweredCount}/{questions.length}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              Perguntas restantes: {activeQuestions.length}
            </p>
          </div>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
            </div>

            <div className="space-y-4 mb-6">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.value;
                const isCorrectOption = option.value === currentQuestion.correctAnswer;
                let bgColor = "bg-white dark:bg-gray-800";
                let iconToShow = <Circle className="w-5 h-5 text-gray-400" />;

                if (showFeedback) {
                  if (isSelected && isCorrectOption) {
                    bgColor = "bg-green-100 dark:bg-green-900 border-green-500";
                    iconToShow = <Check className="w-5 h-5 text-green-600" />;
                  } else if (isSelected && !isCorrectOption) {
                    bgColor = "bg-red-100 dark:bg-red-900 border-red-500";
                    iconToShow = <X className="w-5 h-5 text-red-600" />;
                  } else if (!isSelected && isCorrectOption) {
                    bgColor = "bg-green-100 dark:bg-green-900 border-green-500";
                    iconToShow = <Check className="w-5 h-5 text-green-600" />;
                  }
                }

                return (
                  <div key={option.value}>
                    <input
                      type="radio"
                      id={option.value}
                      name="answer"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => handleAnswer(currentQuestion.id, option.value)}
                      className="sr-only peer"
                      disabled={showFeedback || lives <= 0}
                    />
                    <label
                      htmlFor={option.value}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${bgColor} ${
                        !showFeedback && lives > 0
                          ? "hover:border-purple-400 dark:hover:border-purple-600"
                          : "cursor-default"
                      }`}
                    >
                      <span className="mr-3">{iconToShow}</span>
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>

            {showFeedback && (
              <div className="mb-6">
                <div
                  className={`p-4 rounded-lg ${
                    isCorrect ? "bg-green-50 dark:bg-green-900" : "bg-red-50 dark:bg-red-900"
                  }`}
                >
                  <h3 className="font-semibold mb-2 flex items-center">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        Correto!
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600 mr-2" />
                        Quase lá! ({lives} vidas restantes)
                      </>
                    )}
                  </h3>
                  <p className="text-sm mb-3">{currentQuestion.explanation}</p>
                  {currentQuestion.bookExample && (
                    <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-sm font-medium flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Exemplo do livro:
                      </p>
                      <p className="text-sm italic">{currentQuestion.bookExample}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Accordion type="single" collapsible className="mb-6">
              <AccordionItem value="dica">
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Precisa de uma dica?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 p-2">
                    {currentQuestion.hint}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={questionsAnsweredCount === 0 || showFeedback}
              >
                <ChevronLeft className="mr-2" />
                Anterior
              </Button>

              {showFeedback && lives > 0 ? (
                <Button size="sm" onClick={handleNextQuestion}>
                  {activeQuestions.length === 1 && isCorrect ? "Concluir" : "Próxima"}
                  <ChevronRight className="ml-2" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {}}
                  disabled={!selectedAnswer || lives <= 0}
                  variant="outline"
                >
                  {lives <= 0 ? "Fim de Jogo" : "Selecione uma resposta"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default MicroLessonTemplate;