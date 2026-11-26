import type { MouseEvent } from "react";
import { ArrowRight, ArrowUpRight, Cpu, Github, Laptop, Monitor, Smartphone, type LucideIcon } from "lucide-react";
import styles from "./LandingPage.module.css";
import { HeroIllustration } from "../components/landing/HeroIllustration";
import { CategoryDot } from "../components/common/CategoryDot";
import { deviceSubtitle, deviceTiles, devices, getPart } from "../data/devices";
import { categories } from "../data/categories";
import { deviceBlurbs, developer, hero, links, steps } from "../data/landing";
import { exploreHref, homeHref } from "../router";
import type { DeviceIcon } from "../types";

const deviceIcons: Record<DeviceIcon, LucideIcon> = {
  desktop: Monitor,
  laptop: Laptop,
  phone: Smartphone,
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Screen-reader note for links that open in a new tab. */
const newTab = <span className="sr-only"> (opens in a new tab)</span>;

/** Scroll to a section without changing the URL hash (the hash is used for routing). */
function scrollTo(id: string) {
  return (e: MouseEvent) => {
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
}

export function LandingPage() {
  const preview = getPart(devices["desktop-pc"], "ram");

  return (
    <div className={styles.page}>
      <header id="top" className={styles.header}>
        <div className={`${styles.container} ${styles.headerInner}`}>
          <a href={homeHref} className={styles.brand} onClick={scrollTo("top")}>
            <span className={styles.logo} aria-hidden="true">
              <Cpu size={18} strokeWidth={1.8} />
            </span>
            <span className={styles.wordmark}>Matware</span>
          </a>
          <nav aria-label="Main" className={styles.nav}>
            <a className={styles.navLink} href="#devices" onClick={scrollTo("devices")}>
              Devices
            </a>
            <a className={`${styles.navLink} ${styles.desktopOnly}`} href={links.portfolio} {...external}>
              About the developer
              {newTab}
            </a>
            <a className={`${styles.navLink} ${styles.desktopOnly}`} href={links.github} {...external}>
              <Github size={16} strokeWidth={1.8} aria-hidden="true" />
              GitHub
              {newTab}
            </a>
            <a className={`${styles.btn} ${styles.primary} ${styles.navCta}`} href={exploreHref()}>
              Open explorer
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className={`${styles.container} ${styles.hero}`}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>{hero.eyebrow}</p>
            <h1 className={styles.heroTitle}>{hero.title}</h1>
            <p className={styles.heroLead}>{hero.lead}</p>
            <div className={styles.actions}>
              <a className={`${styles.btn} ${styles.primary}`} href={exploreHref("desktop-pc")}>
                Start exploring
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
              <a className={`${styles.btn} ${styles.secondary}`} href="#how" onClick={scrollTo("how")}>
                How it works
              </a>
            </div>
          </div>

          <div className={styles.stage}>
            <HeroIllustration />
            {preview && (
              <div className={styles.previewCard} aria-hidden="true">
                <div className={styles.previewTop}>
                  <span className={styles.code}>{preview.code}</span>
                  <span className={styles.cat}>
                    <CategoryDot category={preview.category} />
                    {categories[preview.category].name}
                  </span>
                </div>
                <p className={styles.previewName}>{preview.name}</p>
                <p className={styles.previewText}>{preview.definition.beginner}</p>
              </div>
            )}
          </div>
        </section>

        <section id="how" className={styles.band}>
          <div className={`${styles.container} ${styles.steps}`}>
            {steps.map((step, i) => (
              <div key={step.title}>
                <p className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</p>
                <h2 className={styles.stepTitle}>{step.title}</h2>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="devices" className={`${styles.container} ${styles.section}`}>
          <p className={styles.eyebrow}>Devices</p>
          <h2 className={styles.sectionTitle}>Pick a device to explore</h2>
          <div className={styles.deviceGrid}>
            {deviceTiles.map((tile) => {
              const device = devices[tile.id];
              const Icon = deviceIcons[tile.icon];
              if (!device) return null;
              return (
                <a key={tile.id} className={styles.deviceCard} href={exploreHref(tile.id)}>
                  <div className={styles.deviceTop}>
                    <span className={styles.deviceIcon}>
                      <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <span className={styles.tag}>Available</span>
                  </div>
                  <div>
                    <h3 className={styles.deviceName}>{device.name}</h3>
                    <p className={`mono-label ${styles.deviceMeta}`}>{deviceSubtitle(device)}</p>
                  </div>
                  <p className={styles.deviceText}>{deviceBlurbs[tile.id] ?? device.intro}</p>
                  <span className={styles.deviceLink}>
                    Open {device.name}
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        <section id="about" className={styles.aboutBand}>
          <div className={`${styles.container} ${styles.section}`}>
            <p className={styles.eyebrow}>About the developer</p>
            <div className={styles.aboutCard}>
              <div className={styles.avatar} aria-hidden="true">
                {developer.initials}
              </div>
              <div className={styles.aboutBody}>
                <h2 className={styles.aboutName}>{developer.name}</h2>
                <p className={`mono-label ${styles.aboutRole}`}>{developer.role}</p>
                <p className={styles.aboutNote}>{developer.note}</p>
                <div className={styles.actions}>
                  <a className={`${styles.btn} ${styles.primary}`} href={links.portfolio} {...external}>
                    View portfolio
                    <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                    {newTab}
                  </a>
                  <a className={`${styles.btn} ${styles.secondary}`} href={links.github} {...external}>
                    <Github size={16} strokeWidth={1.8} aria-hidden="true" />
                    View Matware on GitHub
                    {newTab}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <span>© {new Date().getFullYear()} Matware · Made by {developer.name} for IT students</span>
          <div className={styles.footerLinks}>
            <a href={links.portfolio} {...external}>
              About the developer
              {newTab}
            </a>
            <a href={links.github} {...external}>
              GitHub
              {newTab}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
