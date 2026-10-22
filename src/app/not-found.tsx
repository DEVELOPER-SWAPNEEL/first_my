import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="shell-container unfinished-page">
      <p className="eyebrow mono">{"// Unregistered destination"}</p>
      <h1>Page not found.</h1>
      <p>This route is outside the current reference registry.</p>
      <Link href="/">Return home</Link>
    </main>
  );
}
