import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Launch from '@/models/Launch';
import Upvote from '@/models/Upvote';

// POST /api/launches/[id]/upvote - Toggle upvote (add if not exists, remove if exists)
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();
    const launchId = params.id;

    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
        }

        // Check if already upvoted
        const existingUpvote = await Upvote.findOne({ launchId, userId });

        if (existingUpvote) {
            // Remove upvote (toggle off)
            await Upvote.findByIdAndDelete(existingUpvote._id);
            await Launch.findByIdAndUpdate(launchId, { $inc: { upvoteCount: -1 } });
            return NextResponse.json({ success: true, data: { upvoted: false, action: 'removed' } });
        } else {
            // Add upvote (toggle on)
            await Upvote.create({ launchId, userId });
            await Launch.findByIdAndUpdate(launchId, { $inc: { upvoteCount: 1 } });
            return NextResponse.json({ success: true, data: { upvoted: true, action: 'added' } }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to toggle upvote' }, { status: 500 });
    }
}

// DELETE /api/launches/[id]/upvote - Explicitly remove upvote
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();
    const launchId = params.id;

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
        }

        const deleted = await Upvote.findOneAndDelete({ launchId, userId });

        if (deleted) {
            await Launch.findByIdAndUpdate(launchId, { $inc: { upvoteCount: -1 } });
            return NextResponse.json({ success: true, data: { upvoted: false } });
        }

        return NextResponse.json({ success: false, error: 'Upvote not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to remove upvote' }, { status: 500 });
    }
}

// GET /api/launches/[id]/upvote - Check if user has upvoted
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();
    const launchId = params.id;

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
        }

        const upvote = await Upvote.findOne({ launchId, userId });
        return NextResponse.json({ success: true, data: { upvoted: !!upvote } });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to check upvote status' }, { status: 500 });
    }
}
