import { NextResponse } from 'next/server';
import { PILOTS } from '@/lib/data';

// Helper for 'Basic Matchmaking' (P2)
// Recommend pilots based on a user's industry or previous views
// For now, simpler implementation: recommend pilots in same category
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'General';

    // Mock recommendation logic
    // In real app, we would use vector search or simple tag matching

    // Just return random 3 pilots as "Recommended" for now
    const recommendations = PILOTS.slice(0, 3);

    return NextResponse.json({
        recommended: recommendations,
        reason: `Based on your interest in ${category}`
    });
}
