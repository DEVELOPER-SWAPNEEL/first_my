import Link from "next/link";
import { routes, type SiteRoute } from "@/content/routes";
export function UnfinishedPage({ route }: { route: SiteRoute }) {
  const children = routes.filter((item) => item.parent === route.path);
  return (
    <main id="main" tabIndex={-1} className="unfinished-page shell-container">
      <p className="eyebrow mono">{"// DRAFT · M1 local foundation"}</p>
      <h1>{route.label}</h1>
      <p className="unfinished-copy">
        This page is unfinished. Only the site shell is implemented.
      </p>
      {route.mappingIdentifier && (
        <p className="mapping-note mono">
          Temporary reference mapping: <code>{route.path}</code>. This is not an
          owner project, service or article claim.
        </p>
      )}
      {children.length > 0 && (
        <nav
          className="route-destinations"
          aria-label={`${route.label} unfinished destinations`}
        >
          <p className="label mono">Unfinished destinations</p>
          <ul>
            {children.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  {item.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </main>
  );
}
