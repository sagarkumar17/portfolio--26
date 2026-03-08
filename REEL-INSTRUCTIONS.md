# Scrolling Image Reel — Usage Guide

## How to add the reel to any project page

### Step 1 — Paste this CSS in the `<style>` block of the page

```css
/* ── Scrolling Image Reel ───────────────────────── */
.sk-reel-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
  cursor: pointer;
  user-select: none;
}
.sk-reel-wrap::after {
  content: '⏸ Click to pause';
  position: absolute;
  bottom: 14px; left: 50%;
  transform: translateX(-50%) translateY(8px);
  background: rgba(8,8,15,0.8);
  backdrop-filter: blur(12px);
  color: rgba(255,255,255,0.85);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.12);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.sk-reel-wrap:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); }
.sk-reel-wrap.is-paused::after { content: '▶ Click to play'; opacity: 1; transform: translateX(-50%) translateY(0); }
.sk-reel-track {
  display: flex;
  gap: 14px;
  width: max-content;
  animation: sk-reel-scroll 36s linear infinite;
  will-change: transform;
}
.sk-reel-track.is-paused { animation-play-state: paused; }
@keyframes sk-reel-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.sk-reel-frame {
  flex-shrink: 0;
  width: 340px;          /* ← desktop screens */
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.07);
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  background: #14141e;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.sk-reel-frame:hover { transform: scale(1.02); box-shadow: 0 8px 36px rgba(0,0,0,0.55); }
.sk-reel-frame img { display: block; width: 100%; height: auto; vertical-align: bottom; pointer-events: none; }
.sk-reel-frame.is-tall { width: 200px; }  /* ← mobile/portrait screens */
```

---

### Step 2 — Paste this HTML where you want the reel

```html
<!-- Change reel-A / track-A to unique IDs per page -->
<div class="sk-reel-wrap" id="reel-A">
  <div class="sk-reel-track" id="track-A">

    <!-- Desktop / landscape screenshot -->
    <div class="sk-reel-frame">
      <img src="img/your-screen-01.png" alt="Screen description"/>
    </div>

    <!-- Mobile / portrait screenshot — add class "is-tall" -->
    <div class="sk-reel-frame is-tall">
      <img src="img/your-screen-02.png" alt="Screen description"/>
    </div>

    <!-- Add as many frames as you like ... -->

  </div>
</div>
```

---

### Step 3 — Paste this JS before `</body>`

```js
function initReel(wrapId, trackId) {
  const wrap  = document.getElementById(wrapId);
  const track = document.getElementById(trackId);
  if (!wrap || !track) return;
  // duplicate for seamless loop
  Array.from(track.children).forEach(el => track.appendChild(el.cloneNode(true)));
  // respect reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // click to pause/play
  let paused = false;
  wrap.addEventListener('click', () => {
    paused = !paused;
    track.classList.toggle('is-paused', paused);
    wrap.classList.toggle('is-paused', paused);
  });
}
// Call once per reel on the page
initReel('reel-A', 'track-A');
```

---

## Adjusting speed

Change `36s` in `.sk-reel-track { animation: sk-reel-scroll 36s ... }`:
- `24s` = faster
- `48s` = slower

## Screen sizes

| Class on `.sk-reel-frame` | Width | Use for |
|---|---|---|
| *(none)* | 340px | Desktop / tablet |
| `is-tall` | 200px | Mobile portrait |

Change these pixel values to match your actual screenshot dimensions.
