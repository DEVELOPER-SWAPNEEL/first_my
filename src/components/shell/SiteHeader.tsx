"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { mainNavigation, moreNavigation } from "@/content/routes";
import { ownerContact, profile } from "@/content/profile";
import { currentFact } from "@/lib/content";
import { NavigationLink } from "./NavigationLink";

export function SiteHeader({
  name,
  availability,
  contact,
}: {
  name: string;
  availability: string;
  contact: string;
}) {
  const pathname = usePathname();
  const [contracted, setContracted] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  useEffect(() => {
    // Reference scroll threshold unavailable; 24px is an explicit local estimate.
    const update = () => setContracted(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const sheet = dialog.current;
    if (!sheet) return;
    const release = () => {
      document.body.style.overflow = "";
      if (restoreFocus.current) {
        trigger.current?.focus({ preventScroll: true });
        restoreFocus.current = false;
      }
    };
    if (open) {
      if (!sheet.open) sheet.showModal();
      document.body.style.overflow = "hidden";
      closeButton.current?.focus();
      sheet.scrollTop = 0;
      restoreFocus.current = true;
    } else {
      if (sheet.open) sheet.close();
      release();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const close = () => setOpen(false);
  return (
    <>
      <header className={`site-header${contracted ? " is-contracted" : ""}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="shell-container header-inner">
          <Link className="brand" href="/" aria-label={`${name}, home`}>
            {name}
            <i className="caret" aria-hidden="true" />
          </Link>
          <nav className="desktop-navigation mono" aria-label="Main">
            <ul>
              {mainNavigation
                .filter((item) => item.href !== "/")
                .map((item, index) => (
                  <li key={item.href}>
                    <NavigationLink
                      {...item}
                      number={String(index + 1).padStart(2, "0")}
                      currentPath={pathname}
                    />
                  </li>
                ))}
            </ul>
          </nav>
          <div className="header-end">
            <p className="header-status mono">
              <i className="status-dot" aria-hidden="true" />
              {availability}
            </p>
            <Link className="contact-button" href="/contact">
              Get in touch
            </Link>
            <button
              ref={trigger}
              className="menu-button"
              aria-label="Menu"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen(true)}
            >
              <i />
              <i />
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="site-menu"
        className="menu-sheet"
        aria-label="Menu"
        onCancel={close}
        onClose={close}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const items = event.currentTarget.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          );
          const first = items[0];
          const last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <div className="menu-top">
          <Link className="brand" href="/" onClick={close}>
            {name}
            <i className="caret" aria-hidden="true" />
          </Link>
          <button
            ref={closeButton}
            className="menu-button is-close"
            aria-label="Close menu"
            onClick={close}
          >
            <i />
            <i />
          </button>
        </div>
        <div className="menu-body">
          <nav aria-label="Menu main">
            <ul className="menu-main">
              {mainNavigation.map((item, index) => (
                <li
                  key={item.href}
                  style={{ "--row-index": index } as CSSProperties}
                  onClick={close}
                >
                  <Link
                    href={item.href}
                    aria-current={
                      pathname === item.href ||
                      (item.href !== "/" &&
                        pathname.startsWith(`${item.href}/`))
                        ? "page"
                        : undefined
                    }
                  >
                    <span className="mono">
                      {String(index).padStart(2, "0")}
                    </span>
                    <b>{item.label}</b>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="label mono">More pages</p>
          <nav aria-label="More pages">
            <ul className="menu-more mono">
              {moreNavigation.map((item) => (
                <li key={item.href} onClick={close}>
                  <NavigationLink {...item} currentPath={pathname} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="menu-footer mono">
          <p>
            <i className="status-dot" aria-hidden="true" />
            {availability}
          </p>
          <p>
            <a href={`mailto:${contact}`}>{contact}</a>
          </p>
          <p>
            <a href={ownerContact.telephoneUri}>{ownerContact.phone}</a>
          </p>
          <p className="menu-social">
            <a href={currentFact(profile.github)!}>GitHub ↗</a> ·{" "}
            <a href={currentFact(profile.linkedin)!}>LinkedIn ↗</a>
          </p>
          <Link className="contact-button" href="/contact" onClick={close}>
            Get in touch<span aria-hidden="true">→</span>
          </Link>
        </div>
      </dialog>
    </>
  );
}
