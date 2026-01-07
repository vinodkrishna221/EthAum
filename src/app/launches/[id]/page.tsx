import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Launch from '@/models/Launch';
import UpvoteButton from '@/components/launch/UpvoteButton';
import CommentSection from '@/components/launch/CommentSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink } from 'lucide-react';

async function getLaunch(id: string) {
    await dbConnect();
    try {
        const launch = await Launch.findById(id).populate({
            path: 'productId',
            populate: { path: 'companyId' }
        });
        return launch ? JSON.parse(JSON.stringify(launch)) : null;
    } catch (e) {
        return null;
    }
}

export default async function LaunchDetailPage({ params }: { params: { id: string } }) {
    const launch = await getLaunch(params.id);

    if (!launch) return notFound();

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <Link href="/launches" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Launches
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex gap-6 items-start">
                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-3xl font-bold text-gray-300">
                            {launch.productId.name[0]}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{launch.title}</h1>
                            <p className="text-xl text-gray-600 mt-2">{launch.tagline}</p>
                        </div>
                    </div>

                    {/* Media Gallery (Placeholder) */}
                    <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center text-white">
                        {launch.media?.[0]?.url ? (
                            <img src={launch.media[0].url} alt={launch.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <div className="text-center">
                                <p className="text-2xl font-semibold">Media Gallery</p>
                                <p className="text-sm opacity-70">No media uploaded</p>
                            </div>
                        )}
                    </div>

                    <div className="prose max-w-none">
                        <h3 className="text-xl font-semibold mb-4">About this launch</h3>
                        <p className="whitespace-pre-wrap text-gray-700">{launch.description || "No description provided."}</p>
                    </div>

                    <CommentSection launchId={launch._id} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="sticky top-8">
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1">
                                <UpvoteButton
                                    launchId={launch._id}
                                    initialCount={launch.upvoteCount}
                                />
                            </div>
                            <Button className="flex-1 h-14" variant="outline" asChild>
                                <a href={launch.productId.websiteUrl || '#'} target="_blank" rel="noopener noreferrer">
                                    Visit Website <ExternalLink className="ml-2 w-4 h-4" />
                                </a>
                            </Button>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 border shadow-sm">
                            <h4 className="font-semibold text-sm uppercase text-gray-500 mb-4">Maker</h4>
                            <Link href={`/companies/${launch.productId.companyId.slug}`} className="flex items-center gap-3 hover:opacity-80">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border font-bold">
                                    {launch.productId.companyId.name[0]}
                                </div>
                                <div>
                                    <p className="font-semibold">{launch.productId.companyId.name}</p>
                                    <p className="text-xs text-gray-500">View Profile</p>
                                </div>
                            </Link>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-semibold text-sm uppercase text-gray-500 mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {launch.productId.tags?.map((tag: string) => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
