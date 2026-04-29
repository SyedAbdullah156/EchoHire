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
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-10">
        <h1 className="mb-3 text-center text-4xl font-bold tracking-[0.12em] text-white md:text-5xl">
          PRICING
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-center text-base text-[#9ca8c4]">
          Pick the plan that matches your prep goals.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.title}
              className={`flex min-h-[460px] flex-col rounded-2xl border border-[#1a2338] p-7 shadow-[0_0_30px_rgba(9,28,84,0.2)] ${
                plan.featured ? "scale-[1.02] bg-[#1f2738]" : "bg-[#050d17]"
              }`}
            >
              <div className="mb-6 text-center">
                <p className="mb-1 text-6xl font-semibold text-white">
                  <span className="mr-1 text-xl text-[#1689f2]">$</span>
                  {plan.price}
                </p>
                <p className="text-lg text-[#d9e0f1]">/ month</p>
              </div>

              <button
                type="button"
                className="mb-6 w-full rounded-xl bg-gradient-to-r from-[#2080f8] to-[#3f2f8e] py-3 text-lg font-medium text-[#e4edff]"
              >
                {plan.title}
              </button>

              <ul className="space-y-3 text-base">
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

              <button
                type="button"
                className="mt-auto w-full rounded-xl border border-[#385488] bg-[#0e1a31] py-2.5 text-sm text-[#d7e4ff] transition hover:bg-[#132344]"
              >
                Choose {plan.title}
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
