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
   SKILLS CONSTELLATION
   Labeled technology nodes drifting and connecting —
   edit SKILL_NODES to match your actual expertise.
================================================================ */
(function initSkillsConstellation() {
  const canvas = document.getElementById('skillsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ✏️  Edit these to match your actual skills + proficiency (0–1)
  const SKILL_NODES = [
    { label: 'CUDA',     weight: 1.0 },
    { label: 'C++',      weight: 0.95 },
    { label: 'MPI',      weight: 0.85 },
    { label: 'OpenMP',   weight: 0.80 },
    { label: 'gem5',     weight: 0.75 },
    { label: 'RISC-V',   weight: 0.70 },
    { label: 'Python',   weight: 0.85 },
    { label: 'LLVM',     weight: 0.60 },
    { label: 'Verilog',  weight: 0.55 },
  ];

  const MAX_DIST   = 170;
  const SPEED      = 0.18;

  let W, H, nodes, raf;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildNodes();
  }

  function buildNodes() {
    const cols = Math.min(SKILL_NODES.length, 5);
    nodes = SKILL_NODES.map((s, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        x:  (W / (cols + 1)) * (col + 1) + (Math.random() - 0.5) * 30,
        y:  (H / 3) * (row + 1) + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        label: s.label,
        r:  2.5 + s.weight * 2.5,   // radius 2.5–5 px by proficiency
        weight: s.weight,
      };
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move — soft bounce at padded edges
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 24 || n.x > W - 24) n.vx *= -1;
      if (n.y < 18 || n.y > H - 18) n.vy *= -1;
    });

    // Edges — cyan → violet gradient based on distance ratio
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist >= MAX_DIST) continue;

        const t     = dist / MAX_DIST;               // 0 = close, 1 = far
        const alpha = (1 - t) * 0.45;
        const r     = Math.round(0   + t * 124);
        const g     = Math.round(207 - t * 149);
        const b     = Math.round(255 - t * 18);

        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }
    }

    // Nodes + labels
    nodes.forEach(n => {
      // Soft glow halo
      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3.5);
      grd.addColorStop(0, `rgba(0, 207, 255, ${0.18 + n.weight * 0.22})`);
      grd.addColorStop(1, 'rgba(0, 207, 255, 0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = '#00CFFF';
      ctx.shadowColor = '#00CFFF';
      ctx.shadowBlur  = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label below dot
      ctx.font      = `500 10.5px 'JetBrains Mono', monospace`;
      ctx.fillStyle = `rgba(226, 232, 240, ${0.6 + n.weight * 0.35})`;
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y + n.r + 13);
    });

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); draw(); }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf); else draw();
  });

  resize();
  draw();
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

/* ================================================================
   SCROLL PROGRESS BAR
   Thin cyan-to-violet gradient fills as you scroll down the page.
================================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0).toFixed(2) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ================================================================
   CUSTOM CURSOR GLOW
   Soft cyan halo that smoothly tracks the mouse (lerp follow).
   Disabled on touch devices.
================================================================ */
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -999, mouseY = -999;
  let curX = -999, curY = -999;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    curX = lerp(curX, mouseX, 0.09);
    curY = lerp(curY, mouseY, 0.09);
    glow.style.left = curX + 'px';
    glow.style.top  = curY + 'px';
    raf = requestAnimationFrame(animate);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf); else animate();
  });

  animate();
})();

/* ================================================================
   SECTION PROGRESS DOTS
   Right-side dots highlight which section is currently in view.
================================================================ */
(function initSectionDots() {
  const dots     = document.querySelectorAll('.section-dot');
  const sections = document.querySelectorAll('section[id]');
  if (!dots.length || !sections.length) return;

  // Activate first dot immediately
  dots[0]?.classList.add('active');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      dots.forEach(dot => dot.classList.toggle('active', dot.dataset.section === id));
    });
  }, { rootMargin: '-35% 0px -60% 0px' });

  sections.forEach(s => obs.observe(s));
})();