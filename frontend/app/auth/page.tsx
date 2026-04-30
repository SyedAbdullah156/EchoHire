"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { FiCheckSquare } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FiLinkedin } from "react-icons/fi";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authSchema, getZodFieldMessage, parseZodMessage } from "@/lib/validation";
import { getApiErrorMessage } from "@/lib/api-error";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5050";
const PROFILE_STORAGE_KEY = "echohire-profile";
const TOKEN_STORAGE_KEY = "echohire-token";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPasswordFieldError, setConfirmPasswordFieldError] = useState("");

  const passwordChecks = useMemo(() => {
    if (mode !== "signup") {
      return [];
    }

    return [
      {
        label: "8-128 characters",
        valid: password.length >= 8 && password.length <= 128,
      },
      {
        label: "At least one uppercase letter",
        valid: /[A-Z]/.test(password),
      },
      {
        label: "At least one lowercase letter",
        valid: /[a-z]/.test(password),
      },
      {
        label: "At least one number",
        valid: /[0-9]/.test(password),
      },
      {
        label: "At least one special character",
        valid: /[^A-Za-z0-9]/.test(password),
      },
    ];
  }, [mode, password]);

  const passwordIsValid = passwordChecks.length > 0 && passwordChecks.every((check) => check.valid);
  const confirmPasswordIsValid = mode !== "signup" || confirmPassword.length === 0 || password === confirmPassword;

  const persistSession = (token: string, profile: { name: string; email: string; role: string }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  };

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
      const message =
        parsed.error.issues
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
      const payload =
        mode === "signin"
          ? { email: email.trim(), password }
          : { name: name.trim(), email: email.trim(), password, role };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(getApiErrorMessage(result, "Authentication failed"));
      }

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
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="mx-auto grid max-w-[1540px] grid-cols-1 gap-8 px-6 pb-8 pt-28 md:grid-cols-[1.65fr_1fr]">
        <div className="overflow-hidden rounded-[26px] border border-white/25">
          <Image
            src="/mainpagepic.png"
            alt="AI visual"
            width={1200}
            height={900}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div className="rounded-[22px] border border-[#243253] bg-[#05070f] p-6 md:p-8">
          <div className="mb-6 flex gap-8 text-base font-semibold md:text-lg">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`pb-2 transition ${
                mode === "signin"
                  ? "border-b-2 border-[#2d7eff] text-[#dbe7ff]"
                  : "text-[#858e9f]"
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`pb-2 transition ${
                mode === "signup"
                  ? "border-b-2 border-[#2d7eff] text-[#dbe7ff]"
                  : "text-[#858e9f]"
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          <h1 className="text-3xl font-bold leading-tight text-[#3f83ff] md:text-4xl">
            {mode === "signin"
              ? "Sign in to continue to your dashboard."
              : "Set up your account to start interview practice."}
          </h1>

          <p className="mt-3 text-base leading-7 text-[#9ea7ba] md:text-lg">
            {mode === "signin"
              ? "Use your email and password to access your account."
              : "Create your profile, choose your role, and start practicing interviews."}
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#dce2ee] md:text-base">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full rounded-xl border border-[#2b344a] bg-transparent px-4 py-3 text-base outline-none placeholder:text-[#5c667f] focus:border-[#3f83ff]"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#dce2ee] md:text-base">
                Email Address
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                className="w-full rounded-xl border border-[#2b344a] bg-transparent px-4 py-3 text-base outline-none placeholder:text-[#5c667f] focus:border-[#3f83ff]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#dce2ee] md:text-base">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrorMessage("");
                }}
                required
                className="w-full rounded-xl border border-[#2b344a] bg-transparent px-4 py-3 text-base outline-none placeholder:text-[#5c667f] focus:border-[#3f83ff]"
                placeholder="Enter your password"
              />
              {mode === "signup" && (
                <div className="mt-3 space-y-2 rounded-xl border border-[#22314f] bg-[#07101f] p-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7f8fb2]">
                    Password rules
                  </p>
                  <div className="grid gap-2">
                    {passwordChecks.map((check) => (
                      <div
                        key={check.label}
                        className={`flex items-center gap-2 text-sm transition-colors ${check.valid ? "text-emerald-300" : "text-[#94a3c7]"}`}
                      >
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${check.valid ? "border-emerald-400 bg-emerald-400/15" : "border-[#556484] bg-transparent"}`}
                        >
                          {check.valid ? "✓" : "•"}
                        </span>
                        {check.label}
                      </div>
                    ))}
                  </div>
                  {password.length > 0 && passwordIsValid && (
                    <p className="text-sm text-emerald-300">Password looks good.</p>
                  )}
                </div>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#dce2ee] md:text-base">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setConfirmPasswordFieldError("");
                    setErrorMessage("");
                  }}
                  required
                  className="w-full rounded-xl border border-[#2b344a] bg-transparent px-4 py-3 text-base outline-none placeholder:text-[#5c667f] focus:border-[#3f83ff]"
                  placeholder="Confirm your password"
                />
                {confirmPassword.length > 0 && !confirmPasswordIsValid && (
                  <p className="mt-2 text-sm text-red-300">Passwords do not match.</p>
                )}
                {confirmPasswordFieldError && (
                  <p className="mt-2 text-sm text-red-300">{confirmPasswordFieldError}</p>
                )}
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#dce2ee] md:text-base">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as "candidate" | "recruiter")}
                  className="w-full rounded-xl border border-[#2b344a] bg-black/30 px-4 py-3 text-base outline-none focus:border-[#3f83ff]"
                >
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-[#8f97aa] md:text-base">
              <label className="flex items-center gap-2">
                <FiCheckSquare className="text-[#2e7eff]" />
                Remember me
              </label>
              {mode === "signin" && (
                <button type="button" className="hover:text-white">
                  Forgot Password?
                </button>
              )}
            </div>

            {errorMessage && (
              <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="block w-full rounded-xl bg-gradient-to-r from-[#227dff] to-[#332989] py-3 text-center text-base font-medium text-[#ebf2ff] md:text-lg"
            >
              {isSubmitting
                ? "Please wait..."
                : mode === "signin"
                  ? "Login to Your Space"
                  : "Create Account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-sm text-[#7f889b]">
            <div className="h-px flex-1 bg-[#273148]" />
            or continue with
            <div className="h-px flex-1 bg-[#273148]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#2a334a] py-3 text-base font-medium text-[#d8e2fb] md:text-lg"
            >
              <FcGoogle />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#2a334a] py-3 text-base font-medium text-[#d8e2fb] md:text-lg"
            >
              <FiLinkedin className="text-[#2f82ff]" />
              LinkedIn
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
