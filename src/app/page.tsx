"use client";

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStartNow = () => {
    router.push('/compliance');
  };

  const handleLogin = () => {
    router.push('/compliance');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background gradient matching dashboard */}
      <div className="fixed inset-0 bg-slate-900 -z-10"></div>
      
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <span className="font-bold text-lg text-white">CLAUDIBLE</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-white/70">Already have an account?</p>
          <button 
            onClick={handleLogin}
            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-5 py-2 rounded-full text-sm hover:bg-white/20 transition-all duration-300"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col md:flex-row items-center justify-between px-12 py-12 md:py-20">
        {/* Left Text */}
        <div className="max-w-xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
            Is Your Cloud <br /> Audit-Ready?
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Auditing compliance is time consuming, not beginner friendly and not cost effective.
            Claudible aims to mitigate these challenges and ensure your cloud providers are audit
            ready.
          </p>
          <button 
            onClick={handleStartNow}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold border-0 shadow-lg transition-all duration-300"
          >
            START NOW
          </button>
        </div>

        {/* Right Logos */}
        <div className="mt-10 md:mt-0 grid grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="flex items-center justify-center h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
            <img src="/img/Amazon_Web_Services_Logo.svg.png" alt="AWS" className="max-h-16 max-w-full object-contain hover:scale-110 transition-transform cursor-pointer" />
          </div>
          <div className="flex items-center justify-center h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
            <img src="/img/Microsoft_Azure.svg.png" alt="Microsoft Azure" className="max-h-16 max-w-full object-contain hover:scale-110 transition-transform cursor-pointer" />
          </div>
          <div className="flex items-center justify-center h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
            <img src="/img/social-icon-google-cloud-1200-630.png" alt="Google Cloud Platform" className="max-h-16 max-w-full object-contain hover:scale-110 transition-transform cursor-pointer" />
          </div>
          <div className="flex items-center justify-center h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
            <img src="/img/images.png" alt="Cloud Provider" className="max-h-16 max-w-full object-contain hover:scale-110 transition-transform cursor-pointer" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 text-center py-4 text-sm text-white/60">
        2026 Claudible. All rights reserved.
      </footer>
    </div>
  );
}
