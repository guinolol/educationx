"use client";

import LessonNode from "./LessonNode";

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

interface LearningPathProps {
  trilhaId: string;
  lessons: Modulo[];
  onLessonClick: (moduleId: number, type: string) => void;
}

const LearningPath = ({ lessons, onLessonClick }: LearningPathProps) => {
  const firstIncompleteIndex = lessons.findIndex(l => !l.concluido);
  const currentLessonIndex = firstIncompleteIndex === -1 ? lessons.length - 1 : firstIncompleteIndex;

  const pathPattern = ['center', 'right', 'center', 'left', 'center', 'right', 'center', 'left'];

  return (
    <div className="relative w-full max-w-2xl mx-auto py-12 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-200 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-200 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-emerald-200 rounded-full blur-3xl" />
      </div>

      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 0 }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
            <stop offset="30%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#34d399" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.3" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <path
          d="M 50% 5% Q 65% 12%, 50% 18% Q 35% 24%, 50% 30% Q 65% 36%, 50% 42% Q 35% 48%, 50% 54% Q 65% 60%, 50% 66% Q 35% 72%, 50% 78% Q 65% 84%, 50% 90%"
          stroke="url(#pathGradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
          strokeDasharray="12 8"
        />
      </svg>

      <div className="relative space-y-20" style={{ zIndex: 1 }}>
        {lessons.map((lesson, index) => {
          let status: 'completed' | 'current' | 'locked' | 'unlocked';
          
          if (lesson.concluido) {
            status = 'completed';
          } else if (index === currentLessonIndex) {
            status = 'current';
          } else if (lesson.desbloqueado) {
            status = 'unlocked';
          } else {
            status = 'locked';
          }

          const position = pathPattern[index % pathPattern.length] as 'left' | 'center' | 'right';

          return (
            <div key={lesson.id} className="relative">
              <LessonNode
                title={lesson.titulo}
                teaser={lesson.teaser || lesson.descricao}
                status={status}
                xp={lesson.xp}
                type={lesson.type}
                position={position}
                onClick={() => onLessonClick(lesson.id, lesson.type || 'lesson')}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-20 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-slate-300 blur-xl opacity-50" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center border-4 border-slate-400 shadow-lg">
            <span className="text-3xl">🔒</span>
          </div>
          <p className="text-center mt-3 text-sm font-semibold text-slate-500">
            Em breve...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;