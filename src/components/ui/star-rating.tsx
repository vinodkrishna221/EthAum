"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
    rating: number
    maxRating?: number
    onRatingChange?: (rating: number) => void
    readOnly?: boolean
    size?: "sm" | "md" | "lg"
    className?: string
}

export function StarRating({
    rating,
    maxRating = 5,
    onRatingChange,
    readOnly = false,
    size = "md",
    className,
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = React.useState(0)

    const sizeClasses = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-8 w-8",
    }

    const handleMouseEnter = (index: number) => {
        if (!readOnly) {
            setHoverRating(index)
        }
    }

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoverRating(0)
        }
    }

    const handleClick = (index: number) => {
        if (!readOnly && onRatingChange) {
            onRatingChange(index)
        }
    }

    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            {[...Array(maxRating)].map((_, i) => {
                const starIndex = i + 1
                return (
                    <button
                        key={i}
                        type="button"
                        disabled={readOnly}
                        className={cn(
                            "focus:outline-none transition-transform",
                            !readOnly && "hover:scale-110",
                            readOnly && "cursor-default"
                        )}
                        onClick={() => handleClick(starIndex)}
                        onMouseEnter={() => handleMouseEnter(starIndex)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                "transition-colors",
                                (hoverRating || rating) >= starIndex
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-muted-foreground/30 fill-none"
                            )}
                        />
                    </button>
                )
            })}
        </div>
    )
}
