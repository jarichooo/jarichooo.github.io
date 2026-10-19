import json
import unittest
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).parents[1]


class PortfolioSiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.projects = json.loads((ROOT / "projects.json").read_text(encoding="utf-8"))

    def test_selected_projects_have_complete_public_evidence(self):
        self.assertEqual(len(self.projects), 3)
        self.assertEqual({p['repo'].rsplit('/', 1)[-1] for p in self.projects},
                         {'AirQualityMonitor', 'NLP-FINAL-PROJECT', 'CrackTify'})
        self.assertEqual([p['title'] for p in self.projects],
                         ['IoT Air Quality Monitor', 'Morphism', 'CrackTify'])
        self.assertEqual(len({project["id"] for project in self.projects}), len(self.projects))

        required = {"id", "title", "repo", "summary", "stack", "status", "contribution", "why", "limitations", "sources"}
        for project in self.projects:
            self.assertTrue(required.issubset(project), project.get("title"))
            self.assertTrue(project["sources"], project["title"])
            for url in [project["repo"], *(source["url"] for source in project["sources"])]:
                parsed = urlparse(url)
                self.assertEqual(parsed.scheme, "https")
                self.assertEqual(parsed.netloc, "github.com")

    def test_page_and_script_keep_the_static_contract(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        script = (ROOT / "app.js").read_text(encoding="utf-8")
        for element_id in ("terminal", "output", "command-form", "terminal-input", "announcer"):
            self.assertIn(f'id="{element_id}"', html)
        self.assertIn('fetch("./projects.json")', script)
        self.assertNotIn("eval(", script)
        self.assertNotIn("innerHTML", script)
        self.assertNotIn('class="project-card"', html)
        self.assertNotIn('id="initial-projects"', html)
        self.assertNotIn('class="guide"', html)
        self.assertNotIn('data-command="about"', html)
        self.assertNotIn('Run help', html)
        self.assertNotIn('<footer>', html)
        self.assertNotIn('fourth-year', html)
        self.assertIn('Type <code>about</code>', html)
        self.assertIn('fourth-year Computer Science student at Camarines Sur Polytechnic Colleges', script)
        self.assertIn('https://www.linkedin.com/in/joshua-jericho-barja-27b878286', script)
        self.assertIn('mailto:barjajoshuajericho@gmail.com', script)

    def test_commands_replace_output_without_nested_scrolling(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        css = (ROOT / "styles.css").read_text(encoding="utf-8")
        script = (ROOT / "app.js").read_text(encoding="utf-8")
        self.assertIn('aria-label="Current command output"', html)
        self.assertNotIn('overflow-y: auto', css)
        self.assertNotIn('height: 100dvh', css)
        self.assertNotIn('output.append(result)', script)
        self.assertEqual(script.count('output.replaceChildren(result)'), 2)


if __name__ == "__main__":
    unittest.main()
