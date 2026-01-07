import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Launch from '@/models/Launch';
import Product from '@/models/Product';

// GET /api/launches - List launches with filters
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');
        const featured = searchParams.get('featured') === 'true';
        const status = searchParams.get('status') || 'LIVE';
        const limit = parseInt(searchParams.get('limit') || '50');

        const query: any = { status };

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            query.launchedAt = { $gte: startOfDay, $lte: endOfDay };
        }

        if (featured) {
            query.featured = true;
        }

        const launches = await Launch.find(query)
            .populate({
                path: 'productId',
                populate: { path: 'companyId', select: 'name slug logoUrl' }
            })
            .sort({ upvoteCount: -1, launchedAt: -1 })
            .limit(limit);

        return NextResponse.json({ success: true, data: launches });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch launches' }, { status: 500 });
    }
}

// POST /api/launches - Create a new launch
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        if (!body.productId || !body.title || !body.tagline) {
            return NextResponse.json({ success: false, error: 'productId, title, and tagline are required' }, { status: 400 });
        }

        // Verify product exists
        const product = await Product.findById(body.productId);
        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        const launch = await Launch.create({
            ...body,
            status: body.status || 'DRAFT'
        });

        return NextResponse.json({ success: true, data: launch }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create launch' }, { status: 500 });
    }
}
