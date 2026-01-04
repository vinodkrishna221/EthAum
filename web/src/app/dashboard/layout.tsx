import Link from 'next/link';
import { LayoutDashboard, Rocket, Zap, Star, Settings, LogOut, Users } from 'lucide-react';
import { NotificationBell } from '@/components/notification-bell';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 fixed h-full hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        EthAum.ai
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Overview</span>
                    </Link>
                    <Link href="/dashboard/inquiries" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Inquiries</span>
                    </Link>
                    <Link href="/dashboard/pilots" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                        <Zap className="w-5 h-5" />
                        <span className="font-medium">My Pilots</span>
                    </Link>
                    <Link href="/dashboard/launches" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                        <Rocket className="w-5 h-5" />
                        <span className="font-medium">Launches</span>
                    </Link>
                    <Link href="/dashboard/reviews" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                        <Star className="w-5 h-5" />
                        <span className="font-medium">Reviews</span>
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-slate-500 hover:text-red-600 rounded-md transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64">
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white capitalize">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                            JD
                        </div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}
