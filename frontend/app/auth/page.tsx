import Image from "next/image";
import Navbar from "@/components/Navbar";
import { FiCheckSquare } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FiLinkedin } from "react-icons/fi";

export default function AuthPage() {
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

        <div className="rounded-[22px] bg-[#05070f] p-8">
          <div className="mb-6 flex gap-10 text-[24px] font-semibold">
            <button className="border-b-2 border-[#2d7eff] pb-2 text-[#dbe7ff]">SIGN IN</button>
            <button className="pb-2 text-[#858e9f]">CREATE ACCOUNT</button>
          </div>

          <h1 className="text-[64px] font-bold leading-none text-[#3f83ff]">Welcome Back!</h1>
          <p className="mb-8 mt-2 text-[24px] text-[#8f97aa]">Log in to access your dashboard</p>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-[35px] font-semibold text-[#dce2ee]">Email Address</label>
              <input
                className="w-full rounded-2xl border border-[#2b344a] bg-transparent px-5 py-4 text-[27px] outline-none placeholder:text-[#5c667f] focus:border-[#3f83ff]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="mb-2 block text-[35px] font-semibold text-[#dce2ee]">Password</label>
              <input
                type="password"
                className="w-full rounded-2xl border border-[#2b344a] bg-transparent px-5 py-4 text-[27px] outline-none placeholder:text-[#5c667f] focus:border-[#3f83ff]"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between text-[24px] text-[#8f97aa]">
              <label className="flex items-center gap-2">
                <FiCheckSquare className="text-[#2e7eff]" />
                Remember me
              </label>
              <button className="hover:text-white">Forgot Password?</button>
            </div>

            <button className="w-full rounded-2xl bg-gradient-to-r from-[#227dff] to-[#332989] py-4 text-[34px] font-medium text-[#ebf2ff]">
              Login to Your Space
            </button>
          </div>

          <div className="my-8 flex items-center gap-3 text-[23px] text-[#7f889b]">
            <div className="h-px flex-1 bg-[#273148]" />
            or continue with
            <div className="h-px flex-1 bg-[#273148]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 rounded-2xl border border-[#2a334a] py-4 text-[34px] font-medium text-[#d8e2fb]">
              <FcGoogle />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 rounded-2xl border border-[#2a334a] py-4 text-[34px] font-medium text-[#d8e2fb]">
              <FiLinkedin className="text-[#2f82ff]" />
              LinkedIn
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
