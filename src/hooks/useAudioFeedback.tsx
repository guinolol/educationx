"use client";

import React, { useCallback } from 'react';

// Define os caminhos para os arquivos de áudio usando os links externos fornecidos
const SOUND_PATHS = {
  error: 'https://cdn.freesound.org/previews/759/759977_16155788-lq.mp3',
  success: 'https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3',
  win: 'https://cdn.freesound.org/previews/391/391539_5235550-lq.mp3',
  gameOver: 'https://cdn.freesound.org/previews/364/364929_6512973-lq.mp3',
};

// Função utilitária para criar e reproduzir um elemento de áudio
const playSound = (path: string) => {
  try {
    const audio = new Audio(path);
    // Garante que o som seja reproduzido do início, mesmo se for chamado rapidamente
    audio.currentTime = 0; 
    audio.play().catch(e => console.warn("Audio playback blocked or failed:", e));
  } catch (e) {
    console.error("Failed to create or play audio element:", e);
  }
};

export function useAudioFeedback() {
  // Funções de reprodução específicas
  const playSuccess = useCallback(() => {
    playSound(SOUND_PATHS.success);
  }, []);

  const playError = useCallback(() => {
    playSound(SOUND_PATHS.error);
  }, []);

  const playGameOver = useCallback(() => {
    playSound(SOUND_PATHS.gameOver);
  }, []);

  const playWin = useCallback(() => {
    playSound(SOUND_PATHS.win);
  }, []);

  return {
    playSuccess,
    playError,
    playGameOver,
    playWin,
  };
}