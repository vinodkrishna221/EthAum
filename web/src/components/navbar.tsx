import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, Zap } from 'lucide-react';

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        EthAum.ai
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/pilots" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white transition-colors">
                        Pilots
                    </Link>
                    <Link href="/launches" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white transition-colors">
                        Launches
                    </Link>
                    <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white transition-colors">
                        SaaS Deals
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300">
                        Log in
                    </Link>
                    <Link href="/dashboard">
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 border-none shadow-lg shadow-indigo-500/20">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
