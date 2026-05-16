(function () {
  const DATA_URL = "data/cv.json";
  const state = {
    data: null,
    lang: "es"
  };

  const $ = (selector) => document.querySelector(selector);

  const nodes = {
    profileImage: $("#profile-image"),
    givenName: $("#given-name"),
    familyName: $("#family-name"),
    roleLine: $("#role-line"),
    headlineLine: $("#headline-line"),
    contactPanel: $("#contact-panel"),
    about: $("#about-section"),
    skills: $("#skills-section"),
    links: $("#links-section"),
    languages: $("#languages-section"),
    hobbies: $("#hobbies-section"),
    courses: $("#courses-section"),
    personal: $("#personal-section"),
    experience: $("#experience-section"),
    portfolio: $("#portfolio-section"),
    education: $("#education-section"),
    downloads: $("#downloads-section"),
    footerDomain: $("#footer-domain")
  };

  function el(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (text !== undefined) {
      element.textContent = text;
    }
    return element;
  }

  function sectionTitle(text) {
    return el("h2", "section-title", text);
  }

  function normalizeLang(candidate, data) {
    if (candidate && data.locales[candidate]) {
      return candidate;
    }
    return data.site.defaultLanguage;
  }

  function initialLang(data) {
    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get("lang");
    const savedLang = window.localStorage.getItem("cv-language");
    const browserLang = window.navigator.language.slice(0, 2).toLowerCase();
    return normalizeLang(queryLang || savedLang || browserLang, data);
  }

  function updateUrl(lang) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("lang", lang);
    window.history.replaceState({}, "", nextUrl);
  }

  function setLanguage(lang) {
    state.lang = normalizeLang(lang, state.data);
    window.localStorage.setItem("cv-language", state.lang);
    updateUrl(state.lang);
    render();
  }

  function renderHeader(locale, person) {
    nodes.profileImage.src = person.profileImage;
    nodes.profileImage.alt = person.displayName;
    nodes.givenName.textContent = person.givenName;
    nodes.familyName.textContent = person.familyName;
    nodes.roleLine.textContent = locale.role;
    nodes.headlineLine.textContent = locale.headline;

    nodes.contactPanel.replaceChildren(
      contactRow("L", locale.availability),
      contactRow("T", person.phone, `tel:${person.phone.replace(/\s/g, "")}`),
      contactRow("@", person.email, `mailto:${person.email}`)
    );
  }

  function contactRow(icon, text, href) {
    const row = el("div", "contact-row");
    row.append(el("span", "contact-icon", icon));
    const textNode = el("span", "contact-text");
    if (href) {
      const link = el("a", "", text);
      link.href = href;
      textNode.append(link);
    } else {
      textNode.textContent = text;
    }
    row.append(textNode);
    return row;
  }

  function renderAbout(locale) {
    const copy = el("p", "sidebar-copy", locale.summary);
    nodes.about.replaceChildren(sectionTitle(locale.labels.about), copy);
  }

  function renderSkills(locale) {
    const list = el("div", "skill-list");
    locale.skills.forEach((skill) => {
      const item = el("div", "skill-item");
      const name = el("span", "skill-name", skill.name);
      const bar = el("span", "skill-bar");
      const fill = el("span");
      fill.style.setProperty("--skill-level", `${skill.level}%`);
      bar.append(fill);
      item.append(name, bar);
      list.append(item);
    });
    nodes.skills.replaceChildren(sectionTitle(locale.labels.skills), list);
  }

  function renderLinks(locale, person) {
    const list = el("ul", "plain-list link-list");
    const linkedIn = el("li");
    const linkedInLink = el("a", "", person.linkedin.label);
    linkedInLink.href = person.linkedin.url;
    linkedInLink.target = "_blank";
    linkedInLink.rel = "noreferrer";
    linkedIn.append(linkedInLink);
    list.append(linkedIn);
    nodes.links.replaceChildren(sectionTitle(locale.labels.links), list);
  }

  function renderPlainList(target, title, items) {
    const list = el("ul", "plain-list");
    items.forEach((item) => list.append(el("li", "", item)));
    target.replaceChildren(sectionTitle(title), list);
  }

  function renderCourses(locale) {
    const list = el("ul", "course-list");
    locale.courses.forEach((course) => {
      const item = el("li");
      item.append(el("strong", "", course.name));
      item.append(el("span", "", course.institution));
      item.append(el("span", "", course.period));
      list.append(item);
    });
    nodes.courses.replaceChildren(sectionTitle(locale.labels.courses), list);
  }

  function renderPersonal(locale) {
    const list = el("ul", "plain-list");
    locale.personalDetails.forEach((detail) => {
      const item = el("li");
      item.append(el("strong", "", `${detail.label}: `));
      item.append(document.createTextNode(detail.value));
      list.append(item);
    });
    nodes.personal.replaceChildren(sectionTitle(locale.labels.personalDetails), list);
  }

  function renderExperience(locale) {
    const timeline = el("div", "timeline");
    locale.experience.forEach((experience) => {
      const item = el("article", "timeline-item");
      const meta = el("div", "timeline-meta");
      meta.append(el("strong", "", experience.company));
      meta.append(el("span", "", experience.location));
      meta.append(el("span", "", experience.period));

      const line = el("div", "timeline-line");
      const content = el("div", "timeline-content");
      content.append(el("h3", "", experience.role));
      const highlights = el("ul");
      experience.highlights.forEach((highlight) => highlights.append(el("li", "", highlight)));
      content.append(highlights);

      item.append(meta, line, content);
      timeline.append(item);
    });
    nodes.experience.replaceChildren(sectionTitle(locale.labels.experience), timeline);
  }

  function renderPortfolio(locale) {
    const grid = el("div", "portfolio-grid");
    locale.portfolioHighlights.forEach((project) => {
      const item = el("article", "portfolio-item");
      item.append(el("span", "portfolio-kicker", project.type));
      const content = el("div");
      content.append(el("h3", "", project.name));
      content.append(el("p", "", project.summary));
      item.append(content);
      grid.append(item);
    });
    nodes.portfolio.replaceChildren(sectionTitle(locale.labels.portfolio), grid);
  }

  function renderEducation(locale) {
    const grid = el("div", "education-grid");
    locale.education.forEach((education) => {
      const item = el("article", "education-item");
      const year = el("div", "education-year");
      year.append(el("strong", "", education.year));
      if (education.location) {
        year.append(el("span", "", education.location));
      }
      const content = el("div");
      content.append(el("h3", "", education.institution));
      content.append(el("p", "", education.degree));
      item.append(year, content);
      grid.append(item);
    });
    nodes.education.replaceChildren(sectionTitle(locale.labels.education), grid);
  }

  function renderDownloads(locale, data) {
    const list = el("ul", "download-list");
    data.downloads
      .filter((download) => download.language === state.lang)
      .forEach((download) => {
        const item = el("li");
        const link = el("a", "", download.label);
        link.href = download.path;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.append(el("span", "", download.format));
        item.append(link);
        list.append(item);
      });
    nodes.downloads.replaceChildren(sectionTitle(locale.labels.downloads), list);
  }

  function renderControls(locale) {
    document.querySelectorAll("[data-lang]").forEach((button) => {
      const active = button.dataset.lang === state.lang;
      button.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      if (locale.labels[key]) {
        node.textContent = locale.labels[key];
      }
    });
  }

  function renderSchema(locale, person) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: person.displayName,
      jobTitle: locale.role,
      email: person.email,
      telephone: person.phone,
      image: person.profileImage,
      url: `https://${state.data.site.domain}/`,
      sameAs: [person.linkedin.url],
      address: {
        "@type": "PostalAddress",
        addressLocality: person.location.city,
        addressCountry: person.location.country
      }
    };
    $("#person-schema").textContent = JSON.stringify(schema);
  }

  function render() {
    const data = state.data;
    const locale = data.locales[state.lang];
    const person = data.person;

    document.documentElement.lang = locale.htmlLang;
    document.title = `${person.displayName} | ${locale.labels.downloadCv}`;
    nodes.footerDomain.textContent = data.site.domain;

    renderControls(locale);
    renderHeader(locale, person);
    renderAbout(locale);
    renderSkills(locale);
    renderLinks(locale, person);
    renderPlainList(nodes.languages, locale.labels.languages, locale.spokenLanguages);
    renderPlainList(nodes.hobbies, locale.labels.hobbies, locale.hobbies);
    renderCourses(locale);
    renderPersonal(locale);
    renderExperience(locale);
    renderPortfolio(locale);
    renderEducation(locale);
    renderDownloads(locale, data);
    renderSchema(locale, person);
  }

  function boot() {
    fetch(DATA_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load ${DATA_URL}`);
        }
        return response.json();
      })
      .then((data) => {
        state.data = data;
        state.lang = initialLang(data);
        render();
      })
      .catch((error) => {
        $("#resume").replaceChildren(
          el("p", "noscript-message", `${error.message}. Run a local server to preview the CV.`)
        );
      });
  }

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });

  $("[data-action='print']").addEventListener("click", () => window.print());

  boot();
})();
