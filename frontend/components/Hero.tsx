// components/Hero.tsx
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="h-screen bg-[url('/mainpagepic.png')] bg-cover bg-center flex items-center px-10 md:px-20 relative">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-xl">
        
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          MASTER YOUR TECH CAREER <br />
          WITH AI POWERED
        </h1>

        <p className="text-gray-300 mb-8 leading-relaxed">
          From generating your LinkedIn visibility score to conducting adaptive,
          voice-based technical interviews. Build your confidence with an AI
          that knows exactly what top tech companies are looking for.
        </p>

        <div className="flex gap-4">
          
          <Link
            href="/auth"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg text-white"
          >
            Get Started For Free <FiArrowRight />
          </Link>

          <Link
            href="/pricing"
            className="border border-blue-500 px-6 py-3 rounded-lg text-white hover:bg-blue-500/10"
          >
            Explore Features
          </Link>
        </div>

      </div>
    </section>
  );
}