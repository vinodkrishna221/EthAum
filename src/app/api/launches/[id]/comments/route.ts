import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Launch from '@/models/Launch';

// GET /api/launches/[id]/comments - List comments for a launch
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();
    const launchId = params.id;

    try {
        const comments = await Comment.find({ launchId })
            .populate('userId', 'name image')
            .sort({ createdAt: -1 });

        // Build threaded structure
        const map: any = {};
        const roots: any[] = [];

        comments.forEach(c => {
            map[c._id.toString()] = { ...c.toObject(), replies: [] };
        });

        comments.forEach(c => {
            if (c.parentId) {
                const parentKey = c.parentId.toString();
                if (map[parentKey]) {
                    map[parentKey].replies.push(map[c._id.toString()]);
                }
            } else {
                roots.push(map[c._id.toString()]);
            }
        });

        return NextResponse.json({ success: true, data: roots });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
    }
}

// POST /api/launches/[id]/comments - Create a new comment
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();
    const launchId = params.id;

    try {
        const body = await req.json();
        const { userId, content, parentId } = body;

        if (!userId || !content) {
            return NextResponse.json({ success: false, error: 'userId and content are required' }, { status: 400 });
        }

        // Verify launch exists
        const launch = await Launch.findById(launchId);
        if (!launch) {
            return NextResponse.json({ success: false, error: 'Launch not found' }, { status: 404 });
        }

        const comment = await Comment.create({
            launchId,
            userId,
            content,
            parentId: parentId || null
        });

        // Increment comment count on launch
        await Launch.findByIdAndUpdate(launchId, { $inc: { commentCount: 1 } });

        // Populate user for response
        await comment.populate('userId', 'name image');

        return NextResponse.json({ success: true, data: comment }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create comment' }, { status: 500 });
    }
}

// PUT /api/launches/[id]/comments - Update a comment (requires commentId in body)
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const body = await req.json();
        const { commentId, content, userId } = body;

        if (!commentId || !content) {
            return NextResponse.json({ success: false, error: 'commentId and content are required' }, { status: 400 });
        }

        // Verify ownership (simplified - in production, use session)
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
        }

        if (comment.userId.toString() !== userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        comment.content = content;
        await comment.save();

        return NextResponse.json({ success: true, data: comment });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update comment' }, { status: 500 });
    }
}

// DELETE /api/launches/[id]/comments - Delete a comment
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();
    const launchId = params.id;

    try {
        const { searchParams } = new URL(req.url);
        const commentId = searchParams.get('commentId');
        const userId = searchParams.get('userId');

        if (!commentId) {
            return NextResponse.json({ success: false, error: 'commentId is required' }, { status: 400 });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
        }

        // Verify ownership (simplified)
        if (comment.userId.toString() !== userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        // Delete comment and all replies
        await Comment.deleteMany({
            $or: [
                { _id: commentId },
                { parentId: commentId }
            ]
        });

        // Decrement count (simplified - doesn't account for nested replies)
        await Launch.findByIdAndUpdate(launchId, { $inc: { commentCount: -1 } });

        return NextResponse.json({ success: true, data: { deleted: true } });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete comment' }, { status: 500 });
    }
}
