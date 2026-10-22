import type { NextConfig } from "next";
if (process.env.SITE_PUBLICATION_MODE === "publish") {
  throw new Error(
    "Publication blocked: unfinished routes and unapproved editorial / disclosure content.",
  );
}
const config: NextConfig = {
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};
export default config;
