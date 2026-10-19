"""Check public project data and the exact Pages artifact without dependencies."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).parent
ASSETS = ('index.html', 'styles.css', 'app.js', 'projects.json')


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.local_assets = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag in ('script', 'link'):
            value = attrs.get('src') or attrs.get('href', '')
            if value and not urlparse(value).scheme:
                self.local_assets.append(value)


def main():
    for name in ASSETS:
        assert (ROOT / name).is_file(), f'Missing deployment asset: {name}'
    projects = json.loads((ROOT / 'projects.json').read_text(encoding='utf-8'))
    assert len(projects) == 3
    assert len({p['id'] for p in projects}) == len(projects)
    public_repos = {'AirQualityMonitor', 'NLP-FINAL-PROJECT', 'CrackTify'}
    for project in projects:
        for key in ('id', 'title', 'summary', 'stack', 'contribution', 'why', 'limitations', 'sources'):
            assert project[key], (project['id'], key)
        assert len(project['sources']) >= 3
        for source in project['sources'] + [{'url': project['repo']}]:
            url = urlparse(source['url'])
            parts = url.path.strip('/').split('/')
            assert url.scheme == 'https' and url.netloc == 'github.com'
            assert parts[0] == 'jarichooo' and parts[1] in public_repos
            if len(parts) > 2:
                assert parts[2] in ('blob', 'commit') and len(parts[3]) == 40
    page = Page()
    page.feed((ROOT / 'index.html').read_text(encoding='utf-8'))
    assert len(page.ids) == len(set(page.ids)), 'Duplicate HTML ids'
    for asset in page.local_assets:
        assert (ROOT / asset).is_file(), f'Broken local asset: {asset}'
    workflow = (ROOT / '.github/workflows/pages.yml').read_text(encoding='utf-8')
    assert 'workflow_dispatch:' in workflow and 'branches: [main]' in workflow
    assert 'cp index.html styles.css app.js projects.json _site/' in workflow
    assert 'path: _site' in workflow
    print(f'PASS: {len(projects)} public projects, pinned evidence, local assets, manual Pages allowlist.')


if __name__ == '__main__':
    main()
