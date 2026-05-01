import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FileText, BrainCircuit, LineChart } from "lucide-react";

const steps = [
  {
    id: 0,
    title: "1. Upload Job Description",
    description: "Simply paste your JD or upload a file. EchoHire's AI instantly parses the requirements and creates a custom evaluation rubric tailored to the role.",
    icon: FileText,
  },
  {
    id: 1,
    title: "2. AI Conducts Interviews",
    description: "Candidates interact with our advanced conversational AI. They solve coding challenges in a real IDE while the AI probes their thought process just like a senior engineer would.",
    icon: BrainCircuit,
  },
  {
    id: 2,
    title: "3. Review Deep Insights",
    description: "Receive a comprehensive scorecard for each candidate. We provide unbiased rankings, detailed competency breakdowns, and full interview transcripts.",
    icon: LineChart,
  },
];

export default function HowItWorksStepper() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <div className="mb-16 text-center md:mb-24">
        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          How EchoHire Works
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[#98a7cb]">
          A seamless process designed to save your engineering team hundreds of hours.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
        {/* Left Column: Stepper */}
        <div className="flex flex-col justify-center space-y-4">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`group flex items-start gap-6 rounded-[2rem] border p-6 text-left transition-all duration-300 ${isActive
                  ? "border-[#227dff]/30 bg-[#070d1a]"
                  : "border-transparent hover:bg-white/5"
                  }`}
              >
                <div
                  className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${isActive
                    ? "border-[#227dff] bg-[#227dff]/10 text-[#227dff]"
                    : "border-white/10 bg-transparent text-[#7f92be] group-hover:text-white"
                    }`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3
                    className={`text-xl font-bold transition-colors ${isActive ? "text-white" : "text-[#7f92be] group-hover:text-white"
                      }`}
                  >
                    {step.title}
                  </h3>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="text-[#98a7cb] leading-relaxed overflow-hidden"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Dynamic Content Window */}
        <div className="relative flex min-h-[400px] items-center justify-center rounded-[2.5rem] border border-white/10 bg-[#070d1a] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex w-full flex-col items-center justify-center p-8 text-center"
            >
              {(() => {
                const ActiveIcon = steps[activeStep].icon;
                return (
                  <>
                    <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-3xl border border-white/5 bg-[#0d162a]">
                      <ActiveIcon className="h-16 w-16 text-[#227dff]" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">{steps[activeStep].title}</h4>
                    <p className="text-[#7f92be] max-w-md mx-auto">
                      Visual representation of the {steps[activeStep].title.toLowerCase()} process taking place within the EchoHire system.
                    </p>
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
