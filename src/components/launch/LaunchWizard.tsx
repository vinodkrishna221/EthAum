'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label'; // Using radix primitive if label component not yet added, or generic div if needed. Assuming standard label usage.
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload, Calendar, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Types
interface LaunchFormData {
    productId: string;
    title: string;
    tagline: string;
    description: string;
    media: { type: 'image' | 'video', url: string, caption: string }[];
    scheduledAt: string;
}

export default function LaunchWizard({ products }: { products: any[] }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<LaunchFormData>({
        defaultValues: {
            media: [{ type: 'image', url: '', caption: '' }]
        }
    });

    const formData = watch();

    const onSubmit = async (data: LaunchFormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/launches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                router.push('/launches'); // Redirect to feed
            } else {
                alert('Failed to launch');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    return (
        <div className="max-w-2xl mx-auto py-10">
            <div className="mb-8 flex justify-between items-center">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`flex flex-col items-center ${s <= step ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${s <= step ? 'border-primary bg-primary/10' : 'border-gray-200'}`}>
                            {s < step ? <CheckCircle className="w-6 h-6" /> : s}
                        </div>
                        <span className="text-xs mt-2 font-medium">
                            {['Basics', 'Media', 'Schedule', 'Review'][s - 1]}
                        </span>
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && 'Basic Details'}
                        {step === 2 && 'Media Assets'}
                        {step === 3 && 'Launch Schedule'}
                        {step === 4 && 'Review & Launch'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="launch-form" onSubmit={handleSubmit(onSubmit)}>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Select Product</label>
                                            <select
                                                {...register('productId', { required: true })}
                                                className="w-full p-2 border rounded-md"
                                            >
                                                <option value="">Select a product...</option>
                                                {products.map(p => (
                                                    <option key={p._id} value={p._id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Launch Title</label>
                                            <Input {...register('title', { required: true })} placeholder="e.g. Version 2.0 Release" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Tagline</label>
                                            <Input {...register('tagline', { required: true })} placeholder="Short, punchy description" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Description</label>
                                            <textarea
                                                {...register('description')}
                                                className="w-full p-2 border rounded-md min-h-[100px]"
                                                placeholder="Detailed launch description..."
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">Click to upload images or videos</p>
                                        </div>
                                        {/* Simplified media input for now */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Media URL</label>
                                            <Input
                                                value={formData.media[0]?.url}
                                                onChange={(e) => setValue('media.0.url', e.target.value)}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-500">When do you want this launch to go live?</p>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Launch Date & Time</label>
                                            <Input type="datetime-local" {...register('scheduledAt')} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                            <h3 className="font-semibold">{formData.title}</h3>
                                            <p className="text-gray-600">{formData.tagline}</p>
                                            <div className="text-sm text-gray-500">
                                                Scheduled for: {formData.scheduledAt ? new Date(formData.scheduledAt).toLocaleString() : 'Immediate Release'}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">Ready to blast off? 🚀</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={prevStep} disabled={step === 1}>
                        Previous
                    </Button>

                    {step < 4 ? (
                        <Button onClick={nextStep}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Launch Now
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
