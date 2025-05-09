
import { Toaster as Sonner } from 'sonner'
import { useTheme } from '@/hooks/use-theme'

export function Toaster() {
  const { theme } = useTheme() || { theme: 'system' }

  return (
    <Sonner
      position="bottom-right"
      theme={theme as 'light' | 'dark' | 'system'}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toast]:text-green-500 group-[.toast]:border-green-500/20 group-[.toast]:bg-green-50 dark:group-[.toast]:bg-green-900/10",
          error: "group-[.toast]:text-red-500 group-[.toast]:border-red-500/20 group-[.toast]:bg-red-50 dark:group-[.toast]:bg-red-900/10",
          info: "group-[.toast]:text-blue-500 group-[.toast]:border-blue-500/20 group-[.toast]:bg-blue-50 dark:group-[.toast]:bg-blue-900/10",
          warning: "group-[.toast]:text-amber-500 group-[.toast]:border-amber-500/20 group-[.toast]:bg-amber-50 dark:group-[.toast]:bg-amber-900/10",
        },
      }}
    />
  )
}
