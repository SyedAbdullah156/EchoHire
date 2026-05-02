import Navbar from "@/components/Navbar";
import LandingClient from "@/components/landing/LandingClient";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden">
      <Navbar />
      <LandingClient />
    </main>
  );
}