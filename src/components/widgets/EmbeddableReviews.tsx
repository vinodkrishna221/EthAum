"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReviewCard, Review } from "@/components/reviews/ReviewCard"
import { ChevronLeft, ChevronRight, Copy, Check, Code } from "lucide-react"

// Reuse dummy data for preview
const DUMMY_REVIEWS: Review[] = [
    {
        id: "1",
        authorName: "Sarah Chen",
        authorRole: "CTO",
        authorCompany: "TechFlow",
        rating: 5,
        date: "Jan 10, 2026",
        verified: true,
        content: "EthAum has completely transformed how we evaluate enterprise software. The credibility scores are spot on.",
        pros: [],
        cons: []
    },
    {
        id: "3",
        authorName: "Jessica Lee",
        authorRole: "Founder",
        authorCompany: "StartUp Zen",
        rating: 5,
        date: "Jan 05, 2026",
        verified: false,
        content: "We launched our product here and the feedback loop was incredible. A game changer for Series A startups.",
        pros: [],
        cons: []
    }
]

interface EmbeddableReviewsProps {
    productSlug: string
}

export function EmbeddableReviews({ productSlug }: EmbeddableReviewsProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [copied, setCopied] = React.useState(false)

    const embedCode = `<div data-ethaum-reviews="${productSlug}" data-theme="light"></div><script src="https://ethaum.ai/widget.js" async></script>`

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % DUMMY_REVIEWS.length)
    }

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + DUMMY_REVIEWS.length) % DUMMY_REVIEWS.length)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-4 rounded-lg border p-4 bg-background">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Code className="h-4 w-4" /> Review Widget
                </h3>
            </div>

            {/* Widget Preview Area */}
            <div className="bg-muted/30 p-8 rounded-lg border border-dashed flex items-center justify-center relative min-h-[300px]">
                <div className="w-full max-w-sm relative">
                    <div className="overflow-hidden">
                        <div className="relative bg-card rounded-xl shadow-lg border p-1" >
                            <ReviewCard review={DUMMY_REVIEWS[currentIndex]} />
                        </div>
                    </div>

                    {/* Controls */}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute -left-12 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full shadow-sm"
                        onClick={handlePrev}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute -right-12 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full shadow-sm"
                        onClick={handleNext}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="absolute bottom-2 right-4 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                    Preview
                </div>
            </div>

            <div className="flex gap-2">
                <Input value={embedCode} readOnly className="font-mono text-xs h-9 bg-muted" />
                <Button size="sm" variant="outline" className="shrink-0" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    )
}
