"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import type {
  ExperienceResponse,
  LanguageCode,
  ProfileResponse,
  SkillResponse,
} from "@/types/api";
import { localeNames, localeTags, messages, sectionIds } from "@/lib/i18n";

type SectionId = (typeof sectionIds)[number];

interface PortfolioProps {
  locale: LanguageCode;
  activeSection: SectionId;
  profile: ProfileResponse | null;
  experiences: ExperienceResponse[];
  skills: SkillResponse[];
  failed: Record<SectionId, boolean>;
}

const skillCategoryLabels: Record<
  LanguageCode,
  Record<string, string>
> = {
  en: {
    language: "Languages",
    framework: "Frameworks",
    tool: "Tools",
    os: "Operating systems",
    cloud: "Cloud",
    database: "Databases",
    other: "Other",
  },
  ja: {
    language: "プログラミング言語",
    framework: "フレームワーク",
    tool: "ツール",
    os: "オペレーティングシステム",
    cloud: "クラウド",
    database: "データベース",
    other: "その他",
  },
  "zh-Hant-TW": {
    language: "程式語言",
    framework: "框架",
    tool: "工具",
    os: "作業系統",
    cloud: "雲端",
    database: "資料庫",
    other: "其他",
  },
  ko: {
    language: "언어",
    framework: "프레임워크",
    tool: "도구",
    os: "운영 체제",
    cloud: "클라우드",
    database: "데이터베이스",
    other: "기타",
  },
};

function formatDate(value: string, locale: LanguageCode): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(localeTags[locale], {
    year: "numeric",
    month: "short",
  }).format(date);
}

function formatDuration(months: number, locale: LanguageCode): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const parts: string[] = [];

  if (years > 0) {
    parts.push(
      locale === "ja"
        ? `${years}年`
        : locale === "zh-Hant-TW"
          ? `${years} 年`
          : locale === "ko"
            ? `${years}년`
            : `${years} yr`,
    );
  }
  if (remainingMonths > 0) {
    parts.push(
      locale === "ja"
        ? `${remainingMonths}か月`
        : locale === "zh-Hant-TW"
          ? `${remainingMonths} 個月`
          : locale === "ko"
            ? `${remainingMonths}개월`
            : `${remainingMonths} mo`,
    );
  }

  return parts.join(" ");
}

export default function Portfolio({
  locale,
  activeSection: initialSection,
  profile,
  experiences,
  skills,
  failed,
}: PortfolioProps) {
  const [activeSection, setActiveSection] =
    useState<SectionId>(initialSection);
  const text = messages[locale];

  useEffect(() => {
    document.documentElement.lang = localeTags[locale];

    const updateFromHash = () => {
      const section = window.location.hash.slice(1);
      if (sectionIds.includes(section as SectionId)) {
        setActiveSection(section as SectionId);
      }
    };

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);
    return () => window.removeEventListener("hashchange", updateFromHash);
  }, [locale]);

  const navItems = sectionIds.map((id) => ({
    id,
    ...text.sections[id],
  }));

  const featuredSkills = skills.filter((skill) => skill.is_featured);
  const groupedSkills = skills.reduce<Record<string, SkillResponse[]>>(
    (groups, skill) => {
      (groups[skill.category] ??= []).push(skill);
      return groups;
    },
    {},
  );

  return (
    <main className="page-shell">
      <div className="portfolio-layout">
        <aside className="sidebar" aria-label={text.navigation}>
          <a className="brand" href="#profile">
            <span className="brand-mark" aria-hidden="true">
              P//
            </span>
            <span>{text.brand}</span>
          </a>
          <nav className="nav-list" aria-label={text.sectionsLabel}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-item${activeSection === item.id ? " active" : ""}`}
                aria-current={activeSection === item.id ? "location" : undefined}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="nav-label">{item.label}</span>
                <span className="nav-subtitle">{item.subtitle}</span>
              </a>
            ))}
          </nav>
          <div className="sidebar-footer">
            <span className="status-dot" aria-hidden="true" />
            <span>{text.publicPortfolio}</span>
          </div>
        </aside>

        <div className="content">
          <header className="content-header">
            <div>
              <p className="eyebrow">{text.eyebrow}</p>
              <h1 className="page-title">{text.title}</h1>
            </div>
            <nav className="lang-switcher" aria-label={text.languageLabel}>
              {(Object.keys(localeNames) as LanguageCode[]).map((code) => (
                <a
                  key={code}
                  href={`?lang=${code}&section=${activeSection}#${activeSection}`}
                  aria-current={locale === code ? "true" : undefined}
                  aria-label={localeNames[code]}
                >
                  {text.languageShortNames[code]}
                </a>
              ))}
            </nav>
          </header>

          <div className="section-stack">
            <section
              id="profile"
              className="section-card profile-section"
              aria-labelledby="profile-heading"
            >
              <div className="section-heading">
                <div>
                  <span className="label">{text.sections.profile.subtitle}</span>
                  <h2 id="profile-heading">{text.profileHeading}</h2>
                </div>
                <span className="section-index">01 / 03</span>
              </div>
              {failed.profile ? (
                <p className="error-message" role="alert">
                  {text.loadError}
                </p>
              ) : profile ? (
                <>
                  {profile.content_language !== locale && (
                    <p className="fallback-note">{text.englishFallback}</p>
                  )}
                  <div className="profile-grid">
                    <div className="profile-copy">
                      {profile.headline && (
                        <p className="profile-headline">{profile.headline}</p>
                      )}
                      <h3 className="profile-name">
                        {profile.display_name ?? text.profileHeading}
                      </h3>
                      {profile.summary && (
                        <p className="lead profile-summary">{profile.summary}</p>
                      )}
                      {featuredSkills.length > 0 && (
                        <div className="featured-skills">
                          <span className="label">{text.coreTechnologies}</span>
                          <ul className="inline-list">
                            {featuredSkills.map((skill) => (
                              <li key={skill.id}>{skill.display_name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {profile.links.length > 0 && (
                        <nav className="profile-links" aria-label={text.professionalLinks}>
                          {profile.links.map((link) => (
                            <a
                              key={`${link.link_type}-${link.url}`}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {link.label}
                              <span aria-hidden="true"> ↗</span>
                            </a>
                          ))}
                        </nav>
                      )}
                    </div>
                    {profile.profile_picture_url && (
                      <Image
                        className="profile-image"
                        src={profile.profile_picture_url}
                        alt={profile.display_name ?? ""}
                        width="180"
                        height="180"
                        unoptimized
                      />
                    )}
                  </div>
                  {profile.spoken_languages.length > 0 && (
                    <div className="spoken-languages">
                      <span className="label">{text.spokenLanguages}</span>
                      <ul className="inline-list">
                        {profile.spoken_languages.map((language) => (
                          <li key={language.language_name}>
                            {language.language_name}
                            <span className="muted-detail">
                              {" "}
                              / {text.proficiency[language.proficiency_level] ?? language.proficiency_level}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="empty-state">{text.noProfile}</p>
              )}
            </section>

            <section
              id="experiences"
              className="section-card"
              aria-labelledby="experiences-heading"
            >
              <div className="section-heading">
                <div>
                  <span className="label">
                    {text.sections.experiences.subtitle}
                  </span>
                  <h2 id="experiences-heading">{text.experiencesHeading}</h2>
                </div>
                <span className="section-index">02 / 03</span>
              </div>
              {failed.experiences ? (
                <p className="error-message" role="alert">
                  {text.loadError}
                </p>
              ) : experiences.length > 0 ? (
                <div className="experience-list">
                  {experiences.map((experience) => (
                    <article className="experience-item" key={experience.id}>
                      <div className="experience-meta">
                        <span>{experience.employer}</span>
                        <time dateTime={experience.start_date}>
                          {formatDate(experience.start_date, locale)}
                          {" — "}
                          {experience.end_date
                            ? formatDate(experience.end_date, locale)
                            : text.present}
                        </time>
                      </div>
                      {experience.content_language !== locale && (
                        <p className="fallback-note">{text.englishFallback}</p>
                      )}
                      <h3>{experience.title}</h3>
                      <p className="experience-role">{experience.role}</p>
                      {experience.overview && (
                        <div className="experience-markdown">
                          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                            {experience.overview}
                          </ReactMarkdown>
                        </div>
                      )}
                      {experience.responsibilities && (
                        <div className="experience-markdown">
                          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                            {experience.responsibilities}
                          </ReactMarkdown>
                        </div>
                      )}
                      {experience.contributions && (
                        <div className="experience-markdown">
                          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                            {experience.contributions}
                          </ReactMarkdown>
                        </div>
                      )}
                      {experience.skills.length > 0 && (
                        <ul className="inline-list experience-skills">
                          {experience.skills.map((skill) => (
                            <li key={skill.skill_name}>{skill.skill_name}</li>
                          ))}
                        </ul>
                      )}
                      {experience.urls.length > 0 && (
                        <ul className="experience-links">
                          {experience.urls.map((url) => (
                            <li key={url.url}>
                              <a href={url.url} target="_blank" rel="noreferrer">
                                {url.label ?? text.linkTypes[url.url_type]}
                                <span aria-hidden="true"> ↗</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-state">{text.noExperiences}</p>
              )}
            </section>

            <section
              id="skills"
              className="section-card"
              aria-labelledby="skills-heading"
            >
              <div className="section-heading">
                <div>
                  <span className="label">{text.sections.skills.subtitle}</span>
                  <h2 id="skills-heading">{text.skillsHeading}</h2>
                </div>
                <span className="section-index">03 / 03</span>
              </div>
              {failed.skills ? (
                <p className="error-message" role="alert">
                  {text.loadError}
                </p>
              ) : skills.length > 0 ? (
                <div className="skills-grid">
                  {Object.entries(groupedSkills).map(([category, entries]) => (
                    <section className="skill-category" key={category}>
                      <h3>
                        {skillCategoryLabels[locale][category] ??
                          category}
                      </h3>
                      <ul className="skill-list">
                        {entries.map((skill) => (
                          <li key={skill.id}>
                            <div>
                              <span>{skill.display_name}</span>
                              {skill.content_language !== locale && (
                                <span className="skill-fallback">
                                  {" "}
                                  · {text.englishFallback}
                                </span>
                              )}
                              {skill.description && (
                                <p>{skill.description}</p>
                              )}
                            </div>
                            {skill.duration_months !== null && (
                              <span className="skill-duration">
                                {formatDuration(skill.duration_months, locale)}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              ) : (
                <p className="empty-state">{text.noSkills}</p>
              )}
            </section>
          </div>
          <footer className="page-footer">
            <span>{text.footer}</span>
            <span className="footer-code">SYS // PORTFOLIO</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
