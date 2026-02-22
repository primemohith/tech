// ─── Config — Edit these to personalize your blog ─────────────────────────────
const BLOG_CONFIG = {
  authorName:    "Yogendra H J",
  authorInitials: "YH",
  authorBio:     "Learning and Sharing knowledge · Cloud Computing evangelist · AWS SAPro · Azure Admin · Exploring DevOps",
};

// ─── Emoji map for tags ────────────────────────────────────────────────────────
const TAG_EMOJI = {
  AWS: "☁️", DevOps: "🔧", Networking: "🌐", Security: "🔐",
  Lambda: "⚡", Python: "🐍", Docker: "🐳", Kubernetes: "☸️",
  Database: "🗄️", Storage: "💾", IAM: "🔑", CI_CD: "🚀",
  default: "📝",
};

// ─── Markdown parser (lightweight) ────────────────────────────────────────────
function parseMarkdown(text) {
  const lines = text.split("\n");
  let html = "";
  let inCode = false;
  let codeLines = [];
  let inList = false;
  let listType = "";

  const flushList = () => {
    if (!inList) return;
    html += `</${listType}>`;
    inList = false; listType = "";
  };

  const inlineFormat = (line) =>
    line
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith("```")) {
      if (inCode) {
        html += `<pre><code>${codeLines.join("\n").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code></pre>`;
        codeLines = []; inCode = false;
      } else {
        flushList(); inCode = true;
      }
      continue;
    }
    if (inCode) { codeLines.push(line); continue; }

    // Headings
    if (line.startsWith("### ")) { flushList(); html += `<h3>${inlineFormat(line.slice(4))}</h3>`; continue; }
    if (line.startsWith("## ")) { flushList(); html += `<h2>${inlineFormat(line.slice(3))}</h2>`; continue; }
    if (line.startsWith("# ")) { flushList(); html += `<h2>${inlineFormat(line.slice(2))}</h2>`; continue; }

    // Blockquote
    if (line.startsWith("> ")) { flushList(); html += `<blockquote><p>${inlineFormat(line.slice(2))}</p></blockquote>`; continue; }

    // Unordered list
    if (/^[-*] /.test(line)) {
      if (!inList || listType !== "ul") { flushList(); html += "<ul>"; inList = true; listType = "ul"; }
      html += `<li>${inlineFormat(line.slice(2))}</li>`;
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      if (!inList || listType !== "ol") { flushList(); html += "<ol>"; inList = true; listType = "ol"; }
      html += `<li>${inlineFormat(line.replace(/^\d+\. /, ""))}</li>`;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) { flushList(); html += "<hr>"; continue; }

    // Empty line
    if (line.trim() === "") { flushList(); continue; }

    // Paragraph
    flushList();
    html += `<p>${inlineFormat(line)}</p>`;
  }
  flushList();
  return html;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function readTime(text) {
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function getEmoji(tag) {
  return TAG_EMOJI[tag] || TAG_EMOJI.default;
}

function initials(name) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ─── App State ────────────────────────────────────────────────────────────────
let allPosts = [];
let activeTag = "all";

// ─── Render ───────────────────────────────────────────────────────────────────
function renderFeed(posts) {
  const list = document.getElementById("articleList");
  if (posts.length === 0) {
    list.innerHTML = `<div class="empty-state">No posts in this category yet.</div>`;
    return;
  }
  list.innerHTML = posts.map((post, i) => `
    <div class="article-card fade-in" data-id="${post.id}" style="animation-delay:${i * 0.05}s">
      <div>
        <div class="article-meta">
          <div class="avatar-sm">${initials(post.author || BLOG_CONFIG.authorName)}</div>
          <span class="author-name">${post.author || BLOG_CONFIG.authorName}</span>
          <span class="article-date">${formatDate(post.date)}</span>
        </div>
        <h2 class="article-title">${post.title}</h2>
        <p class="article-excerpt">${post.subtitle || post.body.slice(0, 160).replace(/[#*>`]/g, "").trim()}…</p>
        <div class="article-footer">
          ${post.tag ? `<span class="article-tag">${post.tag}</span>` : ""}
          <span class="read-time">${readTime(post.body)}</span>
        </div>
      </div>
      <div class="article-emoji">${getEmoji(post.tag)}</div>
    </div>
  `).join("");

  // Bind click events
  list.querySelectorAll(".article-card").forEach(card => {
    card.addEventListener("click", () => openArticle(card.dataset.id));
  });
}

function renderTagBar(posts) {
  const tags = [...new Set(posts.map(p => p.tag).filter(Boolean))];
  const bar = document.getElementById("tagBar");
  bar.innerHTML = `<button class="tag-pill active" data-tag="all">All</button>` +
    tags.map(t => `<button class="tag-pill" data-tag="${t}">${t}</button>`).join("");

  bar.querySelectorAll(".tag-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      activeTag = pill.dataset.tag;
      bar.querySelectorAll(".tag-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const filtered = activeTag === "all" ? allPosts : allPosts.filter(p => p.tag === activeTag);
      renderFeed(filtered);
    });
  });
}

function renderSidebar(posts) {
  // Profile
  document.getElementById("sidebarName").textContent = BLOG_CONFIG.authorName;
  document.getElementById("sidebarBio").textContent = BLOG_CONFIG.authorBio;
  document.getElementById("sidebarAvatar").textContent = initials(BLOG_CONFIG.authorName);

  // Stats
  const tags = [...new Set(posts.map(p => p.tag).filter(Boolean))];
  document.getElementById("totalPosts").textContent = posts.length;
  document.getElementById("totalTags").textContent = tags.length;

  // Sidebar tags
  const sidebarTags = document.getElementById("sidebarTags");
  sidebarTags.innerHTML = tags.map(t =>
    `<button class="tag-pill" data-tag="${t}" style="margin:0.2rem">${t}</button>`
  ).join("");
  sidebarTags.querySelectorAll(".tag-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      activeTag = pill.dataset.tag;
      document.querySelectorAll("#tagBar .tag-pill").forEach(p => {
        p.classList.toggle("active", p.dataset.tag === activeTag);
      });
      renderFeed(allPosts.filter(p => p.tag === activeTag));
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// ─── Article Modal ─────────────────────────────────────────────────────────────
function openArticle(id) {
  const post = allPosts.find(p => p.id === id);
  if (!post) return;

  document.getElementById("articleContent").innerHTML = `
    <span class="article-tag" style="display:inline-block;margin-bottom:1rem">${post.tag || ""}</span>
    <h1 class="article-full-title">${post.title}</h1>
    <div class="article-full-meta">
      <div class="avatar-sm">${initials(post.author || BLOG_CONFIG.authorName)}</div>
      <div>
        <div style="font-size:0.85rem;font-weight:600">${post.author || BLOG_CONFIG.authorName}</div>
        <div style="display:flex;gap:0.75rem;font-size:0.78rem;color:var(--ink-muted);font-family:var(--mono)">
          <span>${formatDate(post.date)}</span>
          <span>${readTime(post.body)}</span>
        </div>
      </div>
    </div>
    <div class="article-full-body">${parseMarkdown(post.body)}</div>
  `;

  const overlay = document.getElementById("articleOverlay");
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";

  // Update URL hash for direct linking
  history.pushState({ postId: id }, "", `#${id}`);
}

function closeArticle() {
  document.getElementById("articleOverlay").classList.remove("open");
  document.body.style.overflow = "";
  history.pushState(null, "", window.location.pathname);
}

// ─── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  // Load posts from JSON
  try {
    const resp = await fetch("posts.json?v=" + Date.now());
    allPosts = await resp.json();
    // Sort newest first
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (e) {
    document.getElementById("articleList").innerHTML =
      `<div class="empty-state">Could not load posts. Make sure posts.json exists.</div>`;
    return;
  }

  renderTagBar(allPosts);
  renderFeed(allPosts);
  renderSidebar(allPosts);

  // Handle direct link via hash
  const hash = window.location.hash.slice(1);
  if (hash && allPosts.find(p => p.id === hash)) {
    openArticle(hash);
  }
}

// ─── Event Listeners ──────────────────────────────────────────────────────────
document.getElementById("articleClose").addEventListener("click", closeArticle);
document.getElementById("articleOverlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeArticle();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeArticle();
});
window.addEventListener("popstate", (e) => {
  if (!e.state?.postId) closeArticle();
});

// ─── Go ───────────────────────────────────────────────────────────────────────
init();
