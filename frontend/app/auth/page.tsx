"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiMail, FiLock, FiUser, FiArrowRight, FiShield, FiGithub, FiCheck, FiCpu, FiBarChart2, FiAward, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authSchema, emailSchema } from "@/lib/validation";
import Link from "next/link";
import { loginAction, registerAction } from "./actions";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

// --- Configuration & Constants ---
const TESTIMONIALS = [
  {
    quote: "EchoHire's AI interview prep reduced my anxiety and helped me land a Senior Dev role at a top fintech.",
    author: "Sarah J.",
    role: "Senior Software Engineer",
    icon: <FiCpu className="text-primary" />
  },
  {
    quote: "The ATS optimization feature is a game-changer. My response rate from recruiters tripled in two weeks.",
    author: "Michael R.",
    role: "Product Manager",
    icon: <FiBarChart2 className="text-primary" />
  },
  {
    quote: "I finally feel confident during behavioral rounds. The real-time feedback is like having a private coach.",
    author: "Elena T.",
    role: "UX Designer",
    icon: <FiAward className="text-primary" />
  }
];

const SHAKE_VARIANTS = {
  shake: {
    x: [0, -6, 6, -6, 6, 0],
    transition: { duration: 0.4, ease: "easeInOut" }
  }
};

// --- Sub-components ---

function FloatingInput({
  label,
  value,
  onChange,
  type = "text",
  icon: Icon,
  required = false,
  error = "",
  onBlur,
  name
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  icon?: React.ElementType;
  required?: boolean;
  error?: string;
  onBlur?: () => void;
  name?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isFloating = isFocused || value.length > 0;
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full group">
      <motion.div
        variants={SHAKE_VARIANTS}
        animate={error ? "shake" : "default"}
        className={`relative flex items-center min-h-[56px] rounded-xl border transition-all duration-200 
          ${isFocused ? "border-primary bg-surface-2" : "border-border-medium bg-surface-1 hover:border-text-muted"}
          ${error ? "border-rose-500/50 bg-rose-500/5" : ""}
        `}
      >
        {Icon && (
          <div className={`pl-4 flex items-center justify-center transition-colors duration-200 ${isFocused ? "text-primary" : "text-text-muted"}`}>
            <Icon size={20} />
          </div>
        )}
        <div className="relative flex-1 h-full flex items-center">
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none tracking-wide
              ${isFloating
                ? "text-[10px] uppercase font-bold -translate-y-3.5 text-primary"
                : "text-sm text-text-muted translate-y-0"
              }
            `}
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          <input
            name={name}
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            required={required}
            className={`w-full h-full bg-transparent border-none outline-none px-4 pt-4 text-sm text-white placeholder:opacity-0 focus:ring-0 ${isPassword ? "pr-12" : ""}`}
          />
        </div>
        {/* Eye toggle — only on password fields */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="pr-4 pl-2 flex items-center text-text-muted hover:text-white transition-colors shrink-0"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 ml-1 text-[11px] font-medium text-rose-400 tracking-tight overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}


function AuthContent() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup" | "magic">("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (fieldName: string, value: string) => {
    let fieldError = "";
    try {
      if (fieldName === "email") emailSchema.parse(value);
      else if (fieldName === "password" && mode === "signup") {
        const missing = [];
        if (value.length < 8) missing.push("8 characters");
        if (!/[A-Z]/.test(value)) missing.push("one uppercase letter");
        if (!/[0-9]/.test(value)) missing.push("one number");
        if (!/[^A-Za-z0-9]/.test(value)) missing.push("one special character");
        
        if (missing.length > 0) {
          fieldError = `Password must include at least: ${missing.join(", ")}`;
        }
      }
      else if (fieldName === "password" && mode === "signin" && !value) fieldError = "Password is required";
      else if (fieldName === "name" && mode === "signup" && value.length < 2) fieldError = "Name is too short";
      else if (fieldName === "confirmPassword" && mode === "signup" && value !== password) fieldError = "Passwords do not match";
    } catch (err: unknown) { 
      if (err && typeof err === 'object' && 'issues' in err) {
        const zodErr = err as { issues: { message: string }[] };
        fieldError = zodErr.issues?.[0]?.message || "Invalid input";
      } else {
        fieldError = "Invalid input";
      }
    }
    setErrors(prev => ({ ...prev, [fieldName]: fieldError }));
  };

  const handleBlur = (fieldName: string, value: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value);
  };

  const handleChange = (fieldName: string, value: string, setter: (v: string) => void) => {
    setter(value);
    const isPasswordSignup = fieldName === "password" && mode === "signup";
    if (touched[fieldName] || errors[fieldName] || isPasswordSignup) {
      validateField(fieldName, value);
    }
  };

  // Rotation for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async () => {
      setIsSubmitting(true);
      try {
        // Implementation for Google login would go here
        toast.info("Google Authentication integration in progress.");
      } catch {
        toast.error("Google login failed.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Simple mock for Magic Link
    if (mode === "magic") {
      setIsSubmitting(true);
      setTimeout(() => {
        toast.success(`Magic link sent to ${email}. Check your inbox!`);
        setIsSubmitting(false);
      }, 1500);
      return;
    }

    const parsed = authSchema.safeParse(
      mode === "signin"
        ? { mode, email, password }
        : { mode, name, email, password, confirmPassword, role }
    );

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      const newTouched: Record<string, boolean> = {};
      parsed.error.issues.forEach(issue => {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      });
      ["name", "email", "password", "confirmPassword"].forEach(f => newTouched[f] = true);
      setErrors(fieldErrors);
      setTouched(newTouched);
      toast.error("Please correct the errors in the form.");
      const firstError = parsed.error.issues[0].path.join(".");
      document.getElementsByName(firstError)[0]?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (mode === "signin") {
        result = await loginAction({ email: email.trim(), password });
      } else {
        result = await registerAction({ name: name.trim(), email: email.trim(), password, role });
      }

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(mode === "signin" ? "Welcome back to EchoHire!" : "Account created successfully.");
      router.push(result.redirectUrl || "/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "System error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <main className="flex-1 bg-background flex flex-col lg:flex-row overflow-hidden selection:bg-primary/30">

        {/* --- Left Side: Visual/Brand --- */}
        <section className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-surface-1 border-r border-border-medium relative flex-col justify-between p-16">
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <span className="text-base font-black text-white">EH</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Echo<span className="text-primary">Hire</span>
              </span>
            </Link>
          </div>

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-8"
              >
                <div className="h-12 w-12 rounded-2xl bg-surface-2 border border-border-medium flex items-center justify-center text-xl">
                  {TESTIMONIALS[activeTestimonial].icon}
                </div>
                <h2 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
                  {TESTIMONIALS[activeTestimonial].quote}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-surface-2 border border-border-medium flex items-center justify-center font-bold text-primary">
                    {TESTIMONIALS[activeTestimonial].author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-wider">{TESTIMONIALS[activeTestimonial].author}</p>
                    <p className="text-xs text-text-muted">{TESTIMONIALS[activeTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 mt-12">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${i === activeTestimonial ? "w-8 bg-primary" : "w-4 bg-border-medium"}`}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-xs font-bold text-text-muted tracking-widest uppercase">
            <FiShield className="text-primary" />
            Enterprise Grade Security & Privacy
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#227dff_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#227dff05_1px,transparent_1px),linear-gradient(to_bottom,#227dff05_1px,transparent_1px)] [background-size:128px_128px]" />
          </div>
        </section>

        {/* --- Right Side: Interaction --- */}
        <section className="flex-1 bg-background overflow-y-auto">
          <div className="min-h-full w-full flex flex-col items-center justify-start py-12 lg:py-32 px-6 sm:px-12">

            {/* Mobile Logo */}
            <div className="lg:hidden mb-12">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <span className="text-base font-black text-white">EH</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">EchoHire</span>
              </Link>
            </div>

            <motion.div
              className="w-full max-w-[440px] bg-surface-1 border border-border-medium rounded-[3rem] p-8 md:p-12"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div className="space-y-2 text-center lg:text-left">
                    <h1 className="text-3xl font-black text-white tracking-tight">
                      {mode === "signin" ? "Access Workspace" : mode === "signup" ? "Build Your Profile" : "Passwordless Login"}
                    </h1>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {mode === "signin"
                        ? "Enter your credentials to continue your career journey."
                        : mode === "signup"
                          ? "Join 15,000+ engineers optimizing their future."
                          : "Enter your email and we'll send you a secure login link."
                      }
                    </p>
                  </div>

                  {/* Main Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {mode === "signup" && (
                      <FloatingInput
                        name="name"
                        label="Full Name"
                        value={name}
                        onChange={(v) => handleChange("name", v, setName)}
                        onBlur={() => handleBlur("name", name)}
                        icon={FiUser}
                        required
                        error={errors.name}
                      />
                    )}

                    <FloatingInput
                      name="email"
                      label="Email Address"
                      value={email}
                      onChange={(v) => handleChange("email", v, setEmail)}
                      onBlur={() => handleBlur("email", email)}
                      type="email"
                      icon={FiMail}
                      required
                      error={errors.email}
                    />

                    {mode !== "magic" && (
                      <div className="space-y-1">
                        <FloatingInput
                          name="password"
                          label="Password"
                          value={password}
                          onChange={(v) => handleChange("password", v, setPassword)}
                          onBlur={() => handleBlur("password", password)}
                          type="password"
                          icon={FiLock}
                          required
                          error={errors.password}
                        />
                        {mode === "signin" && (
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => setMode("magic")}
                              className="text-[11px] font-bold uppercase tracking-widest text-text-muted hover:text-primary transition-colors"
                            >
                              Forgot Password?
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {mode === "signup" && (
                      <>
                        <FloatingInput
                          name="confirmPassword"
                          label="Confirm Password"
                          value={confirmPassword}
                          onChange={(v) => handleChange("confirmPassword", v, setConfirmPassword)}
                          onBlur={() => handleBlur("confirmPassword", confirmPassword)}
                          type="password"
                          icon={FiCheck}
                          required
                          error={errors.confirmPassword}
                        />
                        <div className="pt-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 ml-1">Select Role</p>
                          <div className="grid grid-cols-2 gap-3">
                            {(["candidate", "recruiter"] as const).map((r) => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`h-11 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all
                              ${role === r
                                    ? "bg-primary border-primary text-white"
                                    : "bg-surface-2 border-border-medium text-text-muted hover:border-text-muted"
                                  }
                            `}
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[56px] rounded-xl bg-primary text-sm font-bold text-white uppercase tracking-widest transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? "Authenticating..." : mode === "signin" ? "Login to Dashboard" : mode === "signup" ? "Create Account" : "Send Magic Link"}
                      {!isSubmitting && <FiArrowRight />}
                    </button>
                  </form>

                  {/* SSO Options */}
                  <div className="space-y-6 pt-4">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border-subtle"></div>
                      </div>
                      <span className="relative px-4 bg-surface-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">Or Securely Connect With</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleGoogleLogin()}
                        className="h-[52px] rounded-xl border border-border-medium bg-surface-2 flex items-center justify-center gap-3 text-xs font-bold text-white hover:bg-surface-1 hover:border-text-muted transition-all"
                      >
                        <FcGoogle size={20} />
                        Google
                      </button>
                      <button className="h-[52px] rounded-xl border border-border-medium bg-surface-2 flex items-center justify-center gap-3 text-xs font-bold text-white hover:bg-surface-1 hover:border-text-muted transition-all">
                        <FiGithub size={20} />
                        GitHub
                      </button>
                    </div>
                  </div>

                  {/* Mode Switchers */}
                  <div className="pt-8 text-center border-t border-border-subtle">
                    <p className="text-sm text-text-muted">
                      {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
                      {" "}
                      <button
                        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                        className="text-primary font-bold hover:underline underline-offset-4"
                      >
                        {mode === "signin" ? "Create Account" : "Sign In Instead"}
                      </button>
                    </p>
                    {mode === "magic" && (
                      <button
                        onClick={() => setMode("signin")}
                        className="mt-4 text-xs font-bold text-text-muted hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
                      >
                        <FiArrowLeft /> Back to Password Login
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <p className="mt-12 text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold opacity-50">
              &copy; 2024 EchoHire Labs &middot; Privacy First Architecture
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function AuthPage() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContent />
    </GoogleOAuthProvider>
  );
}