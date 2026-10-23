# Joshua Barja's terminal portfolio

A buildless, responsive portfolio for GitHub Pages. Only verified public repository material appears in `projects.json`. Read [the selection rationale](SELECTION.md) for evidence and limitations.

## Preview

From this directory run `python -m http.server 8000 --bind 127.0.0.1`, then open http://127.0.0.1:8000. Serve over HTTP because project data loads from JSON.

Visitors type commands to explore. No command executes a real shell. The contact command shows the owner's provided LinkedIn and email, plus GitHub. No analytics, external fonts, or runtime dependencies are required.

The opening screen waits for input: type `about` and press Enter to read Joshua's introduction, or `help` for available commands. Projects appear only after `projects` or `open <number|id>`. Every command replaces the previous output, so opening a project closes the previous view. There is no internal terminal scrollbar. Up/Down still recalls command history. `clear` restores the opening screen without the introduction. The current selection is IoT Air Quality Monitor, Morphism, and CrackTify.

The welcome uses a full-width responsive layout with a session-detail panel, stacking on mobile. It preserves the owner's edited labels, and its brief entrance animations respect reduced motion.

Run `python check_site.py` to verify project data, pinned evidence URLs, local assets, and the deployment allowlist. This check does not replace browser or screen-reader testing.

Simple commands are listed beneath the prompt without a suggestion dropdown, open syntax, or aliases. Projects have View project and All projects buttons. Every command and project-button action returns focus to the input, including errors; `/` still focuses the prompt. Entrance, card, cursor, and hover animations respect reduced-motion preferences; content never waits for animation to finish. Command results have no focus rectangle; interactive controls retain green keyboard-focus indicators, and the input uses a green underline.

Command outputs use distinct layouts: an introduction and focus panel for about, compact project rows, expandable contribution/scope/source notes in project details, clickable help and section lists, a tool cloud for skills, contact rows, and recovery buttons for errors. Project evidence and limits remain available inside native disclosure controls. Results use the full terminal width.

`home` returns to the first screen and focuses the prompt. A focused, empty prompt shows a blinking green block cursor; typing uses the native text caret. The block cursor is hidden when the input is not focused. The opening screen animates again when returning home. Reduced motion keeps the cursor static.

Run `python -m unittest discover -s tests -p 'test_*.py'` for the static regression checks. Open http://127.0.0.1:8000/tests/app_logic_test.html to run the prepared command-routing checks in a browser. The browser checks were not executed in the authoring session because no browser was connected.

## GitHub Pages deployment

The workflow deploys pushes to `main` and also supports manual runs:

1. Commit the reviewed site files and workflow to `jarichooo/jarichooo.github.io`, then push to `main`.
2. In repository Settings > Pages, choose GitHub Actions as the publishing source.
3. The push starts **Deploy portfolio to GitHub Pages** automatically; use a manual run to redeploy if needed.
4. Verify the workflow's deployment URL, expected to be https://jarichooo.github.io/.

The workflow packages only `index.html`, `styles.css`, `app.js`, and `projects.json`, plus an empty `.nojekyll`. Local notes, repository metadata, tests, and future unrelated files are not included in that artifact. Do not add private material to public source control, even outside the artifact.

Workflow structure follows [GitHub's custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Methodology

Build the interface with semantic HTML, responsive CSS, and vanilla JavaScript. [`app.js`](app.js) routes typed commands to DOM renderers and loads project records from [`projects.json`](projects.json). Project selection uses public repository evidence and records contribution scope and limitations; [`SELECTION.md`](SELECTION.md) explains that process.

The [Pages workflow](.github/workflows/pages.yml) publishes an explicit list of static assets. Validation is provided by [`check_site.py`](check_site.py) and the checks in [`tests/`](tests/).

## Results and evaluation

The implemented portfolio presents three selected projects—IoT Air Quality Monitor, Morphism, and CrackTify—alongside an introduction, skills, contact links, and command help. It includes command history, project detail views, keyboard focus handling, and reduced-motion styling. The published address is [jarichooo.github.io](https://jarichooo.github.io/).

These results describe the checked-in functionality. No measured usability, accessibility audit, or performance results are reported here. The validation commands above allow reviewers to reproduce the available checks.

## Source, data, and documentation

- **Source:** [`index.html`](index.html), [`styles.css`](styles.css), and [`app.js`](app.js).
- **Data:** [`projects.json`](projects.json) contains manually curated public project metadata and evidence links. This project does not require a training dataset.
- **Documentation:** this README covers local preview and deployment; [`SELECTION.md`](SELECTION.md) covers selection evidence, and [`REVIEW-NOTES.md`](REVIEW-NOTES.md) records review notes.

## Topics

`portfolio` · `github-pages` · `javascript` · `html` · `css` · `responsive-design`
