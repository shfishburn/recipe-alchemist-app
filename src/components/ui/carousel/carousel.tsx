
"use client";

import React, { useRef, useState, useEffect, forwardRef } from "react";
import { Swiper as SwiperComponent } from "swiper/react";
import { Swiper as SwiperCore } from "swiper";
import { cn } from "@/lib/utils";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import Swiper modules
import { Pagination, Navigation, Keyboard, A11y } from 'swiper/modules';

type CarouselProps = {
  opts?: SwiperOptions;
  plugins?: any[];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: SwiperCore | null) => void;
  className?: string;
  children?: React.ReactNode;
};

type SwiperOptions = {
  loop?: boolean;
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  centeredSlides?: boolean;
  speed?: number;
  effect?: string;
  autoHeight?: boolean;
  navigation?: boolean;
  pagination?: boolean | any;
  keyboard?: boolean | any;
  [key: string]: any;
};

type CarouselApi = SwiperCore;

type CarouselContextProps = {
  api: CarouselApi | null;
  activeIndex: number;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

export const Carousel = forwardRef<
  HTMLDivElement,
  CarouselProps
>(
  (
    {
      opts = {},
      plugins = [],
      orientation = "horizontal",
      setApi,
      className,
      children,
    },
    ref
  ) => {
    const swiperRef = useRef<SwiperCore | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    // Set up default Swiper options
    const defaultOptions: SwiperOptions = {
      modules: [Navigation, Pagination, Keyboard, A11y, ...plugins],
      direction: orientation === "horizontal" ? "horizontal" : "vertical",
      loop: opts.loop ?? true,
      slidesPerView: opts.slidesPerView ?? 1,
      spaceBetween: opts.spaceBetween ?? 0,
      centeredSlides: opts.centeredSlides,
      speed: opts.speed ?? 500,
      touchMoveStopPropagation: true,
      touchStartPreventDefault: false,
      keyboard: opts.keyboard ?? {
        enabled: true,
        onlyInViewport: true,
      },
      a11y: {
        enabled: true,
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
      },
      on: {
        init: (swiper) => {
          updateButtonState(swiper);
        },
        slideChange: (swiper) => {
          setActiveIndex(swiper.realIndex);
          updateButtonState(swiper);
        },
      },
    };

    function updateButtonState(swiper: SwiperCore) {
      setCanScrollPrev(swiper.isBeginning === false); // Can scroll prev if not at beginning
      setCanScrollNext(swiper.isEnd === false); // Can scroll next if not at end
    }

    const scrollPrev = () => {
      swiperRef.current?.slidePrev();
    };

    const scrollNext = () => {
      swiperRef.current?.slideNext();
    };

    useEffect(() => {
      if (swiperRef.current && setApi) {
        setApi(swiperRef.current);
      }
    }, [swiperRef.current, setApi]);

    return (
      <CarouselContext.Provider
        value={{
          api: swiperRef.current,
          activeIndex,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          className={cn("relative w-full", className)}
          aria-roledescription="carousel"
        >
          <SwiperComponent
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              if (setApi) setApi(swiper);
            }}
            className={cn(
              "w-full touch-pan-x hw-accelerated",
              orientation === "vertical" ? "h-full touch-pan-y" : ""
            )}
            {...defaultOptions}
            {...opts}
          >
            {children}
          </SwiperComponent>
        </div>
      </CarouselContext.Provider>
    );
  }
);

Carousel.displayName = "Carousel";
