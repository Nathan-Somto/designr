import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
type Props = {
  children: React.ReactNode
  align?: "end" | "start" | "center"
  alignOffset?: number
  sideOffset?: number
  side?: "top" | "bottom" | "left" | "right"
  label: string
  className?: string
}
function Hint({ children, align = 'center', alignOffset = 2, label, sideOffset = 4, side, className }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          align={align}
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          side={side}
          className={className}
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Hint;