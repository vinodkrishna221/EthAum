'use client';

import Link from 'next/link';
import { MoreHorizontal, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PILOTS } from '@/lib/data'; // Use mock data

export default function MyPilotsPage() {
    // For demo purposes, we'll use same pilots but simulate different statuses
    const myPilots = PILOTS.slice(0, 3).map((p, i) => ({
        ...p,
        status: i === 0 ? 'Active' : i === 1 ? 'Pending' : 'Draft',
        inquiries: i === 0 ? 12 : i === 1 ? 5 : 0,
        views: i === 0 ? 340 : i === 1 ? 120 : 45,
        createDate: new Date(Date.now() - (i + 1) * 86400000 * 5).toLocaleDateString()
    }));

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Pilots</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your pilot offerings and track performance.</p>
                </div>
                <Link href="/pilots/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Create Pilot
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Pilots</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <Input placeholder="Search pilots..." className="pl-8 w-[250px]" />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pilot Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Inquiries</TableHead>
                                <TableHead>Views</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myPilots.map((pilot) => (
                                <TableRow key={pilot.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 dark:text-white font-semibold">{pilot.title}</span>
                                            <span className="text-xs text-slate-500 truncate max-w-[200px]">{pilot.shortDescription || pilot.description.substring(0, 50)}...</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={pilot.status === 'Active' ? 'default' : pilot.status === 'Pending' ? 'secondary' : 'outline'}
                                            className={
                                                pilot.status === 'Active' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none' :
                                                    pilot.status === 'Pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-none' :
                                                        'text-slate-500'
                                            }
                                        >
                                            {pilot.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${pilot.price}</TableCell>
                                    <TableCell>{pilot.inquiries}</TableCell>
                                    <TableCell>{pilot.views}</TableCell>
                                    <TableCell>{pilot.createDate}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText("pilot-id")}>
                                                    Copy Pilot ID
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Pilot</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                    Delete Pilot
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
