"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoUpload } from "@/components/video/VideoUpload"
import { StarRating } from "@/components/ui/star-rating"
import { Plus, Minus, Send } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReviewForm() {
    const [rating, setRating] = React.useState(0)
    const [pros, setPros] = React.useState<string[]>([""])
    const [cons, setCons] = React.useState<string[]>([""])
    const [video, setVideo] = React.useState<File | null>(null)

    const handleAddField = (setter: React.Dispatch<React.SetStateAction<string[]>>, formatted: string[]) => {
        setter([...formatted, ""])
    }

    const handleRemoveField = (setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[], index: number) => {
        const newFields = [...current]
        newFields.splice(index, 1)
        setter(newFields)
    }

    const handleFieldChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[], index: number, value: string) => {
        const newFields = [...current]
        newFields[index] = value
        setter(newFields)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, this would send data to the backend
        alert("Review submitted! (Simulation)")
        console.log({ rating, pros, cons, videoField: video ? video.name : "No Video" })
    }

    return (
        <Card className="max-w-2xl w-full mx-auto">
            <CardHeader>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>Share your experience with the community. Your insights help others make better decisions.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    {/* Rating Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Overall Rating</label>
                        <div className="flex items-center gap-2">
                            <StarRating
                                rating={rating}
                                size="lg"
                                onRatingChange={setRating}
                            />
                            <span className="ml-2 text-sm text-muted-foreground font-medium pt-1">
                                {rating ? `${rating} out of 5` : "Select a rating"}
                            </span>
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Your Review</label>
                        <Textarea placeholder="What did you like or dislike? What problems did it solve for you?" className="min-h-[120px]" required />
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-green-600">Pros</label>
                            {pros.map((pro, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="What stood out?"
                                        value={pro}
                                        onChange={(e) => handleFieldChange(setPros, pros, index, e.target.value)}
                                    />
                                    {pros.length > 1 && (
                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveField(setPros, pros, index)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" className="w-full border-dashed" onClick={() => handleAddField(setPros, pros)}>
                                <Plus className="h-4 w-4 mr-2" /> Add Pro
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-red-600">Cons</label>
                            {cons.map((con, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="What could be improved?"
                                        value={con}
                                        onChange={(e) => handleFieldChange(setCons, cons, index, e.target.value)}
                                    />
                                    {cons.length > 1 && (
                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveField(setCons, cons, index)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" className="w-full border-dashed" onClick={() => handleAddField(setCons, cons)}>
                                <Plus className="h-4 w-4 mr-2" /> Add Con
                            </Button>
                        </div>
                    </div>

                    {/* Video Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Video Testimonial (Optional)</label>
                        <CardDescription className="mb-2">Add a personal touch with a short video.</CardDescription>
                        <VideoUpload onVideoSelected={setVideo} />
                    </div>

                </CardContent>
                <CardFooter className="flex justify-end gap-2 bg-muted/20 p-6 border-t">
                    <Button variant="outline" type="button">Cancel</Button>
                    <Button type="submit" disabled={rating === 0}>
                        <Send className="mr-2 h-4 w-4" /> Submit Review
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
