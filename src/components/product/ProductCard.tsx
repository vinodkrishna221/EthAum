'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        slug: string;
        tagline: string;
        logoUrl?: string;
        tags: string[];
        companyId: {
            name: string;
            slug: string;
        };
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="hover:shadow-md transition-all h-full flex flex-col">
            <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">
                        {product.logoUrl ? (
                            <img src={product.logoUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            product.name[0]
                        )}
                    </div>
                    <Link href={`/companies/${product.companyId.slug}`} className="text-xs text-gray-400 hover:text-primary truncate max-w-[100px]">
                        by {product.companyId.name}
                    </Link>
                </div>

                <Link href={`/products/${product.slug}`} className="hover:underline block mb-2">
                    <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                </Link>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                    {product.tagline}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {product.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
