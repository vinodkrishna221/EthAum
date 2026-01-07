import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Company from '@/models/Company';

// GET /api/products - List products with search/filter
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get('companyId');
        const q = searchParams.get('q');
        const sort = searchParams.get('sort') || 'newest';
        const limit = parseInt(searchParams.get('limit') || '20');

        const query: any = {};

        if (companyId) {
            query.companyId = companyId;
        }

        if (q) {
            const searchRegex = new RegExp(q, 'i');
            query.$or = [
                { name: searchRegex },
                { tagline: searchRegex },
                { description: searchRegex },
                { tags: { $in: [searchRegex] } }
            ];
        }

        let sortOptions: any = { createdAt: -1 };
        if (sort === 'oldest') sortOptions = { createdAt: 1 };
        if (sort === 'name') sortOptions = { name: 1 };

        const products = await Product.find(query)
            .populate('companyId', 'name slug logoUrl')
            .sort(sortOptions)
            .limit(limit);

        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST /api/products - Create a new product
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        if (!body.name || !body.slug || !body.companyId) {
            return NextResponse.json({ success: false, error: 'Name, slug, and companyId are required' }, { status: 400 });
        }

        // Check company exists
        const company = await Company.findById(body.companyId);
        if (!company) {
            return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 });
        }

        // Check for duplicate slug
        const existing = await Product.findOne({ slug: body.slug });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });
        }

        const product = await Product.create(body);
        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
    }
}
