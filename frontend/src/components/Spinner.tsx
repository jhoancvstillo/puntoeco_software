import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn("animate-spin rounded-full border-4 border-primary border-t-transparent", className)}
      style={{ width: '2rem', height: '2rem' }}
      {...props}
    />
  )
}
