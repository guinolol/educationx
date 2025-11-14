"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, BookOpen, Clock, Star, Trophy } from 'lucide-react';
import { ALL_LEARNING_PATHS } from '@/data/learningPaths';
import { useQuery } from '@tanstack/react-query';
import { fetchAllUserProgress } from '@/integrations/supabase/progress';
import { useAuth } from './SessionProvider';

interface PathSelectorProps {
  onSelectPath: (pathId: string) => void;
}

const PathSelector = ({ onSelectPath }: PathSelectorProps) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const { user } = useAuth();
  const userId = user?.id;

  const { data: allProgress = [] } = useQuery({
    queryKey: ['allUserProgress', userId],
    queryFn: () => fetchAllUserProgress(userId!),
    enabled: !!userId,
  });

  const handleConfirm = () => {
    if (selectedPath) {
      onSelectPath(selectedPath);
    }
  };

  const getPathProgress = (pathId: string) => {
    const pathProgress = allProgress.filter(p => p.path_id === pathId);
    const completed = pathProgress.filter(p => p.is_completed).length;
    const pathConfig = ALL_LEARNING_PATHS.find(p => p.id === pathId);
    const total = pathConfig ? pathConfig.lessons.length : 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Escolha Sua Trilha de Aprendizado
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Selecione o caminho que você quer seguir. Você pode trocar entre trilhas a qualquer momento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {ALL_LEARNING_PATHS.map((path) => {
            const isSelected = selectedPath === path.id;
            const PathIcon = path.icon;
            const progress = getPathProgress(path.id);
            const hasProgress = progress.completed > 0;
            
            return (
              <Card
                key={path.id}
                className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/50 shadow-xl scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:shadow-lg'
                }`}
                onClick={() => setSelectedPath(path.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <PathIcon className={`w-8 h-8 ${
                      isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {path.lessons.length} lições
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {path.simulations.length} simulações
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1" />
                        ~{Math.ceil(path.lessons.length * 10)} min total
                      </Badge>
                      {hasProgress && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <Trophy className="w-3 h-3 mr-1" />
                          Em progresso
                        </Badge>
                      )}
                    </div>

                    {hasProgress && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600 dark:text-gray-300">Progresso</span>
                          <span className="font-semibold">{progress.completed}/{progress.total}</span>
                        </div>
                        <Progress value={progress.percentage} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      ✓ Trilha selecionada
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={!selectedPath}
            className="px-8"
          >
            Começar Trilha Selecionada
            <ChevronRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PathSelector;