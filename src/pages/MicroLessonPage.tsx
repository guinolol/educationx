"use client";

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import MicroLessonTemplate from '@/components/MicroLessonTemplate';
import NotFound from './NotFound';
import { saveUserProgress } from '@/integrations/supabase/progress';
import { useQueryClient } from '@tanstack/react-query';
import { getLessonOrSimulationData } from '@/data/learningPaths';

const MicroLessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [searchParams] = useSearchParams();
  const trilhaId = searchParams.get('trilha');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!trilhaId || !lessonId) {
    return <NotFound />;
  }

  const moduleId = parseInt(lessonId);
  if (isNaN(moduleId)) {
    return <NotFound />;
  }

  const result = getLessonOrSimulationData(trilhaId, moduleId);

  if (!result || result.type !== 'lesson') {
    return <NotFound />;
  }

  const lesson = result.data;

  const handleConclude = async (xpEarned: number, score: number) => {
    await saveUserProgress({
      pathId: trilhaId,
      lessonId: moduleId, // Salva com o ID original da lição (1-20)
      xpEarned: xpEarned,
      score: score,
      isCompleted: true,
    });
    
    queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    queryClient.invalidateQueries({ queryKey: ['allUserProgress'] });
    navigate('/aprendizado');
  };

  return (
    <MicroLessonTemplate
      title={lesson.title}
      level1={lesson.level1}
      level2={lesson.level2}
      level3={lesson.level3}
      questions={lesson.questions}
      conclusionMessage={lesson.conclusionMessage}
      recapitulation={lesson.recapitulation}
      practicalChecklist={lesson.practicalChecklist}
      onConclude={handleConclude}
    />
  );
};

export default MicroLessonPage;