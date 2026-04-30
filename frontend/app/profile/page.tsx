"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { toast } from "sonner";
import { getZodFieldMessages, parseZodMessage, profileSchema } from "@/lib/validation";
import { getApiErrorMessage } from "@/lib/api-error";

const PROFILE_STORAGE_KEY = "echohire-profile";

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

const defaultProfile: ProfileData = {
  fullName: "Hassan",
  email: "hassan@example.com",
  phone: "",
  cityCountry: "",
  linkedInUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  targetRole: "Software Engineer",
  yearsExperience: "0-1 years",
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
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [savedMessage, setSavedMessage] = useState("");
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof ProfileData, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Try to load from backend if token exists, otherwise fallback to localStorage
      const token = localStorage.getItem("echohire-token");
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5050";
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/api/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const body = await res.json();
            const serverProfile = (body?.data?.profile) as Partial<ProfileData> | undefined;
            // If server returns basic user fields, merge them
            const merged = {
              fullName: body?.data?.name ?? defaultProfile.fullName,
              email: body?.data?.email ?? defaultProfile.email,
              ...serverProfile,
            } as Partial<ProfileData>;
            setProfile((prev) => ({ ...prev, ...merged }));
            return;
          }
        } catch (e) {
          // ignore and fallback to localStorage
        }
      }

      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved) as Partial<ProfileData>;
        setProfile((prev) => ({ ...prev, ...parsed }));
      } catch {
        // Ignore invalid local storage value.
      }
    };

    load();
  }, []);

  const avatarInitial = useMemo(() => {
    const source = profile.fullName.trim() || "U";
    return source.charAt(0).toUpperCase();
  }, [profile.fullName]);

  const fieldErrors = useMemo(() => {
    const parsed = profileSchema.safeParse(profile);
    if (parsed.success) {
      return {} as Record<string, string>;
    }

    return getZodFieldMessages(parsed.error);
  }, [profile]);

  const shouldShowError = (field: keyof ProfileData) => Boolean(touchedFields[field] || submitAttempted);

  const fieldClassName = (field: keyof ProfileData) =>
    `w-full rounded-lg border px-3 py-2.5 text-[#eaf0ff] outline-none placeholder:text-[#6f86b2] ${
      shouldShowError(field) && fieldErrors[field]
        ? "border-red-400 focus:border-red-300"
        : "border-[#2e4067] focus:border-[#3f83ff]"
    }`;

  const renderFieldError = (field: keyof ProfileData) =>
    shouldShowError(field) && fieldErrors[field] ? (
      <p className="mt-1 text-sm text-red-300">{fieldErrors[field]}</p>
    ) : null;

  const updateField =
    (field: keyof ProfileData) =>
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
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setProfile((prev) => ({ ...prev, avatarDataUrl: result }));
      setTouchedFields((prev) => ({ ...prev, avatarDataUrl: true }));
      setSavedMessage("");
      toast.success("Avatar loaded successfully.");
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setSubmitAttempted(true);
    const token = localStorage.getItem("echohire-token");
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5050";

    const parsed = profileSchema.safeParse(profile);
    if (!parsed.success) {
      const message = parseZodMessage(parsed.error) || "Please fix the profile fields before saving.";
      setSavedMessage(message);
      toast.error(message);
      return;
    }

    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/profile/me`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profile }),
        });

        if (res.ok) {
          setSavedMessage("Profile saved to your account.");
          toast.success("Profile saved to your account.");
          return;
        }
        const err = await res.json().catch(() => ({}));
        const message = getApiErrorMessage(err, "Failed to save profile to server.");
        setSavedMessage(message);
        toast.error(message);
        return;
      } catch (e) {
        const message = "Failed to save profile to server.";
        setSavedMessage(message);
        toast.error(message);
        return;
      }
    }

    // fallback to localStorage when no auth token
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setSavedMessage("Profile saved locally.");
    toast.success("Profile saved locally.");
  };

  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 pb-12 pt-8 lg:flex-row md:px-6">
        <DashboardSidebar active="profile" />
        <div className="flex-1">
        <header className="mb-5 rounded-2xl border border-[#243253] bg-[#0d162a] p-5">
          <h1 className="text-4xl font-semibold text-[#dbe7ff]">My Profile</h1>
          <p className="mt-1 text-base text-[#9fb1d8]">Add your details so EchoHire can personalize interviews and suggestions.</p>
        </header>

        <div className="rounded-2xl border border-[#243253] bg-[#0d162a] p-6">
          <div className="mb-6 flex flex-col items-start gap-4 rounded-xl border border-[#2a3b61] bg-[#0a1223] p-4 md:flex-row md:items-center">
            {profile.avatarDataUrl ? (
              <img
                src={profile.avatarDataUrl}
                alt="Profile avatar"
                className="h-16 w-16 rounded-full border border-[#3a5488] object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#3a5488] bg-gradient-to-br from-[#2a7df7] to-[#372e8f] text-xl font-semibold text-white">
                {avatarInitial}
              </div>
            )}

            <div>
              <p className="text-base font-medium text-[#dbe7ff]">Profile Photo</p>
              <p className="text-sm text-[#9fb1d8]">Upload a photo or keep initial-based avatar.</p>
            </div>
            <label className="cursor-pointer rounded-lg border border-[#32466f] px-4 py-2 text-sm text-[#dbe7ff] hover:bg-[#16213a] md:ml-auto">
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
            </label>
          </div>

          <h2 className="mb-3 text-lg font-semibold text-[#dbe7ff]">Personal Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">Full Name</label>
              <input value={profile.fullName} onChange={updateField("fullName")} className={fieldClassName("fullName")} />
              {renderFieldError("fullName")}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">Email</label>
              <input value={profile.email} onChange={updateField("email")} className={fieldClassName("email")} />
              {renderFieldError("email")}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">Phone</label>
              <input value={profile.phone} onChange={updateField("phone")} placeholder="+92 ..." className={fieldClassName("phone")} />
              {renderFieldError("phone")}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">City, Country</label>
              <input value={profile.cityCountry} onChange={updateField("cityCountry")} className={fieldClassName("cityCountry")} />
              {renderFieldError("cityCountry")}
            </div>
          </div>

          <h2 className="mb-3 mt-6 text-lg font-semibold text-[#dbe7ff]">Professional Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">Target Role</label>
              <input value={profile.targetRole} onChange={updateField("targetRole")} className={fieldClassName("targetRole")} />
              {renderFieldError("targetRole")}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">Years of Experience</label>
              <input value={profile.yearsExperience} onChange={updateField("yearsExperience")} className={fieldClassName("yearsExperience")} />
              {renderFieldError("yearsExperience")}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">Current Status</label>
              <select value={profile.currentStatus} onChange={updateField("currentStatus")} className={fieldClassName("currentStatus")}>
                <option>Student</option>
                <option>Fresh Graduate</option>
                <option>Working Professional</option>
                <option>Job Seeker</option>
              </select>
              {renderFieldError("currentStatus")}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">Preferred Industry</label>
              <input value={profile.preferredIndustry} onChange={updateField("preferredIndustry")} placeholder="FinTech, AI, SaaS..." className={fieldClassName("preferredIndustry")} />
              {renderFieldError("preferredIndustry")}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">LinkedIn URL</label>
              <input value={profile.linkedInUrl} onChange={updateField("linkedInUrl")} className={fieldClassName("linkedInUrl")} />
              {renderFieldError("linkedInUrl")}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">GitHub URL</label>
              <input value={profile.githubUrl} onChange={updateField("githubUrl")} className={fieldClassName("githubUrl")} />
              {renderFieldError("githubUrl")}
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm text-[#9fb1d8]">Portfolio URL</label>
              <input value={profile.portfolioUrl} onChange={updateField("portfolioUrl")} className={fieldClassName("portfolioUrl")} />
              {renderFieldError("portfolioUrl")}
            </div>
          </div>

          <h2 className="mb-3 mt-6 text-lg font-semibold text-[#dbe7ff]">Education</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">Degree / Program</label>
              <input value={profile.degree} onChange={updateField("degree")} placeholder="BS Computer Science" className={fieldClassName("degree")} />
              {renderFieldError("degree")}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">University / Institute</label>
              <input value={profile.university} onChange={updateField("university")} className={fieldClassName("university")} />
              {renderFieldError("university")}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">Graduation Year</label>
              <input value={profile.graduationYear} onChange={updateField("graduationYear")} placeholder="2026" className={fieldClassName("graduationYear")} />
              {renderFieldError("graduationYear")}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">CGPA / Grade</label>
              <input value={profile.cgpa} onChange={updateField("cgpa")} placeholder="3.7 / 4.0" className={fieldClassName("cgpa")} />
              {renderFieldError("cgpa")}
            </div>
          </div>

          <h2 className="mb-3 mt-6 text-lg font-semibold text-[#dbe7ff]">Preparation Preferences</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">Core Skills (comma separated)</label>
              <input value={profile.coreSkills} onChange={updateField("coreSkills")} placeholder="React, Node.js, SQL..." className={fieldClassName("coreSkills")} />
              {renderFieldError("coreSkills")}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#9fb1d8]">Interview Focus</label>
              <select value={profile.interviewFocus} onChange={updateField("interviewFocus")} className={fieldClassName("interviewFocus")}>
                <option>Technical + Behavioral</option>
                <option>Technical Only</option>
                <option>Behavioral Only</option>
                <option>System Design Focus</option>
              </select>
              {renderFieldError("interviewFocus")}
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm text-[#9fb1d8]">Career Goal</label>
              <textarea value={profile.careerGoal} onChange={updateField("careerGoal")} rows={4} placeholder="Describe your 6-12 month career goal..." className={fieldClassName("careerGoal")} />
              {renderFieldError("careerGoal")}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={saveProfile} className="rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-4 py-2 text-sm font-medium">
              Save Changes
            </button>
            <Link href="/dashboard" className="rounded-lg border border-[#32466f] px-4 py-2 text-sm text-[#dbe7ff]">
              Back to Dashboard
            </Link>
            {savedMessage && <p className="self-center text-sm text-[#8fc0ff]">{savedMessage}</p>}
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}
