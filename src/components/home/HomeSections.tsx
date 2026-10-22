import Link from "next/link";
import Image from "next/image";
import { ownerContact, profile } from "@/content/profile";
import { currentFact } from "@/lib/content";
import { AbstractDiagram } from "./AbstractDiagram";
import { homeDraft as draft } from "@/content/home-draft";
import { Action, Placeholder, SectionHeading } from "./Primitives";
import {
  DraftBrief,
  LabRail,
  SingleAccordion,
  StackBoard,
} from "./Interactive";
import { WorkDeck } from "./WorkDeck";
import styles from "./Home.module.css";
import { CompileText, RevealWords, IlluminateWords } from "../motion/Text";
import { PortraitSource } from "../motion/PortraitSource";

export function Hero() {
  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-title">
      <PortraitSource className={styles.portrait}>
        <Image
          src="/images/swapneel-portrait.webp"
          alt="Swapneel Purohit"
          fill
          sizes="(max-width: 900px) 100vw, 48vw"
          preload
          data-reveal="image"
        />
      </PortraitSource>
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={`${styles.container} ${styles.heroInner}`}>
        <p className={styles.previewNotice}>{draft.notice}</p>
        <div className={styles.heroCopy}>
          <p
            className={styles.eyebrow}
            data-reveal="eyebrow"
          >{`// ${draft.professionalHeadline}`}</p>
          <h1 id="hero-title" data-reveal="words">
            {draft.heroLines.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {i === 2 ? (
                  <em>
                    <RevealWords
                      text={line}
                      offset={
                        draft.heroLines
                          .slice(0, i)
                          .join(" ")
                          .split(" ")
                          .filter(Boolean).length
                      }
                    />
                  </em>
                ) : (
                  <RevealWords
                    text={line}
                    offset={
                      draft.heroLines
                        .slice(0, i)
                        .join(" ")
                        .split(" ")
                        .filter(Boolean).length
                    }
                  />
                )}
              </span>
            ))}
          </h1>
          <div className={styles.heroRow}>
            <p className={styles.lead}>{draft.hero.description}</p>
            <div className={styles.heroActions}>
              <Action href="#work" primary>
                Explore the work
              </Action>
              <a className={styles.action} href={ownerContact.resume} download>
                Download CV <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <dl className={styles.heroStats}>
            {draft.heroStats.map((item) => (
              <div key={item.label}>
                <dd>{item.value}</dd>
                <dt>{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <div className={`${styles.plate} ${styles.commit}`}>
          <p className={styles.small}>LaunchOps · current focus</p>
          <p>Local application verified in project records</p>
          <p className={styles.small}>
            Containers and deployment work remain planned
          </p>
        </div>
      </div>
    </section>
  );
}
export function ClientStrip() {
  return (
    <section
      id="clients"
      className={styles.clients}
      aria-label="Technical focus and status"
    >
      <div className={styles.clientTrack}>
        <p className={styles.small}>{"// Technical focus"}</p>
        <ul>
          {draft.clients.map((item) => (
            <li key={item}>
              {item}
              <span aria-hidden="true">/</span>
            </li>
          ))}
        </ul>
      </div>
      <dl className={`${styles.container} ${styles.statusStrip}`}>
        {[
          ["status", currentFact(profile.availability)!],
          ["time zone", "Bengaluru · Asia/Kolkata · IST"],
          ["reply intention", ownerContact.responseIntention],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}:</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
export function SelectedWork() {
  return (
    <section
      id="work"
      className={`${styles.section} ${styles.work}`}
      aria-labelledby="work-title"
    >
      <div className={styles.container}>
        <div className={styles.sectionTop}>
          <SectionHeading
            id="work-title"
            label="Selected work"
            fixture={draft.headings.work}
          />
          <Action href="/work" quiet>
            Work index · pages queued
          </Action>
        </div>
        <WorkDeck>
          {draft.work.map((item, i) => (
            <li
              key={item.id}
              id={`work-${item.id}`}
              style={{ "--card-index": i } as React.CSSProperties}
            >
              <article className={`${styles.plate} ${styles.workCard}`}>
                <div className={styles.workBody}>
                  <p className={`${styles.small} ${styles.workMeta}`}>
                    <span>
                      {String(i + 1).padStart(2, "0")} of{" "}
                      {String(draft.work.length).padStart(2, "0")}
                    </span>
                    <span>{item.period}</span>
                  </p>
                  <div className={styles.workMain}>
                    <h3>
                      <CompileText text={item.title} />
                    </h3>
                    <p>{item.description}</p>
                    <p className={styles.small}>{item.credit}</p>
                  </div>
                  <div className={styles.workFoot}>
                    <p className={styles.workStatus}>{item.evidence}</p>
                    <p className={styles.small}>{item.boundary}</p>
                    <ul className={styles.tags}>
                      {item.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    {item.href ? (
                      <a className={styles.action} href={item.href}>
                        View repository <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <p className={styles.small}>
                        Case page queued · editorial draft
                      </p>
                    )}
                  </div>
                </div>
                <div className={styles.workMedia}>
                  <AbstractDiagram
                    labels={item.diagram}
                    note={item.diagramNote}
                  />
                  <span className={styles.tag}>{item.category}</span>
                </div>
              </article>
            </li>
          ))}
        </WorkDeck>
      </div>
    </section>
  );
}
export function About() {
  return (
    <section
      id="about"
      className={styles.section}
      aria-labelledby="about-title"
    >
      <div className={styles.container}>
        <div className={styles.aboutTop}>
          <div>
            <p className={styles.eyebrow} data-reveal="eyebrow">
              {"// About · DRAFT"}
            </p>
            <h2 id="about-title" className={styles.aboutNarrative}>
              <IlluminateWords text={draft.headings.about.title} />
            </h2>
          </div>
          <figure className={styles.aboutFigure} data-reveal="image">
            <Placeholder label="Desk image" />
            <figcaption className={styles.small}>
              Workspace image pending · neutral placeholder
            </figcaption>
          </figure>
        </div>
        <div className={styles.now}>
          <p className={styles.small}>
            ● Now <span>Profile review · October 2026</span>
          </p>
          <dl>
            {draft.now.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
          <Action href="/about" quiet>
            About page · queued
          </Action>
        </div>
      </div>
    </section>
  );
}
export function Scores() {
  return (
    <section
      id="scores"
      className={`${styles.section} ${styles.scores}`}
      aria-labelledby="scores-title"
    >
      <div className={styles.container}>
        <SectionHeading
          id="scores-title"
          label="Work areas"
          fixture={draft.headings.scores}
        />
        <ul className={styles.rings} aria-label="Work areas, not ratings">
          {[
            "Infrastructure",
            "Observability",
            "Networking",
            "Backend / lab",
          ].map((label, i) => (
            <li key={label}>
              <p className={styles.small}>
                {String(i + 1).padStart(2, "0")} {label}
              </p>
              <div className={styles.ring}>
                <strong className={styles.areaValue}>
                  {["Work", "Work", "Report", "Lab"][i]}
                </strong>
                <span className={styles.small}>Evidence context</span>
              </div>
            </li>
          ))}
        </ul>
        <div className={`${styles.plate} ${styles.vitals}`}>
          <p className={styles.fileBar}>
            LaunchOps status <span>Local records · 14 October 2026</span>
          </p>
          <dl>
            {[
              [
                "API + SQLite",
                "Local",
                "Tests and HTTP check recorded passing",
              ],
              [
                "Container runtime",
                "Prepared",
                "Dockerfile / Compose not runtime-verified",
              ],
              [
                "Delivery + recovery",
                "Planned",
                "Cloud, CI/CD and recovery drills upcoming",
              ],
            ].map(([label, value, note]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  {value}
                  <span className={styles.small}>{note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
export function Stack() {
  return (
    <section
      id="stack"
      className={styles.section}
      aria-labelledby="stack-title"
    >
      <div className={styles.container}>
        <div className={styles.sectionTop}>
          <SectionHeading
            id="stack-title"
            label="The stack"
            fixture={draft.headings.stack}
          />
          <Action href="/stack" quiet>
            Stack page · queued
          </Action>
        </div>
        <StackBoard tools={draft.tools} groups={draft.toolGroups} />
      </div>
    </section>
  );
}
export function Services() {
  return (
    <section
      id="services"
      className={styles.section}
      aria-labelledby="services-title"
    >
      <div className={styles.container}>
        <div className={styles.sectionTop}>
          <SectionHeading
            id="services-title"
            label="Engineering work"
            fixture={draft.headings.services}
          />
          <Action href="/services" quiet>
            Work areas page · queued
          </Action>
        </div>
        <SingleAccordion items={draft.services} kind="services" />
      </div>
    </section>
  );
}
export function Career() {
  return (
    <section
      id="career"
      className={styles.section}
      aria-labelledby="career-title"
    >
      <div className={styles.container}>
        <div className={styles.careerTop}>
          <SectionHeading
            id="career-title"
            label="Experience and study"
            fixture={draft.headings.career}
          />
          <div>
            <p className={styles.lead}>
              The supplied PDF is available unchanged. Its statements are
              owner-supplied; detailed project attribution and certification
              titles still need review.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.action} href={ownerContact.resume} download>
                Download CV ↓
              </a>
              <Action href="/resume" quiet>
                Resume page · queued
              </Action>
            </div>
          </div>
        </div>
        <ol className={styles.timeline}>
          {draft.career.map((item) => (
            <li key={item.title}>
              <div className={styles.timelineWhen}>
                {item.period}
                <br />
                <span>{item.usage}</span>
              </div>
              <div className={styles.timelineRail} aria-hidden="true">
                <i />
              </div>
              <div className={styles.timelineWhat}>
                <p className={styles.small}>{item.organization}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <ul className={styles.tags}>
                {item.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
export function Lab() {
  return (
    <section
      id="lab"
      className={`${styles.section} ${styles.lab}`}
      aria-labelledby="lab-title"
    >
      <div className={styles.container}>
        <SectionHeading
          id="lab-title"
          label="Local demo previews"
          fixture={draft.headings.lab}
        />
      </div>
      <LabRail items={draft.lab} />
    </section>
  );
}
export function Reviews() {
  return (
    <section
      id="reviews"
      className={styles.section}
      aria-labelledby="reviews-title"
    >
      <div className={styles.container}>
        <SectionHeading
          id="reviews-title"
          label="Working notes"
          fixture={draft.headings.reviews}
        />
        <div className={`${styles.plate} ${styles.reviewFile}`}>
          <p className={styles.fileBar}>
            principles/draft.md <span>Proposed editorial copy</span>
          </p>
          <ol className={styles.reviewRows}>
            {draft.reviews.map((item, i) => (
              <li key={item.title}>
                <span className={styles.lineNumber} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className={styles.reviewer}>
                  <strong>{item.title}</strong>
                  <p className={styles.small}>Proposed principle</p>
                </div>
                <p className={styles.reviewText}>{item.description}</p>
                <span className={styles.reviewPending}>Draft</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
export function Writing() {
  const featured = draft.writing[0];
  return (
    <section
      id="writing"
      className={styles.section}
      aria-labelledby="writing-title"
    >
      <div className={styles.container}>
        <div className={styles.sectionTop}>
          <SectionHeading
            id="writing-title"
            label="Writing"
            fixture={draft.headings.writing}
          />
          <Action href="/writing" quiet>
            All writing previews
          </Action>
        </div>
        <div className={styles.writingGrid}>
          <Link
            className={`${styles.plate} ${styles.featuredArticle}`}
            href={featured.href!}
          >
            <Placeholder label="Featured article image" />
            <div>
              <p className={styles.small}>
                Local preview · not a published article
              </p>
              <h3>{featured.title}</h3>
              <p>{featured.description}</p>
              <p className={styles.small}>Open unfinished preview →</p>
            </div>
          </Link>
          <div>
            <p className={styles.small}>Additional layout previews</p>
            <ul className={styles.writingRows}>
              {draft.writing.slice(1).map((item) => (
                <li key={item.title}>
                  <Link href={item.href!}>
                    <p className={styles.small}>Unpublished preview</p>
                    <h3>{item.title}</h3>
                    <p className={styles.small}>Article not supplied</p>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
export function Faq() {
  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title">
      <div className={`${styles.container} ${styles.faqGrid}`}>
        <SectionHeading
          id="faq-title"
          label="Questions"
          fixture={draft.headings.faq}
        />
        <SingleAccordion items={draft.faq} kind="faq" />
        <div className={`${styles.plate} ${styles.askPanel}`}>
          <h3>Get in touch</h3>
          <p>{ownerContact.responseIntention}</p>
          <a className={styles.action} href={`mailto:${ownerContact.email}`}>
            Write an email ↗
          </a>
          <a className={styles.textLink} href={ownerContact.telephoneUri}>
            {ownerContact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
export function Brief() {
  return (
    <section
      id="brief"
      className={`${styles.section} ${styles.brief}`}
      aria-labelledby="brief-title"
    >
      <div className={styles.container}>
        <SectionHeading
          id="brief-title"
          label="Local brief preview"
          fixture={draft.headings.brief}
        />
        <DraftBrief kinds={draft.briefKinds} topics={draft.briefTopics} />
      </div>
    </section>
  );
}
