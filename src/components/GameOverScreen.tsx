"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skull, ChevronRight, RefreshCw } from 'lucide-react';

interface GameOverScreenProps {
  title: string;
  isReview: boolean;
  onRestart: () => void;
  onExit: () => void;
}

const GameOverScreen = ({ title, isReview, onRestart, onExit }: GameOverScreenProps) => {
  const message = isReview 
    ? "Você perdeu todas as suas vidas na Revisão. O conhecimento precisa ser reforçado!"
    : "Você perdeu todas as suas vidas. Não se preocupe, use o material de apoio e tente novamente!";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900 dark:to-pink-900 p-4 flex items-center justify-center">
      <Card className="p-8 max-w-md w-full text-center shadow-2xl border-4 border-red-400 dark:border-red-700">
        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Skull className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">Fim de Jogo!</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          {message}
        </p>
        
        <div className="space-y-4">
          <Button 
            size="lg" 
            onClick={onRestart}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="mr-2" />
            Tentar Novamente
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={onExit}
            className="w-full"
          >
            Voltar ao Dashboard
            <ChevronRight className="ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameOverScreen;