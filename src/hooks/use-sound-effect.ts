
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSoundEffectOptions {
  enabled?: boolean;
  loop?: boolean;
  volume?: number;
}

export function useSoundEffect(
  soundUrl: string, 
  options: UseSoundEffectOptions = {}
) {
  const { enabled = true, loop = false, volume = 0.5 } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Initialize audio on mount with preload
  useEffect(() => {
    const audio = new Audio(soundUrl);
    audio.loop = loop;
    audio.volume = volume;
    audio.preload = "auto"; // Preload the audio file
    
    // For iOS devices - needs to be set after a user interaction
    if (typeof document !== 'undefined') {
      const unlockAudio = () => {
        if (audioRef.current) {
          // Create and play a silent audio buffer to unlock audio playback
          const silentPlay = audioRef.current.play();
          if (silentPlay !== undefined) {
            silentPlay
              .then(() => {
                // Successfully unlocked audio
                audioRef.current?.pause();
              })
              .catch(() => {
                // Audio still locked, retry on next user interaction
              });
          }
        }
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('click', unlockAudio);
      };
      
      document.addEventListener('touchstart', unlockAudio, { once: true });
      document.addEventListener('click', unlockAudio, { once: true });
    }
    
    audioRef.current = audio;
    
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [soundUrl, loop, volume]);
  
  // Play sound with better error handling
  const play = useCallback(() => {
    if (!audioRef.current || !enabled || isMuted) return;
    
    // For browsers that require user interaction
    try {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            // Don't log the error, it's usually just browser autoplay policy
            // and can clutter the console
            setIsPlaying(false);
          });
      }
    } catch (error) {
      // Silent error handling to prevent app crashing
      setIsPlaying(false);
    }
  }, [enabled, isMuted]);
  
  // Pause sound
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    
    const newMuteState = !isMuted;
    audioRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
    
    // If unmuting and was playing, resume
    if (!newMuteState && isPlaying) {
      audioRef.current.play().catch(() => {
        // Silent catch - don't break the UI if audio fails
      });
    }
    
    return newMuteState;
  }, [isMuted, isPlaying]);
  
  // Set volume
  const setAudioVolume = useCallback((vol: number) => {
    if (!audioRef.current) return;
    
    const clampedVol = Math.max(0, Math.min(1, vol));
    audioRef.current.volume = clampedVol;
  }, []);
  
  return {
    play,
    pause,
    isPlaying,
    isMuted,
    toggleMute,
    setVolume: setAudioVolume
  };
}
