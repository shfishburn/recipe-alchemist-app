# Carousel Component Documentation

## Overview

The Carousel component is a versatile UI element used to display a series of content items (images, text, or other components) in a rotating or sliding manner. It allows users to navigate through the items using navigation controls such as arrows, pagination dots, or by swiping on touch devices.

## Key Features

- **Responsive Design**: Adapts to different screen sizes and devices, ensuring a consistent user experience across platforms.
- **Navigation Controls**: Provides intuitive navigation controls, including arrows and pagination dots, for easy browsing.
- **Auto-Scrolling**: Supports automatic scrolling of items at a configurable interval, enhancing user engagement.
- **Customizable**: Offers a range of customization options, including item width, spacing, and animation effects, to suit different design requirements.
- **Touch Support**: Enables swipe gestures on touch devices for seamless navigation.
- **Accessibility**: Implements accessibility features, such as ARIA attributes and keyboard navigation, to ensure usability for all users.

## Component Structure

The Carousel component consists of the following sub-components:

- **CarouselContainer**: The main container element that wraps the entire carousel.
- **CarouselScrollArea**: A scrollable area that contains the carousel items.
- **CarouselItem**: An individual item within the carousel.
- **CarouselNav**: Navigation controls (arrows) for moving between items.
- **CarouselPagination**: Pagination dots indicating the current item and allowing direct navigation.
- **CarouselCounter**: Displays the current item number and total number of items.

## Usage

To use the Carousel component, import it into your React component and provide an array of items to be displayed. Each item should have a unique `id` and `content` property.

```typescript
import { Carousel } from "@/components/ui/carousel/Carousel";

const items = [
  { id: 1, content: <img src="/images/image1.jpg" alt="Image 1" /> },
  { id: 2, content: <img src="/images/image2.jpg" alt="Image 2" /> },
  { id: 3, content: <img src="/images/image3.jpg" alt="Image 3" /> },
];

function MyComponent() {
  return (
    <Carousel items={items} renderItem={(item) => item.content} />
  );
}
```

## Props

The Carousel component accepts the following props:

| Prop                | Type                                     | Default | Description
