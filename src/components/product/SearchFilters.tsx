'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/lib/hooks'; // Assuming hooks lib exists or I'll define debounce locally

export default function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [term, setTerm] = useState(searchParams.get('q') || '');

    // Simple debounce effect
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (term) {
                params.set('q', term);
            } else {
                params.delete('q');
            }
            router.push(`?${params.toString()}`);
        }, 500);

        return () => clearTimeout(handler);
    }, [term, router, searchParams]);

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                    placeholder="Search products, tags, or companies..."
                    className="pl-9"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                />
            </div>
            <div className="w-full md:w-48">
                <Select defaultValue={searchParams.get('sort') || 'newest'} onValueChange={handleSortChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
