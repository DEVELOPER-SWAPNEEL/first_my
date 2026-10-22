import Link from "next/link";
export function NavigationLink({
  href,
  label,
  currentPath,
  number,
}: {
  href: string;
  label: string;
  currentPath: string;
  number?: string;
}) {
  const active =
    href === "/"
      ? currentPath === "/"
      : currentPath === href || currentPath.startsWith(`${href}/`);
  return (
    <Link href={href} aria-current={active ? "page" : undefined}>
      {number && (
        <span className="nav-number" aria-hidden="true">
          {number}
        </span>
      )}
      {label}
    </Link>
  );
}
