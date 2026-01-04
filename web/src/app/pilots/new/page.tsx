'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Upload, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

// Helper component for dynamic lists (Features, Requirements, etc.)
const DynamicList = ({
    items,
    onAdd,
    onRemove,
    placeholder,
    label
}: {
    items: string[],
    onAdd: (val: string) => void,
    onRemove: (idx: number) => void,
    placeholder: string,
    label: string
}) => {
    const [newItem, setNewItem] = useState('');

    const handleAdd = () => {
        if (newItem.trim()) {
            onAdd(newItem.trim());
            setNewItem('');
        }
    };

    return (
        <div className="space-y-3">
            <Label>{label}</Label>
            <div className="space-y-2">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                        <span className="flex-1 text-sm">{item}</span>
                        <button
                            type="button"
                            onClick={() => onRemove(idx)}
                            className="text-slate-400 hover:text-red-500"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                />
                <Button type="button" onClick={handleAdd} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default function CreatePilotPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [features, setFeatures] = useState<string[]>([]);
    const [requirements, setRequirements] = useState<string[]>([]);
    const [deliverables, setDeliverables] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert('Pilot created successfully! (Mock)');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/pilots" className="text-slate-500 hover:text-indigo-600">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Create New Pilot</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Save Draft</Button>
                        <Button onClick={handleSubmit} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            {isLoading ? 'Publishing...' : 'Publish Pilot'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pilot Details</CardTitle>
                                <CardDescription>Basic information about your pilot offering.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Pilot Title</Label>
                                    <Input id="title" placeholder="e.g. 30-Day Enterprise Access" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shortDesc">Short Description</Label>
                                    <Textarea id="shortDesc" placeholder="Brief summary for cards (1-2 lines)" className="h-20" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fullDesc">Full Description</Label>
                                    <Textarea id="fullDesc" placeholder="Detailed explanation of the pilot..." className="h-40" required />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Offerings & Requirements</CardTitle>
                                <CardDescription>Define what's included and what's needed.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <DynamicList
                                    label="Key Features"
                                    items={features}
                                    placeholder="Add a feature..."
                                    onAdd={i => setFeatures([...features, i])}
                                    onRemove={i => setFeatures(features.filter((_, idx) => idx !== i))}
                                />
                                <DynamicList
                                    label="Requirements"
                                    items={requirements}
                                    placeholder="Add a requirement..."
                                    onAdd={i => setRequirements([...requirements, i])}
                                    onRemove={i => setRequirements(requirements.filter((_, idx) => idx !== i))}
                                />
                                <DynamicList
                                    label="Deliverables"
                                    items={deliverables}
                                    placeholder="Add a deliverable..."
                                    onAdd={i => setDeliverables([...deliverables, i])}
                                    onRemove={i => setDeliverables(deliverables.filter((_, idx) => idx !== i))}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar / Settings */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing & Availability</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Deal Price ($)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input type="number" placeholder="499" className="pl-9" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Original Price ($)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input type="number" placeholder="2500" className="pl-9" required />
                                    </div>
                                    <p className="text-xs text-slate-500">Shows the discount percentage.</p>
                                </div>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="space-y-2">
                                        <Label>Total Spots Available</Label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input type="number" placeholder="e.g. 5" className="pl-9" required />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Media</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Upload Logo or Banner</div>
                                    <div className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </form>
            </div>
        </div>
    );
}
