# Joshua Barja's terminal portfolio

A buildless, responsive portfolio for GitHub Pages. Only verified public repository material appears in `projects.json`. Read [the selection rationale](SELECTION.md) for evidence and limitations.

## Preview

From this directory run `python -m http.server 8000 --bind 127.0.0.1`, then open http://127.0.0.1:8000. Serve over HTTP because project data loads from JSON.

Visitors type commands to explore. No command executes a real shell. The contact command shows the owner's provided LinkedIn and email, plus GitHub. No analytics, external fonts, or runtime dependencies are required.

The opening screen waits for input: type `about` and press Enter to read Joshua's introduction, or `help` for available commands. Projects appear only after `projects` or `open <number|id>`. Every command replaces the previous output, so opening a project closes the previous view. There is no internal terminal scrollbar. Up/Down still recalls command history. `clear` restores the opening screen without the introduction. The current selection is IoT Air Quality Monitor, Morphism, and CrackTify.

Run `python check_site.py` to verify project data, pinned evidence URLs, local assets, and the deployment allowlist. This check does not replace browser or screen-reader testing.

Run `python -m unittest discover -s tests -p 'test_*.py'` for the static regression checks. Open http://127.0.0.1:8000/tests/app_logic_test.html to run the prepared command-routing checks in a browser. The browser checks were not executed in the authoring session because no browser was connected.

## GitHub Pages deployment

The workflow deploys pushes to `main` and also supports manual runs:

1. Commit the reviewed site files and workflow to `jarichooo/jarichooo.github.io`, then push to `main`.
2. In repository Settings > Pages, choose GitHub Actions as the publishing source.
3. The push starts **Deploy portfolio to GitHub Pages** automatically; use a manual run to redeploy if needed.
4. Verify the workflow's deployment URL, expected to be https://jarichooo.github.io/.

The workflow packages only `index.html`, `styles.css`, `app.js`, and `projects.json`, plus an empty `.nojekyll`. Local notes, repository metadata, tests, and future unrelated files are not included in that artifact. Do not add private material to public source control, even outside the artifact.

Workflow structure follows [GitHub's custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
