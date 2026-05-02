"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
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
            <h1 className="text-5xl font-black text-white tracking-tight">Privacy Policy</h1>
            <p className="text-text-muted text-sm font-bold uppercase tracking-widest">Last Updated: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
              <p className="text-text-secondary leading-relaxed">
                EchoHire (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by EchoHire. By using our platform, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
              <p className="text-text-secondary leading-relaxed">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                <li>Create an account (Name, Email, Password)</li>
                <li>Upload your resume or LinkedIn profile for analysis</li>
                <li>Participate in AI-powered mock interviews (Audio/Video recordings)</li>
                <li>Communicate with us via our support channels or chatbot</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. How We Use Your Information</h2>
              <p className="text-text-secondary leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                <li>Generating resume audits and LinkedIn optimization suggestions</li>
                <li>Providing real-time feedback during AI interviews</li>
                <li>Personalizing your career development path</li>
                <li>Protecting against fraudulent or illegal activity</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
              <p className="text-text-secondary leading-relaxed">
                We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Third-Party Services</h2>
              <p className="text-text-secondary leading-relaxed">
                We use third-party AI providers (like Google Gemini) to process certain aspects of your data. These providers are strictly prohibited from using your data for their own purposes or training their models on your personal information without explicit consent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Your Rights</h2>
              <p className="text-text-secondary leading-relaxed">
                Depending on your location, you may have rights to access, correct, or delete your personal information. You can manage most of your data through your account settings or by contacting our support team.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
