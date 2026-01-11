import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "@/components/ui/star-rating"
import { CheckCircle, ThumbsUp, ThumbsDown, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Simplified for now

export interface Review {
    id: string
    authorName: string
    authorRole: string
    authorCompany: string
    rating: number
    date: string
    verified: boolean
    content: string
    pros: string[]
    cons: string[]
    videoUrl?: string
}

interface ReviewCardProps {
    review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row gap-4 items-start pb-2">
                {/* Placeholder Avatar */}
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {review.authorName.charAt(0)}
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{review.authorName}</h4>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{review.authorRole} at {review.authorCompany}</p>

                    <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} readOnly size="sm" />
                        {review.verified && (
                            <div className="flex items-center gap-1 text-green-600 text-[10px] font-medium px-1.5 py-0.5 bg-green-500/10 rounded-full">
                                <CheckCircle className="h-3 w-3" />
                                Verified User
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4 py-2">
                {review.videoUrl && (
                    <div className="relative aspect-video rounded-md bg-muted flex items-center justify-center overflow-hidden border">
                        {/* In a real app, this would be a thumbnail or video player */}
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white/90 gap-2 cursor-pointer hover:bg-black/40 transition-colors">
                            <PlayCircle className="h-12 w-12" />
                            <span className="text-sm font-medium">Watch Video Testimonial</span>
                        </div>
                    </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-line">{review.content}</p>

                {(review.pros.length > 0 || review.cons.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {review.pros.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-green-600">
                                    <ThumbsUp className="h-3.5 w-3.5" /> Pros
                                </div>
                                <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                                    {review.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                                </ul>
                            </div>
                        )}
                        {review.cons.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
                                    <ThumbsDown className="h-3.5 w-3.5" /> Cons
                                </div>
                                <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                                    {review.cons.map((con, i) => <li key={i}>{con}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
