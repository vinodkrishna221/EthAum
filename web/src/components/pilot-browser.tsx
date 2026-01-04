'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PilotCard } from '@/components/pilot-card';

// Define categories based on mock data + some extras
const CATEGORIES = ['All', 'Analytics', 'Security', 'HR', 'Marketing', 'DevOps', 'Sales'];

interface PilotBrowserProps {
    pilots: any[]; // Using any for brevity since type is implicitly defined in data
}

export function PilotBrowser({ pilots }: PilotBrowserProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredPilots = pilots.filter(pilot => {
        const matchesSearch =
            pilot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pilot.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pilot.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Mock category logic since data doesn't have explicit category field yet
        // In real app, check pilot.category === selectedCategory
        const matchesCategory = selectedCategory === 'All' ||
            pilot.title.includes(selectedCategory) ||
            pilot.description.includes(selectedCategory);

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search pilots, companies, or keywords..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {CATEGORIES.map(cat => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(cat)}
                            className={`rounded-full whitespace-nowrap ${selectedCategory === cat
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    : 'border-slate-300 dark:border-slate-700'
                                }`}
                            size="sm"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filteredPilots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPilots.map((pilot) => (
                        <PilotCard
                            key={pilot.id}
                            {...pilot}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    <Filter className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No pilots found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
}
