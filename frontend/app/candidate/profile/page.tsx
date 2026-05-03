"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getZodFieldMessages, parseZodMessage, profileSchema } from "@/lib/validation";
import { useAuth } from "@/context/AuthContext";
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiLink, FiGithub, FiLinkedin, FiAward, FiBook, FiSave, FiArrowLeft, FiCamera } from "react-icons/fi";
import { motion } from "framer-motion";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  cityCountry: string;
  linkedInUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  targetRole: string;
  yearsExperience: string;
  currentStatus: string;
  degree: string;
  university: string;
  graduationYear: string;
  cgpa: string;
  coreSkills: string;
  preferredIndustry: string;
  interviewFocus: string;
  careerGoal: string;
  avatarDataUrl: string;
};

const INITIAL_PROFILE: ProfileData = {
  fullName: "",
  email: "",
  phone: "",
  cityCountry: "",
  linkedInUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  targetRole: "",
  yearsExperience: "",
  currentStatus: "Student",
  degree: "",
  university: "",
  graduationYear: "",
  cgpa: "",
  coreSkills: "",
  preferredIndustry: "",
  interviewFocus: "Technical + Behavioral",
  careerGoal: "",
  avatarDataUrl: "",
};

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof ProfileData, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfile({
        ...INITIAL_PROFILE,
        fullName: user.name || "",
        email: user.email || "",
        ...(user.profile || {}),
      });
    }
  }, [user]);

  const fieldErrors = useMemo(() => {
    const parsed = profileSchema.safeParse(profile);
    return parsed.success ? {} : getZodFieldMessages(parsed.error);
  }, [profile]);

  const updateField = (field: keyof ProfileData) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProfile(prev => ({ ...prev, [field]: e.target.value }));
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error("File size must be < 2MB");
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const saveProfile = async () => {
    setSubmitAttempted(true);
    const parsed = profileSchema.safeParse(profile);
    if (!parsed.success) return toast.error("Please fix validation errors.");

    setIsSaving(true);
    const loadingId = toast.loading("Saving your profile...");

    try {
      let avatarUrl = profile.avatarDataUrl;

      // 1. Upload Avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append("logo", avatarFile);
        const uploadRes = await fetch("/api/users/me/avatar", {
          method: "POST",
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          avatarUrl = uploadData.url;
        }
      }

      // 2. Save Profile Data
      const { fullName, email, ...restProfile } = profile;
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: email,
          profile: { ...restProfile, avatarDataUrl: avatarUrl },
        }),
      });

      if (res.ok) {
        toast.success("Profile synchronized successfully!", { id: loadingId });
        await refreshUser();
        setAvatarFile(null);
        setPreviewUrl(null);
      } else {
        toast.error("Failed to save changes.", { id: loadingId });
      }
    } catch (err) {
      toast.error("Network error.", { id: loadingId });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
             <FiUser /> Identity & Background
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Candidate Profile</h1>
          <p className="text-text-muted">Keep your professional identity updated for AI-matching accuracy.</p>
        </div>
        <div className="flex gap-3">
           <Link href="/candidate/dashboard" className="h-12 px-6 rounded-xl border border-white/10 flex items-center gap-2 text-xs font-bold text-white hover:bg-white/5 transition-all">
             <FiArrowLeft /> Back
           </Link>
           <button onClick={saveProfile} disabled={isSaving} className="h-12 px-8 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
             {isSaving ? "Saving..." : <><FiSave /> Save Changes</>}
           </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Sidebar: Avatar & Summary */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-8 rounded-[3rem] bg-surface-1 border border-white/5 text-center space-y-6">
              <div className="relative inline-block group">
                 <div className="h-32 w-32 rounded-[2.5rem] bg-surface-2 border-2 border-white/5 overflow-hidden flex items-center justify-center text-4xl font-black text-primary">
                    {previewUrl || profile.avatarDataUrl ? (
                      <img src={previewUrl || profile.avatarDataUrl} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      profile.fullName?.[0] || "?"
                    )}
                 </div>
                 <label className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-xl">
                    <FiCamera size={18} />
                    <input type="file" className="hidden" onChange={onAvatarChange} accept="image/*" />
                 </label>
              </div>
              <div className="space-y-1">
                 <h3 className="text-xl font-bold text-white">{profile.fullName || "Your Name"}</h3>
                 <p className="text-sm text-text-muted">{profile.targetRole || "Role not specified"}</p>
              </div>
              <div className="pt-6 border-t border-white/5 space-y-4">
                 <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <FiMail className="text-primary" /> {profile.email}
                 </div>
                 <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <FiMapPin className="text-primary" /> {profile.cityCountry || "Location unknown"}
                 </div>
              </div>
           </div>

           <div className="p-8 rounded-[3rem] bg-primary/5 border border-primary/10 space-y-4">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                 <FiAward /> Interview Optimization
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                 Our AI Engine uses these details to generate questions tailored to your experience level and industry focus.
              </p>
           </div>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-8 space-y-10">
           {/* Section: Personal */}
           <section className="space-y-6">
              <h3 className="text-lg font-bold text-white px-2">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Full Name</label>
                    <input value={profile.fullName} onChange={updateField("fullName")} className={`w-full h-14 bg-surface-1 border rounded-2xl px-4 text-sm text-white outline-none focus:border-primary/40 transition-all ${fieldErrors.fullName ? 'border-rose-500/50' : 'border-white/5'}`} />
                    {fieldErrors.fullName && <p className="text-[10px] font-bold text-rose-400 px-1">{fieldErrors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Phone Number</label>
                    <input value={profile.phone} onChange={updateField("phone")} placeholder="+92 ..." className={`w-full h-14 bg-surface-1 border rounded-2xl px-4 text-sm text-white outline-none focus:border-primary/40 transition-all ${fieldErrors.phone ? 'border-rose-500/50' : 'border-white/5'}`} />
                    {fieldErrors.phone && <p className="text-[10px] font-bold text-rose-400 px-1">{fieldErrors.phone}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">City & Country</label>
                    <input value={profile.cityCountry} onChange={updateField("cityCountry")} className={`w-full h-14 bg-surface-1 border rounded-2xl px-4 text-sm text-white outline-none focus:border-primary/40 transition-all ${fieldErrors.cityCountry ? 'border-rose-500/50' : 'border-white/5'}`} />
                    {fieldErrors.cityCountry && <p className="text-[10px] font-bold text-rose-400 px-1">{fieldErrors.cityCountry}</p>}
                  </div>
              </div>
           </section>

           {/* Section: Professional */}
           <section className="space-y-6">
              <h3 className="text-lg font-bold text-white px-2">Professional Experience</h3>
              <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Target Role</label>
                    <input value={profile.targetRole} onChange={updateField("targetRole")} placeholder="e.g. Senior Frontend Engineer" className={`w-full h-14 bg-surface-1 border rounded-2xl px-4 text-sm text-white outline-none focus:border-primary/40 transition-all ${fieldErrors.targetRole ? 'border-rose-500/50' : 'border-white/5'}`} />
                    {fieldErrors.targetRole && <p className="text-[10px] font-bold text-rose-400 px-1">{fieldErrors.targetRole}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Experience Level</label>
                    <select value={profile.yearsExperience} onChange={updateField("yearsExperience")} className={`w-full h-14 bg-surface-1 border rounded-2xl px-4 text-sm text-white outline-none focus:border-primary/40 transition-all appearance-none ${fieldErrors.yearsExperience ? 'border-rose-500/50' : 'border-white/5'}`}>
                       <option value="">Select Level</option>
                       <option>Fresh / Entry Level</option>
                       <option>1-3 Years (Junior)</option>
                       <option>3-5 Years (Mid-Level)</option>
                       <option>5+ Years (Senior)</option>
                    </select>
                    {fieldErrors.yearsExperience && <p className="text-[10px] font-bold text-rose-400 px-1">{fieldErrors.yearsExperience}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">LinkedIn Profile</label>
                    <input value={profile.linkedInUrl} onChange={updateField("linkedInUrl")} className={`w-full h-14 bg-surface-1 border rounded-2xl px-4 text-sm text-white outline-none focus:border-primary/40 transition-all ${fieldErrors.linkedInUrl ? 'border-rose-500/50' : 'border-white/5'}`} />
                    {fieldErrors.linkedInUrl && <p className="text-[10px] font-bold text-rose-400 px-1">{fieldErrors.linkedInUrl}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">GitHub Profile</label>
                    <input value={profile.githubUrl} onChange={updateField("githubUrl")} className={`w-full h-14 bg-surface-1 border rounded-2xl px-4 text-sm text-white outline-none focus:border-primary/40 transition-all ${fieldErrors.githubUrl ? 'border-rose-500/50' : 'border-white/5'}`} />
                    {fieldErrors.githubUrl && <p className="text-[10px] font-bold text-rose-400 px-1">{fieldErrors.githubUrl}</p>}
                  </div>
              </div>
           </section>

           {/* Section: Academic */}
           <section className="space-y-6">
              <h3 className="text-lg font-bold text-white px-2">Academic Background</h3>
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Highest Degree</label>
                    <input value={profile.degree} onChange={updateField("degree")} placeholder="BS Computer Science" className={`w-full h-14 bg-surface-1 border rounded-2xl px-4 text-sm text-white outline-none focus:border-primary/40 transition-all ${fieldErrors.degree ? 'border-rose-500/50' : 'border-white/5'}`} />
                    {fieldErrors.degree && <p className="text-[10px] font-bold text-rose-400 px-1">{fieldErrors.degree}</p>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">University</label>
                    <input value={profile.university} onChange={updateField("university")} className={`w-full h-14 bg-surface-1 border rounded-2xl px-4 text-sm text-white outline-none focus:border-primary/40 transition-all ${fieldErrors.university ? 'border-rose-500/50' : 'border-white/5'}`} />
                    {fieldErrors.university && <p className="text-[10px] font-bold text-rose-400 px-1">{fieldErrors.university}</p>}
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
