# DevBytes — Personal Tech Blog

A clean, fast, zero-dependency tech blog that runs on GitHub Pages. **No backend. No database. No build step.**

## 🚀 Deploy in 5 Minutes

### 1. Create your GitHub repo

```bash
# Go to github.com → New Repository
# Name it: yourusername.github.io  (for a personal blog)
# OR any name like: my-tech-blog   (hosted at yourusername.github.io/my-tech-blog)
```

### 2. Clone and push this project

```bash
git clone https://github.com/yourusername/yourusername.github.io
cd yourusername.github.io

# Copy all these files into the repo, then:
git add .
git commit -m "Initial blog setup"
git push
```

### 3. Enable GitHub Pages

- Go to your repo → **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: `main` → `/ (root)`
- Click **Save**

Your blog will be live at `https://yourusername.github.io` in ~30 seconds! 🎉

---

## ✍️ How to Post Every Day

**This is the only file you edit:** `posts.json`

### Add a new post

Open `posts.json` and add a new object at the **top** of the array:

```json
[
  {
    "id": "my-new-post-slug",
    "title": "Your Post Title Here",
    "subtitle": "A one-line summary that appears in the feed.",
    "tag": "AWS",
    "date": "2024-02-22",
    "author": "Your Name",
    "body": "Your full post content in Markdown here.\n\n## Section Heading\n\nYour content..."
  },
  
  ... existing posts below ...
]
```

Then push:

```bash
git add posts.json
git commit -m "Post: Your Post Title"
git push
```

**Live in ~30 seconds.** That's it.

---

## 📝 Markdown Support

In your `body` field, you can use:

| Syntax | Result |
|--------|--------|
| `## Heading` | Section heading |
| `### Sub-heading` | Sub-heading |
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `` `code` `` | inline code |
| ` ```code block``` ` | code block |
| `> quote` | blockquote |
| `- item` | bullet list |
| `1. item` | numbered list |
| `[text](url)` | link |

**Important:** Since the body is inside JSON, you must escape newlines as `\n`:
```json
"body": "First paragraph.\n\n## Section\n\nSecond paragraph."
```

---

## ⚙️ Customize Your Profile

Edit `js/app.js` at the top:

```js
const BLOG_CONFIG = {
  authorName:     "Your Name",
  authorInitials: "YN",
  authorBio:      "Cloud engineer · AWS enthusiast · Writer",
};
```

---

## 📁 File Structure

```
your-repo/
├── index.html       ← Blog homepage (don't edit)
├── posts.json       ← YOUR POSTS GO HERE ← edit this daily
├── css/
│   └── style.css    ← Styling (customize if you want)
└── js/
    └── app.js       ← Logic (edit BLOG_CONFIG at top)
```

---

## 💡 Tips

- **Post ID:** Must be unique and URL-friendly (no spaces, use hyphens): `"id": "my-post-2024-02-22"`
- **Date format:** Always `YYYY-MM-DD` for correct sorting
- **Direct links:** Every post is linkable at `yourblog.github.io/#post-id`
- **Tag anything:** `AWS`, `DevOps`, `Python`, `Kubernetes`, etc. Tags auto-appear in the filter bar
- **No title page images needed** — emojis are auto-assigned per tag

---

## 🆓 Completely Free

- GitHub Pages: Free forever
- No backend, no database, no hosting fees
- Your posts are just text in a JSON file — version-controlled, portable, yours forever
