import Navbar from "@/components/Navbar";
import { FiCheck, FiX } from "react-icons/fi";

const plans = [
  {
    price: 49,
    title: "Standard",
    featured: false,
    perks: [
      { label: "Unlimited Access", available: true },
      { label: "Limited Users", available: true },
      { label: "No Monthly Fees", available: true },
      { label: "Up to 100 Projects", available: true },
      { label: "Priority Support", available: false },
      { label: "Value for Money", available: false },
      { label: "Unlimited Storage", available: false },
      { label: "Live Meeting", available: false },
    ],
  },
  {
    price: 99,
    title: "Enterprise",
    featured: true,
    perks: [
      { label: "Unlimited Access", available: true },
      { label: "Unlimited Users", available: true },
      { label: "No Monthly Fees", available: true },
      { label: "Priority Support", available: true },
      { label: "Value for Money", available: true },
      { label: "Unlimited Storage", available: true },
      { label: "Live Meeting", available: true },
      { label: "Unlimited Projects", available: true },
    ],
  },
  {
    price: 79,
    title: "Business",
    featured: false,
    perks: [
      { label: "Unlimited Access", available: true },
      { label: "Limited Users", available: true },
      { label: "No Monthly Fees", available: true },
      { label: "Priority Support", available: true },
      { label: "Value for Money", available: true },
      { label: "Up to 150 Projects", available: true },
      { label: "Unlimited Storage", available: false },
      { label: "Live Meeting", available: false },
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#02050d] text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-32">
        <h1 className="mb-10 text-center text-4xl font-bold tracking-[0.2em] text-white md:text-5xl">
          PRICING
        </h1>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.title}
              className={`rounded-sm border border-[#1a2338] p-8 shadow-[0_0_30px_rgba(9,28,84,0.2)] ${
                plan.featured ? "bg-[#323a46]" : "bg-[#050d17]"
              }`}
            >
              <div className="mb-6 text-center">
                <p className="mb-1 text-7xl font-light text-white">
                  <span className="mr-1 text-3xl text-[#1689f2]">$</span>
                  {plan.price}
                </p>
                <p className="text-4xl text-[#d9e0f1]">/ month</p>
              </div>

              <button className="mb-8 w-full rounded-xl bg-gradient-to-r from-[#2080f8] to-[#3f2f8e] py-3 text-3xl font-medium text-[#e4edff]">
                {plan.title}
              </button>

              <ul className="space-y-3 text-[31px]">
                {plan.perks.map((perk) => (
                  <li
                    key={perk.label}
                    className={`flex items-center gap-3 ${
                      perk.available ? "text-[#d6def1]" : "text-[#556077]"
                    }`}
                  >
                    {perk.available ? (
                      <FiCheck className="text-[#1f8cff]" />
                    ) : (
                      <FiX className="text-[#244b75]" />
                    )}
                    <span>{perk.label}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
