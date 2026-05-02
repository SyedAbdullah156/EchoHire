"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function TermsPage() {
  const lastUpdated = "May 20, 2024";

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-40 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="space-y-4 border-b border-border-medium pb-12">
            <h1 className="text-5xl font-black text-white tracking-tight">Terms of Service</h1>
            <p className="text-text-muted text-sm font-bold uppercase tracking-widest">Last Updated: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
              <p className="text-text-secondary leading-relaxed">
                By accessing or using EchoHire, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Use License</h2>
              <p className="text-text-secondary leading-relaxed">
                {"Permission is granted to temporarily use the materials (information or software) on EchoHire's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."}
              </p>
              <p className="text-text-secondary leading-relaxed">You may not:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                <li>Modify or copy the materials.</li>
                <li>Use the materials for any commercial purpose.</li>
                <li>{"Attempt to decompile or reverse engineer any software contained on EchoHire's website."}</li>
                <li>Remove any copyright or other proprietary notations from the materials.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. AI-Generated Content</h2>
              <p className="text-text-secondary leading-relaxed">
                EchoHire provides AI-powered analysis and feedback. While we strive for accuracy, AI-generated content may occasionally be incorrect or misleading. You are solely responsible for verifying any advice or optimization suggestions before applying them to your career or job applications.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. User Accounts</h2>
              <p className="text-text-secondary leading-relaxed">
                To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. We reserve the right to terminate accounts that violate our community guidelines.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Disclaimer</h2>
              <p className="text-text-secondary leading-relaxed">
                {"The materials on EchoHire's website are provided on an 'as is' basis. EchoHire makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Limitations</h2>
              <p className="text-text-secondary leading-relaxed">
                {"In no event shall EchoHire or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EchoHire's website."}
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
