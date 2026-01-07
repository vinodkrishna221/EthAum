import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

// GET /api/companies - List all companies
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const featured = searchParams.get('featured') === 'true';
        const verified = searchParams.get('verified') === 'true';
        const categoryId = searchParams.get('categoryId');
        const limit = parseInt(searchParams.get('limit') || '50');

        const query: any = {};
        if (featured) query.featured = true;
        if (verified) query.verified = true;
        if (categoryId) query.categoryId = categoryId;

        const companies = await Company.find(query)
            .populate('categoryId', 'name slug')
            .sort({ createdAt: -1 })
            .limit(limit);

        return NextResponse.json({ success: true, data: companies });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch companies' }, { status: 500 });
    }
}

// POST /api/companies - Create a new company
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        if (!body.name || !body.slug) {
            return NextResponse.json({ success: false, error: 'Name and slug are required' }, { status: 400 });
        }

        // Check for duplicate slug
        const existing = await Company.findOne({ slug: body.slug });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });
        }

        const company = await Company.create(body);
        return NextResponse.json({ success: true, data: company }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create company' }, { status: 500 });
    }
}
