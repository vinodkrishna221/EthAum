import Link from "next/link";
import { ArrowRight, Zap, Target, Shield, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PilotCard } from '@/components/pilot-card';
import { PILOTS } from '@/lib/data';

export default function Home() {
  const featuredPilots = PILOTS.slice(0, 3);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl opacity-50 dark:bg-indigo-900/20 -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-200/30 rounded-full blur-3xl opacity-50 dark:bg-purple-900/20 -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            EthAum.ai 1.0 is now live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            The Marketplace for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">Enterprise Innovation</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            Discover vetted AI pilots, launch your enterprise SaaS, and get exclusive early-adopter deals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <Link href="/pilots">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6 h-auto w-full sm:w-auto shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all rounded-full">
                Explore Pilots <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/launches">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto w-full sm:w-auto border-slate-300 dark:border-slate-700 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                View Launches
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Popular Categories</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Generative AI', 'Cybersecurity', 'DevOps', 'FinTech', 'HR Tech', 'Marketing Automation', 'Data Analytics'].map((cat) => (
              <Link key={cat} href={`/pilots?category=${cat}`}>
                <div className="px-6 py-3 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all text-slate-700 dark:text-slate-200 font-medium">
                  {cat}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pilots Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Trending Pilots</h2>
              <p className="text-slate-600 dark:text-slate-400">Exclusive limited-time offers from top AI startups.</p>
            </div>
            <Link href="/pilots" className="hidden md:flex text-indigo-600 font-medium hover:text-indigo-700 items-center">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPilots.map((pilot, i) => (
              <div key={pilot.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                <PilotCard {...pilot} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/pilots">
              <Button variant="outline">View All Pilots</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why EthAum?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              We bridge the gap between innovative startups and forward-thinking enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Curated Selection</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Every pilot is vetted for quality, security, and enterprise-readiness before listing.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Risk-Free Trials</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Secure 30-day pilot access with money-back guarantees and dedicated support.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Fast Implementation</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Skip the long sales cycles. Get instant access to documentation and API keys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Accelerate Innovation?</h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Join 500+ enterprises and 200+ startups building the future of AI together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-6 h-auto">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10 text-lg px-8 py-6 h-auto">
              List Your Startup
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
