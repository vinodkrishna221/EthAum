import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const pilotId = params.id;

        // Logic to create Inquiry
        // await prisma.pilotInquiry.create({ ... })

        // Logic to create Notification for the Startup Owner
        // await prisma.notification.create({ ... })

        return NextResponse.json({ success: true, message: 'Inquiry submitted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
    }
}
