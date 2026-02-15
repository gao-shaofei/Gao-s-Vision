import fs from "node:fs";
import path from "node:path";

type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary?: string;
};

type Post = PostMeta & {
  html: string;
};

const rootDir = process.cwd();
const contentDir = path.join(rootDir, "content");
const postsDir = path.join(rootDir, "posts");
const indexPath = path.join(rootDir, "index.html");
const stylePath = path.join(rootDir, "style.css");

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInline(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '<a href="$2">$1</a>');
}

function parseFrontMatter(raw: string): { meta: Partial<PostMeta>; body: string } {
  if (!raw.startsWith("---\n")) {
    return { meta: {}, body: raw };
  }

  const closeAt = raw.indexOf("\n---\n", 4);
  if (closeAt === -1) {
    return { meta: {}, body: raw };
  }

  const block = raw.slice(4, closeAt).trim();
  const body = raw.slice(closeAt + 5);
  const meta: Partial<PostMeta> = {};

  for (const line of block.split("\n")) {
    const sep = line.indexOf(":");
    if (sep < 0) {
      continue;
    }

    const key = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim();

    if (key === "title") meta.title = value;
    if (key === "date") meta.date = value;
    if (key === "summary") meta.summary = value;
  }

  return { meta, body };
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];

  let inCodeBlock = false;
  let codeLines: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeLists = (): void => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      closeLists();
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLines = [];
      } else {
        out.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.trim() === "") {
      closeLists();
      continue;
    }

    if (line.startsWith("# ")) {
      closeLists();
      out.push(`<h1>${formatInline(line.slice(2).trim())}</h1>`);
      continue;
    }

    if (line.startsWith("## ")) {
      closeLists();
      out.push(`<h2>${formatInline(line.slice(3).trim())}</h2>`);
      continue;
    }

    if (line.startsWith("### ")) {
      closeLists();
      out.push(`<h3>${formatInline(line.slice(4).trim())}</h3>`);
      continue;
    }

    if (line.trim() === "---") {
      closeLists();
      out.push("<hr />");
      continue;
    }

    if (line.startsWith("> ")) {
      closeLists();
      out.push(`<blockquote>${formatInline(line.slice(2).trim())}</blockquote>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      if (!inOl) {
        if (inUl) {
          out.push("</ul>");
          inUl = false;
        }
        out.push("<ol>");
        inOl = true;
      }
      out.push(`<li>${formatInline(line.replace(/^\d+\.\s+/, ""))}</li>`);
      continue;
    }

    if (/^-\s+/.test(line)) {
      if (!inUl) {
        if (inOl) {
          out.push("</ol>");
          inOl = false;
        }
        out.push("<ul>");
        inUl = true;
      }
      out.push(`<li>${formatInline(line.replace(/^-\s+/, ""))}</li>`);
      continue;
    }

    closeLists();
    out.push(`<p>${formatInline(line.trim())}</p>`);
  }

  if (inCodeBlock) {
    out.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  closeLists();
  return out.join("\n");
}

function pageTemplate(title: string, stylesheetHref: string, content: string): string {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="${stylesheetHref}" />
  </head>
  <body>
    <main class="container">
${content}
    </main>
  </body>
</html>`;
}

function renderPost(post: Post): string {
  const body = `      <p><a href="../index.html">← 返回首页</a></p>
      <article>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="muted">${escapeHtml(post.date)}</p>
        ${post.html}
      </article>`;
  return pageTemplate(`${post.title} | My Blog`, "../style.css", body);
}

function renderIndex(posts: Post[]): string {
  const items = posts
    .map((post) => {
      return `        <li>
          <h2><a href="posts/${post.slug}.html">${escapeHtml(post.title)}</a></h2>
          <p class="muted">${escapeHtml(post.date)}</p>
          ${post.summary ? `<p>${escapeHtml(post.summary)}</p>` : ""}
        </li>`;
    })
    .join("\n");

  const body = `      <header>
        <h1>My Blog</h1>
        <p class="muted">一个用 TypeScript 生成的静态博客</p>
      </header>
      <section>
        <ul class="post-list">
${items}
        </ul>
      </section>`;

  return pageTemplate("My Blog", "./style.css", body);
}

function loadPosts(): Post[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs
    .readdirSync(contentDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .sort();

  const posts: Post[] = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(contentDir, fileName);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { meta, body } = parseFrontMatter(raw);

    return {
      slug,
      title: meta.title || slug,
      date: meta.date || "1970-01-01",
      summary: meta.summary,
      html: markdownToHtml(body),
    };
  });

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

function writeStyle(): void {
  const css = `:root {
  --bg: #f7f4ed;
  --card: #fffcf5;
  --text: #2f261d;
  --muted: #75624f;
  --border: #dacbb8;
  --link: #8d3b2d;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  color: var(--text);
  font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif;
  line-height: 1.7;
  background: radial-gradient(circle at top right, #f2e8d7 0%, var(--bg) 38%, #eee6da 100%);
}

.container {
  max-width: 760px;
  margin: 0 auto;
  padding: 3rem 1.2rem 4rem;
}

h1,
h2,
h3 {
  line-height: 1.25;
}

a {
  color: var(--link);
  text-decoration-thickness: 1px;
}

.muted {
  color: var(--muted);
}

.post-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.post-list li {
  margin-bottom: 1rem;
  padding: 1rem 1rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
}

pre {
  background: #20170f;
  color: #f5eddc;
  padding: 0.9rem;
  border-radius: 8px;
  overflow-x: auto;
}

code {
  font-family: "Fira Code", "SFMono-Regular", Menlo, Consolas, monospace;
}

blockquote {
  margin: 1rem 0;
  padding-left: 0.8rem;
  border-left: 3px solid var(--border);
  color: #5f4f3d;
}

hr {
  border: 0;
  border-top: 1px solid var(--border);
}

@media (max-width: 640px) {
  .container {
    padding-top: 2rem;
  }
}`;

  fs.writeFileSync(stylePath, css);
}

function cleanGeneratedPostsDir(): void {
  if (!fs.existsSync(postsDir)) {
    return;
  }

  for (const name of fs.readdirSync(postsDir)) {
    const full = path.join(postsDir, name);
    const stat = fs.statSync(full);
    if (stat.isFile()) {
      fs.unlinkSync(full);
    }
  }
}

function build(): void {
  ensureDir(postsDir);
  cleanGeneratedPostsDir();

  const posts = loadPosts();

  for (const post of posts) {
    const outputPath = path.join(postsDir, `${post.slug}.html`);
    fs.writeFileSync(outputPath, renderPost(post));
  }

  fs.writeFileSync(indexPath, renderIndex(posts));
  writeStyle();

  console.log(`Built ${posts.length} post(s).`);
}

build();
