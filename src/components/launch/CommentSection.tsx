'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
    _id: string;
    content: string;
    userId: {
        _id: string;
        name: string;
        image: string;
    };
    createdAt: string;
    children?: Comment[];
}

export default function CommentSection({ launchId }: { launchId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [launchId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/launches/${launchId}/comments`);
            const data = await res.json();
            if (data.success) {
                // Simple client-side threading logic
                const threads = buildCommentThreads(data.data);
                setComments(threads);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const buildCommentThreads = (flatComments: any[]) => {
        const map: any = {};
        const roots: Comment[] = [];

        flatComments.forEach(c => {
            map[c._id] = { ...c, children: [] };
        });

        flatComments.forEach(c => {
            if (c.parentId) {
                if (map[c.parentId]) {
                    map[c.parentId].children.push(map[c._id]);
                }
            } else {
                roots.push(map[c._id]);
            }
        });

        return roots;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/launches/${launchId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Hardcoded userId for MVP demo
                body: JSON.stringify({ userId: 'demo-user-id', content: newComment })
            });

            if (res.ok) {
                setNewComment('');
                fetchComments(); // Refresh list
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 mt-8">
            <h3 className="text-xl font-bold">Discussion</h3>

            <form onSubmit={handleSubmit} className="flex gap-4">
                <Avatar>
                    <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <div className="flex-1 gap-2 flex">
                    <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="What do you think of this launch?"
                    />
                    <Button type="submit" disabled={isLoading}>Post</Button>
                </div>
            </form>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <CommentItem key={comment._id} comment={comment} />
                ))}
            </div>
        </div>
    );
}

function CommentItem({ comment }: { comment: Comment }) {
    return (
        <div className="flex gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={comment.userId.image} />
                <AvatarFallback>{comment.userId.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{comment.userId.name || 'Anonymous user'}</span>
                    <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>

                {/* Actions like reply could be added here */}

                {comment.children && comment.children.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                        {comment.children.map(child => (
                            <CommentItem key={child._id} comment={child} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
