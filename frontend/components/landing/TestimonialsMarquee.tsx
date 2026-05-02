import React from "react";

const testimonials = [
  {
    quote: "EchoHire&apos;s AI completely changed how we screen engineers. We&apos;ve cut our hiring time in half without sacrificing quality.",
    author: "Sarah Jenkins",
    role: "VP of Engineering, CloudSync",
  },
  {
    quote: "The interactive IDE and unbiased scoring give us a much clearer picture of a candidate&apos;s actual abilities compared to traditional whiteboarding.",
    author: "Marcus Chen",
    role: "Engineering Manager, TechFlow",
  },
  {
    quote: "Candidates love the conversational feel. It feels like pair programming rather than an interrogation.",
    author: "Emily Ross",
    role: "Technical Recruiter, InnovateAI",
  },
  {
    quote: "We integrated EchoHire directly into our ATS. The automated transcript and scorecard generation is a massive time saver.",
    author: "David Alaba",
    role: "Director of Talent, DevScale",
  },
];

export default function TestimonialsMarquee() {
  return (
    <section className="overflow-hidden py-24 md:py-32 bg-[#030712]">
      <div className="mb-16 text-center px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          Trusted by engineering leaders
        </h2>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        {/* CSS Marquee wrapper */}
        <div className="flex w-full overflow-hidden group">
          <div className="flex w-max animate-marquee space-x-6 px-3 hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((testimonial, i) => (
              <div
                key={i}
                className="w-[350px] md:w-[450px] shrink-0 rounded-3xl border border-white/10 bg-[#070d1a] p-8 flex flex-col justify-between"
              >
                <p className="text-lg text-[#dbe7ff] leading-relaxed mb-8">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <h4 className="font-bold text-white">{testimonial.author}</h4>
                  <p className="text-sm text-[#7f92be]">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient fades for the edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[#030712] to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#030712] to-transparent"></div>
      </div>
    </section>
  );
}
