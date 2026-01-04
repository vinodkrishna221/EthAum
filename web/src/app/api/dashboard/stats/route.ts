import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Mock aggregated dashboard stats
    const stats = {
        totalPilots: 5,
        activeInquiries: 12,
        totalViews: 1240,
        conversionRate: "2.4%",
        revenuePotential: 12450
    };

    return NextResponse.json(stats);
}
