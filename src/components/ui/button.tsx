import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border border-foreground shadow-sm hover:bg-foreground hover:text-background hover:shadow-[0_0_8px_2px_hsl(45,33%,56%)] active:scale-95",
        destructive:
          "bg-background text-foreground border border-foreground shadow-sm hover:bg-foreground hover:text-background hover:shadow-[0_0_8px_2px_hsl(45,33%,56%)]",
        outline:
          "border-2 border-foreground bg-background text-foreground shadow-xs hover:bg-foreground hover:text-background hover:shadow-[0_0_8px_2px_hsl(45,33%,56%)]",
        secondary:
          "bg-background text-foreground border border-foreground shadow-sm hover:bg-foreground hover:text-background hover:shadow-[0_0_8px_2px_hsl(45,33%,56%)]",
        ghost: "bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline hover:text-foreground/80",
        hero: "bg-background text-foreground border-2 border-foreground shadow-lg hover:bg-foreground hover:text-background hover:shadow-[0_0_16px_4px_hsl(45,33%,56%)] font-bold tracking-wide",
        accent: "bg-background text-foreground border border-foreground shadow-md hover:bg-foreground hover:text-background hover:shadow-[0_0_8px_2px_hsl(45,33%,56%)]",
        brand: "bg-background text-foreground border border-foreground shadow-md hover:bg-foreground hover:text-background hover:shadow-[0_0_8px_2px_hsl(45,33%,56%)]",
        modern: "bg-background text-foreground border border-foreground shadow-lg hover:bg-foreground hover:text-background hover:shadow-[0_0_16px_4px_hsl(45,33%,56%)]"
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-12 text-lg font-bold",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
