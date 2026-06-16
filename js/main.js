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

/* ---- Contact form ---- */
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

    // Simulate send (replace with real endpoint)
    setTimeout(() => {
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    }, 1200);
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
    '.cn-chapter',
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


/* ═══════════════════════════════════════════════════════════
   SK LIGHTBOX — click-to-expand image viewer
   Works on: proj-visuals banners, screen-card browser wraps,
             and project card thumbnails
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── 1. Build the lightbox DOM ──────────────────────────
  var lb = document.createElement('div');
  lb.id = 'sk-lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = [
    '<div class="sk-lb__bar">',
      '<span class="sk-lb__title" id="sk-lb-title"></span>',
      '<span class="sk-lb__counter" id="sk-lb-counter"></span>',
      '<button class="sk-lb__close" aria-label="Close" id="sk-lb-close">&#x2715;</button>',
    '</div>',
    '<div class="sk-lb__stage">',
      '<button class="sk-lb__nav sk-lb__nav--prev" id="sk-lb-prev" aria-label="Previous">&#8592;</button>',
      '<div class="sk-lb__img-wrap">',
        '<img class="sk-lb__img" id="sk-lb-img" src="" alt="">',
      '</div>',
      '<button class="sk-lb__nav sk-lb__nav--next" id="sk-lb-next" aria-label="Next">&#8594;</button>',
    '</div>',
    '<div class="sk-lb__panel" id="sk-lb-panel"></div>',
    '<div class="sk-lb__strip" id="sk-lb-strip"></div>'
  ].join('');
  document.body.appendChild(lb);

  var lbEl    = lb;
  var lbImg   = document.getElementById('sk-lb-img');
  var lbTitle = document.getElementById('sk-lb-title');
  var lbCount = document.getElementById('sk-lb-counter');
  var lbPanel = document.getElementById('sk-lb-panel');
  var lbStrip = document.getElementById('sk-lb-strip');
  var lbClose = document.getElementById('sk-lb-close');
  var lbPrev  = document.getElementById('sk-lb-prev');
  var lbNext  = document.getElementById('sk-lb-next');

  var gallery = [];  // [{src, title, desc, annots:[{label,text}]}]
  var current = 0;

  // ── 2. Harvest images from the page ───────────────────
  function buildGallery() {
    gallery = [];

    // Selector covers: visual banners, browser-wrap screens, card thumbs
    var selectors = [
      '.proj-visuals__banner img[src]:not([src=""])',
      '.proj-visuals__frame img[src]:not([src=""])',
      '.screen-card .browser-wrap img[src]:not([src=""])',
      '.pcard__thumb img[src]:not([src=""])',
      '.project-card__img img[src]:not([src=""])'
    ];

    var seen = new Set();
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (imgEl) {
        if (seen.has(imgEl.src)) return;
        seen.add(imgEl.src);

        // Try to find title + desc from nearest screen-card
        var card    = imgEl.closest('.screen-card');
        var title   = '';
        var desc    = '';
        var annots  = [];

        if (card) {
          var titleEl = card.querySelector('.screen-card__title');
          var descEl  = card.querySelector('.screen-card__desc');
          if (titleEl) title = titleEl.textContent.trim();
          if (descEl)  desc  = descEl.textContent.trim();
          card.querySelectorAll('.screen-card__annot').forEach(function (a) {
            var lbl = a.querySelector('.screen-card__annot-label');
            var txt = a.querySelector('.screen-card__annot-text');
            annots.push({
              label: lbl ? lbl.textContent.trim() : '',
              text:  txt ? txt.textContent.trim() : ''
            });
          });
        } else {
          // Fallback: use alt text or closest heading
          title = imgEl.alt || '';
          var sec = imgEl.closest('section, .psu-section, .cs-section, .proj-visuals');
          if (sec) {
            var h = sec.querySelector('h1,h2,h3,.pu-h2,.cs-h,.pcard__title');
            if (h && !title) title = h.textContent.trim();
          }
        }

        gallery.push({ src: imgEl.src, title: title, desc: desc, annots: annots, el: imgEl });
      });
    });
  }

  // ── 3. Render a gallery item ───────────────────────────
  function showItem(idx) {
    if (!gallery.length) return;
    idx = Math.max(0, Math.min(idx, gallery.length - 1));
    current = idx;

    var item = gallery[idx];
    lbImg.src = item.src;
    lbImg.alt = item.title || '';
    lbTitle.textContent = item.title || 'Visual';
    lbCount.textContent = gallery.length > 1 ? (idx + 1) + ' / ' + gallery.length : '';

    lbPrev.disabled = idx === 0;
    lbNext.disabled = idx === gallery.length - 1;

    // Panel: description + annotations
    lbPanel.innerHTML = '';
    if (item.desc) {
      var d = document.createElement('p');
      d.className = 'sk-lb__desc';
      d.textContent = item.desc;
      lbPanel.appendChild(d);
    }
    if (item.annots && item.annots.length) {
      var annotWrap = document.createElement('div');
      annotWrap.className = 'sk-lb__annots';
      item.annots.forEach(function (a) {
        if (!a.text) return;
        var div = document.createElement('div');
        div.className = 'sk-lb__annot';
        div.innerHTML =
          (a.label ? '<div class="sk-lb__annot-label">' + a.label + '</div>' : '') +
          '<div class="sk-lb__annot-text">' + a.text + '</div>';
        annotWrap.appendChild(div);
      });
      if (annotWrap.children.length) lbPanel.appendChild(annotWrap);
    }

    // Strip: update active thumb
    lbStrip.querySelectorAll('.sk-lb__thumb').forEach(function (t, i) {
      t.classList.toggle('active', i === idx);
    });
  }

  // ── 4. Open / Close ───────────────────────────────────
  function open(idx) {
    buildGallery();
    if (!gallery.length) return;

    // Build thumbnail strip
    lbStrip.innerHTML = '';
    if (gallery.length > 1) {
      gallery.forEach(function (item, i) {
        var t = document.createElement('div');
        t.className = 'sk-lb__thumb' + (i === idx ? ' active' : '');
        t.innerHTML = '<img src="' + item.src + '" alt="" loading="lazy">';
        t.addEventListener('click', function () { showItem(i); });
        lbStrip.appendChild(t);
      });
    }

    showItem(idx);
    lbEl.classList.add('sk-lb--open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function close() {
    lbEl.classList.remove('sk-lb--open');
    document.body.style.overflow = '';
    setTimeout(function () { lbImg.src = ''; }, 320);
  }

  // ── 5. Wire up clicks on images ───────────────────────
  function attachTriggers() {
    var sel = [
      '.proj-visuals__banner img[src]:not([src=""])',
      '.proj-visuals__frame img[src]:not([src=""])',
      '.screen-card .browser-wrap img[src]:not([src=""])',
      '.pcard__thumb img[src]:not([src=""])',
      '.project-card__img img[src]:not([src=""])'
    ].join(',');

    document.querySelectorAll(sel).forEach(function (imgEl) {
      if (imgEl.dataset.lbWired) return;
      imgEl.dataset.lbWired = '1';
      imgEl.addEventListener('click', function (e) {
        e.stopPropagation();
        buildGallery();
        var idx = gallery.findIndex(function (g) { return g.src === imgEl.src; });
        open(Math.max(0, idx));
      });
    });
  }

  // ── 6. Controls ───────────────────────────────────────
  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', function () { showItem(current - 1); });
  lbNext.addEventListener('click', function () { showItem(current + 1); });

  // Click backdrop to close
  lbEl.addEventListener('click', function (e) {
    if (e.target === lbEl || e.target.classList.contains('sk-lb__stage')) close();
  });

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (!lbEl.classList.contains('sk-lb--open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   showItem(current - 1);
    if (e.key === 'ArrowRight')  showItem(current + 1);
  });

  // ── 7. Init on DOM ready + after dynamic content ──────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachTriggers);
  } else {
    attachTriggers();
  }
  // Also run after a short delay to catch lazy-loaded content
  window.addEventListener('load', function () { setTimeout(attachTriggers, 400); });

})();
/* ── End Lightbox ─────────────────────────────────────── */


/* ============================================================
   PREMIUM v2 — Cursor · Page Transitions · Word Reveals · Magnetic
   ============================================================ */
(function () {
  'use strict';

  var isTouch = !window.matchMedia('(pointer: fine)').matches;

  /* ── Noise div ──────────────────────────────────────────── */
  var noise = document.createElement('div');
  noise.id = 'sk-noise';
  document.body.appendChild(noise);

  /* ── 1. Page Transition Veil ────────────────────────────── */
  var veil = document.createElement('div');
  veil.id = 'sk-veil';
  document.body.appendChild(veil);

  // On any page load: slide veil out upward
  (function revealPage() {
    // already in veil-in position from previous exit, or fresh load
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        veil.classList.add('veil-out');
        setTimeout(function () {
          veil.classList.remove('veil-in', 'veil-out');
        }, 620);
      });
    });
  })();

  // Intercept internal link clicks
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href]');
    if (!anchor) return;
    var href = anchor.getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      anchor.hasAttribute('download') ||
      anchor.target === '_blank'
    ) return;
    e.preventDefault();
    veil.classList.add('veil-in');
    setTimeout(function () { window.location.href = href; }, 540);
  });

  /* ── 2. Custom Cursor ───────────────────────────────────── */
  if (!isTouch) {
    var dot  = document.createElement('div'); dot.className  = 'sk-cur-dot';
    var ring = document.createElement('div'); ring.className = 'sk-cur-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = -200, my = -200, rx = -200, ry = -200;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });

    // Ring lags behind with lerp
    (function lerpRing() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(lerpRing);
    })();

    var hoverSel = 'a, button, .btn, .project-card, .pcard, [role="button"], input, textarea, select, label';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverSel)) document.body.classList.add('sk-hovering');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverSel)) document.body.classList.remove('sk-hovering');
    });
    document.addEventListener('mousedown', function () { document.body.classList.add('sk-clicking'); });
    document.addEventListener('mouseup',   function () { document.body.classList.remove('sk-clicking'); });
    document.addEventListener('mouseleave', function () { dot.classList.add('sk-hidden'); ring.classList.add('sk-hidden'); });
    document.addEventListener('mouseenter', function () { dot.classList.remove('sk-hidden'); ring.classList.remove('sk-hidden'); });
  }

  /* ── 3. Word Split Reveal ───────────────────────────────── */
  function splitWords(el) {
    if (el.dataset.skSplit) return;
    el.dataset.skSplit = '1';

    // Walk child nodes so we preserve <span class="text-accent"> etc.
    var nodes = Array.from(el.childNodes);
    el.innerHTML = '';

    // We track all .sk-w spans so we can apply stagger globally
    var wordIndex = 0;

    nodes.forEach(function (node) {
      if (node.nodeType === 3 /* TEXT_NODE */) {
        // Split by spaces, preserving them as separate tokens
        var tokens = node.textContent.split(/(\s+)/);
        tokens.forEach(function (token) {
          if (/^\s+$/.test(token)) {
            // Whitespace: just add as text
            el.appendChild(document.createTextNode(token));
          } else if (token) {
            var ww = document.createElement('span'); ww.className = 'sk-ww';
            var w  = document.createElement('span'); w.className  = 'sk-w';
            w.style.transitionDelay = (wordIndex * 65) + 'ms';
            w.textContent = token;
            ww.appendChild(w);
            el.appendChild(ww);
            wordIndex++;
          }
        });
      } else {
        // Element node (e.g. <span class="text-accent">scale.</span>)
        var ww = document.createElement('span'); ww.className = 'sk-ww';
        var w  = document.createElement('span'); w.className  = 'sk-w';
        w.style.transitionDelay = (wordIndex * 65) + 'ms';
        w.appendChild(node.cloneNode(true));
        ww.appendChild(w);
        el.appendChild(ww);
        wordIndex++;
      }
    });
  }

  // Target: hero headline + all section d-lg / d-md headings
  var splitTargets = document.querySelectorAll('.hero__headline, .section .d-lg, .section .d-md, .page-hero .d-xl');
  var splitObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('sk-reveal-done');
        splitObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  splitTargets.forEach(function (el) {
    // Remove existing reveal class so split animation takes over
    el.classList.remove('reveal', 'reveal-delay-1', 'reveal-delay-2');
    splitWords(el);
    splitObs.observe(el);
  });

  /* ── 4. Magnetic Buttons ────────────────────────────────── */
  if (!isTouch) {
    var STRENGTH = 0.32;
    document.querySelectorAll('.btn, .nav__cta, .nav__cv').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r  = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width  / 2)) * STRENGTH;
        var dy = (e.clientY - (r.top  + r.height / 2)) * STRENGTH;
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

})();
