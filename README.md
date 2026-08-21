# anish-shah11.github.io — PhD Portfolio Site

Personal academic website for a PhD student in High-Performance Computing & Computer Architecture. Built with pure HTML, CSS, and vanilla JS — no frameworks, no build tools, deploys instantly on GitHub Pages.

---

## 🚀 Getting started

1. **Clone / download** these files into your `anish.github.io` repository.
2. Push to the `main` branch — GitHub Pages serves it automatically.
3. Your site is live at `https://anish-shah11.github.io`.

---

## ✏️ What to customize

Open `index.html` and search for `<!-- ✏️` comments — every placeholder is marked.

### Essential changes (do these first)

| What | Where in `index.html` |
|---|---|
| Your institution & advisor | `.hero__institution` paragraph |
| Your bio | `.about__bio` section |
| Social / profile links | `.about__links` anchors |
| Email address | `.contact__channels` and `about__links` |
| GitHub / Scholar / LinkedIn URLs | All `href` attributes with `#` |

### Adding a photo

Replace the placeholder div in the About section:
```html
<!-- Remove this: -->
<div class="about__photo-placeholder"><span>Your Photo</span></div>

<!-- Add this: -->
<img src="assets/photo.jpg" alt="Anish [Your Last Name]" />
```
Put `photo.jpg` in the `assets/` folder. Aim for a square crop (400×400px or larger).

### Adding your CV

Drop your PDF into `assets/cv.pdf`. The Download CV button and the CV section link already point there.

### Adding a project

Copy and paste this block inside the `.projects__grid` div:
```html
<article class="project-card">
  <div class="project-card__top">
    <span class="project-status">Active</span>   <!-- or: project-status--done + "Completed" -->
    <div class="project-card__links">
      <a href="https://github.com/..." target="_blank" rel="noopener">GH</a>
      <a href="link-to-paper.pdf"   target="_blank" rel="noopener">PDF</a>
    </div>
  </div>
  <h3>Your Project Title</h3>
  <p>One to two sentences describing the project.</p>
  <div class="project-card__tags">
    <span>Tag 1</span><span>Tag 2</span>
  </div>
</article>
```

### Adding a publication

Copy and paste this block inside the `.pub-list` ordered list:
```html
<li class="pub-item">
  <span class="pub-year mono">2025</span>
  <div class="pub-body">
    <h3 class="pub-title">Your Paper Title</h3>
    <p class="pub-authors"><strong>Anish [Last Name]</strong>, Co-Author, Advisor</p>
    <p class="pub-venue"><em>Conference Name (VENUE '25)</em></p>
    <div class="pub-links">
      <a href="paper.pdf" target="_blank" rel="noopener">Paper</a>
      <a href="slides.pdf" target="_blank" rel="noopener">Slides</a>
    </div>
  </div>
</li>
```

### Adding a CV entry

Copy and paste inside the `.cv-timeline` div:
```html
<div class="cv-item">
  <span class="cv-date mono">2025</span>
  <div class="cv-content">
    <h3>Role / Degree Title</h3>
    <span class="cv-org">Institution / Company</span>
    <p>Brief description of your work or study here.</p>
  </div>
</div>
```

---

## 🎨 Design tokens

All colors and fonts live in `assets/css/style.css` under `:root`. To change the accent color from cyan to something else, update:
```css
--cyan:     #00CFFF;   /* primary accent */
--violet:   #7C3AED;   /* secondary accent / gradient end */
```

---

## 📁 File structure

```
anish.github.io/
├── index.html          ← main page (all sections here)
├── assets/
│   ├── css/
│   │   └── style.css   ← all styles & design tokens
│   ├── js/
│   │   └── main.js     ← canvas, counters, nav, scroll reveal
│   ├── cv.pdf          ← drop your CV PDF here
│   └── photo.jpg       ← drop your photo here
└── README.md
```

---

## 🔧 No build process

This site uses no npm, no bundlers, no frameworks. Edit files and push — that's it.

For local preview: open `index.html` directly in a browser, or run any static server:
```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

