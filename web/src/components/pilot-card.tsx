import Link from 'next/link';
import { Check, User, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PilotCardProps {
    id: string;
    title: string;
    companyName: string;
    price: number;
    originalPrice: number;
    description: string;
    features: string[];
    spotsRemaining: number;
    logoUrl?: string;
}

export function PilotCard({
    id,
    title,
    companyName,
    price,
    originalPrice,
    description,
    features,
    spotsRemaining,
    logoUrl
}: PilotCardProps) {
    const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);

    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl shrink-0">
                            {logoUrl ? <img src={logoUrl} alt={companyName} className="w-full h-full object-cover rounded-lg" /> : companyName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 leading-tight line-clamp-1">{title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{companyName}</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border-none">
                        {discountPercentage}% OFF
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
                <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">${price}</span>
                        <span className="text-sm text-slate-400 line-through">${originalPrice}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{description}</p>
                </div>

                <ul className="space-y-2">
                    {features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="pt-0 flex flex-col gap-3">
                <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{spotsRemaining} spots left</span>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Enterprise Trial</span>
                </div>

                <Link href={`/pilots/${id}`} className="w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none group">
                        Request Access
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
