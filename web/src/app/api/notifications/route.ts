import { NextResponse } from 'next/server';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data';

export async function GET(request: Request) {
    // In real app, fetch from DB based on logged-in user session
    // const session = await getSession();
    // const notifications = await prisma.notification.findMany({ where: { userId: session.user.id } });

    return NextResponse.json(MOCK_NOTIFICATIONS);
}
