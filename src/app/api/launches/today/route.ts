import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Launch from '@/models/Launch';

// GET /api/launches/today - Get today's launches
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20');

        // Get start and end of today (UTC)
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(now);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const launches = await Launch.find({
            status: 'LIVE',
            launchedAt: { $gte: startOfDay, $lte: endOfDay }
        })
            .populate({
                path: 'productId',
                populate: { path: 'companyId', select: 'name slug logoUrl' }
            })
            .sort({ upvoteCount: -1, launchedAt: -1 })
            .limit(limit);

        return NextResponse.json({
            success: true,
            data: {
                date: startOfDay.toISOString().split('T')[0],
                count: launches.length,
                launches
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch today\'s launches' }, { status: 500 });
    }
}
