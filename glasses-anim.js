(function () {
  'use strict';

  const LENS = {
    left:  { cx: 0.2775, cy: 0.2998, rx: 0.1646, ry: 0.2647 },
    right: { cx: 0.7205, cy: 0.2986, rx: 0.1644, ry: 0.2631 },
  };

  const stage      = document.getElementById('glasses-anim-stage');
  const sticky     = document.getElementById('glasses-anim-sticky');
  const wrap       = document.getElementById('glasses-anim-wrap');
  const img        = document.getElementById('glasses-anim-img');
  const blurryText = document.getElementById('glasses-anim-blurry');
  const maskLeft   = document.getElementById('glasses-mask-left');
  const maskRight  = document.getElementById('glasses-mask-right');
  const sharpLeft  = document.getElementById('glasses-anim-sharp-left');
  const sharpRight = document.getElementById('glasses-anim-sharp-right');

  if (!stage) return;

  const easeOut3  = t => 1 - Math.pow(1 - t, 3);
  const easeIn3   = t => t * t * t;
  const easeInOut = t => t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
  const lerp      = (a, b, t) => a + (b - a) * t;
  const clamp01   = v => Math.max(0, Math.min(1, v));
  const inv       = (a, b, v) => clamp01((v - a) / (b - a));

  let ticking = false;
  let lastProgress = -1;

  // ── Diagnostics ─────────────────────────────────────────────────────
  // Toggle via URL: ?glassesdebug or localStorage.glassesDebug = '1'
  // Quick enable from DevTools console: localStorage.glassesDebug='1'; location.reload()
  const DEBUG = /[?&]glassesdebug\b/.test(location.search) ||
                (typeof localStorage !== 'undefined' && localStorage.glassesDebug === '1');
  const dbg = {
    frames: 0,
    slowFrames: 0,
    maxUpdateMs: 0,
    maxScale: 0,
    maxRasterPx: 0,
    lastLog: 0,
  };
  function logStats(force) {
    const now = performance.now();
    if (!force && now - dbg.lastLog < 500) return;
    dbg.lastLog = now;
    console.log(
      `[glasses] frames=${dbg.frames} slow(>8ms)=${dbg.slowFrames} ` +
      `maxUpdate=${dbg.maxUpdateMs.toFixed(2)}ms maxScale=${dbg.maxScale.toFixed(2)} ` +
      `maxRaster=${dbg.maxRasterPx.toFixed(0)}px`
    );
  }

  // ── diagnose() — runs on init and pageshow, always logs critical failures,
  //    verbose detail only when DEBUG is on.
  //    Checks four root-cause candidates:
  //      1. CSS not loaded (stage height, wrap position, eyeline color)
  //      2. SVG not ready (complete, naturalHeight, offsetHeight)
  //      3. Stale scroll position (scrollY > 0 at page load)
  //      4. Service Worker cache info (which SW cache version is active)
  function diagnose(trigger) {
    const cs  = window.getComputedStyle;
    const stageH   = stage.offsetHeight;
    const wrapPos  = cs(wrap).position;         // expected: 'absolute'
    const eyeline  = stage.querySelector('.glasses-anim-eyeline');
    const elineCol = eyeline ? cs(eyeline).color : 'n/a'; // expected: rgb(10,42,61)
    const elineW   = eyeline ? cs(eyeline).fontWeight : 'n/a'; // expected: '300'
    // stage should be 500vh — on any real viewport that's many times the
    // viewport height. If stageH ≈ 1×vpH it means height:500vh didn't apply.
    const cssOk    = stageH > window.innerHeight * 3 && wrapPos === 'absolute';

    const imgComplete    = img.complete;
    const imgNatH        = img.naturalHeight;
    const imgOffH        = img.offsetHeight;
    const svgOk          = imgComplete && imgOffH > 0;

    const scrollY        = window.scrollY;
    const lang           = document.documentElement.lang || 'unknown';
    const readyState     = document.readyState;

    // ── Always-on warnings (visible in production DevTools) ──────────
    if (!cssOk) {
      console.warn(
        `[glasses] ⚠ CSS NOT APPLIED on ${trigger} (lang=${lang}). ` +
        `stage.offsetHeight=${stageH} (expect >500), wrap.position='${wrapPos}' (expect 'absolute'). ` +
        `Likely cause: styles.css not loaded or SW serving stale cache. ` +
        `Check: Network > styles.css response headers & SW cache storage.`
      );
    }
    if (!svgOk) {
      console.warn(
        `[glasses] ⚠ SVG NOT READY on ${trigger} (lang=${lang}). ` +
        `img.complete=${imgComplete} naturalHeight=${imgNatH} offsetHeight=${imgOffH}. ` +
        `The load-event listener should recover this automatically.`
      );
    }
    if (scrollY > 100) {
      console.warn(
        `[glasses] ⚠ NON-ZERO SCROLL on ${trigger}: scrollY=${scrollY}. ` +
        `history.scrollRestoration='${history.scrollRestoration}'. ` +
        `The animation may start mid-progress instead of scale(0.5).`
      );
    }

    // ── Verbose detail only when DEBUG is on ─────────────────────────
    if (!DEBUG) return;
    console.groupCollapsed(`[glasses] diagnose(${trigger}) lang=${lang} t=${performance.now().toFixed(0)}ms`);
    console.log('readyState       :', readyState);
    console.log('scrollY          :', scrollY);
    console.log('scrollRestoration:', history.scrollRestoration);
    console.log('--- CSS ---');
    console.log('stage.offsetHeight :', stageH, cssOk ? '✓' : '✗ BROKEN');
    console.log('wrap.position      :', wrapPos, wrapPos === 'absolute' ? '✓' : '✗ BROKEN');
    console.log('eyeline color      :', elineCol, '(expect rgb(10,42,61))');
    console.log('eyeline fontWeight :', elineW,   '(expect 300)');
    console.log('--- SVG ---');
    console.log('img.complete       :', imgComplete);
    console.log('img.naturalHeight  :', imgNatH);
    console.log('img.offsetHeight   :', imgOffH, svgOk ? '✓' : '⏳ will retry on load');
    console.log('img.currentSrc     :', img.currentSrc);
    console.log('--- JS state ---');
    console.log('lastProgress       :', lastProgress);
    console.log('scrollAttached     :', scrollAttached);
    console.log('ticking            :', ticking);
    console.log('wrap.style.transform:', wrap.style.transform);
    // Check stylesheets to see if styles.css is in the document
    const sheets = Array.from(document.styleSheets).map(s => {
      try { return s.href || '(inline)'; } catch(e) { return '(cross-origin)'; }
    });
    console.log('loaded stylesheets :', sheets);
    // SW cache version if available
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const sw = navigator.serviceWorker.controller;
      console.log('SW scriptURL       :', sw.scriptURL);
      console.log('SW state           :', sw.state);
    } else {
      console.log('SW controller      : none (page not controlled by SW)');
    }
    console.groupEnd();
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function update() {
    ticking = false;
    const t0 = DEBUG ? performance.now() : 0;

    // ── READ all layout values first (no writes until below) ──────────
    const stageRect  = stage.getBoundingClientRect();
    const stageTop   = stageRect.top;
    const stageH     = stage.offsetHeight;
    const vpH        = window.innerHeight;

    // Early-exit when section is fully off-screen. Full-viewport blur()
    // and SVG clipPath writes are expensive — skipping them off-screen
    // frees the main thread so the FAB's CSS pulse doesn't stutter.
    // Clamp progress to the appropriate idle value (0 above, 1 below)
    // and write once to leave the section in a consistent state.
    if (stageTop > vpH || stageRect.bottom < 0) {
      const idle = stageTop > vpH ? 0 : 1;
      if (lastProgress !== idle) {
        lastProgress = idle;
        const o = idle === 0 ? '0' : '1';
        blurryText.style.opacity = o;
        sharpLeft.style.opacity  = o;
        sharpRight.style.opacity = o;
      }
      return;
    }

    const imgW       = img.offsetWidth;
    const imgH       = img.offsetHeight;
    const vpW        = window.innerWidth;

    // Guard: SVG not yet decoded — offsetHeight is 0 when height:auto
    // can't compute without the image's natural dimensions. Returning
    // here prevents broken 0-height clip-path ellipses. The img.onload
    // handler set up in init() will reset lastProgress and re-call
    // update() once the image is ready.
    if (imgH === 0) {
      if (DEBUG) console.log('[glasses] update: imgH=0, waiting for SVG load event');
      return;
    }

    // ── Calculate everything ──────────────────────────────────────────
    const progress = clamp01(-stageTop / (stageH - vpH));
    if (progress === lastProgress) return;
    lastProgress = progress;

    // Zoom: scale 0.5 → 2.6
    const normalScale = lerp(0.5, 2.6, easeInOut(inv(0, 0.68, progress)));

    // Exit through left lens: 0.68 → 1.00
    // NOTE: exit scale is capped so that the rasterized glasses layer
    // stays under the browser's max texture size (~4096px in most
    // Chromium configs). Exceeding that causes dropped tiles — the
    // "torn/missing chunks" bug. We fade the image out during exit
    // instead of scaling it to infinity, which looks visually the same
    // (user's view "enters" the lens) without blowing the GPU.
    const maxRasterWidth = 4000; // safe under the 4096px texture limit
    const imgScaleCap = Math.max(2.6, maxRasterWidth / Math.max(1, img.offsetWidth));
    const p4  = inv(0.68, 1.00, progress);
    const p4e = easeIn3(p4);
    const exitScale  = lerp(2.6, imgScaleCap, p4e);
    const s = progress < 0.68 ? normalScale : exitScale;
    // Fade image out during exit so there's no hard stop at the cap
    const imgOpacity = progress < 0.68 ? 1 : lerp(1, 0, easeIn3(inv(0.80, 1.00, progress)));

    // Pivot shifts to left lens center during exit
    const lensOffX = (LENS.left.cx - 0.5) * imgW;
    const lensOffY = (LENS.left.cy - 0.5) * imgH;
    const pivotT = easeInOut(p4);
    const ox = lerp(0, lensOffX, pivotT);
    const oy = lerp(0, lensOffY, pivotT);
    const tx = ox * (1 - s);
    const ty = oy * (1 - s);

    // Right lens closes during exit
    const rightFade = progress < 0.68 ? 1 : lerp(1, 0, easeOut3(inv(0.68, 0.88, progress)));

    // Clip coordinates computed analytically from transform — avoids
    // getBoundingClientRect() after writing wrap.style.transform (layout thrash).
    // When sticky is sticking, its top-left is at viewport (0,0).
    // transform: translate(tx,ty) scale(s) with transform-origin center maps
    // a layout point (px,py) to: (vpW/2 + tx + s*(px - vpW/2), vpH/2 + ty + s*(py - vpH/2))
    const imgVL = vpW / 2 + tx - s * imgW / 2;   // img visual left
    const imgVT = vpH / 2 + ty - s * imgH / 2;   // img visual top
    const imgVW = s * imgW;
    const imgVH = s * imgH;

    const lCx = imgVL + LENS.left.cx  * imgVW,  lCy = imgVT + LENS.left.cy  * imgVH;
    const lRx = Math.max(0, LENS.left.rx  * imgVW), lRy = Math.max(0, LENS.left.ry  * imgVH);
    const rCx = imgVL + LENS.right.cx * imgVW,  rCy = imgVT + LENS.right.cy * imgVH;
    const rRx = Math.max(0, LENS.right.rx * imgVW * rightFade), rRy = Math.max(0, LENS.right.ry * imgVH * rightFade);

    const textOpacity = easeOut3(inv(0.08, 0.30, progress));
    // NOTE: blur is held constant — animating `filter: blur(Npx)` per
    // frame on a full-viewport element forces the compositor to rebuild
    // the blur every frame, starving the main thread and stuttering the
    // FAB pulse. Opacity fade produces the same visual effect cheaply.

    // ── WRITE all DOM changes (no reads after this point) ─────────────
    wrap.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${s.toFixed(4)})`;

    // CSS clip-path: ellipse() is a basic-shape clip that Chromium can
    // composite without repainting the clipped element's contents.
    // Much cheaper than SVG clipPath across two full-viewport elements.
    const leftClip  = `ellipse(${lRx.toFixed(1)}px ${lRy.toFixed(1)}px at ${lCx.toFixed(1)}px ${lCy.toFixed(1)}px)`;
    const rightClip = `ellipse(${rRx.toFixed(1)}px ${rRy.toFixed(1)}px at ${rCx.toFixed(1)}px ${rCy.toFixed(1)}px)`;
    maskLeft.style.clipPath  = leftClip;
    maskRight.style.clipPath = rightClip;
    sharpLeft.style.clipPath  = leftClip;
    sharpRight.style.clipPath = rightClip;

    blurryText.style.opacity = textOpacity;
    const sharpOpacity = easeOut3(inv(0.15, 0.35, progress));
    sharpLeft.style.opacity  = sharpOpacity;
    sharpRight.style.opacity = sharpOpacity;
    img.style.opacity = imgOpacity;

    if (DEBUG) {
      const dt = performance.now() - t0;
      dbg.frames++;
      if (dt > 8) dbg.slowFrames++;
      if (dt > dbg.maxUpdateMs) dbg.maxUpdateMs = dt;
      if (s > dbg.maxScale) dbg.maxScale = s;
      const raster = s * imgW;
      if (raster > dbg.maxRasterPx) dbg.maxRasterPx = raster;
      if (raster > 4096) {
        console.warn(`[glasses] raster width ${raster.toFixed(0)}px exceeds 4096px tile limit at progress=${progress.toFixed(3)}, scale=${s.toFixed(2)}`);
      }
      logStats();
    }
  }

  let scrollAttached = false;
  function attachScroll() {
    if (scrollAttached) return;
    scrollAttached = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    sticky.classList.add('glasses-active');
    if (DEBUG) console.log(`[glasses] IO → attachScroll() scrollY=${window.scrollY} lastProgress=${lastProgress}`);
    update();
  }
  function detachScroll() {
    if (!scrollAttached) return;
    scrollAttached = false;
    window.removeEventListener('scroll', onScroll);
    sticky.classList.remove('glasses-active');
    // Reset so the next attachScroll() → update() always renders fresh.
    // Without this, lastProgress retains whatever value the early-exit
    // wrote (0 or 1), and if the section re-enters at the same idle
    // progress the `if (progress === lastProgress) return` check fires
    // and skips the render — leaving clip-paths / opacities stale.
    lastProgress = -1;
    if (DEBUG) console.log(`[glasses] IO → detachScroll() scrollY=${window.scrollY}`);
  }

  function init() {
    blurryText.style.opacity = '0';
    // Blur is intentionally constant — see note in update().
    // Use a smaller radius on mobile: the blur is applied to a
    // full-viewport element and processed by the GPU every composite
    // frame. 10px on a ~390px-wide mobile viewport taxes the GPU enough
    // to cause visible scroll stutter; 4px gives the same visual
    // contrast between blurry/sharp while halving the blur kernel cost.
    const blurVal = window.innerWidth > 768 ? 'blur(10px)' : 'blur(4px)';
    blurryText.style.filter  = blurVal;
    sharpLeft.style.opacity  = '0';
    sharpRight.style.opacity = '0';
    // Apply the animation's starting transform immediately so the
    // glasses don't pop from their natural size to scale(0.5) on the
    // first frame after the IntersectionObserver attaches the scroll
    // handler.
    wrap.style.transform = 'translate(0px,0px) scale(0.5)';

    // Run diagnostics — will warn loudly in console if CSS or SVG is broken.
    diagnose('init');

    // On production the glasses SVG may arrive from the network after
    // the first update() call (it is not in ASSETS_TO_CACHE by default
    // and may not yet be in the SW dynamic cache on first language-switch).
    // When height:auto cannot compute without natural dimensions,
    // img.offsetHeight is 0 and update() returns early (see guard above).
    // Re-trigger a render once the image is decoded so the animation
    // starts correctly without requiring a scroll event.
    if (!img.complete || img.naturalHeight === 0) {
      if (DEBUG) console.log('[glasses] init: SVG not yet decoded — added load listener');
      img.addEventListener('load', function () {
        lastProgress = -1; // bypass the progress-equality short-circuit
        if (DEBUG) console.log(`[glasses] img.load fired: naturalHeight=${img.naturalHeight} offsetHeight=${img.offsetHeight} scrollAttached=${scrollAttached}`);
        if (scrollAttached) update();
      }, { once: true });
    }

    // Only run the scroll handler (and only promote compositor layers)
    // while the section is within ~one viewport of the visible area.
    // Without this, `will-change: transform` kept a large backing store
    // alive across the whole page lifetime, and repeated scroll passes
    // accumulated GPU pressure until scroll started stuttering around
    // the 3rd–4th pass.
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (DEBUG) console.log(`[glasses] IntersectionObserver: isIntersecting=${e.isIntersecting} intersectionRatio=${e.intersectionRatio.toFixed(3)}`);
          if (e.isIntersecting) attachScroll();
          else detachScroll();
        }
      }, { rootMargin: '100% 0px 100% 0px' });
      io.observe(stage);
    } else {
      attachScroll();
    }

    window.addEventListener('resize', () => { if (scrollAttached) update(); });
  }

  // ── bfcache / pageshow handling ────────────────────────────────────
  // When the browser restores this page from bfcache (back/forward
  // navigation after a language switch), the IIFE does NOT re-run —
  // JS state is frozen and restored. Inline styles on animation
  // elements may be cleared or stale, and `lastProgress` prevents
  // update() from re-rendering. Force a full re-init on restore.
  //
  // Key fixes vs. the naive approach:
  // 1. `ticking` might be frozen true → next scroll never schedules a frame.
  // 2. `scrollAttached` might be false (IntersectionObserver detached the
  //    scroll listener before the user navigated away, e.g. they were above
  //    or below the section). The old `if (scrollAttached) update()` guard
  //    would silently skip the re-render in that case.
  //    Solution: reset scrollAttached and call attachScroll() unconditionally
  //    so the listener and the `glasses-active` class are always restored.
  //    The IntersectionObserver is still live and will call detachScroll()
  //    again if the section is out of the extended viewport — that is fine.
  window.addEventListener('pageshow', function (e) {
    if (DEBUG) console.log(`[glasses] pageshow: persisted=${e.persisted} lang=${document.documentElement.lang} scrollY=${window.scrollY}`);
    if (e.persisted) {
      // Reset scheduler state so the next scroll / RAF cycle is unblocked
      ticking      = false;
      lastProgress = -1;

      // Re-apply init styles in case the browser cleared them.
      // Use mobile-responsive blur (same logic as init).
      blurryText.style.opacity = '0';
      blurryText.style.filter  = window.innerWidth > 768 ? 'blur(10px)' : 'blur(4px)';
      sharpLeft.style.opacity  = '0';
      sharpRight.style.opacity = '0';
      wrap.style.transform = 'translate(0px,0px) scale(0.5)';
      img.style.opacity = '1';
      maskLeft.style.clipPath  = '';
      maskRight.style.clipPath = '';
      sharpLeft.style.clipPath  = '';
      sharpRight.style.clipPath = '';

      // Run diagnostics for the bfcache-restore path.
      diagnose('pageshow-persisted');

      // Force re-attachment regardless of whether scrollAttached is true or
      // false — reset first so attachScroll()'s guard doesn't short-circuit.
      scrollAttached = false;
      attachScroll();
    }
  });

  // Prevent browsers from restoring a stale scroll position after
  // language-switch navigation, which would cause the animation to
  // jump to a mid-progress state on the first frame.
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
