# Personal Static Blog Spec (v1)

## 1. Overview
Build a minimal personal static blog generator with TypeScript and HTML.

Primary workflow:
1. Write posts locally as Markdown files.
2. Run a local Node.js build command.
3. Generate static HTML files.
4. Commit generated files to GitHub.
5. Publish with GitHub Pages from the `main` branch root.

## 2. Goals
- Keep architecture and code simple.
- Keep dependencies minimal for learning.
- Make the content/build/publish flow explicit and easy to modify.

## 3. Non-Goals (v1)
- No framework (no React/Vue/Next/Nuxt).
- No database or server runtime.
- No full Markdown standard compliance.
- No search, pagination, tags, RSS, comments.

## 4. Tech Constraints
- Runtime: Node.js LTS (>= 20 recommended).
- Language: TypeScript.
- Output: Plain static HTML + CSS.
- Dependencies: only `typescript` as dev dependency.

## 5. Repository Layout
```text
.
├─ SPEC.md
├─ package.json
├─ tsconfig.json
├─ content/
│  └─ *.md
├─ src/
│  └─ build.ts
├─ index.html            # generated home page (root)
├─ style.css             # generated shared stylesheet (root)
└─ posts/
   └─ *.html             # generated post pages
```

## 6. Content Model
Each post is one Markdown file under `content/`.

Filename rules:
- Extension must be `.md`.
- Filename without extension is used as `slug`.

Optional front matter block at top:
```md
---
title: Post Title
date: 2026-02-15
summary: One-line summary
---
```

Field rules:
- `title`: optional, fallback to slug.
- `date`: optional, fallback `1970-01-01`.
- `summary`: optional.

## 7. Markdown Support (v1)
Supported syntax only:
- Headings: `#`, `##`, `###`
- Paragraphs
- Unordered list: `- item`
- Ordered list: `1. item`
- Code fence: triple backticks
- Inline code: `` `code` ``
- Bold/italic: `**text**`, `*text*`
- Links: `[text](url)`
- Blockquote: `> text`
- Horizontal rule: `---`

Anything else is treated as plain text paragraph content.

## 8. Build Behavior
Build command:
- Compile TypeScript to `build/`.
- Run generated JS build script.

Generator behavior:
1. Read all `content/*.md` files.
2. Parse front matter and Markdown.
3. Sort posts by `date` descending (string compare on `YYYY-MM-DD`).
4. Generate per-post pages at `posts/{slug}.html`.
5. Generate home page at `index.html` (repository root).
6. Generate shared stylesheet at `style.css` (repository root).
7. Ensure output directories exist.

Link behavior:
- Home links to each post in `posts/`.
- Post page includes link back to root home.
- Stylesheet links resolve correctly from both root and `posts/` pages.

## 9. HTML Requirements
- Valid `<!doctype html>` pages.
- `<meta charset="UTF-8">` and viewport meta.
- Semantic structure: `main`, `article`, heading hierarchy.
- Escape HTML for user content before applying inline Markdown transforms.

## 10. Styling Requirements
- One stylesheet file: `style.css`.
- Readable typography on desktop and mobile.
- No CSS framework.

## 11. GitHub Pages Publishing (No Actions)
Publishing mode:
- Use GitHub Pages `Deploy from a branch`.
- Branch: `main`.
- Folder: `/ (root)`.

Notes:
- `index.html` must exist at repository root.
- Other static files can stay in subdirectories (for example `posts/`) and be referenced by relative/absolute paths.

## 12. Scripts
`package.json` scripts:
- `build`: `tsc && node build/build.js`
- `clean`: remove generated outputs (`build`, `posts`, `style.css`, `index.html`)

## 13. Error Handling (v1)
- Missing `content/` should not crash; produce empty index.
- Malformed front matter should be tolerated (ignore unknown lines).
- Missing metadata falls back to defaults.

## 14. Acceptance Criteria
1. After adding at least one markdown file, `npm run build` generates:
   - `index.html`
   - `style.css`
   - `posts/<slug>.html`
2. Home page shows post title/date/summary and links to post pages.
3. Post pages render supported markdown features.
4. Repo can be published by GitHub Pages from `main / (root)` with no GitHub Actions.
5. Project has only one dependency: `typescript`.

## 15. Future Extensions (out of scope for v1)
- Tag/category pages.
- Pagination.
- RSS feed.
- Syntax highlighting.
- Draft mode.
- Sitemap generation.
