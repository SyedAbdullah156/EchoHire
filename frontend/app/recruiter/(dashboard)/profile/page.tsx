"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getZodFieldMessages } from "@/lib/validation";
import { getApiErrorMessage } from "@/lib/api-error";
import { FiArrowLeft, FiCamera, FiCheck } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const PROFILE_STORAGE_KEY = "echohire-recruiter-profile";

type RecruiterProfileData = {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  companyName: string;
  companyWebsite: string;
  companySize: string;
  industry: string;
  recruitingFocus: string;
  linkedInUrl: string;
  bio: string;
  avatarDataUrl: string;
};

const defaultProfile: RecruiterProfileData = {
  fullName: "Jane Doe",
  email: "jane.doe@company.com",
  phone: "",
  jobTitle: "Senior Talent Acquisition",
  companyName: "EchoHire Tech",
  companyWebsite: "https://echohire.ai",
  companySize: "51-200 employees",
  industry: "Technology",
  recruitingFocus: "Software Engineering, Design",
  linkedInUrl: "",
  bio: "",
  avatarDataUrl: "",
};

export default function RecruiterProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<RecruiterProfileData>(defaultProfile);
  const [savedMessage, setSavedMessage] = useState("");
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof RecruiterProfileData, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const serverProfile = user.profile as Partial<RecruiterProfileData> | undefined;
        let companyData = {};

        if (user.company_id) {
          try {
            const res = await fetch(`/api/companies/${user.company_id}`);
            if (res.ok) {
              const body = await res.json();
              const c = body.data;
              companyData = {
                companyName: c.name,
                companyWebsite: c.website,
                companySize: c.size,
                industry: c.industry,
                bio: c.description
              };
            }
          } catch (e) {
            console.error("Error loading company:", e);
          }
        }

        setProfile({
          ...defaultProfile,
          fullName: user.name,
          email: user.email,
          ...serverProfile,
          ...companyData
        });
      }
    };
    
    loadData();
  }, [user]);

  useEffect(() => {
    console.log("Current Profile State:", profile);
  }, [profile]);

  const avatarInitial = useMemo(() => {
    const source = profile.fullName.trim() || "J";
    return source.charAt(0).toUpperCase();
  }, [profile.fullName]);

  const fieldClassName = (field: keyof RecruiterProfileData) =>
    `w-full rounded-2xl bg-surface-2 border border-border-medium px-4 py-3 text-foreground placeholder:text-text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all`;

  const updateField =
    (field: keyof RecruiterProfileData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setProfile((prev) => ({ ...prev, [field]: event.target.value }));
      setTouchedFields((prev) => ({ ...prev, [field]: true }));
      setSavedMessage("");
    };

  const onAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar must be 2MB or smaller.");
      return;
    }

    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    toast.success("Avatar selected. Save to apply changes.");
  };

  const saveProfile = async () => {
    setSubmitAttempted(true);
    const loadingToast = toast.loading("Saving profile...");
    
    try {
      let finalAvatarUrl = profile.avatarDataUrl;
      
      if (avatarFile) {
        const formData = new FormData();
        formData.append("logo", avatarFile);
        
        const uploadRes = await fetch(`/api/users/me/avatar`, {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalAvatarUrl = uploadData.url;
        }
      }

      const { fullName, email, ...restProfile } = profile;
      const payload = {
        name: fullName,
        email: email,
        profile: { ...restProfile, avatarDataUrl: finalAvatarUrl },
      };

      const res = await fetch(`/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Handle Company Creation/Update
      if (res.ok && profile.companyName) {
        const companyPayload: any = {
          name: profile.companyName,
          website: profile.companyWebsite,
          size: profile.companySize,
          industry: profile.industry,
        };

        if (profile.bio && profile.bio.length >= 10) {
          companyPayload.description = profile.bio;
        }

        if (user?.company_id) {
          console.log("Updating existing company...");
          const cRes = await fetch(`/api/companies`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(companyPayload),
          });
          const cData = await cRes.json();
          console.log("Company Update Response:", cData);
        } else {
          console.log("Creating new company...");
          const cRes = await fetch(`/api/companies`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(companyPayload),
          });
          const cData = await cRes.json();
          console.log("Company Response:", cData);
          if (!cRes.ok) {
            toast.error(cData.message || "Failed to update company details.", { id: loadingToast });
            return;
          }
        }
      }

      if (res.ok) {
        await refreshUser();
        toast.success("Profile and Company details updated!", { id: loadingToast });
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        return;
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to update profile.", { id: loadingToast });
      }
    } catch (e) {
      toast.error("Failed to save profile.", { id: loadingToast });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link 
          href="/recruiter/dashboard" 
          className="flex items-center gap-2 text-text-muted hover:text-foreground transition-colors mb-4 w-fit"
        >
          <FiArrowLeft />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Recruiter Profile</h1>
        <p className="text-text-secondary">Manage your professional identity and company details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-surface-2 border border-border-medium p-8 text-center space-y-6">
            <div className="relative inline-block group">
              {(previewUrl || profile.avatarDataUrl) ? (
                <img
                  src={previewUrl || profile.avatarDataUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-[2rem] object-cover border-2 border-primary/20 group-hover:border-primary/50 transition-all"
                />
              ) : (
                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-4xl font-black text-foreground shadow-xl shadow-primary/20">
                  {avatarInitial}
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-surface-1 border border-border-medium flex items-center justify-center cursor-pointer hover:bg-primary transition-colors text-foreground shadow-lg">
                <FiCamera />
                <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
              </label>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">{profile.fullName}</h3>
              <p className="text-sm text-primary font-medium">{profile.jobTitle}</p>
              <p className="text-xs text-text-muted">{profile.companyName}</p>
            </div>

            <button 
              onClick={saveProfile}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-foreground font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <FiCheck />
              Save Changes
            </button>
          </div>
        </div>

        {/* Right Column: Form Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Personal Info */}
          <div className="rounded-[2rem] bg-surface-2 border border-border-medium p-8 space-y-6">
            <h2 className="text-xl font-bold text-foreground border-l-4 border-primary pl-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                <input value={profile.fullName} onChange={updateField("fullName")} className={fieldClassName("fullName")} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                <input value={profile.email} onChange={updateField("email")} className={fieldClassName("email")} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Phone Number</label>
                <input value={profile.phone} onChange={updateField("phone")} className={fieldClassName("phone")} placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Job Title</label>
                <input value={profile.jobTitle} onChange={updateField("jobTitle")} className={fieldClassName("jobTitle")} />
              </div>
            </div>
          </div>

          {/* Section: Company Info */}
          <div className="rounded-[2rem] bg-surface-2 border border-border-medium p-8 space-y-6">
            <h2 className="text-xl font-bold text-foreground border-l-4 border-blue-500 pl-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Company Name</label>
                <input value={profile.companyName} onChange={updateField("companyName")} className={fieldClassName("companyName")} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Company Website</label>
                <input value={profile.companyWebsite} onChange={updateField("companyWebsite")} className={fieldClassName("companyWebsite")} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Company Size</label>
                <select value={profile.companySize} onChange={updateField("companySize")} className={fieldClassName("companySize")}>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Industry</label>
                <input value={profile.industry} onChange={updateField("industry")} className={fieldClassName("industry")} placeholder="e.g. Technology" />
              </div>
            </div>
          </div>

          {/* Section: Recruiting Focus & Bio */}
          <div className="rounded-[2rem] bg-surface-2 border border-border-medium p-8 space-y-6">
            <h2 className="text-xl font-bold text-foreground border-l-4 border-purple-500 pl-4">Recruiting Focus</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Focus Areas</label>
                <input value={profile.recruitingFocus} onChange={updateField("recruitingFocus")} className={fieldClassName("recruitingFocus")} placeholder="e.g. Fullstack, DevOps, Product Management" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Professional Bio</label>
                <textarea 
                  value={profile.bio} 
                  onChange={updateField("bio")} 
                  className={`${fieldClassName("bio")} resize-none`} 
                  rows={4} 
                  placeholder="Tell us about your recruiting experience..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
