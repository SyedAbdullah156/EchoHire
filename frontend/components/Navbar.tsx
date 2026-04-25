"use client";

import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut, FiMenu, FiUser, FiX } from "react-icons/fi";

const PROFILE_STORAGE_KEY = "echohire-profile";

type StoredProfile = {
  fullName?: string;
  avatarDataUrl?: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [profileName, setProfileName] = useState("User");
  const [profileAvatar, setProfileAvatar] = useState("");

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const loadProfile = () => {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as StoredProfile;
        setProfileName(parsed.fullName?.trim() || "User");
        setProfileAvatar(parsed.avatarDataUrl || "");
      } catch {
        // ignore bad data
      }
    };

    loadProfile();
    window.addEventListener("storage", loadProfile);
    return () => window.removeEventListener("storage", loadProfile);
  }, []);

  const profileInitial = (profileName || "U").charAt(0).toUpperCase();

  const handleLogoTap = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const key = "echohire-logo-tap-count";
    const raw = sessionStorage.getItem(key);
    const current = raw ? Number.parseInt(raw, 10) : 0;
    const nextPath = current % 2 === 0 ? "/" : "/about-echohire";
    sessionStorage.setItem(key, String(current + 1));
    closeMenu();
    router.push(nextPath);
  };

  const isAppSection =
    pathname === "/dashboard" ||
    pathname === "/ai-interview" ||
    pathname === "/resume-analyzer" ||
    pathname === "/linkedin-optimizer" ||
    pathname === "/profile" ||
    pathname === "/settings" ||
    pathname === "/support";

  return (
    <div className="fixed top-4 z-[1000] flex w-full justify-center px-3 md:top-6 md:px-4">
      <nav className="w-full max-w-7xl flex items-center justify-between px-4 py-2.5 md:px-6
  rounded-2xl 
  border border-white/30 
  bg-black/20 backdrop-blur-xl
  shadow-[0_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(59,130,246,0.3)]">

        {/* Logo Section */}
        <Link
          href="/"
          onClick={handleLogoTap}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white text-xs font-bold">EH</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight md:text-xl">
            Echo<span className="text-blue-400">Hire</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-10 text-[13px] font-medium tracking-wide">
          <Link href="/" className="text-gray-400 hover:text-blue-300 transition-colors duration-300">Home</Link>
          <Link href="/pricing" className="text-gray-400 hover:text-blue-300 transition-colors duration-300">Pricing</Link>
          <Link href="/ai-interview" className="text-gray-400 hover:text-blue-300 transition-colors duration-300">AI Interview</Link>
          <Link href="/linkedin-optimizer" className="text-gray-400 hover:text-blue-300 transition-colors duration-300">Optimizer</Link>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAppSection ? (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium text-[#dbe7ff] transition hover:bg-white/10"
              >
                {profileAvatar ? (
                  <img src={profileAvatar} alt="Profile avatar" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-xs font-semibold text-white">
                    {profileInitial}
                  </span>
                )}
                <span className="max-w-[90px] truncate">{profileName}</span>
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-xl border border-[#2f4168] bg-[#101a2f] px-4 py-2 text-sm font-medium text-[#d2dcf5] transition hover:border-[#4f6697] hover:text-white"
              >
                <FiLogOut />
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-[13px] font-medium text-gray-300 hover:text-white transition-all">
                Sign In
              </Link>

              <Link href="/auth" className="relative group px-5 py-2 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 group-hover:scale-105 transition-transform duration-300"></div>
                <span className="relative text-sm font-semibold text-white">
                  Get Started
                </span>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-[1100] transition-all duration-200 md:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={closeMenu}
          className="absolute inset-0 bg-black/55"
        />
        <div
          className={`absolute right-0 top-0 h-full w-[84vw] max-w-[320px] border-l border-white/20 bg-[#070f22]/95 p-4 backdrop-blur-xl transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={closeMenu}
              className="rounded-lg border border-white/20 bg-black/30 p-2 text-[#c7d7f8]"
              aria-label="Close menu"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-3 text-sm text-[#d4e2ff]">
            <Link href="/" onClick={closeMenu} className="rounded-lg px-3 py-2 hover:bg-[#13213f]">Home</Link>
            <Link href="/pricing" onClick={closeMenu} className="rounded-lg px-3 py-2 hover:bg-[#13213f]">Pricing</Link>
            <Link href="/ai-interview" onClick={closeMenu} className="rounded-lg px-3 py-2 hover:bg-[#13213f]">AI Interview</Link>
            <Link href="/linkedin-optimizer" onClick={closeMenu} className="rounded-lg px-3 py-2 hover:bg-[#13213f]">Optimizer</Link>
            <Link href="/dashboard" onClick={closeMenu} className="rounded-lg px-3 py-2 hover:bg-[#13213f]">Dashboard</Link>
            {isAppSection ? (
              <>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-center font-medium text-[#dbe7ff]"
                >
                  {profileAvatar ? (
                    <img src={profileAvatar} alt="Profile avatar" className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-[11px] font-semibold text-white">
                      {profileInitial}
                    </span>
                  )}
                  <span className="truncate">{profileName}</span>
                </Link>
                <Link
                  href="/auth"
                  onClick={closeMenu}
                  className="rounded-lg border border-[#2f4168] bg-[#101a2f] px-3 py-2 text-center font-medium text-[#dbe7ff]"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link href="/auth" onClick={closeMenu} className="mt-2 rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-3 py-2 text-center font-medium text-white">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}