import { MessageSquare, Target, TrendingUp, Lightbulb, DollarSign, Zap, Shield, Star, FileText, Trophy, Pyramid } from 'lucide-react';

// Importações estáticas para garantir que o Vite/Webpack inclua os arquivos
import crucialConversationsLessons from '@/data/crucial-conversations/Crucial_Conversations.json';
import crucialConversationsSimulations from '@/data/crucial-conversations/Crucial_Conversations_Sim.json';

// Importações de HTML como strings brutas
import info1Html from '@/data/crucial-conversations/info_1.html?raw';
import info2Html from '@/data/crucial-conversations/info_2.html?raw';
import info3Html from '@/data/crucial-conversations/info_3.html?raw';
import info4Html from '@/data/crucial-conversations/info_4.html?raw';
import info5Html from '@/data/crucial-conversations/info_5.html?raw';

// Made to Stick
import madeToStickLessons from '@/data/made-to-stick/MadeToStick.json';
import madeToStickSimulations from '@/data/made-to-stick/MadeToStick_Sim.json';
import madeToStickInfo1 from '@/data/made-to-stick/info_1.html?raw';
import madeToStickInfo2 from '@/data/made-to-stick/info_2.html?raw';
import madeToStickInfo3 from '@/data/made-to-stick/info_3.html?raw';
import madeToStickInfo4 from '@/data/made-to-stick/info_4.html?raw';
import madeToStickInfo5 from '@/data/made-to-stick/info_5.html?raw';

// Million Dollar Weekend
import millionDollarWeekendLessons from '@/data/million-dollar-weekend/MillionDollarWeekend.json';
import millionDollarWeekendSimulations from '@/data/million-dollar-weekend/MillionDollarWeekend_Sim.json';
import millionDollarWeekendInfo1 from '@/data/million-dollar-weekend/info_1.html?raw';
import millionDollarWeekendInfo2 from '@/data/million-dollar-weekend/info_2.html?raw';
import millionDollarWeekendInfo3 from '@/data/million-dollar-weekend/info_3.html?raw';
import millionDollarWeekendInfo4 from '@/data/million-dollar-weekend/info_4.html?raw';
import millionDollarWeekendInfo5 from '@/data/million-dollar-weekend/info_5.html?raw';

// Never Split the Difference
import neverSplitTheDifferenceLessons from '@/data/never-split-the-difference/NeverSplitTheDifference.json';
import neverSplitTheDifferenceSimulations from '@/data/never-split-the-difference/NeverSplitTheDifference_Sim.json';
import neverSplitTheDifferenceInfo1 from '@/data/never-split-the-difference/info_1.html?raw';
import neverSplitTheDifferenceInfo2 from '@/data/never-split-the-difference/info_2.html?raw';
import neverSplitTheDifferenceInfo3 from '@/data/never-split-the-difference/info_3.html?raw';
import neverSplitTheDifferenceInfo4 from '@/data/never-split-the-difference/info_4.html?raw';
import neverSplitTheDifferenceInfo5 from '@/data/never-split-the-difference/info_5.html?raw';

// Obviously Awesome
import obviouslyAwesomeLessons from '@/data/obviously-awesome/ObviouslyAwesome.json';
import obviouslyAwesomeSimulations from '@/data/obviously-awesome/ObviouslyAwesome_Sim.json';
import obviouslyAwesomeInfo1 from '@/data/obviously-awesome/info_1.html?raw';
import obviouslyAwesomeInfo2 from '@/data/obviously-awesome/info_2.html?raw';
import obviouslyAwesomeInfo3 from '@/data/obviously-awesome/info_3.html?raw';
import obviouslyAwesomeInfo4 from '@/data/obviously-awesome/info_4.html?raw';
import obviouslyAwesomeInfo5 from '@/data/obviously-awesome/info_5.html?raw';

// The 1-Page Marketing Plan
import the1PageMarketingPlanLessons from '@/data/the-1-page-marketing-plan/The1PageMarketingPlan.json';
import the1PageMarketingPlanSimulations from '@/data/the-1-page-marketing-plan/The1PageMarketingPlan_Sim.json';
import the1PageMarketingPlanInfo1 from '@/data/the-1-page-marketing-plan/info_1.html?raw';
import the1PageMarketingPlanInfo2 from '@/data/the-1-page-marketing-plan/info_2.html?raw';
import the1PageMarketingPlanInfo3 from '@/data/the-1-page-marketing-plan/info_3.html?raw';
import the1PageMarketingPlanInfo4 from '@/data/the-1-page-marketing-plan/info_4.html?raw';
import the1PageMarketingPlanInfo5 from '@/data/the-1-page-marketing-plan/info_5.html?raw';

export interface LessonData {
  id: number;
  title: string;
  questions: any[];
  level1: string;
  level2: string;
  level3: string;
  conclusionMessage: string;
  recapitulation: string[];
  practicalChecklist: string[];
}

export interface SimulationData {
  simulationId: number;
  title: string;
  introduction: string;
  challenges: any[];
}

export interface LearningPathConfig {
  id: string;
  title: string;
  icon: any;
  lessons: LessonData[];
  simulations: SimulationData[];
  infographics: Record<number, string>;
}

// --- CONFIGURAÇÃO DE TODAS AS TRILHAS ---

const CRUCIAL_CONVERSATIONS_CONFIG: LearningPathConfig = {
  id: 'crucialConversations',
  title: "Conversas Cruciais",
  icon: MessageSquare,
  lessons: crucialConversationsLessons as LessonData[],
  simulations: crucialConversationsSimulations as SimulationData[],
  infographics: {
    800: info1Html,
    801: info2Html,
    802: info3Html,
    803: info4Html,
    804: info5Html,
  }
};

const MADE_TO_STICK_CONFIG: LearningPathConfig = {
  id: 'madeToStick',
  title: "Made to Stick",
  icon: Lightbulb,
  lessons: madeToStickLessons as LessonData[],
  simulations: madeToStickSimulations as SimulationData[],
  infographics: {
    800: madeToStickInfo1,
    801: madeToStickInfo2,
    802: madeToStickInfo3,
    803: madeToStickInfo4,
    804: madeToStickInfo5,
  }
};

const MILLION_DOLLAR_WEEKEND_CONFIG: LearningPathConfig = {
  id: 'millionDollarWeekend',
  title: "Million Dollar Weekend",
  icon: Zap,
  lessons: millionDollarWeekendLessons as LessonData[],
  simulations: millionDollarWeekendSimulations as SimulationData[],
  infographics: {
    800: millionDollarWeekendInfo1,
    801: millionDollarWeekendInfo2,
    802: millionDollarWeekendInfo3,
    803: millionDollarWeekendInfo4,
    804: millionDollarWeekendInfo5,
  }
};

const NEVER_SPLIT_THE_DIFFERENCE_CONFIG: LearningPathConfig = {
  id: 'neverSplitTheDifference',
  title: "Negocie como se sua vida dependesse disso",
  icon: Shield,
  lessons: neverSplitTheDifferenceLessons as LessonData[],
  simulations: neverSplitTheDifferenceSimulations as SimulationData[],
  infographics: {
    800: neverSplitTheDifferenceInfo1,
    801: neverSplitTheDifferenceInfo2,
    802: neverSplitTheDifferenceInfo3,
    803: neverSplitTheDifferenceInfo4,
    804: neverSplitTheDifferenceInfo5,
  }
};

const THE_1_PAGE_MARKETING_PLAN_CONFIG: LearningPathConfig = {
  id: 'the1PageMarketingPlan',
  title: "O plano de marketing de 1 página",
  icon: FileText,
  lessons: the1PageMarketingPlanLessons as LessonData[],
  simulations: the1PageMarketingPlanSimulations as SimulationData[],
  infographics: {
    800: the1PageMarketingPlanInfo1,
    801: the1PageMarketingPlanInfo2,
    802: the1PageMarketingPlanInfo3,
    803: the1PageMarketingPlanInfo4,
    804: the1PageMarketingPlanInfo5,
  }
};

// Adicione novas trilhas aqui:
export const ALL_LEARNING_PATHS: LearningPathConfig[] = [
  CRUCIAL_CONVERSATIONS_CONFIG,
  MADE_TO_STICK_CONFIG,
  MILLION_DOLLAR_WEEKEND_CONFIG,
  NEVER_SPLIT_THE_DIFFERENCE_CONFIG,
  THE_1_PAGE_MARKETING_PLAN_CONFIG,

];


// --- FUNÇÕES DE BUSCA ---

/**
 * Busca a configuração completa de uma trilha pelo ID.
 */
export const getPathConfig = (pathId: string): LearningPathConfig | undefined => {
  const config = ALL_LEARNING_PATHS.find(p => p.id === pathId);
  console.log('🔍 getPathConfig:', { pathId, found: !!config });
  return config;
};

/**
 * Busca uma lição específica (Lição ou Simulação) dentro de uma trilha.
 * @param pathId ID da trilha (ex: 'crucialConversations')
 * @param moduleId ID completo do módulo (1-20 para lições, 501-505 para simulações, 800-804 para revisões)
 */
export const getLessonOrSimulationData = (pathId: string, moduleId: number) => {
  console.log('🔍 getLessonOrSimulationData:', { pathId, moduleId });
  
  const config = getPathConfig(pathId);
  if (!config) {
    console.error('❌ Config não encontrado para pathId:', pathId);
    return null;
  }

  // Simulações (ID >= 500 e < 800)
  if (moduleId >= 500 && moduleId < 800) {
    const originalSimId = moduleId - 500; // Converte 501 -> 1, 502 -> 2, etc.
    console.log('🎮 Buscando simulação:', { moduleId, originalSimId });
    const simulation = config.simulations.find(s => s.simulationId === originalSimId);
    console.log('🎮 Simulação encontrada:', !!simulation);
    return simulation ? { type: 'simulation', data: simulation } : null;
  }
  
  // Revisões (ID >= 800)
  if (moduleId >= 800) {
    console.log('📝 Revisão detectada:', moduleId);
    // Revisões não têm dados próprios, apenas usam perguntas das lições
    return { type: 'review', data: null };
  }

  // Lições normais (ID < 500)
  const lesson = config.lessons.find(l => l.id === moduleId);
  console.log('📚 Lição encontrada:', !!lesson);
  return lesson ? { type: 'lesson', data: lesson } : null;
};

/**
 * Busca o infográfico para uma revisão específica.
 * @param pathId ID da trilha
 * @param reviewId ID da revisão (ex: 800, 801)
 */
export const getInfographicHtml = (pathId: string, reviewId: number): string | undefined => {
  console.log('🖼️ getInfographicHtml:', { pathId, reviewId });
  
  const config = getPathConfig(pathId);
  if (!config) {
    console.error('❌ Config não encontrado para infográfico');
    return undefined;
  }
  
  const infographic = config.infographics[reviewId];
  console.log('🖼️ Infográfico encontrado:', !!infographic, 'Tamanho:', infographic?.length || 0);
  
  return infographic;
};

/**
 * Busca todas as perguntas de lições para uma revisão específica.
 * @param pathId ID da trilha
 * @param lessonsToReview IDs das lições a serem revisadas
 */
export const getReviewQuestions = (pathId: string, lessonsToReview: number[]): any[] => {
  console.log('❓ getReviewQuestions:', { pathId, lessonsToReview });
  
  const config = getPathConfig(pathId);
  if (!config) {
    console.error('❌ Config não encontrado para perguntas');
    return [];
  }

  console.log('📚 Total de lições na trilha:', config.lessons.length);
  console.log('📚 IDs das lições na trilha:', config.lessons.map(l => l.id));

  const relevantLessons = config.lessons.filter(lesson => lessonsToReview.includes(lesson.id));
  console.log('✅ Lições relevantes encontradas:', relevantLessons.length);
  
  let selectedQuestions: any[] = [];
  relevantLessons.forEach(lesson => {
    console.log(`📝 Lição ${lesson.id}: ${lesson.questions?.length || 0} perguntas`);
    const shuffledQuestions = shuffleArray([...lesson.questions]);
    // Seleciona 3 perguntas por lição para a revisão
    selectedQuestions.push(...shuffledQuestions.slice(0, 3));
  });

  console.log('✅ Total de perguntas selecionadas:', selectedQuestions.length);
  return shuffleArray(selectedQuestions);
};

// Helper to shuffle an array (mantido aqui para uso interno)
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};