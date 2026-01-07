import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Launch from '@/models/Launch';
import Upvote from '@/models/Upvote';
import Comment from '@/models/Comment';

// GET /api/launches/[id] - Get launch by ID
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const launch = await Launch.findById(params.id)
            .populate({
                path: 'productId',
                populate: { path: 'companyId' }
            });

        if (!launch) {
            return NextResponse.json({ success: false, error: 'Launch not found' }, { status: 404 });
        }

        // Increment view count
        await Launch.findByIdAndUpdate(params.id, { $inc: { viewCount: 1 } });

        return NextResponse.json({ success: true, data: launch });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch launch' }, { status: 500 });
    }
}

// PUT /api/launches/[id] - Update launch
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const body = await req.json();

        const launch = await Launch.findByIdAndUpdate(
            params.id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!launch) {
            return NextResponse.json({ success: false, error: 'Launch not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: launch });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update launch' }, { status: 500 });
    }
}

// DELETE /api/launches/[id] - Delete launch
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const launch = await Launch.findByIdAndDelete(params.id);

        if (!launch) {
            return NextResponse.json({ success: false, error: 'Launch not found' }, { status: 404 });
        }

        // Cascade delete upvotes and comments
        await Upvote.deleteMany({ launchId: params.id });
        await Comment.deleteMany({ launchId: params.id });

        return NextResponse.json({ success: true, data: { deleted: true } });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete launch' }, { status: 500 });
    }
}
