"use client"

import * as React from "react"
import { ReviewCard, Review } from "@/components/reviews/ReviewCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StarRating } from "@/components/ui/star-rating"
import { Search } from "lucide-react"

// Dummy data
const DUMMY_REVIEWS: Review[] = [
    {
        id: "1",
        authorName: "Sarah Chen",
        authorRole: "CTO",
        authorCompany: "TechFlow",
        rating: 5,
        date: "Jan 10, 2026",
        verified: true,
        content: "EthAum has completely transformed how we evaluate enterprise software. The credibility scores are spot on and saved us weeks of due diligence.",
        pros: ["Accurate credibility scores", "Verified enterprise reviews", "Easy to use interface"],
        cons: [],
        videoUrl: "http://example.com/video1.mp4"
    },
    {
        id: "2",
        authorName: "Michael Ross",
        authorRole: "Product Manager",
        authorCompany: "Innovate Inc",
        rating: 4,
        date: "Jan 08, 2026",
        verified: true,
        content: "Great platform for finding specific startup tools. I wish there were more detailed comparisons for niche industries, but overall very solid.",
        pros: ["Good search filters", "verified badges add trust"],
        cons: ["Niche categories need more content", "Mobile view could be improved"]
    },
    {
        id: "3",
        authorName: "Jessica Lee",
        authorRole: "Founder",
        authorCompany: "StartUp Zen",
        rating: 5,
        date: "Jan 05, 2026",
        verified: false,
        content: "We launched our product here and the feedback loop was incredible. The enterprise matchmaking feature is a game changer for Series A startups.",
        pros: ["Enterprise matchmaking", "Community feedback"],
        cons: ["Onboarding was a bit long"]
    }
]

export function ReviewList() {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [ratingFilter, setRatingFilter] = React.useState<number | null>(null)

    const filteredReviews = DUMMY_REVIEWS.filter(review => {
        const matchesSearch = review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.authorName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRating = ratingFilter ? review.rating === ratingFilter : true
        return matchesSearch && matchesRating
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search reviews..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <Button
                        variant={ratingFilter === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRatingFilter(null)}
                    >
                        All
                    </Button>
                    {[5, 4, 3, 2, 1].map(star => (
                        <Button
                            key={star}
                            variant={ratingFilter === star ? "secondary" : "ghost"}
                            size="sm"
                            className="gap-1 px-2"
                            onClick={() => setRatingFilter(star === ratingFilter ? null : star)}
                        >
                            <span className="text-sm font-medium">{star}</span>
                            <StarRating rating={1} maxRating={1} readOnly size="sm" className="pointer-events-none" />
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        No reviews found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    )
}
