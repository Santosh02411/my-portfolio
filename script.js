// ===== Theme toggle =====
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("santosh-theme", theme);
}

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// ===== Mobile nav =====
const navBurger = document.getElementById("navBurger");
navBurger.addEventListener("click", () => {
  document.body.classList.toggle("nav-open");
});
document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () =>
    document.body.classList.remove("nav-open"),
  );
});

// ===== Smooth scroll with header offset =====
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href").substring(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const headerOffset = 90;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(
  ".about-grid, .timeline-item, .project-card, .skill-category, .cert-card, .contact-grid",
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
);

revealTargets.forEach((el) => io.observe(el));

// ===== Project card cursor-follow glow =====
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
});

// ===== Sticky header shrink on scroll =====
const header = document.querySelector(".site-header");
let lastScroll = 0;
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    header.style.boxShadow =
      y > 40 ? "0 10px 30px -20px rgba(0,0,0,0.4)" : "none";
    lastScroll = y;
  },
  { passive: true },
);

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Site-wide particle network background =====
(function () {
  const canvas = document.getElementById("siteCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let W = 0,
    H = 0,
    DPR = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let anchors = [];
  let mouse = { x: -9999, y: -9999, active: false };
  let colors = {};

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    colors = {
      dim: cs.getPropertyValue("--text-dimmer").trim() || "#666",
      accent: cs.getPropertyValue("--accent").trim() || "#FFB020",
      accent2: cs.getPropertyValue("--accent-2").trim() || "#4CD9C4",
    };
  }

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    initParticles();
  }

  function initParticles() {
    const count = Math.max(60, Math.min(150, Math.floor((W * H) / 12000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1.1 + Math.random() * 1.5,
    }));
    anchors = [
      { baseX: W * 0.78, baseY: H * 0.18, r: 5, color: "accent", t: 0 },
      { baseX: W * 0.18, baseY: H * 0.42, r: 4.5, color: "accent2", t: 2.1 },
      { baseX: W * 0.55, baseY: H * 0.68, r: 4, color: "accent2", t: 4.2 },
      { baseX: W * 0.85, baseY: H * 0.85, r: 4, color: "accent", t: 1.4 },
      { baseX: W * 0.32, baseY: H * 0.9, r: 4, color: "accent2", t: 3.3 },
    ];
  }

  function step(a) {
    a.t += 0.02;
    a.x = a.baseX + Math.cos(a.t) * 18;
    a.y = a.baseY + Math.sin(a.t * 1.3) * 18;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const dimRgb = hexToRgb(colors.dim);
    const accentRgb = hexToRgb(colors.accent);
    const accent2Rgb = hexToRgb(colors.accent2);

    anchors.forEach(step);
    const nodes = particles.concat(anchors);

    // connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j];
        const dx = a.x - b.x,
          dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isAnchorLink = a.color || b.color;
        const maxDist = isAnchorLink ? 250 : 100;
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * (isAnchorLink ? 0.32 : 0.14);
          const c = isAnchorLink ? accent2Rgb : dimRgb;
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      // link to mouse
      if (mouse.active) {
        const a = nodes[i];
        const dx = a.x - mouse.x,
          dy = a.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.45;
          ctx.strokeStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    // particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      if (mouse.active) {
        const dx = p.x - mouse.x,
          dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90 && dist > 0.01) {
          const force = ((90 - dist) / 90) * 0.6;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dimRgb.r},${dimRgb.g},${dimRgb.b},0.55)`;
      ctx.fill();
    });

    // anchors
    anchors.forEach((a) => {
      const c = a.color === "accent" ? accentRgb : accent2Rgb;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.shadowColor = `rgb(${c.r},${c.g},${c.b})`;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function loop() {
    draw();
    if (!reduceMotion) requestAnimationFrame(loop);
  }

  readColors();
  resize();
  loop();

  window.addEventListener(
    "resize",
    () => {
      readColors();
      resize();
    },
    { passive: true },
  );
  themeToggle.addEventListener("click", () => setTimeout(readColors, 50));

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  document.addEventListener("mouseleave", () => {
    mouse.active = false;
  });
})();
