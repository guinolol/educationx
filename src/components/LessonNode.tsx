"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lock, Check, Play, Star, Crown, Sparkles, ChevronRight, BrainCircuit, RefreshCw } from "lucide-react";
import { useState } from "react";

interface LessonNodeProps {
  title: string;
  teaser: string;
  status: 'completed' | 'current' | 'locked' | 'unlocked';
  xp: number;
  type?: 'lesson' | 'checkpoint' | 'treasure' | 'simulation' | 'review';
  position: 'left' | 'center' | 'right';
  onClick: () => void;
}

const statusConfig = {
  completed: {
    bg: "bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500",
    border: "border-amber-300",
    shadow: "shadow-xl shadow-amber-400/40",
    icon: Check,
    ringColor: "ring-amber-200",
    dotColor: "bg-amber-400"
  },
  current: {
    bg: "bg-gradient-to-br from-emerald-400 via-green-400 to-emerald-500",
    border: "border-emerald-300",
    shadow: "shadow-2xl shadow-emerald-400/50 animate-pulse",
    icon: Play,
    ringColor: "ring-emerald-300",
    dotColor: "bg-emerald-400"
  },
  unlocked: {
    bg: "bg-gradient-to-br from-blue-400 via-sky-400 to-blue-500",
    border: "border-blue-300",
    shadow: "shadow-xl shadow-blue-400/40",
    icon: Star,
    ringColor: "ring-blue-200",
    dotColor: "bg-blue-400"
  },
  locked: {
    bg: "bg-gradient-to-br from-slate-300 to-slate-400",
    border: "border-slate-400",
    shadow: "shadow-md",
    icon: Lock,
    ringColor: "ring-slate-200",
    dotColor: "bg-slate-300"
  },
};

const LessonNode = ({ 
  title, 
  teaser, 
  status, 
  xp, 
  type = 'lesson', 
  position,
  onClick 
}: LessonNodeProps) => {
  const [showTeaser, setShowTeaser] = useState(false);
  const config = statusConfig[status];
  let Icon = config.icon;
  const isDisabled = status === 'locked';
  const isCheckpoint = type === 'checkpoint';
  const isTreasure = type === 'treasure';
  const isSimulation = type === 'simulation';
  const isReview = type === 'review';

  if (isSimulation) {
    Icon = BrainCircuit;
  } else if (isReview) {
    Icon = RefreshCw;
  }

  const nodeSize = isCheckpoint || isTreasure || isSimulation || isReview ? 'w-24 h-24' : 'w-20 h-20';
  const iconSize = isCheckpoint || isTreasure || isSimulation || isReview ? 'w-12 h-12' : 'w-9 h-9';

  return (
    <div className="relative flex justify-center items-center w-full">
      <div 
        className={cn(
          "relative flex justify-center",
          position === 'left' && 'mr-auto ml-12',
          position === 'right' && 'ml-auto mr-12',
          position === 'center' && 'mx-auto'
        )}
        onMouseEnter={() => !isDisabled && setShowTeaser(true)}
        onMouseLeave={() => setShowTeaser(false)}
      >
        {isCheckpoint && !isSimulation && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-60 animate-pulse" />
              <Crown className="relative w-10 h-10 text-yellow-500 drop-shadow-2xl animate-bounce" />
            </div>
          </div>
        )}
        {isTreasure && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-400 blur-lg opacity-60 animate-pulse" />
              <Sparkles className="relative w-9 h-9 text-purple-500 drop-shadow-2xl animate-pulse" />
            </div>
          </div>
        )}
        {isSimulation && (
           <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-400 blur-lg opacity-60 animate-pulse" />
              <BrainCircuit className="relative w-10 h-10 text-purple-500 drop-shadow-2xl animate-bounce" />
            </div>
          </div>
        )}

        <div className="relative">
          {status === 'current' && (
            <>
              <div className={`absolute inset-0 rounded-full ${config.ringColor} opacity-60 animate-ping`} />
              <div className={`absolute -inset-2 rounded-full ${config.ringColor} opacity-40 animate-pulse`} />
            </>
          )}

          <Button
            className={cn(
              nodeSize,
              "rounded-full p-0 transition-all duration-300 relative z-10 border-[5px]",
              config.bg,
              config.border,
              config.shadow,
              !isDisabled && "hover:scale-110 hover:-translate-y-1 active:scale-95 cursor-pointer",
              isDisabled && "cursor-not-allowed opacity-50",
              status === 'current' && "ring-4 ring-offset-2 ring-offset-purple-50",
              status === 'current' && config.ringColor
            )}
            onClick={onClick}
            disabled={isDisabled}
          >
            <Icon className={cn(iconSize, "text-white drop-shadow-lg")} />
          </Button>

          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 text-center">
            <p className={cn(
              "text-xs font-bold truncate px-2",
              isDisabled ? "text-slate-400" : "text-slate-700"
            )}>
              {title.split(':').pop()?.trim() || title}
            </p>
          </div>
        </div>

        {showTeaser && !isDisabled && (
          <div 
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-40",
              "w-80 bg-white/95 backdrop-blur-sm rounded-3xl p-5",
              "border-[3px] shadow-2xl",
              "animate-in fade-in zoom-in-95 duration-200",
              position === 'left' ? 'left-28' : position === 'right' ? 'right-28' : 'left-28',
              status === 'completed' ? 'border-amber-300 shadow-amber-200/50' : 
              status === 'current' ? 'border-emerald-300 shadow-emerald-200/50' : 
              'border-blue-300 shadow-blue-200/50'
            )}
          >
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2",
              position === 'right' ? '-right-[15px]' : '-left-[15px]'
            )}>
              <div className={cn(
                "w-0 h-0 border-y-[12px] border-y-transparent",
                position === 'right' 
                  ? `border-l-[15px] ${status === 'completed' ? 'border-l-amber-300' : status === 'current' ? 'border-l-emerald-300' : 'border-l-blue-300'}` 
                  : `border-r-[15px] ${status === 'completed' ? 'border-r-amber-300' : status === 'current' ? 'border-r-emerald-300' : 'border-r-blue-300'}`
              )} />
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-slate-800 text-base leading-tight flex-1">
                  {title}
                </h4>
                {status === 'completed' && (
                  <div className="flex-shrink-0 bg-amber-100 rounded-full p-1.5">
                    <Check className="w-4 h-4 text-amber-600" />
                  </div>
                )}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {teaser}
              </p>

              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
                <div className="flex items-center gap-2 bg-amber-50 rounded-full px-3 py-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-amber-700">+{xp} XP</span>
                </div>
                
                {status === 'current' && (
                  <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm">
                    <span>Começar</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
                
                {status === 'completed' && (
                  <span className="text-sm font-semibold text-amber-600">
                    ✓ Concluído
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonNode;