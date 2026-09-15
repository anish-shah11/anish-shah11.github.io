# anish.github.io — Academic Portfolio

Personal website for a PhD student in High-Performance Computing & Computer Architecture. Light, paper-textured academic design. Pure HTML/CSS/JS — no build step, no dependencies.

---

## 🚀 Deploy

1. Copy `index.html`, `assets/`, and this README into your `anish.github.io` repo.
2. Push to `main`.
3. Live at `https://anish.github.io`.

---

## ✏️ Customization checklist

Search `index.html` for `<!-- ✏️` — every placeholder is flagged.

**Do these first:**

- [ ] Replace `Anish [Last Name]` — appears in the page title, nav, hero, and footer
- [ ] Institution, department, and advisor (hero + About)
- [ ] One-sentence research statement (hero)
- [ ] Full bio (About section)
- [ ] All social links: email, Scholar, GitHub, LinkedIn
- [ ] Office address (Contact)
- [ ] Add `assets/cv.pdf`
- [ ] Add `assets/photo.jpg` (4:5 portrait crop works best)

**Adding your photo** — replace the placeholder in the About section:

```html
<!-- Remove: -->
<div class="photo-placeholder"><span class="mono">Your Photo</span></div>

<!-- With: -->
<img src="assets/photo.jpg" alt="Anish [Last Name]" />
```

---

## 📄 Adding content

**A project** — copy any `<article class="project-card project-flip">` block inside `.projects__grid`. Front shows title/status/tags; back shows description + links. Use `status--done` for completed work.

**A publication** — copy any `<li class="pub-item">` block inside `.pub-list`.

**A CV entry** — copy any `<div class="tl-item">` block inside `.timeline`.

**A section dot** — if you add a whole new section, add a matching `<a class="section-dot" data-section="your-id" data-label="Label">` in the `.section-dots` nav.

---

## 🎨 Design system

Everything lives in `:root` at the top of `assets/css/style.css`.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#FAF8F4` | base page |
| `--paper-2` | `#F4F0E8` | alternating bands |
| `--card` | `#FFFDF9` | raised cards |
| `--ink` | `#23272E` | headings |
| `--blue` | `#4E6E8E` | primary accent |
| `--sage` | `#7D9481` | secondary accent |
| `--clay` | `#B5795C` | tertiary accent |

**Type:** Newsreader (serif headings) · Inter (body) · JetBrains Mono (labels).

**Paper grain:** an inline SVG fractal-noise texture in the `.grain` rule, fixed over the page at 40% opacity with `mix-blend-mode: multiply`. Lower the `opacity` value to soften it, or delete the `.grain` div from the HTML to remove it entirely.

---

## 📁 Structure

```
anish.github.io/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── cv.pdf        ← add this
│   └── photo.jpg     ← add this
└── README.md
```

Local preview: `python3 -m http.server 8000`