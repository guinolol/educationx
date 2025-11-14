"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, Flame, Star, Crown, Zap, Loader2, ArrowLeft
} from "lucide-react";
import LearningPath from "./LearningPath";
import PathSelector from "./PathSelector";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./SessionProvider";

import { ALL_LEARNING_PATHS, LearningPathConfig } from '@/data/learningPaths';
import { fetchUserProgressForPath, fetchAllUserProgress } from '@/integrations/supabase/progress';

interface DashboardAprendizadoProps {
  resultadoQuiz: any;
}

interface UserProgress {
  lesson_id: number;
  is_completed: boolean;
  score: number;
  xp_earned: number;
}

interface Modulo {
  id: number;
  titulo: string;
  teaser?: string;
  descricao: string;
  progresso: number;
  desbloqueado: boolean;
  concluido: boolean;
  xp: number;
  dificuldade: string;
  duracao: string;
  type?: 'lesson' | 'checkpoint' | 'treasure' | 'simulation' | 'review';
}

const createLearningPath = (pathConfig: LearningPathConfig, userProgress: UserProgress[]): Modulo[] => {
  const path: Modulo[] = [];
  let lessonIndex = 0;
  let simulationIndex = 0;
  const progressMap = new Map(userProgress.map(p => [p.lesson_id, p]));

  const lessons = pathConfig.lessons;
  const simulations = pathConfig.simulations;

  while (lessonIndex < lessons.length) {
    const lessonsInThisBlock: any[] = [];
    
    // Adiciona 4 lições
    for (let i = 0; i < 4 && lessonIndex < lessons.length; i++) {
      const lesson = lessons[lessonIndex];
      const lessonId = lesson.id;
      const progress = progressMap.get(lessonId) || { is_completed: false, xp_earned: 0 };

      const newLesson = {
        id: lessonId, // Usa o ID direto do JSON
        titulo: `Lição ${lessonIndex + 1}: ${lesson.title}`,
        teaser: lesson.teaser || lesson.conclusionMessage?.split('.')[0] + '.',
        descricao: lesson.conclusionMessage?.split('.')[0] + '.',
        progresso: progress.is_completed ? 100 : 0,
        desbloqueado: false,
        concluido: progress.is_completed,
        xp: 50 + lessonIndex * 5,
        dificuldade: 'iniciante',
        duracao: `${Math.ceil(lesson.questions?.length * 1.5) || 10} min`,
        type: 'lesson' as 'lesson',
      };
      path.push(newLesson);
      lessonsInThisBlock.push(newLesson);
      lessonIndex++;
    }

    // Adiciona Revisão e Simulação após cada bloco de 4 lições
    if (simulationIndex < simulations.length) {
      const lessonsToReview = lessonsInThisBlock.map(l => l.id);
      
      const reviewId = 800 + simulationIndex;
      const reviewProgress = progressMap.get(reviewId) || { is_completed: false, xp_earned: 0 };
      path.push({
        id: reviewId,
        titulo: `Revisão ${simulationIndex + 1}`,
        teaser: "Teste seus conhecimentos das últimas lições com perguntas aleatórias.",
        descricao: "A revisão é crucial para a retenção do conhecimento. Responda 12 perguntas sorteadas para reforçar seu aprendizado.",
        progresso: reviewProgress.is_completed ? 100 : 0,
        desbloqueado: false,
        concluido: reviewProgress.is_completed,
        xp: 75,
        dificuldade: 'misto',
        duracao: '10 min',
        type: 'review',
      });

      const sim = simulations[simulationIndex];
      const simulationId = 500 + sim.simulationId;
      const simProgress = progressMap.get(simulationId) || { is_completed: false, xp_earned: 0 };
      path.push({
        id: simulationId, // ID completo (501, 502, 503...)
        titulo: sim.title,
        teaser: sim.introduction.split('.').slice(0, 2).join('.') + '.',
        descricao: sim.introduction,
        progresso: simProgress.is_completed ? 100 : 0,
        desbloqueado: false,
        concluido: simProgress.is_completed,
        xp: 150,
        dificuldade: 'intermediário',
        duracao: '15 min',
        type: 'simulation',
      });
      simulationIndex++;
    }
  }

  // Sistema de desbloqueio sequencial
  let isPreviousCompleted = true;
  path.forEach((item) => {
    if (isPreviousCompleted) {
      item.desbloqueado = true;
    } else {
      item.desbloqueado = false;
    }
    isPreviousCompleted = item.concluido;
  });
  
  if (path.length > 0) {
    path[0].desbloqueado = true;
  }

  return path;
};

const DashboardAprendizado = ({ resultadoQuiz }: DashboardAprendizadoProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [showPathSelector, setShowPathSelector] = useState(false);

  useEffect(() => {
    const savedPathId = localStorage.getItem('selectedLearningPath');
    if (savedPathId) {
      setSelectedPathId(savedPathId);
    } else {
      setShowPathSelector(true);
    }
  }, []);

  const { data: userProgress = [], isLoading, error } = useQuery({
    queryKey: ['userProgress', userId, selectedPathId],
    queryFn: () => fetchUserProgressForPath(userId!, selectedPathId!),
    enabled: !!userId && !!selectedPathId,
  });

  const { data: allProgress = [] } = useQuery({
    queryKey: ['allUserProgress', userId],
    queryFn: () => fetchAllUserProgress(userId!),
    enabled: !!userId,
  });

  const trilhaSelecionada = useMemo(() => {
    if (!selectedPathId) return null;
    
    const pathConfig = ALL_LEARNING_PATHS.find(p => p.id === selectedPathId);
    if (!pathConfig) return null;

    return {
      id: pathConfig.id,
      titulo: pathConfig.title,
      icone: pathConfig.icon,
      lessons: createLearningPath(pathConfig, userProgress),
    };
  }, [selectedPathId, userProgress]);

  const handleSelectPath = (pathId: string) => {
    setSelectedPathId(pathId);
    localStorage.setItem('selectedLearningPath', pathId);
    setShowPathSelector(false);
  };

  const handleChangePath = () => {
    setShowPathSelector(true);
  };

  const totalXpEarned = allProgress.reduce((sum, p) => sum + p.xp_earned, 0);
  const xpProximoNivel = 500;
  const nivel = Math.floor(totalXpEarned / xpProximoNivel) + 1;
  const xpNoNivel = totalXpEarned % xpProximoNivel;

  const completedLessons = trilhaSelecionada?.lessons.filter(m => m.concluido).length || 0;
  const totalLessons = trilhaSelecionada?.lessons.length || 0;

  const handleIniciarModulo = (moduleId: number, type: string) => {
    if (!trilhaSelecionada) return;

    const modulo = trilhaSelecionada.lessons.find(m => m.id === moduleId);

    if (modulo?.desbloqueado) {
      if (type === 'review') {
        // Para revisões, precisamos passar as lições que serão revisadas
        const reviewIndex = moduleId - 800;
        const startLessonIndex = reviewIndex * 4;
        const endLessonIndex = Math.min(startLessonIndex + 4, trilhaSelecionada.lessons.filter(l => l.type === 'lesson').length);
        
        const lessonsToReview = trilhaSelecionada.lessons
          .filter(l => l.type === 'lesson')
          .slice(startLessonIndex, endLessonIndex)
          .map(l => l.id);

        navigate(`/review/${moduleId}?trilha=${trilhaSelecionada.id}`, { 
          state: { lessonsToReview } 
        });
      } else if (type === 'simulation') {
        navigate(`/simulation/${moduleId}?trilha=${trilhaSelecionada.id}`);
      } else {
        // Lição normal
        navigate(`/lesson/${moduleId}?trilha=${trilhaSelecionada.id}`);
      }
    }
  };

  const conquistas = [
    { id: 1, titulo: "Primeiros Passos", icon: Star, conquistado: completedLessons > 0 },
    { id: 2, titulo: "Sequência Épica", icon: Flame, conquistado: true },
    { id: 3, titulo: "Velocista", icon: Zap, conquistado: completedLessons >= 3 },
    { id: 4, titulo: "Mestre", icon: Crown, conquistado: nivel >= 5 }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Erro ao carregar progresso: {error.message}</div>;
  }

  if (showPathSelector) {
    return <PathSelector onSelectPath={handleSelectPath} />;
  }

  if (!trilhaSelecionada) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6 border-2 shadow-xl bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-400 blur-lg opacity-40 rounded-full" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-purple-200 shadow-xl">
                  {nivel}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Nível {nivel}</p>
                <div className="w-48 mt-2 bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${(xpNoNivel / xpProximoNivel) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 font-semibold">{xpNoNivel}/{xpProximoNivel} XP para o próximo nível</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-400 blur-lg opacity-40 rounded-full" />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">1</p>
                  <p className="text-xs text-slate-500 font-semibold">dias de streak</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-40 rounded-full" />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{conquistas.filter(c => c.conquistado).length}</p>
                  <p className="text-xs text-slate-500 font-semibold">conquistas</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-2 shadow-xl bg-gradient-to-b from-white via-purple-50/30 to-blue-50/30 backdrop-blur">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <trilhaSelecionada.icone className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">{trilhaSelecionada.titulo}</h2>
                <p className="text-sm text-slate-500">Continue sua jornada de aprendizado</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg">
                {completedLessons}/{totalLessons}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangePath}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Mudar Trilha
              </Button>
            </div>
          </div>

          <LearningPath
            trilhaId={trilhaSelecionada.id}
            lessons={trilhaSelecionada.lessons}
            onLessonClick={(moduleId, type) => handleIniciarModulo(moduleId, type)}
          />
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {conquistas.map((c) => (
            <Card
              key={c.id}
              className={cn(
                "p-6 text-center transition-all duration-300 border-2",
                c.conquistado
                  ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 shadow-lg hover:shadow-xl hover:-translate-y-1'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              )}
            >
              <div className="relative inline-block mb-3">
                {c.conquistado && (
                  <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-40" />
                )}
                <c.icon className={cn(
                  "relative w-10 h-10 mx-auto",
                  c.conquistado ? 'text-yellow-600' : 'text-slate-400'
                )} />
              </div>
              <p className="text-sm font-bold text-slate-700">{c.titulo}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAprendizado;