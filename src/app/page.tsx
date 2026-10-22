import type { Metadata } from "next";
import { HomeMotion } from "@/components/motion/HomeMotion";
import {
  About,
  Brief,
  Career,
  ClientStrip,
  Faq,
  Hero,
  Lab,
  Reviews,
  Scores,
  SelectedWork,
  Services,
  Stack,
  Writing,
} from "@/components/home/HomeSections";
export const metadata: Metadata = {
  title: "Swapneel Purohit · Local editorial preview",
  description:
    "Swapneel’s infrastructure, backend work and LaunchOps lab. Unpublished editorial preview.",
  robots: { index: false, follow: false },
};
export default function HomePage() {
  return (
    <main id="main" tabIndex={-1}>
      <HomeMotion />
      <Hero />
      <ClientStrip />
      <SelectedWork />
      <About />
      <Scores />
      <Stack />
      <Services />
      <Career />
      <Lab />
      <Reviews />
      <Writing />
      <Faq />
      <Brief />
    </main>
  );
}
