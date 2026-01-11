import * as React from "react"
import { CheckCircle, ShieldCheck, Linkedin } from "lucide-react"
import { cn } from "@/lib/utils"

export type VerificationType = "user" | "linkedin" | "platform"

interface VerificationBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    type: VerificationType
    showText?: boolean
}

export function VerificationBadge({ type, showText = true, className, ...props }: VerificationBadgeProps) {

    const config = {
        user: {
            icon: CheckCircle,
            text: "Verified User",
            classes: "text-green-600 bg-green-500/10 border-green-500/20"
        },
        linkedin: {
            icon: Linkedin,
            text: "LinkedIn Verified",
            classes: "text-blue-600 bg-blue-500/10 border-blue-500/20"
        },
        platform: {
            icon: ShieldCheck,
            text: "Platform Verified",
            classes: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20"
        }
    }

    const { icon: Icon, text, classes } = config[type]

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium select-none",
                classes,
                !showText && "px-1",
                className
            )}
            {...props}
            title={text}
        >
            <Icon className="h-3 w-3" />
            {showText && <span>{text}</span>}
        </div>
    )
}
