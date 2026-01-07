import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Company from '@/models/Company';
import Launch from '@/models/Launch';

// GET /api/search - Unified search across products, companies, and launches
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q');
        const type = searchParams.get('type'); // 'products', 'companies', 'launches', or 'all'
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!q || q.trim().length < 2) {
            return NextResponse.json({
                success: false,
                error: 'Query must be at least 2 characters'
            }, { status: 400 });
        }

        const searchRegex = new RegExp(q, 'i');
        const results: any = {};

        // Search Products
        if (!type || type === 'all' || type === 'products') {
            const products = await Product.find({
                $or: [
                    { name: searchRegex },
                    { tagline: searchRegex },
                    { description: searchRegex },
                    { tags: { $in: [searchRegex] } }
                ]
            })
                .populate('companyId', 'name slug')
                .limit(limit)
                .select('name slug tagline logoUrl tags');

            results.products = products;
        }

        // Search Companies
        if (!type || type === 'all' || type === 'companies') {
            const companies = await Company.find({
                $or: [
                    { name: searchRegex },
                    { tagline: searchRegex },
                    { description: searchRegex }
                ]
            })
                .limit(limit)
                .select('name slug tagline logoUrl verified');

            results.companies = companies;
        }

        // Search Launches
        if (!type || type === 'all' || type === 'launches') {
            const launches = await Launch.find({
                status: 'LIVE',
                $or: [
                    { title: searchRegex },
                    { tagline: searchRegex },
                    { description: searchRegex }
                ]
            })
                .populate('productId', 'name slug')
                .limit(limit)
                .select('title tagline upvoteCount productId');

            results.launches = launches;
        }

        // Count total results
        const totalCount =
            (results.products?.length || 0) +
            (results.companies?.length || 0) +
            (results.launches?.length || 0);

        return NextResponse.json({
            success: true,
            data: {
                query: q,
                totalCount,
                ...results
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
    }
}
