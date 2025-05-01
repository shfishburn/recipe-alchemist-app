
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-hidden="true" // Hide from screen readers as this is a visual-only element
      role="presentation" // Indicate this is presentational only
      {...props}
    />
  )
}

export { Skeleton }
