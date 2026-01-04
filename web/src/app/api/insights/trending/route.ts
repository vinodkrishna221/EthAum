import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '5');

    // Mock logic to return trending items
    const trending = [
        { id: '1', title: 'Generative AI Writer', growth: '+120%' },
        { id: '2', title: 'CyberSec Shield', growth: '+85%' },
        { id: '3', title: 'DevOps Flow', growth: '+60%' },
    ];

    return NextResponse.json(trending.slice(0, limit));
}
