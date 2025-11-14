"use client";

import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import ReviewLessonTemplate from '@/components/ReviewLessonTemplate';
import NotFound from './NotFound';
import { useEffect, useState } from 'react';
import { saveUserProgress } from '@/integrations/supabase/progress';
import { useQueryClient } from '@tanstack/react-query';
import { getReviewQuestions, getInfographicHtml } from '@/data/learningPaths';

const ReviewLessonPage = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const [searchParams] = useSearchParams();
  const trilhaId = searchParams.get('trilha');
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[] | null>(null);
  const [infographicHtml, setInfographicHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { lessonsToReview } = location.state || { lessonsToReview: [] };
  const reviewNumber = parseInt(reviewId || '0');
  
  const REVIEW_ID_BASE = 800;
  const displayReviewNumber = reviewNumber >= REVIEW_ID_BASE ? reviewNumber - REVIEW_ID_BASE + 1 : reviewNumber;

  useEffect(() => {
    console.log('🔍 ReviewLessonPage - Debug Info:', {
      reviewId,
      trilhaId,
      lessonsToReview,
      reviewNumber,
      displayReviewNumber
    });

    if (!trilhaId) {
      console.error('❌ Trilha ID não encontrado');
      setError('Trilha não especificada');
      return;
    }

    if (!lessonsToReview || lessonsToReview.length === 0) {
      console.error('❌ Nenhuma lição para revisar');
      setError('Nenhuma lição para revisar');
      return;
    }

    try {
      const reviewQuestions = getReviewQuestions(trilhaId, lessonsToReview);
      console.log('✅ Perguntas carregadas:', reviewQuestions.length);
      setQuestions(reviewQuestions);

      const infographic = getInfographicHtml(trilhaId, reviewNumber);
      console.log('📊 Infográfico:', infographic ? 'Encontrado' : 'Não encontrado');
      setInfographicHtml(infographic || null);

      if (reviewQuestions.length === 0) {
        setError('Nenhuma pergunta encontrada para esta revisão');
      }
    } catch (err) {
      console.error('❌ Erro ao carregar dados:', err);
      setError('Erro ao carregar dados da revisão');
    }
  }, [lessonsToReview, reviewId, trilhaId, reviewNumber]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao Carregar Revisão</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/aprendizado')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!questions || !infographicHtml) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando revisão...</p>
      </div>
    );
  }

  const handleConclude = async (xpEarned: number, score: number) => {
    const reviewNumId = parseInt(reviewId || '0');
    if (isNaN(reviewNumId) || !trilhaId) return;

    await saveUserProgress({
      pathId: trilhaId,
      lessonId: reviewNumId,
      xpEarned: xpEarned,
      score: score,
      isCompleted: true,
    });
    
    queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    queryClient.invalidateQueries({ queryKey: ['allUserProgress'] });
    navigate('/aprendizado');
  };

  return (
    <ReviewLessonTemplate
      title={`Revisão ${displayReviewNumber}`}
      questions={questions}
      infographicHtml={infographicHtml}
      onConclude={handleConclude}
    />
  );
};

export default ReviewLessonPage;