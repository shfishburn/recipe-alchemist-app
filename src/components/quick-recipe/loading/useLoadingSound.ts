
import { useState, useEffect, useCallback } from 'react';

interface UseLoadingSoundProps {
  completedLoading: boolean;
}

export function useLoadingSound({ completedLoading }: UseLoadingSoundProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  
  // Initialize audio on component mount
  useEffect(() => {
    const audioElement = new Audio('/lovable-uploads/typing.mp3');
    audioElement.loop = true;
    setAudio(audioElement);
    
    // Check if audio is enabled in localStorage
    const storedPreference = localStorage.getItem('recipe-audio-enabled');
    setAudioEnabled(storedPreference === 'true');
    
    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, []);
  
  // Play typing sound
  const playTypingSound = useCallback(() => {
    if (audio && audioEnabled && !completedLoading) {
      audio.currentTime = 0;
      audio.play().catch(err => console.error('Error playing sound:', err));
    }
  }, [audio, audioEnabled, completedLoading]);
  
  // Pause typing sound
  const pauseTypingSound = useCallback(() => {
    if (audio) {
      audio.pause();
    }
  }, [audio]);
  
  // Toggle audio
  const toggleAudio = useCallback(() => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    localStorage.setItem('recipe-audio-enabled', String(newState));
    
    if (newState && !completedLoading && audio) {
      audio.play().catch(err => console.error('Error playing sound:', err));
    } else if (audio) {
      audio.pause();
    }
  }, [audioEnabled, completedLoading, audio]);
  
  // Stop audio when loading completes
  useEffect(() => {
    if (completedLoading && audio) {
      audio.pause();
    }
  }, [completedLoading, audio]);
  
  return {
    audioEnabled,
    playTypingSound,
    pauseTypingSound,
    toggleAudio
  };
}
