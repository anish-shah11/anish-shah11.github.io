'use strict';

/* ================================================================
   NAVIGATION — background on scroll + mobile menu
================================================================ */
(function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ================================================================
   SCROLL PROGRESS BAR
================================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0).toFixed(2) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

/* ================================================================
   SCROLL REVEAL — gentle fade-up as content enters the viewport
================================================================ */
(function initScrollReveal() {
  const targets = [
    '.section-header',
    '.about__grid',
    '.research-card',
    '.project-card',
    '.pub-item',
    '.tl-item',
    '.contact__body',
  ].join(', ');

  const elements = document.querySelectorAll(targets);
  if (!elements.length) return;

  // Stagger delays for grid children
  document.querySelectorAll('.research__grid .research-card').forEach((el, i) => {
    el.style.setProperty('--i', i);
  });
  document.querySelectorAll('.projects__grid .project-card').forEach((el, i) => {
    el.style.setProperty('--i', i);
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => {
    el.classList.add('reveal');
    obs.observe(el);
  });
})();

/* ================================================================
   ACTIVE SECTION — nav underline + right-side progress dots
================================================================ */
(function initActiveSection() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav__links a');
  const dots     = document.querySelectorAll('.section-dot');
  if (!sections.length) return;

  dots[0]?.classList.add('active');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;

      navLinks.forEach(a => {
        a.removeAttribute('aria-current');
        if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'page');
      });

      dots.forEach(d => d.classList.toggle('active', d.dataset.section === id));
    });
  }, { rootMargin: '-35% 0px -58% 0px' });

  sections.forEach(s => obs.observe(s));
})();

/* ================================================================
   PROJECT FLIP — tap to flip on touch devices
   (hover handles it on desktop via CSS)
================================================================ */
(function initTouchFlip() {
  if (!window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.project-flip').forEach(card => {
    card.addEventListener('click', e => {
      // Let real links through without flipping back
      if (e.target.closest('a')) return;
      card.classList.toggle('flipped');
    });
  });
})();

/* ================================================================
   FOOTER — auto-updating date
================================================================ */
(function initFooter() {
  const el = document.getElementById('footerDate');
  if (!el) return;
  const date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  el.textContent = 'Last updated ' + date;
})();