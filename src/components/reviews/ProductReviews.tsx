"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Assume Tabs exist or will create simple version
import { ReviewList } from "@/components/reviews/ReviewList"
import { ReviewForm } from "@/components/reviews/ReviewForm"
import { CredibilityScore } from "@/components/reviews/CredibilityScore"
import { EmbeddableBadge } from "@/components/widgets/EmbeddableBadge"
import { EmbeddableReviews } from "@/components/widgets/EmbeddableReviews"

export function ProductReviews() {
    const [activeTab, setActiveTab] = React.useState("reviews")

    return (
        <div className="space-y-8">
            {/* Top Section: Score & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <CredibilityScore
                        score={87}
                        breakdown={[
                            { label: "Verified Reviews", score: 92, weight: 40 },
                            { label: "Market Presence", score: 85, weight: 30 },
                            { label: "Community", score: 78, weight: 30 },
                        ]}
                    />
                    <div className="mt-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Widgets & Badges</h4>
                        <div className="space-y-4">
                            <EmbeddableBadge companySlug="acme-analytics" score={87} />
                            <EmbeddableReviews productSlug="acme-analytics" />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-6 border-b pb-2">
                        <h2 className="text-2xl font-bold tracking-tight">Product Reviews</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab("reviews")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "reviews" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                            >
                                Read Reviews
                            </button>
                            <button
                                onClick={() => setActiveTab("write")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "write" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                            >
                                Write a Review
                            </button>
                        </div>
                    </div>

                    {activeTab === "reviews" ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <ReviewList />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <ReviewForm />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
