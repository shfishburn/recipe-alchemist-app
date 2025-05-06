
import { useCallback, useEffect, useRef, useState } from "react";

interface GestureOptions {
  direction?: "horizontal" | "vertical";
  threshold?: number;
  resistance?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: () => void;
  onSwipeMove?: (delta: number, direction: "left" | "right" | "up" | "down") => void;
  onSwipeEnd?: (
    endDirection: "left" | "right" | "up" | "down" | null, 
    velocity: number
  ) => void;
}

export function useCarouselGestures(
  ref: React.RefObject<HTMLElement>,
  options: GestureOptions = {}
) {
  const {
    direction = "horizontal",
    threshold = 50,
    resistance = 0.3,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onSwipeStart,
    onSwipeMove,
    onSwipeEnd
  } = options;

  const initialTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const timeStampRef = useRef<number>(0);
  const distanceRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isSwipingRef = useRef(false);
  
  const [isSwiping, setIsSwiping] = useState(false);

  // Calculate velocity based on distance and time
  const calculateVelocity = useCallback((distance: number, time: number) => {
    if (time === 0) return 0;
    return distance / time; // pixels per millisecond
  }, []);

  // Handle touch start event
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      const touchPoint = { x: touch.clientX, y: touch.clientY };
      
      initialTouchRef.current = touchPoint;
      lastTouchRef.current = touchPoint;
      timeStampRef.current = e.timeStamp;
      isSwipingRef.current = true;
      distanceRef.current = { x: 0, y: 0 };
      
      if (onSwipeStart) {
        onSwipeStart();
      }
    },
    [onSwipeStart]
  );

  // Handle touch move event
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isSwipingRef.current || !initialTouchRef.current || !lastTouchRef.current) return;

      const touch = e.touches[0];
      const currentTouch = { x: touch.clientX, y: touch.clientY };
      
      // Calculate delta from initial position
      const deltaX = currentTouch.x - initialTouchRef.current.x;
      const deltaY = currentTouch.y - initialTouchRef.current.y;
      
      // Calculate velocity
      const timeDelta = e.timeStamp - timeStampRef.current;
      const xDistance = currentTouch.x - lastTouchRef.current.x;
      const yDistance = currentTouch.y - lastTouchRef.current.y;
      
      velocityRef.current = {
        x: calculateVelocity(xDistance, timeDelta),
        y: calculateVelocity(yDistance, timeDelta)
      };
      
      // Update last position and timestamp
      lastTouchRef.current = currentTouch;
      timeStampRef.current = e.timeStamp;
      distanceRef.current = { x: deltaX, y: deltaY };
      
      // Determine swipe direction
      let swipeDirection: "left" | "right" | "up" | "down" | null = null;
      
      if (direction === "horizontal") {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          swipeDirection = deltaX > 0 ? "right" : "left";
        }
      } else {
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          swipeDirection = deltaY > 0 ? "down" : "up";
        }
      }
      
      // Call move handler with resistance at edges
      if (swipeDirection && onSwipeMove) {
        // Apply resistance near boundaries if needed
        const distance = direction === "horizontal" ? deltaX : deltaY;
        const adjustedDistance = distance * resistance;
        
        onSwipeMove(adjustedDistance, swipeDirection);
      }
      
      if (!isSwiping) {
        setIsSwiping(true);
      }
    },
    [direction, resistance, onSwipeMove, isSwiping, calculateVelocity]
  );

  // Handle touch end event
  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!isSwipingRef.current || !initialTouchRef.current || !lastTouchRef.current) return;
      
      const deltaX = distanceRef.current.x;
      const deltaY = distanceRef.current.y;
      
      // Clear state
      isSwipingRef.current = false;
      setIsSwiping(false);
      
      // Determine which direction had the larger movement
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
      
      // Only handle swipe if it exceeds threshold
      if (isHorizontal && direction === "horizontal") {
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        }
      } else if (!isHorizontal && direction === "vertical") {
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }
      
      // Determine final swipe direction and velocity
      let endDirection: "left" | "right" | "up" | "down" | null = null;
      let velocity = 0;
      
      if (direction === "horizontal") {
        if (Math.abs(deltaX) > threshold) {
          endDirection = deltaX > 0 ? "right" : "left";
          velocity = Math.abs(velocityRef.current.x);
        }
      } else {
        if (Math.abs(deltaY) > threshold) {
          endDirection = deltaY > 0 ? "down" : "up";
          velocity = Math.abs(velocityRef.current.y);
        }
      }
      
      // Call end handler with final direction and velocity
      if (onSwipeEnd) {
        onSwipeEnd(endDirection, velocity);
      }
    },
    [direction, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onSwipeEnd]
  );

  // Attach and remove event listeners
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Use passive: true for better performance
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [ref, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { isSwiping };
}
