"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, ShieldCheck } from "lucide-react"

interface EmbeddableBadgeProps {
    companySlug: string
    score: number
    theme?: "light" | "dark"
}

export function EmbeddableBadge({ companySlug, score, theme = "light" }: EmbeddableBadgeProps) {
    const [copied, setCopied] = React.useState(false)

    const embedCode = `<div data-ethaum-badge="${companySlug}" data-theme="${theme}"></div><script src="https://ethaum.ai/widget.js" async></script>`

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-4 rounded-lg border p-4 bg-background">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Embed Badge</h3>
                <div className="flex gap-2 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                    <span className={theme === "light" ? "text-foreground font-medium" : ""}>Light</span>
                    <span>|</span>
                    <span className={theme === "dark" ? "text-foreground font-medium" : ""}>Dark</span>
                </div>
            </div>

            {/* Badge Preview */}
            <div className="flex justify-center p-8 bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-secondary/30 rounded-lg border border-dashed">
                <div className={`
                flex items-center gap-3 px-4 py-2 rounded-lg border shadow-sm
                ${theme === 'light' ? 'bg-white text-slate-900 border-slate-200' : 'bg-slate-900 text-white border-slate-800'}
          `}>
                    <div className="flex items-center justify-center h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md text-white font-bold text-lg shadow-inner">
                        {score}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Credibility Score</span>
                        <div className="flex items-center gap-1 font-bold leading-none">
                            EthAum <ShieldCheck className="h-3 w-3 text-emerald-400" />
                        </div>
                    </div>
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
