import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { inquiryId, action, message } = await request.json();

        if (!['accept', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // 1. Update Inquiry Status
        // await prisma.pilotInquiry.update({
        //    where: { id: inquiryId },
        //    data: { status: action === 'accept' ? 'accepted' : 'rejected', responseMessage: message }
        // })

        // 2. Send Email (Mocked here, but would use Resend/SendGrid)
        console.log(`Sending email to applicant: Status ${action}, Message: ${message}`);

        // 3. Create Notification for Applicant (if they are a user)

        return NextResponse.json({ success: true, status: action === 'accept' ? 'accepted' : 'rejected' });
    } catch (error) {
        return NextResponse.json({ error: 'Action failed' }, { status: 500 });
    }
}
