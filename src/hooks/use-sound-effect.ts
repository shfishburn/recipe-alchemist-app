
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSoundEffectOptions {
  enabled?: boolean;
  loop?: boolean;
  volume?: number;
}

export function useSoundEffect(options: UseSoundEffectOptions = {}) {
  const { enabled = true, loop = false, volume = 0.5 } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Initialize audio element dynamically when needed
  const getAudioElement = useCallback((soundUrl: string) => {
    if (!audioRef.current) {
      const audio = new Audio(soundUrl);
      audio.loop = loop;
      audio.volume = volume;
      audio.preload = "auto";
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [loop, volume]);
  
  // Play sound with better error handling
  const play = useCallback((soundUrl: string, options: { volume?: number } = {}) => {
    if (!enabled || isMuted) return;
    
    try {
      const audio = getAudioElement(soundUrl);
      
      // Apply optional volume override for this play instance
      if (options.volume !== undefined) {
        audio.volume = Math.max(0, Math.min(1, options.volume));
      }
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            // Silent error handling to prevent app crashing
            setIsPlaying(false);
          });
      }
    } catch (error) {
      // Silent error handling to prevent app crashing
      setIsPlaying(false);
    }
  }, [enabled, isMuted, getAudioElement]);
  
  // Pause sound
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return isMuted;
    
    const newMuteState = !isMuted;
    audioRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
    
    return newMuteState;
  }, [isMuted]);
  
  // Set volume
  const setVolume = useCallback((vol: number) => {
    if (!audioRef.current) return;
    
    const clampedVol = Math.max(0, Math.min(1, vol));
    audioRef.current.volume = clampedVol;
  }, []);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);
  
  return {
    play,
    pause,
    isPlaying,
    isMuted,
    toggleMute,
    setVolume
  };
}
