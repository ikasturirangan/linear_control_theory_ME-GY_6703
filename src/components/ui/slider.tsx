"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

const rootStyle: React.CSSProperties = {
  position: "relative",
  display: "flex",
  width: "100%",
  touchAction: "none",
  userSelect: "none",
  alignItems: "center",
  height: 22,
};

const trackStyle: React.CSSProperties = {
  position: "relative",
  height: 6,
  width: "100%",
  overflow: "hidden",
  borderRadius: 9999,
  background: "#e2e8f0",
};

const rangeStyle: React.CSSProperties = {
  position: "absolute",
  height: "100%",
  background: "#0f766e",
};

const thumbStyle: React.CSSProperties = {
  display: "block",
  width: 16,
  height: 16,
  borderRadius: "50%",
  border: "2px solid #0f766e",
  background: "#ffffff",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.18)",
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ style, ...props }, ref) => {
  const values = props.value ?? props.defaultValue ?? [0];
  const thumbCount = Array.isArray(values) ? values.length : 1;

  return (
    <SliderPrimitive.Root ref={ref} style={{ ...rootStyle, ...style }} {...props}>
      <SliderPrimitive.Track style={trackStyle}>
        <SliderPrimitive.Range style={rangeStyle} />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }).map((_, index) => (
        <SliderPrimitive.Thumb aria-label={`Slider thumb ${index + 1}`} key={index} style={thumbStyle} />
      ))}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
