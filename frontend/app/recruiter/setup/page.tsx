"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, 
  FiBriefcase, 
  FiBell, 
  FiCheck, 
  FiCamera, 
  FiSearch, 
  FiArrowRight, 
  FiArrowLeft,
  FiLoader
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setupRecruiterProfile } from "./actions";

// --- Types ---

interface Company {
  _id: string;
  name: string;
  location?: string;
  logoUrl?: string;
}

export default function RecruiterSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    companyId: "",
    avatarDataUrl: "",
    notifications: {
      email: true,
      desktop: true,
      marketing: false,
    }
  });

  // Company Search State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch Companies
  useEffect(() => {
    const fetchCompanies = async () => {
      if (searchQuery.length < 2) {
        setCompanies([]);
        return;
      }
      setIsSearching(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5050";
        const res = await fetch(`${backendUrl}/api/companies`);
        const data = await res.json();
        if (data.success) {
          // Client-side filter for simulation
          const filtered = data.data.filter((c: Company) => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setCompanies(filtered);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchCompanies, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await setupRecruiterProfile(formData);
    if (result.success) {
      toast.success("Profile setup complete!");
      router.push("/recruiter/dashboard");
    } else {
      toast.error(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary/30">
      
      {/* --- Progress Indicator --- */}
      <div className="w-full max-w-lg mb-12 flex items-center justify-between px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
              step >= s ? "bg-primary border-primary text-white" : "bg-transparent border-border-medium text-text-muted"
            }`}>
              {step > s ? <FiCheck /> : s}
            </div>
            {s < 3 && <div className={`h-px w-16 md:w-24 ${step > s ? "bg-primary" : "bg-border-medium"}`} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-xl bg-surface-1 border border-border-medium rounded-[2.5rem] overflow-hidden relative">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-10 space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight">Personal Details</h2>
                <p className="text-sm text-text-secondary leading-relaxed">Tell us a bit about yourself to personalize your recruiter profile.</p>
              </div>

              {/* Avatar Upload Placeholder */}
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-3xl border-2 border-dashed border-border-medium flex flex-col items-center justify-center gap-2 text-text-muted hover:border-primary hover:text-primary cursor-pointer transition-all">
                  <FiCamera className="text-2xl" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Upload Photo</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">First Name</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Jane"
                    className="w-full h-12 bg-surface-2 border border-border-medium rounded-2xl px-5 text-sm text-white outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Doe"
                    className="w-full h-12 bg-surface-2 border border-border-medium rounded-2xl px-5 text-sm text-white outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Job Title</label>
                <input 
                  type="text" 
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                  placeholder="e.g. Talent Acquisition Manager"
                  className="w-full h-12 bg-surface-2 border border-border-medium rounded-2xl px-5 text-sm text-white outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <button 
                onClick={handleNext}
                disabled={!formData.firstName || !formData.lastName || !formData.jobTitle}
                className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest rounded-2xl transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                Continue <FiArrowRight />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Company Linkage */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-10 space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight">Your Company</h2>
                <p className="text-sm text-text-secondary leading-relaxed">Search for your company to link it to your profile.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search company name..."
                    className="w-full h-14 bg-surface-2 border border-border-medium rounded-2xl pl-14 pr-5 text-sm text-white outline-none focus:border-primary/50 transition-all"
                  />
                  {isSearching && <FiLoader className="absolute right-5 top-1/2 -translate-y-1/2 animate-spin text-primary" />}
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {companies.map((company) => (
                    <button
                      key={company._id}
                      onClick={() => {
                        setFormData({...formData, companyId: company._id});
                        setSearchQuery(company.name);
                        setCompanies([]);
                      }}
                      className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        formData.companyId === company._id 
                          ? "bg-primary/10 border-primary text-white" 
                          : "bg-surface-2 border-border-subtle text-text-secondary hover:border-primary/30"
                      }`}
                    >
                      <span className="text-sm font-bold">{company.name}</span>
                      {formData.companyId === company._id && <FiCheck className="text-primary" />}
                    </button>
                  ))}
                  {searchQuery.length >= 2 && companies.length === 0 && !isSearching && (
                    <p className="text-center py-4 text-xs text-text-muted">No companies found. Try a different name.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleBack}
                  className="w-14 h-14 bg-surface-2 border border-border-medium rounded-2xl flex items-center justify-center text-white hover:bg-surface-1 transition-all"
                >
                  <FiArrowLeft />
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!formData.companyId}
                  className="flex-1 h-14 bg-primary text-white font-black uppercase tracking-widest rounded-2xl transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  Continue <FiArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Preferences */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-10 space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight">Preferences</h2>
                <p className="text-sm text-text-secondary leading-relaxed">Choose how you want to stay updated on your candidates.</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: "email", label: "Email Notifications", desc: "Get daily candidate activity reports" },
                  { key: "desktop", label: "Desktop Alerts", desc: "Real-time notifications for AI analysis" },
                  { key: "marketing", label: "Product Updates", desc: "Tips on using new EchoHire features" },
                ].map((pref) => (
                  <div key={pref.key} className="flex items-center justify-between p-5 bg-surface-2 border border-border-subtle rounded-2xl">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{pref.label}</p>
                      <p className="text-[10px] text-text-muted">{pref.desc}</p>
                    </div>
                    <button 
                      onClick={() => setFormData({
                        ...formData, 
                        notifications: { ...formData.notifications, [pref.key]: !formData.notifications[pref.key as keyof typeof formData.notifications] }
                      })}
                      className={`h-6 w-11 rounded-full transition-colors relative ${
                        formData.notifications[pref.key as keyof typeof formData.notifications] ? "bg-primary" : "bg-border-medium"
                      }`}
                    >
                      <motion.div 
                        animate={{ x: formData.notifications[pref.key as keyof typeof formData.notifications] ? 20 : 2 }}
                        className="absolute top-1 left-0 h-4 w-4 bg-white rounded-full" 
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleBack}
                  className="w-14 h-14 bg-surface-2 border border-border-medium rounded-2xl flex items-center justify-center text-white hover:bg-surface-1 transition-all"
                >
                  <FiArrowLeft />
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 h-14 bg-primary text-white font-black uppercase tracking-widest rounded-2xl transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? "Saving..." : "Finish Setup"}
                  {!isSubmitting && <FiCheck />}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
    </div>
  );
}
