import { Activity, MessageSquare, Zap, Star, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ACTIVITIES = [
    {
        id: 1,
        icon: UserPlus,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        text: "New pilot inquiry from Sarah Smith",
        time: "2 hours ago"
    },
    {
        id: 2,
        icon: Activity,
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        text: "Your pilot 'Cloud Security Audit' is trending",
        time: "5 hours ago"
    },
    {
        id: 3,
        icon: MessageSquare,
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/20",
        text: "New comment on your launch",
        time: "1 day ago"
    },
    {
        id: 4,
        icon: Star,
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-900/20",
        text: "Received a 5-star review from TechCorp",
        time: "Yesterday"
    },
    {
        id: 5,
        icon: Zap,
        color: "text-indigo-500",
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
        text: "Pilot 'HR Automation' reached 100 views",
        time: "2 days ago"
    },
];

export function ActivityFeed() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>
                    Recent updates and notifications.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {ACTIVITIES.map((item) => (
                        <div key={item.id} className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${item.bg} shrink-0`}>
                                <item.icon className={`h-4 w-4 ${item.color}`} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.text}</p>
                                <p className="text-xs text-slate-500">{item.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
