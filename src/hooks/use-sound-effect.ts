
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
  
  // Initialize audio on mount
  useEffect(() => {
    const audio = new Audio(soundUrl);
    audio.loop = loop;
    audio.volume = volume;
    audioRef.current = audio;
    
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [soundUrl, loop, volume]);
  
  // Play sound
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
            console.error("Audio play failed:", error);
            setIsPlaying(false);
          });
      }
    } catch (error) {
      console.error("Audio play error:", error);
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
      audioRef.current.play().catch(console.error);
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
