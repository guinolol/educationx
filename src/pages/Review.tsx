"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Trophy, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface CompletedLesson {
  lesson_id: number;
  score: number;
  completed_at: string;
  path_id: string;
}

const Review = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [completedLessons, setCompletedLessons] = useState<CompletedLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      navigate('/login');
      return;
    }

    loadCompletedLessons();
  }, [session, navigate]);

  const loadCompletedLessons = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('lesson_id, score, completed_at, path_id')
        .eq('user_id', session?.user?.id)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error loading completed lessons:', error);
        toast.error('Erro ao carregar lições completadas');
        return;
      }

      setCompletedLessons(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewLesson = (pathId: string, lessonId: number) => {
    navigate(`/lesson/${pathId}/${lessonId}`);
  };

  const getLessonTitle = (pathId: string, lessonId: number) => {
    const pathNames: Record<string, string> = {
      'html-basics': 'HTML Básico',
      'css-fundamentals': 'CSS Fundamentals',
      'javascript-intro': 'JavaScript Intro'
    };

    return `${pathNames[pathId] || pathId} - Lição ${lessonId}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando lições...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Revisão de Lições
          </h1>
          <p className="text-gray-600">
            Revise as lições que você já completou para reforçar seu aprendizado
          </p>
        </div>

        {completedLessons.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma lição completada ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Complete algumas lições primeiro para poder revisá-las aqui
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Ir para o Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {completedLessons.map((lesson, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {getLessonTitle(lesson.path_id, lesson.lesson_id)}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(lesson.completed_at)}
                        </span>
                        <span className={`flex items-center gap-1 font-semibold ${getScoreColor(lesson.score)}`}>
                          <Trophy className="h-4 w-4" />
                          {lesson.score}% de acerto
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleReviewLesson(lesson.path_id, lesson.lesson_id)}
                      variant="outline"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Revisar
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;