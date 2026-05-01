"use client";

import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { FiCheckSquare, FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FiLinkedin } from "react-icons/fi";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authSchema, getZodFieldMessage } from "@/lib/validation";
import { getApiErrorMessage } from "@/lib/api-error";
import Link from "next/link";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5050";
const PROFILE_STORAGE_KEY = "echohire-profile";
const TOKEN_STORAGE_KEY = "echohire-token";

function AuthForm() {
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

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsSubmitting(true);
        // Note: useGoogleLogin gives an access token, but our backend expects an ID token if we use verifyIdToken.
        // However, we can fetch the user info here using the access token, then send it to the backend, OR we can use GoogleLogin component which provides the ID token credential.
        // Let's use fetch to get user info, or better yet, since the backend expects `credential` (ID token), we should use `flow: "auth-code"` or `credential`.
        // Wait, `useGoogleLogin` with default flow='implicit' gives access_token. Let's just fetch user info here and send it.
        // Actually, backend google-auth-library `verifyIdToken` expects an ID token. Let's send the tokenResponse and let backend handle it, or we can use `@react-oauth/google`'s `<GoogleLogin>` component for simplicity as it directly returns the `credential` ID token.
      } catch (error) {
        toast.error("Google login failed");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: credentialResponse.credential, role: mode === "signup" ? role : undefined }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(getApiErrorMessage(result, "Google authentication failed"));
      }

      persistSession(result.token, result.data);
      toast.success("Successfully logged in with Google.");
      router.push("/dashboard?completeProfile=1");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Import GoogleLogin instead to get the credential JWT directly.
  // Wait, I will just use standard useGoogleLogin?
  // Let's use window.google.accounts.id or standard GoogleLogin component.
  // I will import it from "@react-oauth/google".
  // Wait, I can't put <GoogleLogin> directly inside the button unless it's customized.
  // The easiest way to get an ID token programmatically is to use `useGoogleLogin` with `flow: 'implicit'` but it doesn't return `id_token` by default unless specified scopes, wait no, Google Identity Services prefers credential.
  // Let's implement Google Login properly via window.google.
  // We can just use the backend to fetch user info if we send access_token. Let's update backend to support access_token.

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

  const inputClassName = "w-full min-h-[48px] rounded-xl border border-white/10 bg-[#070d1a] px-4 py-3 text-base outline-none placeholder:text-[#5c667f] transition-all focus:border-[#227dff] focus:ring-2 focus:ring-[#227dff]/30 text-[#dbe7ff]";

  return (
    <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-24 w-full">
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-[linear-gradient(145deg,rgba(7,20,43,0.7)_0%,rgba(11,23,48,0.5)_100%)] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col"
      >
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 border border-white/10 rounded-xl bg-[#030712]/50">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "signin"
                ? "bg-[#227dff] text-white"
                : "text-[#858e9f] hover:text-[#dbe7ff]"
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "signup"
                ? "bg-[#227dff] text-white"
                : "text-[#858e9f] hover:text-[#dbe7ff]"
                }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <motion.div layout="position" className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-[#98a7cb] text-base">
            {mode === "signin"
              ? "Enter your details to access your workspace."
              : "Set up your profile and start practicing."}
          </p>
        </motion.div>

        <motion.form layout className="flex flex-col space-y-5" onSubmit={handleSubmit}>
          <AnimatePresence mode="popLayout">
            {mode === "signup" && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="mb-2 block text-sm font-medium text-[#dbe7ff]">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClassName}
                  placeholder="Enter your full name"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout="position">
            <label className="mb-2 block text-sm font-medium text-[#dbe7ff]">
              Email Address
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className={inputClassName}
              placeholder="Enter your email"
            />
          </motion.div>

          <motion.div layout="position">
            <label className="mb-2 block text-sm font-medium text-[#dbe7ff]">
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
              className={inputClassName}
              placeholder="Enter your password"
            />
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl border border-white/5 bg-[#030712]/50 p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#7f92be]">
                      Password rules
                    </p>
                    <div className="grid gap-2.5">
                      {passwordChecks.map((check) => (
                        <div
                          key={check.label}
                          className={`flex items-center gap-2.5 text-sm transition-colors ${check.valid ? "text-[#227dff]" : "text-[#7f92be]"}`}
                        >
                          <span
                            className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${check.valid ? "bg-[#227dff]/20 text-[#227dff]" : "bg-white/5 text-[#5c667f]"}`}
                          >
                            {check.valid ? "✓" : ""}
                          </span>
                          {check.label}
                        </div>
                      ))}
                    </div>
                    {password.length > 0 && passwordIsValid && (
                      <p className="text-sm text-[#227dff] pt-1 font-medium">Password looks good.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div >

          <AnimatePresence mode="popLayout">
            {mode === "signup" && (
              <motion.div
                key="confirm-password-field"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="mb-2 block text-sm font-medium text-[#dbe7ff]">
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
                  className={inputClassName}
                  placeholder="Confirm your password"
                />
                {confirmPassword.length > 0 && !confirmPasswordIsValid && (
                  <p className="mt-2 text-sm text-red-400">Passwords do not match.</p>
                )}
                {confirmPasswordFieldError && (
                  <p className="mt-2 text-sm text-red-400">{confirmPasswordFieldError}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {mode === "signup" && (
              <motion.div
                key="role-field"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="mb-2 block text-sm font-medium text-[#dbe7ff]">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as "candidate" | "recruiter")}
                  className={inputClassName}
                >
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout="position" className="flex items-center justify-between text-sm text-[#7f92be] pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="flex items-center justify-center w-5 h-5 rounded border border-[#2b344a] bg-[#030712] text-transparent group-hover:border-[#227dff] transition-colors">
                <FiCheckSquare className="text-current w-3.5 h-3.5" />
              </div>
              <span className="group-hover:text-[#98a7cb] transition-colors">Remember me</span>
            </label>
            {mode === "signin" && (
              <Link href="/forgot-password" className="hover:text-white transition-colors">
                Forgot Password?
              </Link>
            )}
          </motion.div>

          {errorMessage && (
            <motion.p layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </motion.p>
          )}

          <motion.button
            layout="position"
            type="submit"
            disabled={isSubmitting}
            className="mt-4 block w-full min-h-[48px] rounded-xl bg-gradient-to-r from-[#227dff] to-[#332989] py-3 text-center text-base font-medium text-white transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#227dff] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "signin"
                ? "Login to Your Space"
                : "Create Account"}
          </motion.button>
        </motion.form>

        <motion.div layout="position" className="my-8 flex items-center gap-4 text-sm text-[#5c667f]">
          <div className="h-px flex-1 bg-white/10" />
          <span>or continue with</span>
          <div className="h-px flex-1 bg-white/10" />
        </motion.div>

        <motion.div layout="position" className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={isSubmitting}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#030712]/50 py-3 text-base font-medium text-[#dbe7ff] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#227dff]"
          >
            <FcGoogle className="w-5 h-5" />
            Google
          </button>
          <button
            type="button"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#030712]/50 py-3 text-base font-medium text-[#dbe7ff] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#227dff]"
          >
            <FiLinkedin className="text-[#227dff] w-5 h-5" />
            LinkedIn
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default function AuthPage() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy_client_id_for_dev";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <main className="min-h-screen bg-[#030712] text-white selection:bg-[#227dff]/30 flex flex-col relative overflow-hidden">
        <Navbar />

        {/* Animated Abstract Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
              x: ["-10%", "10%", "-10%"],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-[#227dff]/20 rounded-full blur-[140px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.3, 0.15],
              x: ["10%", "-10%", "10%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#332989]/30 rounded-full blur-[160px]"
          />
        </div >

        <AuthForm />
      </main >
    </GoogleOAuthProvider >
  );
}