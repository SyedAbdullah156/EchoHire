"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { FiCheckSquare } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FiLinkedin } from "react-icons/fi";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

  const persistSession = (token: string, profile: { name: string; email: string; role: string }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (mode === "signup" && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = mode === "signin" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        mode === "signin"
          ? { email, password }
          : { name, email, password, role };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message ?? "Authentication failed");
      }

      persistSession(result.token, result.data);
      const nextPath =
        result?.data?.role === "recruiter"
          ? "/recruiter-dashboard"
          : "/dashboard?completeProfile=1";
      router.push(nextPath);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode: "signin" | "signup") => {
    setMode(nextMode);
    setErrorMessage("");
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
            {mode === "signin" ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="mb-6 mt-2 text-sm text-[#8f97aa] md:text-base">
            {mode === "signin"
              ? "Sign in to continue to your dashboard."
              : "Set up your account to start interview practice."}
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
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-[#2b344a] bg-transparent px-4 py-3 text-base outline-none placeholder:text-[#5c667f] focus:border-[#3f83ff]"
                placeholder="Enter your password"
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#dce2ee] md:text-base">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  className="w-full rounded-xl border border-[#2b344a] bg-transparent px-4 py-3 text-base outline-none placeholder:text-[#5c667f] focus:border-[#3f83ff]"
                  placeholder="Confirm your password"
                />
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
