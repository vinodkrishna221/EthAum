"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, ExternalLink } from "lucide-react"

interface ScoreBreakdown {
    label: string
    score: number // 0-100
    weight: number // percentage
}

interface CredibilityScoreProps {
    score: number
    breakdown: ScoreBreakdown[]
}

export function CredibilityScore({ score, breakdown }: CredibilityScoreProps) {

    // Simple color function based on score
    const getScoreColor = (s: number) => {
        if (s >= 80) return "text-emerald-500 bg-emerald-500"
        if (s >= 60) return "text-blue-500 bg-blue-500"
        if (s >= 40) return "text-yellow-500 bg-yellow-500"
        return "text-red-500 bg-red-500"
    }

    const scoreColor = getScoreColor(score)

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Credibility Score</CardTitle>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-end gap-3">
                    <div className={`text-6xl font-bold tracking-tighter ${scoreColor.split(" ")[0]}`}>
                        {score}
                    </div>
                    <div className="mb-2 text-sm text-muted-foreground">/ 100</div>
                </div>

                <div className="space-y-3">
                    {breakdown.map((item, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium text-muted-foreground">{item.label}</span>
                                <span className="font-mono">{item.score}</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${getScoreColor(item.score).split(" ")[1]}`}
                                    style={{ width: `${item.score}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-2 border-t text-xs text-muted-foreground">
                    <p>Score is calculated based on verified reviews, market presence, and community engagement.</p>
                </div>
            </CardContent>
        </Card>
    )
}
