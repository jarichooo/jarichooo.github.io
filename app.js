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
      if (!/^https?:$/.test(parsed.protocol)) throw new Error("Unsupported URL");
      link.href = parsed.href;
      link.target = "_blank";
      link.rel = "noreferrer";
    } catch (_) {
      link.textContent += " (link unavailable)";
    }
    return link;
  };

  const projectCard = (project, index) => {
    const article = make("article", "", "project-card");
    const meta = make("div", "", "project-meta");
    meta.append(
      make("span", String(index + 1).padStart(2, "0"), "project-index"),
      make("h3", project.title || "Untitled project"),
      make("span", project.status || "Public project", "project-status")
    );
    article.append(meta, make("p", project.summary || "No summary available."));
    if (Array.isArray(project.stack) && project.stack.length) {
      const stack = make("div", "", "stack");
      project.stack.forEach((tool) => stack.append(make("span", tool)));
      article.append(stack);
    }
    const button = make("button", "Read project details");
    button.type = "button";
    button.dataset.command = `open ${project.id || index + 1}`;
    button.setAttribute("aria-label", `Read project details for ${project.title || "project"}`);
    article.append(button);
    return article;
  };

  let headingCount = 0;
  const addHeading = (container, title) => {
    const heading = make("h2", title);
    heading.id = `result-heading-${++headingCount}`;
    container.setAttribute("aria-labelledby", heading.id);
    container.append(heading);
  };
  const addParagraph = (container, text, className) => container.append(make("p", text, className));
  const addSubheading = (container, text) => container.append(make("h3", text));

  const addList = (container, items, className) => {
    const list = make("ul", "", className);
    items.forEach((item) => list.append(make("li", item)));
    container.append(list);
  };

  const renderHelp = (container) => {
    addHeading(container, "Available commands");
    const commands = [
      ["help", "Show this command guide"],
      ["about", "Read about Joshua"],
      ["projects", "List selected public projects"],
      ["open <number|id>", "Inspect evidence for one project"],
      ["project <number|id>", "Alias for open"],
      ["skills", "Show tools found in selected projects"],
      ["contact", "Open Joshua’s GitHub profile"],
      ["ls", "List portfolio sections"],
      ["clear", "Clear terminal output"]
    ];
    const list = make("ul", "", "command-menu");
    commands.forEach(([command, description]) => {
      const item = make("li");
      item.append(make("code", command), document.createTextNode(description));
      list.append(item);
    });
    container.append(list);
  };

  const renderAbout = (container) => {
    addHeading(container, "About Joshua");
    addParagraph(container, "Joshua Jericho D. Barja publishes public work under the GitHub handle @jarichooo.");
    addParagraph(container, "This portfolio highlights selected repositories using claims checked against their public code, documentation, and repository history.");
  };

  const renderProjects = (container) => {
    addHeading(container, "Selected public projects");
    if (!projects.length) {
      addParagraph(container, projectsError || "No project records are available.", projectsError ? "error" : "muted");
      container.append(safeLink("Browse public repositories on GitHub", "https://github.com/jarichooo?tab=repositories"));
      return;
    }
    const list = make("div", "", "project-list");
    projects.forEach((project, index) => list.append(projectCard(project, index)));
    container.append(list);
    addParagraph(container, "Choose Read project details, or type open <number|id>, to see selection reasons, contribution evidence, and public sources.", "muted");
  };

  const findProject = (query) => {
    const normalized = query.trim().toLowerCase();
    if (/^\d+$/.test(normalized)) return projects[Number(normalized) - 1];
    return projects.find((project) => String(project.id).toLowerCase() === normalized);
  };

  const renderProject = (container, query) => {
    if (!query) {
      addHeading(container, "Project id needed");
      addParagraph(container, "Use projects to see available numbers and ids, then enter open <number|id>.", "error");
      return;
    }
    const project = findProject(query);
    if (!project) {
      addHeading(container, "Project not found");
      addParagraph(container, `No selected project has the id “${query}”. Run projects to see valid ids.`, "error");
      return;
    }

    addHeading(container, project.title);
    addParagraph(container, project.summary || "No summary available.");
    if (Array.isArray(project.stack) && project.stack.length) {
      addSubheading(container, "Tools in the repository");
      addList(container, project.stack, "tag-list");
    }
    if (project.contribution) {
      addSubheading(container, "Verified contribution");
      addParagraph(container, project.contribution);
    }
    if (project.why) {
      addSubheading(container, "Why selected");
      addParagraph(container, project.why);
    }
    if (project.limitations) {
      addSubheading(container, "Scope and limits");
      addParagraph(container, project.limitations);
    }
    if (Array.isArray(project.sources) && project.sources.length) {
      addSubheading(container, "Public sources");
      const sources = make("ul");
      project.sources.forEach((source) => {
        const item = make("li");
        item.append(safeLink(`View ${source.label || "source"} for ${project.title}`, source.url || ""));
        sources.append(item);
      });
      container.append(sources);
    }
    if (project.repo) {
      const repo = make("p");
      repo.append(safeLink(`View repository for ${project.title} ↗`, project.repo));
      container.append(repo);
    }
  };

  const renderSkills = (container) => {
    addHeading(container, "Tools represented in selected projects");
    const tools = [...new Set(projects.flatMap((project) => Array.isArray(project.stack) ? project.stack : []))].sort();
    if (!tools.length) {
      addParagraph(container, projectsError || "No verified project tool data is available.", projectsError ? "error" : "muted");
      return;
    }
    addList(container, tools, "tag-list");
    addParagraph(container, "These labels describe the selected repositories; they are not a proficiency rating.", "muted");
  };

  const renderContact = (container) => {
    addHeading(container, "Contact");
    addParagraph(container, "The verified public contact point for this portfolio is GitHub.");
    container.append(safeLink("Visit github.com/jarichooo ↗", "https://github.com/jarichooo"));
  };

  const renderLs = (container) => {
    addHeading(container, "Portfolio sections");
    addList(container, ["about/", "projects/", "skills/", "contact/"], "tag-list");
    addParagraph(container, "Run a section name as a command to open it.", "muted");
  };

  const announce = (message) => {
    announcer.textContent = "";
    window.setTimeout(() => { announcer.textContent = message; }, 20);
  };

  const restoreWelcome = () => {
    output.replaceChildren(...welcomeTemplate.map((child) => child.cloneNode(true)));
    output.scrollTop = 0;
  };

  const showEmptyHint = () => {
    const result = make("section", "", "result");
    result.tabIndex = -1;
    addHeading(result, "Enter a command");
    addParagraph(result, "Type a command, or choose one of the options above.", "error");
    output.append(result);
    result.focus({ preventScroll: true });
    output.scrollTop = result.offsetTop;
    announce("Type a command, or choose one of the options above.");
  };

  const runCommand = (rawCommand) => {
    const cleaned = rawCommand.trim().replace(/\s+/g, " ");
    if (!cleaned) return;
    const [name, ...args] = cleaned.split(" ");
    const command = name.toLowerCase();

    if (command === "clear") {
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
      addHeading(result, "Command not found");
      addParagraph(result, `Command not found: “${name}”. Try help or choose an option above.`, "error");
    }

    output.append(result);
    result.focus({ preventScroll: true });
    output.scrollTop = result.offsetTop;
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
