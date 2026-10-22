import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { draftLabels, profile } from "@/content/profile";
import { currentFact } from "@/lib/content";
import "@/styles/globals.css";
import "@/styles/motion.css";
import { CustomCursor } from "@/components/motion/CustomCursor";
const heading = localFont({
  src: "../fonts/bricolage-grotesque.ttf",
  variable: "--font-heading",
  weight: "200 800",
  display: "swap",
});
const body = localFont({
  src: "../fonts/geist.ttf",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});
const mono = localFont({
  src: "../fonts/jetbrains-mono.ttf",
  variable: "--font-mono",
  weight: "100 800",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Swapneel Purohit · Unpublished preview",
  description:
    "Local portfolio preview for Swapneel Purohit. Editorial copy and work summaries remain under review.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <CustomCursor />
        <SiteHeader
          name={currentFact(profile.displayName) ?? draftLabels.name}
          availability={
            currentFact(profile.availability) ?? draftLabels.availability
          }
          contact={currentFact(profile.email) ?? draftLabels.email}
        />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
