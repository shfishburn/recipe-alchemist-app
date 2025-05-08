
export interface CarouselItem {
  id: string | number;
  content: any;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CarouselItem[];
  renderItem: (item: CarouselItem, index: number, isActive: boolean) => React.ReactNode;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  showCounter?: boolean;
  itemWidthMobile?: string;
  itemWidthDesktop?: string;
  onSlideChange?: (index: number) => void;
  initialSlide?: number;
  gap?: string;
  arrowPosition?: "inside" | "outside";
}

export interface CarouselNavProps {
  onPrevious: () => void;
  onNext: () => void;
  arrowPosition?: "inside" | "outside";
  showArrows: boolean;
  itemsCount: number;
}

export interface CarouselPaginationProps {
  count: number;
  activeIndex: number;
  onClick: (index: number) => void;
  showDots: boolean;
}

export interface CarouselCounterProps {
  current: number;
  total: number;
  showCounter: boolean;
}
