/* ============================================================
   SAGAR KUMAR PORTFOLIO — main.js
   ============================================================ */

/* ── Page Loader ─────────────────────────────────────────── */
(function () {
  var loader = document.getElementById('sk-loader');
  if (!loader) return;

  var SEEN_KEY = 'sk-loader-seen';

  // Detect browser reload (F5 / Cmd+R / reload button)
  var isReload = false;
  try {
    var navEntry = performance.getEntriesByType('navigation')[0];
    isReload = navEntry ? navEntry.type === 'reload'
                        : performance.navigation.type === 1;
  } catch (e) {}

  // Show only on first visit or browser reload — skip all page navigation
  if (sessionStorage.getItem(SEEN_KEY) && !isReload) {
    loader.remove();
    return;
  }

  sessionStorage.setItem(SEEN_KEY, '1');

  // Make loader visible, then trigger entrance animation
  loader.classList.add('sk-show');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      loader.classList.add('sk-ready');
    });
  });

  function dismissLoader() {
    loader.classList.add('sk-done');
    loader.addEventListener('transitionend', function handler(e) {
      if (e.propertyName !== 'transform') return;
      loader.removeEventListener('transitionend', handler);
      loader.remove();
    });
  }

  // Hold long enough to actually be seen — entrance anim is 350ms,
  // so minimum visible time starts after that
  var HOLD_MS   = 1000;
  var startTime = Date.now();

  if (document.readyState === 'complete') {
    setTimeout(dismissLoader, Math.max(HOLD_MS, HOLD_MS - (Date.now() - startTime)));
  } else {
    window.addEventListener('load', function () {
      setTimeout(dismissLoader, Math.max(HOLD_MS, HOLD_MS - (Date.now() - startTime)));
    });
  }
})();
/* ── End Loader ───────────────────────────────────────────── */

/* ---- Theme toggle ---- */
(function () {
  const STORAGE_KEY = 'sk-theme';
  const html = document.documentElement;

  // Apply saved theme immediately (before paint) to avoid flash
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  if (theme === 'light') html.setAttribute('data-theme', 'light');

  function setTheme(t) {
    html.classList.add('theme-transitioning');
    if (t === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, t);
    setTimeout(() => html.classList.remove('theme-transitioning'), 320);
  }

  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  });
})();

/* ---- Nav: scroll shadow + mobile toggle ---- */
(function () {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      if (open) {
        spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
        spans[1].style.cssText = 'opacity:0';
        spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
      } else {
        spans.forEach(s => s.style.cssText = '');
      }
    });
    // Close on link click
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobile.classList.remove('open');
        toggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
      });
    });
  }
})();

/* ---- Scroll reveal ---- */
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* ---- Skill bar fill on scroll ---- */
(function () {
  const fills = document.querySelectorAll('.skill-item__fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width || 80;
        setTimeout(() => { fill.style.width = width + '%'; }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();

/* ---- Active nav highlighting ---- */
(function () {
  const links = document.querySelectorAll('.nav__links a');
  const path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ---- Case study sticky nav active state ---- */
(function () {
  const csLinks = document.querySelectorAll('.cs-nav-link');
  if (!csLinks.length) return;

  const targets = Array.from(csLinks).map(link => {
    const id = link.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  }).filter(Boolean);

  const setActive = () => {
    let current = '';
    targets.forEach(target => {
      const rect = target.getBoundingClientRect();
      if (rect.top <= 150) current = target.id;
    });
    csLinks.forEach(link => {
      link.classList.toggle('active-section', link.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();

/* ---- Contact form — Formsubmit.co ---- */
(function () {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    const data = new FormData(form);
    // Add hidden fields for Formsubmit config
    data.append('_subject', 'New message from portfolio — ' + (data.get('name') || 'Visitor'));
    data.append('_captcha', 'false');
    data.append('_template', 'table');

    fetch('https://formsubmit.co/ajax/sagar17.kumar@gmail.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    })
      .then(res => res.json())
      .then(res => {
        if (res.success === 'true' || res.success === true) {
          form.style.display = 'none';
          if (success) success.style.display = 'block';
        } else {
          btn.textContent = 'Send Message →';
          btn.disabled = false;
          btn.style.opacity = '1';
          alert('Something went wrong. Please try emailing sagar17.kumar@gmail.com directly.');
        }
      })
      .catch(() => {
        btn.textContent = 'Send Message →';
        btn.disabled = false;
        btn.style.opacity = '1';
        alert('Could not send message. Please email sagar17.kumar@gmail.com directly.');
      });
  });
})();

/* ---- Smooth cursor accent on cards ---- */
(function () {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
})();

/* ---- Trigger reveals already in viewport on load ---- */
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add('in-view');
    }
  });
});

/* ============================================================
   GLOBAL MICRO-INTERACTIONS
   ============================================================ */

/* ── Cursor glow (all pages) ───────────────────────────────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', function (e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();

/* ── Counter animation — Impact Strip (any page with .impact-stat) ── */
(function () {
  const stats = document.querySelectorAll('.impact-stat');
  if (!stats.length) return;
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function animateCounter(el, target, isFloat, dur) {
    let start = null;
    (function step(ts) {
      if (!start) start = ts;
      const t = Math.min((ts - start) / dur, 1);
      el.textContent = isFloat ? (easeOut(t) * target).toFixed(1) : Math.round(easeOut(t) * target);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = isFloat ? target.toFixed(1) : target;
    })(performance.now());
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target.querySelector('.impact-stat__num .accent');
      if (!el || el.dataset.counted) return;
      el.dataset.counted = '1';
      const val = parseFloat(el.textContent);
      animateCounter(el, val, !Number.isInteger(val), 1500);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  stats.forEach(function (s) { io.observe(s); });
})();

/* ── Project card 3-D tilt (any page with .project-card) ───── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.project-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left)  / r.width  - 0.5;
      const y = (e.clientY - r.top)   / r.height - 0.5;
      card.style.transform = 'perspective(900px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 5) + 'deg) translateY(-4px)';
      card.style.transition = 'transform 0.08s ease';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      card.style.transform  = '';
    });
  });
})();

/* ── Magnetic buttons (all pages) ──────────────────────────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.btn--primary, .btn--ghost, .nav__cta').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });
})();

/* ── Marquee pause on hover ─────────────────────────────────── */
(function () {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', function () { track.style.animationPlayState = 'paused'; });
  track.addEventListener('mouseleave', function () { track.style.animationPlayState = 'running'; });
})();

/* ── Testimonials carousel ──────────────────────────────────── */
(function () {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.t-dot');
  const prev   = document.getElementById('tPrev');
  const next   = document.getElementById('tNext');
  if (!slides.length) return;
  let current = 0, timer;
  function goTo(idx) {
    slides[current].classList.remove('t-active');
    dots[current] && dots[current].classList.remove('t-dot-active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('t-active');
    dots[current] && dots[current].classList.add('t-dot-active');
  }
  function restart() { clearInterval(timer); timer = setInterval(function () { goTo(current + 1); }, 5500); }
  if (prev) prev.addEventListener('click', function () { goTo(current - 1); restart(); });
  if (next) next.addEventListener('click', function () { goTo(current + 1); restart(); });
  dots.forEach(function (d) { d.addEventListener('click', function () { goTo(+d.dataset.idx); restart(); }); });
  // Swipe
  const slider = document.getElementById('tSlider');
  if (slider) {
    let tx = 0;
    slider.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend',   function (e) {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); restart(); }
    }, { passive: true });
  }
  restart();
})();

/* ============================================================
   PROJECT PAGE MICRO-INTERACTIONS
   ============================================================ */

/* ── Scroll progress bar ─────────────────────────────────── */
(function () {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  function update() {
    const max = document.body.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = Math.min(pct, 100) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── Generic data-count counter animation ───────────────── */
/* Usage: <span data-count="87" data-suffix="%">87%</span>  */
(function () {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      const target  = parseFloat(el.dataset.count);
      const suffix  = el.dataset.suffix || '';
      const prefix  = el.dataset.prefix || '';
      const isFloat = !Number.isInteger(target);
      const dur     = 1400;
      let start = null;
      (function step(ts) {
        if (!start) start = ts;
        const t   = Math.min((ts - start) / dur, 1);
        const val = easeOut(t) * target;
        el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
      })(performance.now());
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(function (el) { io.observe(el); });
})();

/* ── Staggered reveal for children of .reveal-stagger ────── */
(function () {
  document.querySelectorAll('.reveal-stagger').forEach(function (group) {
    Array.from(group.children).forEach(function (child, i) {
      child.style.transitionDelay = (i * 90) + 'ms';
    });
  });
})();

/* ── Parallax on [data-parallax] elements ────────────────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;
  function tick() {
    const sy = window.scrollY;
    els.forEach(function (el) {
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      const rect  = el.getBoundingClientRect();
      const offset = (rect.top + sy) - window.innerHeight / 2;
      el.style.transform = 'translateY(' + (offset * speed) + 'px)';
    });
  }
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ── Tilt extend: proj-tilt + all project card classes ────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  var TILT_SEL = [
    '.proj-tilt',
    '.pp-method-card', '.pp-outcome-card', '.pp-task',
    '.pds-comp-chip', '.pds-hero-stat',
    '.mnt-impact-card', '.mnt-phase',
    '.psu-machine',
    '.kiid-problem-card'
  ].join(',');
  document.querySelectorAll(TILT_SEL).forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = 'perspective(800px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-4px)';
      card.style.transition = 'transform 0.08s ease';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      card.style.transform  = '';
    });
  });
})();

/* ── Shine sweep on proj-shine + stat/highlight cards ───────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  var SHINE_SEL = [
    '.proj-shine',
    '.mnt-stat', '.mnt-impact-card',
    '.pp-outcome-card',
    '.pds-hero-stat',
    '.psu-machine'
  ].join(',');
  document.querySelectorAll(SHINE_SEL).forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      card.style.setProperty('--shine-x', x + '%');
      card.style.setProperty('--shine-y', y + '%');
      card.style.setProperty('--shine-opacity', '1');
    });
    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--shine-opacity', '0');
    });
  });
})();

/* ── Typewriter for [data-typewrite] ─────────────────────── */
(function () {
  const els = document.querySelectorAll('[data-typewrite]');
  if (!els.length) return;
  els.forEach(function (el) {
    const text   = el.textContent;
    const delay  = parseInt(el.dataset.delay) || 0;
    const speed  = parseInt(el.dataset.speed) || 38;
    el.textContent = '';
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || el.dataset.typed) return;
        el.dataset.typed = '1';
        io.unobserve(el);
        setTimeout(function () {
          let i = 0;
          const cursor = document.createElement('span');
          cursor.className = 'typewrite-cursor';
          el.appendChild(cursor);
          const iv = setInterval(function () {
            cursor.before(text[i]);
            i++;
            if (i >= text.length) {
              clearInterval(iv);
              setTimeout(function () { cursor.remove(); }, 800);
            }
          }, speed);
        }, delay);
      });
    }, { threshold: 0.7 });
    io.observe(el);
  });
})();

