
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSoundEffect } from '@/hooks/use-sound-effect';

export function useAudioInteraction(completedLoading: boolean) {
  const isMobile = useIsMobile();
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Initialize sound effect for typing with mobile-friendly settings
  const { play: playTypingSound, pause: pauseTypingSound } = useSoundEffect('/lovable-uploads/typing.mp3', {
    loop: true,
    volume: isMobile ? 0.5 : 0.3, // Higher volume for mobile
    enabled: true
  });
  
  // Enable audio after a user interaction on mobile
  useEffect(() => {
    const enableAudio = () => {
      if (!audioEnabled) {
        setAudioEnabled(true);
        // Try to play audio now that we have user interaction
        if (!completedLoading) {
          playTypingSound();
        }
        // Remove listener once enabled
        document.removeEventListener('touchstart', enableAudio);
        document.removeEventListener('click', enableAudio);
      }
    };

    // Add listeners for user interaction
    document.addEventListener('touchstart', enableAudio);
    document.addEventListener('click', enableAudio);
    
    return () => {
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('click', enableAudio);
    };
  }, [audioEnabled, completedLoading, playTypingSound]);

  // Effect to play or pause sound based on loading state
  useEffect(() => {
    // Start typing sound if audio is enabled
    if (audioEnabled || !isMobile) {
      if (!completedLoading) {
        playTypingSound();
      } else {
        pauseTypingSound();
      }
    }

    return () => {
      pauseTypingSound();
    };
  }, [completedLoading, audioEnabled, isMobile, playTypingSound, pauseTypingSound]);

  return {
    audioEnabled
  };
}
