import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Launch from '@/models/Launch';

// GET /api/products/[slug] - Get product by slug
export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    await dbConnect();

    try {
        const product = await Product.findOne({ slug: params.slug })
            .populate('companyId', 'name slug logoUrl tagline');

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
    }
}

// PUT /api/products/[slug] - Update product
export async function PUT(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    await dbConnect();

    try {
        const body = await req.json();

        const product = await Product.findOneAndUpdate(
            { slug: params.slug },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE /api/products/[slug] - Delete product
export async function DELETE(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    await dbConnect();

    try {
        const product = await Product.findOneAndDelete({ slug: params.slug });

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        // Cascade delete: Remove associated launches
        await Launch.deleteMany({ productId: product._id });

        return NextResponse.json({ success: true, data: { deleted: true } });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
    }
}
