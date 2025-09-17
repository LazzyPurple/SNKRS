import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 px-3 py-1 text-base outline-none transition-[color,box-shadow]",
        "bg-transparent border-2 border-zinc-700 text-white placeholder-zinc-500",
        "focus-visible:border-violet-500 focus-visible:ring-violet-500/20 focus-visible:ring-[3px]",
        "hover:border-violet-500",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white",
        "selection:bg-violet-600 selection:text-white",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
