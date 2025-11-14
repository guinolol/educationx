import { supabase } from './supabase';
import { showSuccess, showError } from '@/utils/toast';

interface SaveProgressParams {
  pathId: string;
  lessonId: number;
  xpEarned: number;
  score: number;
  isCompleted: boolean;
}

export const saveUserProgress = async ({
  pathId,
  lessonId,
  xpEarned,
  score,
  isCompleted,
}: SaveProgressParams) => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    showError("Você precisa estar logado para salvar o progresso.");
    return;
  }

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      path_id: pathId,
      lesson_id: lessonId,
      is_completed: isCompleted,
      score: score,
      xp_earned: xpEarned,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,path_id,lesson_id' });

  if (error) {
    console.error("Erro ao salvar progresso:", error);
    showError("Erro ao salvar progresso. Tente novamente.");
  } else {
    showSuccess(`Progresso salvo! Você ganhou ${xpEarned} XP.`);
  }
};

export const fetchUserProgressForPath = async (userId: string, pathId: string) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('lesson_id, is_completed, score, xp_earned')
    .eq('user_id', userId)
    .eq('path_id', pathId);

  if (error) throw new Error(error.message);
  return data || [];
};

export const fetchAllUserProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('path_id, lesson_id, is_completed, score, xp_earned')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data || [];
};