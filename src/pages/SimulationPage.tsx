"use client";

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import SimulationTemplate from '@/components/SimulationTemplate';
import NotFound from './NotFound';
import { saveUserProgress } from '@/integrations/supabase/progress';
import { useQueryClient } from '@tanstack/react-query';
import { getLessonOrSimulationData } from '@/data/learningPaths';

const SimulationPage = () => {
  const { simulationId } = useParams<{ simulationId: string }>();
  const [searchParams] = useSearchParams();
  const trilhaId = searchParams.get('trilha');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!trilhaId || !simulationId) {
    return <NotFound />;
  }

  const moduleId = parseInt(simulationId);
  if (isNaN(moduleId)) {
    return <NotFound />;
  }

  const result = getLessonOrSimulationData(trilhaId, moduleId);

  if (!result || result.type !== 'simulation') {
    return <NotFound />;
  }

  const simulation = result.data;

  const handleConclude = async (xpEarned: number, score: number) => {
    await saveUserProgress({
      pathId: trilhaId,
      lessonId: moduleId, // Salva com o ID completo (501, 502, etc.)
      xpEarned: xpEarned,
      score: score,
      isCompleted: true,
    });
    
    queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    queryClient.invalidateQueries({ queryKey: ['allUserProgress'] });
    navigate('/aprendizado');
  };

  return (
    <SimulationTemplate
      simulation={simulation}
      onConclude={handleConclude}
    />
  );
};

export default SimulationPage;