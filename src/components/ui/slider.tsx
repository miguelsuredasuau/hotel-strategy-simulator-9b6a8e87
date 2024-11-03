import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center py-4",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-hotel-accent/50">
      <SliderPrimitive.Range className="absolute h-full bg-hotel-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-7 w-7 rounded-full border-4 border-hotel-primary bg-white ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hotel-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 hover:bg-hotel-primary hover:border-white" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }