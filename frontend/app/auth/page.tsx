"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { FiCheckSquare, FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FiLinkedin } from "react-icons/fi";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authSchema, getZodFieldMessage } from "@/lib/validation";
import { getApiErrorMessage } from "@/lib/api-error";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5050";
const PROFILE_STORAGE_KEY = "echohire-profile";
const TOKEN_STORAGE_KEY = "echohire-token";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  
  // Kept your exact state variables for backend compatibility
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPasswordFieldError, setConfirmPasswordFieldError] = useState("");

  const passwordChecks = useMemo(() => {
    if (mode !== "signup") return [];
    return [
      { label: "8-128 characters", valid: password.length >= 8 && password.length <= 128 },
      { label: "Uppercase & Lowercase", valid: /[A-Z]/.test(password) && /[a-z]/.test(password) },
      { label: "Number & Special Character", valid: /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) },
    ];
  }, [mode, password]);

  const passwordIsValid = passwordChecks.length > 0 && passwordChecks.every((check) => check.valid);
  const confirmPasswordIsValid = mode !== "signup" || confirmPassword.length === 0 || password === confirmPassword;

  // Function exactly as you had it
  const persistSession = (token: string, profile: { name: string; email: string; role: string }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  };

  // Submit logic remains untouched to prevent API errors
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setConfirmPasswordFieldError("");

    const parsed = authSchema.safeParse(
      mode === "signin"
        ? { mode, email, password }
        : { mode, name, email, password, confirmPassword, role },
    );

    if (!parsed.success) {
      const message = parsed.error.issues
          .filter((issue) => issue.path.join(".") !== "confirmPassword")
          .map((issue) => issue.message)
          .filter(Boolean)
          .join(" ") || "Please fix the highlighted fields.";
      const confirmPasswordMessage = getZodFieldMessage(parsed.error, "confirmPassword");
      setErrorMessage(message);
      setConfirmPasswordFieldError(confirmPasswordMessage);
      toast.error(message);
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = mode === "signin" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "signin"
          ? { email: email.trim(), password }
          : { name: name.trim(), email: email.trim(), password, role };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(getApiErrorMessage(result, "Authentication failed"));

      persistSession(result.token, result.data);
      toast.success(mode === "signin" ? "Logged in successfully." : "Account created successfully.");
      router.push("/dashboard?completeProfile=1");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode: "signin" | "signup") => {
    setMode(nextMode);
    setErrorMessage("");
    setConfirmPasswordFieldError("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Navbar />
      <section className="mx-auto grid max-w-[1540px] grid-cols-1 gap-12 px-6 pb-8 pt-28 lg:grid-cols-[1.5fr_1fr] items-center">
        
        {/* Left Visual Section */}
        <div className="relative hidden lg:block overflow-hidden rounded-[32px] border border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <Image
            src="/mainpagepic.png" 
            alt="AI visual"
            width={1200}
            height={900}
            className="h-[750px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute bottom-12 left-12 z-20 max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Master your next interview with AI-driven precision.</h2>
            <p className="text-slate-300 text-lg">Join EchoHire to practice real-world scenarios and land your dream role.</p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full max-w-[500px] mx-auto">
          {/* Mode Switcher */}
          <div className="mb-10 flex p-1 bg-[#111827] rounded-2xl border border-[#243253] w-fit">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`px-8 py-2 rounded-xl text-sm font-semibold transition-all ${
                mode === "signin" ? "bg-blue-600 text-white shadow-lg" : "text-[#858e9f] hover:text-white"
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`px-8 py-2 rounded-xl text-sm font-semibold transition-all ${
                mode === "signup" ? "bg-blue-600 text-white shadow-lg" : "text-[#858e9f] hover:text-white"
              }`}
            >
              REGISTER
            </button>
          </div>

          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">
              {mode === "signin" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-[#9ea7ba] text-lg">
              {mode === "signin" ? "Sign in to access your dashboard." : "Set up your profile to start practicing."}
            </p>
          </header>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#dce2ee] flex items-center gap-2">
                  <FiUser className="text-blue-400" /> Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#2b344a] bg-[#05070f] px-4 py-3.5 outline-none focus:border-blue-500 transition-colors"
                  placeholder="Hassan Ali"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#dce2ee] flex items-center gap-2">
                <FiMail className="text-blue-400" /> Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="w-full rounded-xl border border-[#2b344a] bg-[#05070f] px-4 py-3.5 outline-none focus:border-blue-500 transition-colors"
                placeholder="hassan@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-[#dce2ee] flex items-center gap-2">
                  <FiLock className="text-blue-400" /> Password
                </label>
                {mode === "signin" && (
                  <button type="button" className="text-xs text-blue-400 hover:underline">Forgot?</button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }}
                  required
                  className="w-full rounded-xl border border-[#2b344a] bg-[#05070f] px-4 py-3.5 outline-none focus:border-blue-500 transition-colors pr-12"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c667f] hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Password Rules - Visual Feedback */}
              {mode === "signup" && password.length > 0 && (
                <div className="mt-4 p-4 rounded-xl border border-[#22314f] bg-[#07101f] space-y-2">
                  {passwordChecks.map((check, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs transition-colors ${check.valid ? "text-emerald-400" : "text-[#94a3c7]"}`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${check.valid ? "bg-emerald-400" : "bg-[#2b344a]"}`} />
                      {check.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {mode === "signup" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#dce2ee]">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordFieldError(""); }}
                    required
                    className={`w-full rounded-xl border bg-[#05070f] px-4 py-3.5 outline-none focus:border-blue-500 ${!confirmPasswordIsValid ? 'border-red-500/50' : 'border-[#2b344a]'}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#dce2ee]">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full rounded-xl border border-[#2b344a] bg-[#05070f] px-4 py-3.5 outline-none focus:border-blue-500"
                  >
                    <option value="candidate">Candidate</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-[#8f97aa]">
              <FiCheckSquare className="text-blue-500" />
              <span>Remember me</span>
            </div>

            {errorMessage && (
              <p className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? "Authenticating..." : mode === "signin" ? "Sign In" : "Register"}
              {!isSubmitting && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#4b5563]">
            <div className="h-px flex-1 bg-[#273148]" />
            Social Logins
            <div className="h-px flex-1 bg-[#273148]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 rounded-xl border border-[#2a334a] py-3 text-sm font-semibold hover:bg-[#111827] transition-colors">
              <FcGoogle size={20} /> Google
            </button>
            <button className="flex items-center justify-center gap-3 rounded-xl border border-[#2a334a] py-3 text-sm font-semibold hover:bg-[#111827] transition-colors">
              <FiLinkedin size={20} className="text-[#0077b5]" /> LinkedIn
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}