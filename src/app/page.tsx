import { Button } from "@/components/ui/button"
import { ProductReviews } from "@/components/reviews/ProductReviews"
import { LinkedInConnect } from "@/components/auth/LinkedInConnect"
import { VerificationBadge } from "@/components/ui/verification-badge"
import { Star } from "lucide-react"

export default function Home() {
    return (
        <main className="min-h-screen bg-background pb-20">

            {/* Hero / Header Placeholder */}
            <div className="bg-card border-b">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="h-24 w-24 bg-primary/10 rounded-xl flex items-center justify-center text-4xl font-bold text-primary">
                            A
                        </div>
                        <div className="space-y-2 flex-1">
                            <h1 className="text-3xl font-bold tracking-tight">Acme Analytics</h1>
                            <p className="text-lg text-muted-foreground">The all-in-one analytics platform for scaling startups.</p>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center text-yellow-500">
                                    <Star className="fill-current w-4 h-4" />
                                    <Star className="fill-current w-4 h-4" />
                                    <Star className="fill-current w-4 h-4" />
                                    <Star className="fill-current w-4 h-4" />
                                    <Star className="w-4 h-4 text-muted-foreground/30" />
                                    <span className="ml-2 text-foreground font-medium">4.2</span>
                                    <span className="ml-1 text-muted-foreground">(128 reviews)</span>
                                </div>
                                <span className="text-muted-foreground">•</span>
                                <span className="bg-secondary px-2 py-0.5 rounded text-secondary-foreground font-medium">Series B</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button size="lg">Get Pilot</Button>
                            <Button variant="outline" size="lg">Visit Website</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content - Reviews */}
                    <div className="lg:col-span-3 space-y-12">
                        <ProductReviews />
                    </div>

                    {/* Sidebar Placeholder (Now integrated into ProductReviews or moved below) */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t">
                        <div className="rounded-lg border bg-card p-6">
                            <h3 className="font-semibold mb-4">Verification Center</h3>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">Connect your accounts to build trust.</p>
                                <LinkedInConnect />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <VerificationBadge type="linkedin" />
                                    <VerificationBadge type="platform" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-6">
                            <h3 className="font-semibold mb-4">Similar Products</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-3 items-center">
                                        <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-xs font-bold">L</div>
                                        <div>
                                            <div className="text-sm font-medium">LogMaster {i}</div>
                                            <div className="text-xs text-muted-foreground">DevTools</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>            </div>
            </div>

        </div>
            </div >
        </main >
    )
}
