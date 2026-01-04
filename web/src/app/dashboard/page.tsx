import Link from 'next/link';
import {
    Users,
    ArrowUpRight,
    CreditCard,
    Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OverviewChart, EngagementChart } from '@/components/analytics-charts';
import { ActivityFeed } from '@/components/activity-feed';
import { Zap } from 'lucide-react'; // Re-import Zap as it was removed from import list but used below

export default function DashboardPage() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
                    <p className="text-slate-500 dark:text-slate-400">Overview of your pilots, launches, and engagement.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/pilots/new">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                            <Zap className="mr-2 h-4 w-4" /> Create New Pilot
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pilots</CardTitle>
                        <Zap className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-slate-500">+1 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Inquiries</CardTitle>
                        <Users className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-slate-500">+3 new today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.2k</div>
                        <p className="text-xs text-slate-500">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
                        <CreditCard className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,450</div>
                        <p className="text-xs text-slate-500">From accepted pilots</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Engagement Overview</CardTitle>
                        <CardDescription>
                            Views and Inquiries over the last 6 months.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <EngagementChart />
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Upvotes Trend</CardTitle>
                        <CardDescription>
                            Monthly upvotes on your launches.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Inquiries */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Inquiries</CardTitle>
                        <CardDescription>
                            Latest requests for access to your pilots.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {[
                                { name: "Sarah Smith", email: "sarah@techcorp.com", pilot: "30-Day Enterprise Access", time: "2 hours ago" },
                                { name: "Mike Johnson", email: "mike@startup.io", pilot: "Cloud Security Audit", time: "5 hours ago" },
                                { name: "Alex Chen", email: "alex@global.net", pilot: "HR Automation Suite", time: "1 day ago" },
                                { name: "Emily Brown", email: "emily@devops.co", pilot: "DevOps Pipeline Optimizer", time: "2 days ago" },
                            ].map((inquiry, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mr-4">
                                        {inquiry.name.charAt(0)}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{inquiry.name}</p>
                                        <p className="text-sm text-slate-500">{inquiry.email}</p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <div className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[150px]">{inquiry.pilot}</div>
                                        <div className="text-xs text-slate-500">{inquiry.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Activity / Notifications */}
                <ActivityFeed />
            </div>
        </div>
    );
}
