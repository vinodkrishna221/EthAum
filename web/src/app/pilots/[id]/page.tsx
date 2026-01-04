import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, Shield, Zap, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { notFound } from 'next/navigation';
import { PILOTS } from '@/lib/data';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PilotDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const pilot = PILOTS.find(p => p.id === resolvedParams.id);

    if (!pilot) {
        notFound();
    }

    const discountPercentage = Math.round(((pilot.originalPrice - pilot.price) / pilot.originalPrice) * 100);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 py-8">
                    <Link href="/pilots" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center mb-6 w-fit">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Pilots
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{pilot.title}</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-lg text-slate-600 dark:text-slate-400 font-medium">{pilot.companyName}</span>
                                <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">Verified Partner</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">About this Pilot</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            {pilot.description}
                        </p>

                        <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">What's Included</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {pilot.features.map((f, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Deliverables & Requirements</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" /> Deliverables
                                </h4>
                                <ul className="space-y-2">
                                    {pilot.deliverables.map((d, i) => (
                                        <li key={i} className="text-sm text-slate-600 dark:text-slate-400 pl-6 relative before:absolute before:left-2 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-slate-300">
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-indigo-500" /> Requirements
                                </h4>
                                <ul className="space-y-2">
                                    {pilot.requirements.map((r, i) => (
                                        <li key={i} className="text-sm text-slate-600 dark:text-slate-400 pl-6 relative before:absolute before:left-2 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-slate-300">
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <Card className="border-slate-200 shadow-lg overflow-hidden bg-white dark:bg-slate-800">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white text-center">
                                <div className="text-sm font-medium opacity-90 mb-1">Limited Time Offer</div>
                                <div className="text-4xl font-bold">${pilot.price}</div>
                                <div className="text-indigo-100 text-sm mt-1 line-through opacity-75">Normally ${pilot.originalPrice}</div>
                                <Badge className="mt-3 bg-white/20 hover:bg-white/30 text-white border-none">
                                    Save {discountPercentage}%
                                </Badge>
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span>30 Days Duration</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span className="text-emerald-600 font-medium">{pilot.spotsRemaining} spots left</span>
                                    </div>
                                </div>

                                <Link href={`/pilots/${pilot.id}/inquire`}>
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6 shadow-md shadow-indigo-200 dark:shadow-none text-white">
                                        Request Pilot Access
                                    </Button>
                                </Link>

                                <p className="text-xs text-center text-slate-400 mt-4">
                                    No payment required until acceptance.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="mt-6 flex justify-center gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">100%</div>
                                <div className="text-xs text-slate-500">Money Back</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">24h</div>
                                <div className="text-xs text-slate-500">Response Time</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
