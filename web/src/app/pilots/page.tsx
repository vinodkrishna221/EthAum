import { PilotBrowser } from '@/components/pilot-browser';
import { PILOTS } from '@/lib/data';

export default function PilotsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Exclusive Pilot Offers
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Discover early-stage enterprise technology and get exclusive access to pilot programs at significant discounts.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <PilotBrowser pilots={PILOTS} />
            </div>
        </div>
    );
}
