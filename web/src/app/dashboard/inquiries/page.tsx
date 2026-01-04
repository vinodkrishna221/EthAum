'use client';

import { useState } from 'react';
import {
    Check,
    X,
    Mail,
    Globe,
    Briefcase,
    Building,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { MOCK_INQUIRIES, Inquiry } from '@/lib/mock-data';

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAction = (inquiry: Inquiry, type: 'accept' | 'reject') => {
        setSelectedInquiry(inquiry);
        setActionType(type);
        setResponseMessage(type === 'accept'
            ? `Hi ${inquiry.applicantName.split(' ')[0]},\n\nWe'd love to proceed with the pilot! Here are the next steps...`
            : `Hi ${inquiry.applicantName.split(' ')[0]},\n\nThank you for your interest. Unfortunately, at this time...`
        );
        setIsDialogOpen(true);
    };

    const submitAction = () => {
        if (!selectedInquiry || !actionType) return;

        setInquiries(inquiries.map(inq =>
            inq.id === selectedInquiry.id
                ? { ...inq, status: actionType === 'accept' ? 'accepted' : 'rejected' }
                : inq
        ));
        setIsDialogOpen(false);
        // In real app, would make API call here
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pilot Inquiries</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage incoming requests for your pilots.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Requests</CardTitle>
                    <CardDescription>Review and respond to enterprise pilot applications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Applicant</TableHead>
                                <TableHead>Pilot</TableHead>
                                <TableHead>Use Case</TableHead>
                                <TableHead>Use Case</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inquiries.map((inquiry) => (
                                <TableRow key={inquiry.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{inquiry.applicantName}</span>
                                            <span className="text-xs text-slate-500">{inquiry.company} • {inquiry.role}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[150px] truncate" title={inquiry.pilotTitle}>
                                        {inquiry.pilotTitle}
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate text-slate-500" title={inquiry.useCase}>
                                        {inquiry.useCase}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {inquiry.website && (
                                                <a href={inquiry.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600">
                                                    <Globe className="h-4 w-4" />
                                                </a>
                                            )}
                                            <a href={`mailto:${inquiry.applicantEmail}`} className="text-slate-400 hover:text-indigo-600">
                                                <Mail className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(inquiry.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            inquiry.status === 'accepted' ? 'default' :
                                                inquiry.status === 'rejected' ? 'destructive' : 'secondary'
                                        } className={
                                            inquiry.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none' :
                                                inquiry.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-100 border-none' :
                                                    'bg-amber-100 text-amber-800 hover:bg-amber-100 border-none'
                                        }>
                                            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {inquiry.status === 'pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                                    onClick={() => handleAction(inquiry, 'accept')}
                                                    title="Accept"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                    onClick={() => handleAction(inquiry, 'reject')}
                                                    title="Reject"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Email Applicant</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'accept' ? 'Accept Inquiry' : 'Reject Inquiry'}
                        </DialogTitle>
                        <DialogDescription>
                            Send a response to {selectedInquiry?.applicantName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                            className="min-h-[150px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={submitAction}
                            className={actionType === 'accept' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
                        >
                            {actionType === 'accept' ? 'Send & Accept' : 'Send & Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
