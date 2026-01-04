'use client';

import { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import Link from 'next/link';

export function NotificationBell() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-500">
                            No notifications yet.
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notification.read ? 'bg-slate-50/50 dark:bg-slate-800/20' : ''}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!notification.read ? 'bg-indigo-500' : 'bg-transparent'}`} />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {new Date(notification.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <Link href="/dashboard/notifications" className="text-xs text-slate-500 hover:text-indigo-600">
                        View all properties
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
