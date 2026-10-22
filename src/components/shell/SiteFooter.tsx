import { IstClock } from "./IstClock";
import { FooterWordmark } from "./FooterWordmark";
import Link from "next/link";
import { footerNavigation } from "@/content/routes";
import { draftLabels, ownerContact, profile } from "@/content/profile";
import { currentFact } from "@/lib/content";
export function SiteFooter() {
  const name = currentFact(profile.name) ?? draftLabels.name;
  const email = currentFact(profile.email);
  return (
    <footer className="site-footer">
      <div className="shell-container footer-inner">
        <div className="footer-top">
          <div className="footer-identity">
            <p className="footer-headline">
              {currentFact(profile.headline) ?? draftLabels.headline}
            </p>
            <div className="footer-contact">
              <span className="label mono">Write to me</span>
              {email ? (
                <a href={`mailto:${email}`}>{email}</a>
              ) : (
                <span className="contact-pending">{draftLabels.email}</span>
              )}
            </div>
            <p className="footer-status mono">
              <i className="status-dot" aria-hidden="true" />
              {currentFact(profile.availability) ?? draftLabels.availability}
            </p>
            <p className="footer-direct mono">
              <a href={ownerContact.telephoneUri}>{ownerContact.phone}</a> ·{" "}
              <a href={ownerContact.resume} download>
                Download resume PDF
              </a>
            </p>
            <p className="footer-direct mono">
              {currentFact(profile.location)}
            </p>
          </div>
          <nav aria-label="Footer" className="footer-columns">
            {footerNavigation.map((group) => (
              <div className="footer-column" key={group.label}>
                <p className="label mono">
                  <span aria-hidden="true">{"// "}</span>
                  {group.label}
                </p>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="footer-column">
              <p className="label mono">
                <span aria-hidden="true">{"// "}</span>Elsewhere
              </p>
              <ul>
                {(["github", "linkedin"] as const).map((key) => {
                  const href = currentFact(profile[key]);
                  const label = {
                    github: "GitHub",
                    linkedin: "LinkedIn",
                    bluesky: "Bluesky",
                  }[key];
                  return (
                    <li key={key}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {label} ↗
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <span className="pending-link">
                          {label}
                          <span className="sr-only"> — link pending</span>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
        <div className="footer-meta mono">
          <p>
            <i className="status-dot" aria-hidden="true" />
            <IstClock />
          </p>
          <p>Unpublished preview · Editorial copy under review</p>
        </div>
        <FooterWordmark name={name} />
      </div>
    </footer>
  );
}
