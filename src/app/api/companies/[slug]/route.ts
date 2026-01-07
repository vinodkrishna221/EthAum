import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';
import Product from '@/models/Product';

// GET /api/companies/[slug] - Get company by slug
export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    await dbConnect();

    try {
        const company = await Company.findOne({ slug: params.slug })
            .populate('categoryId', 'name slug');

        if (!company) {
            return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 });
        }

        // Also fetch products for this company
        const products = await Product.find({ companyId: company._id });

        return NextResponse.json({
            success: true,
            data: { ...company.toObject(), products }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch company' }, { status: 500 });
    }
}

// PUT /api/companies/[slug] - Update company
export async function PUT(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    await dbConnect();

    try {
        const body = await req.json();

        const company = await Company.findOneAndUpdate(
            { slug: params.slug },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!company) {
            return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: company });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update company' }, { status: 500 });
    }
}

// DELETE /api/companies/[slug] - Delete company
export async function DELETE(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    await dbConnect();

    try {
        const company = await Company.findOneAndDelete({ slug: params.slug });

        if (!company) {
            return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 });
        }

        // Optionally: Delete associated products, launches, etc.
        await Product.deleteMany({ companyId: company._id });

        return NextResponse.json({ success: true, data: { deleted: true } });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete company' }, { status: 500 });
    }
}
