import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const categories = await Category.find({ parentId: null })
            .sort({ sortOrder: 1, name: 1 });

        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const category = await Category.create(body);
        return NextResponse.json({ success: true, data: category });
    } catch (e) {
        return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
    }
}
