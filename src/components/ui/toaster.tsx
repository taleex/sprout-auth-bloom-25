
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Edit3, 
  AlertCircle, 
  Trash2, 
  Info, 
  Mail,
  Shield,
  User,
  CreditCard,
  Save,
  Upload
} from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const getIcon = () => {
          const titleStr = title?.toString().toLowerCase() || ""
          const descriptionStr = description?.toString().toLowerCase() || ""
          
          // Success/Positive actions (Green icons)
          if (
            titleStr.includes("added") ||
            titleStr.includes("created") ||
            titleStr.includes("success") ||
            titleStr.includes("updated") ||
            titleStr.includes("saved") ||
            titleStr.includes("verified") ||
            variant === "success"
          ) {
            if (titleStr.includes("added") || titleStr.includes("created")) {
              return <Plus className="h-4 w-4 text-emerald-600" />
            }
            if (titleStr.includes("updated") || titleStr.includes("saved")) {
              return <Save className="h-4 w-4 text-emerald-600" />
            }
            return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          }
          
          // Destructive/Negative actions (Red icons)
          if (
            titleStr.includes("deleted") ||
            titleStr.includes("removed") ||
            titleStr.includes("failed") ||
            titleStr.includes("error") ||
            titleStr.includes("warning") ||
            variant === "destructive"
          ) {
            if (titleStr.includes("deleted") || titleStr.includes("removed")) {
              return <Trash2 className="h-4 w-4 text-red-600" />
            }
            if (titleStr.includes("failed") || titleStr.includes("error")) {
              return <XCircle className="h-4 w-4 text-red-600" />
            }
            if (titleStr.includes("warning")) {
              return <AlertCircle className="h-4 w-4 text-amber-600" />
            }
            return <XCircle className="h-4 w-4 text-red-600" />
          }
          
          // Informational actions (Blue icons)
          if (
            titleStr.includes("info") ||
            titleStr.includes("email") ||
            titleStr.includes("reset") ||
            titleStr.includes("login") ||
            titleStr.includes("logout") ||
            titleStr.includes("account") ||
            titleStr.includes("profile") ||
            variant === "info"
          ) {
            if (titleStr.includes("email")) {
              return <Mail className="h-4 w-4 text-blue-600" />
            }
            if (titleStr.includes("reset") || titleStr.includes("login") || titleStr.includes("logout")) {
              return <Shield className="h-4 w-4 text-blue-600" />
            }
            if (titleStr.includes("account") || titleStr.includes("profile")) {
              return <User className="h-4 w-4 text-blue-600" />
            }
            if (titleStr.includes("upload")) {
              return <Upload className="h-4 w-4 text-blue-600" />
            }
            return <Info className="h-4 w-4 text-blue-600" />
          }
          
          // Default icon for other cases
          return <Info className="h-4 w-4 text-gray-600" />
        }

        const getToastVariant = () => {
          if (variant) return variant
          
          const titleStr = title?.toString().toLowerCase() || ""
          
          if (
            titleStr.includes("added") ||
            titleStr.includes("created") ||
            titleStr.includes("updated") ||
            titleStr.includes("saved") ||
            titleStr.includes("success") ||
            titleStr.includes("verified")
          ) {
            return "success"
          }
          
          if (
            titleStr.includes("deleted") ||
            titleStr.includes("failed") ||
            titleStr.includes("error")
          ) {
            return "destructive"
          }

          if (titleStr.includes("warning")) {
            return "destructive"
          }
          
          if (
            titleStr.includes("info") ||
            titleStr.includes("email") ||
            titleStr.includes("reset") ||
            titleStr.includes("login") ||
            titleStr.includes("logout")
          ) {
            return "info"
          }
          
          return "default"
        }

        return (
          <Toast key={id} variant={getToastVariant()} {...props}>
            <div className="flex items-start gap-3 w-full">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0">
                {title && (
                  <ToastTitle className="font-semibold text-sm leading-tight mb-1">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-sm leading-relaxed opacity-90">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
