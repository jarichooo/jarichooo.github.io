(function () {
  "use strict";

  const output = document.querySelector("#output");
  const form = document.querySelector("#command-form");
  const input = document.querySelector("#terminal-input");
  const announcer = document.querySelector("#announcer");
  const welcomeTemplate = Array.from(output.children, (child) => child.cloneNode(true));
  const history = [];
  let historyIndex = 0;
  let projects = [];
  let projectsError = "Project notes are loading. Run projects again in a moment.";

  const make = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  };

  const safeLink = (label, url) => {
    const link = make("a", label);
    try {
      const parsed = new URL(url);
      if (!/^(https?|mailto):$/.test(parsed.protocol)) throw new Error("Unsupported URL");
      link.href = parsed.href;
      if (parsed.protocol !== "mailto:") link.target = "_blank";
      link.rel = "noreferrer";
    } catch (_) {
      link.textContent += " (link unavailable)";
    }
    return link;
  };

  const commandButton = (command, label = command, className = "command-action") => {
    const button = make("button", label, className);
    button.type = "button";
    button.dataset.command = command;
    return button;
  };

  const projectCard = (project, index) => {
    const article = make("article", "", "project-card");
    article.style.setProperty("--reveal-delay", `${index * 60}ms`);
    const meta = make("div", "", "project-meta");
    meta.append(
      make("span", String(index + 1).padStart(2, "0"), "project-index"),
      make("h3", project.title || "Untitled project"),
      make("span", project.status || "Public project", "project-status")
    );
    article.append(meta, make("p", project.summary || "No summary available.", "project-summary"));
    if (Array.isArray(project.stack) && project.stack.length) {
      const stack = make("div", "", "stack");
      project.stack.forEach((tool) => stack.append(make("span", tool)));
      article.append(stack);
    }
    const button = commandButton(`open ${project.id || index + 1}`, "View project", "project-link");
    button.setAttribute("aria-label", `Read project details for ${project.title || "project"}`);
    article.append(button);
    return article;
  };

  let headingCount = 0;
  const addHeading = (container, title, context = "command output") => {
    const heading = make("h2", title);
    heading.id = `result-heading-${++headingCount}`;
    container.setAttribute("aria-labelledby", heading.id);
    const header = make("header", "", "result-header");
    header.append(make("p", context, "result-context"), heading);
    container.append(header);
  };

  const addParagraph = (container, text, className) => container.append(make("p", text, className));

  const addList = (container, items, className) => {
    const list = make("ul", "", className);
    items.forEach((item) => list.append(make("li", item)));
    container.append(list);
  };

  const addDisclosure = (container, label, content) => {
    if (!content) return;
    const details = make("details", "", "project-disclosure");
    details.append(make("summary", label));
    const body = make("div", "", "disclosure-body");
    if (typeof content === "string") {
      body.append(make("p", content));
    } else {
      body.append(content);
    }
    details.append(body);
    container.append(details);
  };

  const renderHelp = (container) => {
    addHeading(container, "Available commands", "help");
    const commands = [
      ["help", "Show this command guide"],
      ["home", "Return to the opening screen"],
      ["about", "Read about Joshua"],
      ["projects", "List selected public projects"],
      ["skills", "Show tools found in selected projects"],
      ["contact", "Show LinkedIn, email, and GitHub links"],
      ["ls", "List portfolio sections"],
      ["clear", "Clear terminal output"]
    ];
    const list = make("ul", "", "command-menu");
    commands.forEach(([command, description]) => {
      const item = make("li");
      const button = commandButton(command, "", "command-menu-button");
      button.append(make("code", command), make("span", description));
      item.append(button);
      list.append(item);
    });
    container.append(list);
  };

  const renderAbout = (container) => {
    addHeading(container, "About Joshua", "about");
    const profile = make("div", "", "about-profile");
    addParagraph(profile, "Hi, I'm Joshua Jericho Barja, a fourth-year Computer Science student at Camarines Sur Polytechnic Colleges. My studies and personal interests are primarily focused on cybersecurity and computer networking. I am actively learning and building a solid foundation in these areas as I complete my degree and prepare to start my career in the tech industry.");
    const focus = make("dl", "", "about-focus");
    focus.append(make("dt", "Current focus"), make("dd", "Cybersecurity · Computer networking"));
    profile.append(focus);
    container.append(profile);
  };

  const renderProjects = (container) => {
    addHeading(container, "Selected public projects", "projects");
    if (!projects.length) {
      const state = make("div", "", "state-message");
      addParagraph(state, projectsError || "No project records are available.", projectsError ? "error" : "muted");
      state.append(safeLink("Browse public repositories on GitHub", "https://github.com/jarichooo?tab=repositories"));
      container.append(state);
      return;
    }
    addParagraph(container, `${projects.length} projects selected from public repositories.`, "result-summary");
    const list = make("div", "", "project-list");
    projects.forEach((project, index) => list.append(projectCard(project, index)));
    container.append(list);
  };

  const findProject = (query) => {
    const normalized = query.trim().toLowerCase();
    if (/^\d+$/.test(normalized)) return projects[Number(normalized) - 1];
    return projects.find((project) => String(project.id).toLowerCase() === normalized || project.title.toLowerCase() === normalized);
  };

  const renderProject = (container, query) => {
    if (!query) {
      addHeading(container, "Project id needed", "project");
      const state = make("div", "", "state-message");
      addParagraph(state, "Choose a project from the project list.", "error");
      state.append(commandButton("projects", "View projects"));
      container.append(state);
      return;
    }
    const project = findProject(query);
    if (!project) {
      addHeading(container, "Project not found", "project");
      const state = make("div", "", "state-message");
      addParagraph(state, `No selected project matches “${query}”.`, "error");
      state.append(commandButton("projects", "View projects"));
      container.append(state);
      return;
    }

    addHeading(container, project.title, project.status || "project");
    const toolbar = make("div", "", "result-toolbar");
    toolbar.append(commandButton("projects", "← All projects", "text-command"));
    container.append(toolbar);
    addParagraph(container, project.summary || "No summary available.", "project-lead");
    if (Array.isArray(project.stack) && project.stack.length) {
      const tools = make("section", "", "project-tools");
      tools.append(make("h3", "Tools in the repository"));
      addList(tools, project.stack, "tag-list");
      container.append(tools);
    }

    const disclosures = make("div", "", "project-disclosures");
    addDisclosure(disclosures, "Verified contribution", project.contribution);
    addDisclosure(disclosures, "Why selected", project.why);
    addDisclosure(disclosures, "Scope and limits", project.limitations);
    if (Array.isArray(project.sources) && project.sources.length) {
      const sources = make("ul", "", "source-list");
      project.sources.forEach((source) => {
        const item = make("li");
        item.append(safeLink(source.label || "Source", source.url || ""));
        sources.append(item);
      });
      addDisclosure(disclosures, `Public sources (${project.sources.length})`, sources);
    }
    container.append(disclosures);
    if (project.repo) {
      const repo = make("p", "", "repo-link");
      repo.append(safeLink(`View repository for ${project.title} ↗`, project.repo));
      container.append(repo);
    }
  };

  const renderSkills = (container) => {
    addHeading(container, "Tools represented in selected projects", "skills");
    const tools = [...new Set(projects.flatMap((project) => Array.isArray(project.stack) ? project.stack : []))].sort();
    if (!tools.length) {
      const state = make("div", "", "state-message");
      addParagraph(state, projectsError || "No verified project tool data is available.", projectsError ? "error" : "muted");
      container.append(state);
      return;
    }
    const overview = make("div", "", "skills-overview");
    addList(overview, tools, "tag-list");
    addParagraph(overview, "These labels describe the selected repositories; they are not a proficiency rating.", "muted");
    container.append(overview);
  };

  const renderContact = (container) => {
    addHeading(container, "Contact", "contact");
    const contacts = make("ul", "", "contact-list");
    const entries = [
      ["LinkedIn", "Joshua Jericho Barja", "https://www.linkedin.com/in/joshua-jericho-barja-27b878286"],
      ["Email", "barjajoshuajericho@gmail.com", "mailto:barjajoshuajericho@gmail.com"],
      ["GitHub", "github.com/jarichooo", "https://github.com/jarichooo"]
    ];
    entries.forEach(([label, value, url]) => {
      const item = make("li");
      const arrow = make("span", "↗", "contact-arrow");
      arrow.setAttribute("aria-hidden", "true");
      item.append(make("span", label, "contact-label"), safeLink(value, url), arrow);
      contacts.append(item);
    });
    container.append(contacts);
  };

  const renderLs = (container) => {
    addHeading(container, "Portfolio sections", "ls");
    const sections = [
      ["about", "Introduction"],
      ["projects", "Selected public work"],
      ["skills", "Tools represented in projects"],
      ["contact", "Ways to connect"]
    ];
    const list = make("ul", "", "section-list");
    sections.forEach(([command, description]) => {
      const item = make("li");
      const button = commandButton(command, "", "section-link");
      button.append(make("code", `${command}/`), make("span", description));
      item.append(button);
      list.append(item);
    });
    container.append(list);
  };

  const announce = (message) => {
    announcer.textContent = "";
    window.setTimeout(() => { announcer.textContent = message; }, 20);
  };

  const restoreWelcome = () => {
    output.replaceChildren(...welcomeTemplate.map((child) => child.cloneNode(true)));
  };

  const showEmptyHint = () => {
    const result = make("section", "", "result");
    result.tabIndex = -1;
    addHeading(result, "Enter a command", "input needed");
    const state = make("div", "", "state-message");
    addParagraph(state, "Type about for an introduction, or help for available commands.", "error");
    state.append(commandButton("help", "View commands"));
    result.append(state);
    output.replaceChildren(result);
    input.focus({ preventScroll: true });
    announce("Type about for an introduction, or help for available commands.");
  };

  const runCommand = (rawCommand) => {
    const cleaned = rawCommand.trim().replace(/\s+/g, " ");
    if (!cleaned) return;
    const [name, ...args] = cleaned.split(" ");
    const command = name.toLowerCase();

    if (command === "clear" || command === "home") {
      restoreWelcome();
      announce("Terminal reset to the welcome screen.");
      input.focus();
      return;
    }

    const result = make("section", "", "result");
    result.tabIndex = -1;
    const line = make("p", "", "result-command");
    line.append(make("span", "visitor@portfolio"), document.createTextNode(`:~$ ${cleaned}`));
    result.append(line);

    const canonicalCommand = command === "work" ? "projects" : (command === "project" ? "open" : command);
    const renderers = {
      help: () => renderHelp(result),
      about: () => renderAbout(result),
      projects: () => renderProjects(result),
      open: () => renderProject(result, args.join(" ")),
      skills: () => renderSkills(result),
      contact: () => renderContact(result),
      ls: () => renderLs(result)
    };

    if (Object.hasOwn(renderers, canonicalCommand)) {
      renderers[canonicalCommand]();
    } else {
      addHeading(result, "Command not found", "error");
      const state = make("div", "", "state-message");
      addParagraph(state, `Command not found: “${name}”.`, "error");
      state.append(commandButton("help", "View commands"));
      result.append(state);
    }

    output.replaceChildren(result);
    input.focus({ preventScroll: true });
    announce(`Command ${command} completed.`);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = input.value;
    if (!command.trim()) {
      showEmptyHint();
      return;
    }
    history.push(command);
    historyIndex = history.length;
    input.value = "";
    runCommand(command);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      input.value = "";
      announce("Command input cleared.");
      return;
    }
    if (!history.length || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) return;
    event.preventDefault();
    historyIndex = event.key === "ArrowUp" ? Math.max(0, historyIndex - 1) : Math.min(history.length, historyIndex + 1);
    input.value = history[historyIndex] || "";
  });

  document.addEventListener("click", (event) => {
    const control = event.target.closest("[data-command]");
    if (!control) return;
    const command = control.dataset.command;
    history.push(command);
    historyIndex = history.length;
    runCommand(command);
  });

  document.addEventListener("keydown", (event) => {
    const editable = event.target.matches("input, textarea, [contenteditable='true']");
    if (event.key === "/" && !editable && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      input.focus();
    }
  });

  fetch("./projects.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Project data returned ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("Project data is not a list");
      projects = data.filter((project) => project && project.id && project.title);
      projectsError = "";
    })
    .catch(() => {
      projectsError = "Verified project details could not be loaded.";
    });
})();
