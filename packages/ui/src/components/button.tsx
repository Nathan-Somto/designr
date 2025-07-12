import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none   disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:shadow-primary/30 hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-primary text-primary bg-white shadow-sm hover:shadow-md hover:shadow-primary/30 ",
        secondary:
          "bg-secondary text-primary shadow-md hover:shadow-secondary/50",
        ghost: "hover:bg-accent/90 hover:text-primary hover:shadow-sm data-[active=true]:bg-accent/90 data-[active=true]:text-primary hover:data-[active=true]:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline",
        selection: 'hover:!bg-primary/10 !rounded-none hover:!text-primary !text-secondary-foreground data-[active=true]:!bg-primary/10 data-[active=true]:!text-primary',
      },
      size: {
        default: "h-[2.75rem] px-5 py-3 rounded-[0.5rem]",
        sm: "h-[2.25rem] rounded-md px-3 text-xs rounded-[0.25rem]",
        lg: "h-[3.25rem] rounded-md px-8 py-4 text-lg rounded-[0.75rem]",
        icon: "h-[2.5rem] w-[2.5rem] rounded-[0.5rem]",
        shrink: 'h-[2.75rem] w-[2.5rem] rounded-[0.5rem] px-2 py-3',
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
