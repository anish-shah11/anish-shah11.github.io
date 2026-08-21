'use strict';

/* ================================================================
   HPC TOPOLOGY CANVAS — mesh network of drifting nodes & edges
   Evokes the interconnect topology that defines HPC systems.
================================================================ */
(function initTopologyCanvas() {
  const canvas = document.getElementById('topoCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, nodes, raf;
  const MAX_DIST   = 160;
  const NODE_SPEED = 0.22;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildNodes();
  }

  function buildNodes() {
    // Density: one node per ~16 000 px²
    const count = Math.max(20, Math.min(80, Math.floor((W * H) / 16000)));
    nodes = Array.from({ length: count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * NODE_SPEED,
      vy: (Math.random() - 0.5) * NODE_SPEED,
      r:  Math.random() * 1.5 + 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // --- Update positions (wrap at edges for seamless motion) ---
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20)    n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20)    n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
    });

    // --- Draw edges first (behind nodes) ---
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          // Closer = more opaque; blends cyan → violet by ratio
          const t     = dist / MAX_DIST;       // 0 (close) → 1 (far)
          const alpha = (1 - t) * 0.55;

          // Interpolate cyan (#00CFFF) → violet (#7C3AED)
          const r = Math.round(0   + t * 124);
          const g = Math.round(207 - t * 149);
          const b = Math.round(255 - t * 18);

          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }

    // --- Draw node dots ---
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 207, 255, 0.75)';
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });

  // Pause animation when tab is hidden to save battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      draw();
    }
  });

  resize();
  draw();
})();

/* ================================================================
   LIVE PERFORMANCE COUNTERS
   Ticking CPU cycle counter + memory bandwidth readout
================================================================ */
(function initPerfCounters() {
  const cycleEl = document.getElementById('cycleCounter');
  const bwEl    = document.getElementById('bwCounter');
  if (!cycleEl || !bwEl) return;

  // Start at a random mid-range cycle count so it looks like an
  // already-running benchmark, not a fresh boot.
  let cycles = Math.floor(Math.random() * 5e12 + 1e12);

  function formatCycles(n) {
    // e.g. 2,847,391,245,891
    return n.toLocaleString('en-US');
  }

  function tick() {
    // ~3 GHz displayed at ~50 M increments per 120ms ≈ 420 MHz apparent
    cycles += Math.floor(Math.random() * 30e6 + 20e6);
    if (cycles > 9.9e15) cycles = 1e12;

    const bw = (Math.random() * 15 + 290).toFixed(1); // realistic HBM bandwidth

    cycleEl.textContent = formatCycles(cycles);
    bwEl.textContent    = bw + ' GB/s';
  }

  setInterval(tick, 120);
  tick(); // immediate first render
})();

/* ================================================================
   NAVIGATION — scroll glass effect + mobile toggle
================================================================ */
(function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  // Add/remove .scrolled class for frosted-glass effect
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile hamburger
  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Close mobile nav on any link tap
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle?.classList.remove('open');
    });
  });
})();

/* ================================================================
   SCROLL REVEAL — fade-up on intersection
================================================================ */
(function initScrollReveal() {
  const targets = [
    '.section-header',
    '.research-card',
    '.project-card',
    '.pub-item',
    '.cv-item',
    '.contact-card',
    '.about__grid',
  ].join(', ');

  const elements = document.querySelectorAll(targets);

  // Set stagger index for grid children
  document.querySelectorAll('.research__grid .research-card').forEach((el, i) => {
    el.style.setProperty('--i', i);
  });
  document.querySelectorAll('.projects__grid .project-card').forEach((el, i) => {
    el.style.setProperty('--i', i);
  });

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
  );

  elements.forEach(el => {
    el.classList.add('reveal');
    obs.observe(el);
  });
})();

/* ================================================================
   ACTIVE NAV LINK — highlight section in view
================================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => {
            a.removeAttribute('aria-current');
            if (a.getAttribute('href') === '#' + entry.target.id) {
              a.setAttribute('aria-current', 'page');
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => obs.observe(s));
})();

/* ================================================================
   FOOTER — auto-update date
================================================================ */
(function initFooter() {
  const el = document.getElementById('footerDate');
  if (!el) return;
  const date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  el.textContent = 'Last updated ' + date;
})();

