export interface Inquiry {
    id: string;
    pilotId: string;
    pilotTitle: string;
    applicantName: string;
    applicantEmail: string;
    company: string;
    role: string;
    teamSize?: string;
    website?: string;
    useCase: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
}

export const MOCK_INQUIRIES: Inquiry[] = [
    {
        id: 'inq-1',
        pilotId: '1',
        pilotTitle: '30-Day Enterprise Access',
        applicantName: 'Sarah Smith',
        applicantEmail: 'sarah@techcorp.com',
        company: 'TechCorp Inc.',
        role: 'CTO',
        teamSize: '50-100',
        website: 'https://techcorp.com',
        useCase: 'We need advanced analytics for our customer data platform with 100k+ daily active users.',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000) // 2 hours ago
    },
    {
        id: 'inq-2',
        pilotId: '1',
        pilotTitle: '30-Day Enterprise Access',
        applicantName: 'Mike Johnson',
        applicantEmail: 'mike@startup.io',
        company: 'Startup.io',
        role: 'Product Manager',
        teamSize: '10-50',
        useCase: 'Looking to improve our predictive models for user churn.',
        status: 'accepted',
        createdAt: new Date(Date.now() - 5 * 3600 * 1000) // 5 hours ago
    },
    {
        id: 'inq-3',
        pilotId: '2',
        pilotTitle: 'Cloud Security Audit',
        applicantName: 'Alex Chen',
        applicantEmail: 'alex@global.net',
        company: 'Global Networks',
        role: 'Head of Security',
        teamSize: '100-500',
        website: 'https://global.net',
        useCase: 'Need comprehensive security audit before our Series B round.',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 86400 * 1000) // 1 day ago
    },
    {
        id: 'inq-4',
        pilotId: '3',
        pilotTitle: 'HR Automation Suite',
        applicantName: 'Emily Brown',
        applicantEmail: 'emily@hrtech.co',
        company: 'HR Tech Solutions',
        role: 'VP Operations',
        teamSize: '50-100',
        useCase: 'Automate onboarding for 30+ new hires per month.',
        status: 'accepted',
        createdAt: new Date(Date.now() - 2 * 86400 * 1000) // 2 days ago
    },
    {
        id: 'inq-5',
        pilotId: '5',
        pilotTitle: 'DevOps Pipeline Optimizer',
        applicantName: 'David Lee',
        applicantEmail: 'david@devops.com',
        company: 'DevOps Alliance',
        role: 'Engineering Lead',
        teamSize: '20-50',
        useCase: 'Our CI/CD pipelines take 45+ minutes. Need optimization.',
        status: 'rejected',
        createdAt: new Date(Date.now() - 3 * 86400 * 1000) // 3 days ago
    },
    {
        id: 'inq-6',
        pilotId: '4',
        pilotTitle: 'Marketing Content AI',
        applicantName: 'Jessica Lane',
        applicantEmail: 'jessica@contentco.com',
        company: 'Content Co',
        role: 'Marketing Director',
        teamSize: '10-20',
        useCase: 'Generate weekly blog content and social posts for B2B SaaS.',
        status: 'pending',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000) // 4 hours ago
    },
];

export interface Notification {
    id: string;
    type: 'inquiry' | 'message' | 'alert' | 'success';
    title: string;
    message: string;
    time: Date;
    read: boolean;
    actionUrl?: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        type: 'inquiry',
        title: 'New Pilot Inquiry',
        message: 'Sarah Smith requested access to "30-Day Enterprise Access"',
        time: new Date(Date.now() - 2 * 3600 * 1000),
        read: false,
        actionUrl: '/dashboard/inquiries'
    },
    {
        id: 'notif-2',
        type: 'message',
        title: 'New Message',
        message: 'Mike Johnson sent you a message about the pilot',
        time: new Date(Date.now() - 4 * 3600 * 1000),
        read: false
    },
    {
        id: 'notif-3',
        type: 'alert',
        title: 'Pilot Expiring Soon',
        message: 'Your "HR Automation Suite" pilot expires in 3 days',
        time: new Date(Date.now() - 1 * 86400 * 1000),
        read: true
    },
    {
        id: 'notif-4',
        type: 'success',
        title: 'Inquiry Accepted',
        message: 'You accepted an inquiry from Emily Brown',
        time: new Date(Date.now() - 2 * 86400 * 1000),
        read: true
    },
];
