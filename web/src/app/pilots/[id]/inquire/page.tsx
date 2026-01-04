import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PILOTS } from '@/lib/data';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PilotInquiryPage({ params }: PageProps) {
    const resolvedParams = await params;
    const pilot = PILOTS.find(p => p.id === resolvedParams.id);

    if (!pilot) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 py-8">
                    <Link href={`/pilots/${pilot.id}`} className="text-sm text-slate-500 hover:text-indigo-600 flex items-center mb-6 w-fit">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Pilot Details
                    </Link>
                    <div className="max-w-3xl">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Request Access</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Apply for the <span className="font-semibold text-indigo-600">{pilot.title}</span> pilot by {pilot.companyName}.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                    <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                        <CardHeader>
                            <CardTitle>Application Form</CardTitle>
                            <CardDescription>
                                Fill out the details below to request access. The team will review your application within 24 hours.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" placeholder="Jane" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" placeholder="Doe" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Work Email</Label>
                                    <Input id="email" type="email" placeholder="jane@company.com" required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company Name</Label>
                                        <Input id="company" placeholder="Acme Inc." required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Job Title</Label>
                                        <Input id="role" placeholder="CTO, Product Manager, etc." required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="teamSize">Team Size</Label>
                                        <Input id="teamSize" placeholder="e.g. 10-50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Company Website</Label>
                                        <Input id="website" placeholder="https://acme.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="useCase">Use Case / Interest</Label>
                                    <Textarea
                                        id="useCase"
                                        placeholder="Briefly describe how you plan to use this pilot..."
                                        className="min-h-[120px]"
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                                        Submit Application
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                    <p className="text-xs text-slate-500 mt-3">
                                        By submitting, you agree to share this information with {pilot.companyName} for the purpose of this pilot program.
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-8 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Pilot Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">Selected Pilot</div>
                                <div className="font-semibold text-slate-900 dark:text-white">{pilot.title}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">Provider</div>
                                <div className="font-medium text-slate-900 dark:text-white">{pilot.companyName}</div>
                            </div>
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-600 dark:text-slate-300">Price</span>
                                    <span className="font-bold text-slate-900 dark:text-white">${pilot.price}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-slate-500">
                                    <span>Original Value</span>
                                    <span className="line-through">${pilot.originalPrice}</span>
                                </div>
                            </div>

                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/50 mt-4">
                                <div className="flex items-start gap-2">
                                    <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                        Your request is protected by our 24h response guarantee. No payment required today.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
