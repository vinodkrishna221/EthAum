'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UpvoteButton from './UpvoteButton';

interface LaunchCardProps {
    launch: {
        _id: string;
        title: string;
        tagline: string;
        media: { url: string }[];
        upvoteCount: number;
        commentCount: number;
        productId: {
            slug: string;
            logoUrl: string;
            tags: string[];
        };
    };
}

export default function LaunchCard({ launch }: LaunchCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex gap-4 items-start">
                <div className="flex-shrink-0">
                    {/* Simple colored box as placeholder logo */}
                    <div className="w-16 h-16 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                        {launch.title[0]}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <Link href={`/launches/${launch._id}`} className="hover:underline">
                        <h3 className="text-lg font-bold truncate">{launch.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 truncate mb-2">{launch.tagline}</p>
                    <div className="flex gap-2">
                        {launch.productId.tags?.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                <UpvoteButton
                    launchId={launch._id}
                    initialCount={launch.upvoteCount}
                />
            </CardContent>
        </Card>
    );
}
