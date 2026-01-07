'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface UpvoteButtonProps {
    launchId: string;
    initialCount: number;
    initialUpvoted?: boolean;
}

export default function UpvoteButton({ launchId, initialCount, initialUpvoted = false }: UpvoteButtonProps) {
    const [count, setCount] = useState(initialCount);
    const [isUpvoted, setIsUpvoted] = useState(initialUpvoted);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpvote = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a link
        if (isLoading) return;

        // Optimistic update
        const newUpvotedState = !isUpvoted;
        setIsUpvoted(newUpvotedState);
        setCount(prev => newUpvotedState ? prev + 1 : prev - 1);
        setIsLoading(true);

        try {
            const res = await fetch(`/api/launches/${launchId}/upvote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'demo-user-id' }) // Replace with real auth
            });

            if (!res.ok) throw new Error('Failed to upvote');
        } catch (error) {
            // Revert on failure
            setIsUpvoted(!newUpvotedState);
            setCount(prev => !newUpvotedState ? prev + 1 : prev - 1);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className={cn(
                "flex flex-col items-center justify-center h-14 w-12 rounded-lg border-2 transition-all p-1 gap-0",
                isUpvoted
                    ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
            )}
            onClick={handleUpvote}
        >
            <ArrowUp className={cn("w-4 h-4 mb-1", isUpvoted && "animate-bounce")} />
            <span className="font-bold text-xs">
                {count}
            </span>
        </Button>
    );
}
