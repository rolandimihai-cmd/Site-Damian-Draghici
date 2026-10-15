/* Damian Drăghici & Brothers — interacțiuni și animații.
   Fără dependențe. Respectă prefers-reduced-motion. */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Pornește animațiile de intrare din hero după primul frame
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-loaded')));

  /* ---------- Navigație & meniu mobil ---------- */
  const nav = $('[data-nav]');
  const toggle = $('.nav__toggle');
  const menu = $('[data-menu]');

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Link activ în funcție de secțiunea vizibilă
  const navLinks = $$('.nav__links a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) sectionObserver.observe(target);
  });

  /* ---------- Marquee: dublăm conținutul pentru o buclă continuă ---------- */
  $$('.marquee__track').forEach((track) => { track.innerHTML += track.innerHTML; });

  /* ---------- Apariții la scroll ---------- */
  $$('[data-stagger]').forEach((group) => {
    $$('[data-reveal]', group).forEach((el, i) => el.style.setProperty('--d', (i * 0.12).toFixed(2) + 's'));
  });
  $$('[data-gallery] [data-reveal]').forEach((el, i) => el.style.setProperty('--d', ((i % 3) * 0.1).toFixed(2) + 's'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal]').forEach((el) => revealObserver.observe(el));

  /* ---------- Contoare ---------- */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      counterObserver.unobserve(entry.target);
      const el = entry.target;
      const to = parseInt(el.dataset.count, 10);
      const from = parseInt(el.dataset.from || '0', 10);
      if (reduceMotion) { el.textContent = String(to); return; }
      const start = performance.now();
      const dur = 1600;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(from + (to - from) * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => counterObserver.observe(el));

  /* ---------- Scroll: progres, nav, parallax, roți, fitil timeline ---------- */
  const progress = $('.progress span');
  const mbar = $('[data-mbar]');
  const booking = $('#rezervari');
  const parallaxEls = $$('[data-parallax]');
  const wheels = $$('[data-scroll-wheel]');
  const timeline = $('[data-timeline]');
  const fuse = timeline ? $('.timeline__fuse span', timeline) : null;
  const tlItems = timeline ? $$('.tl', timeline) : [];
  let ticking = false;

  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = root.scrollHeight - vh;

    nav.classList.toggle('is-scrolled', y > 40);
    if (progress) progress.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;

    if (mbar) {
      const b = booking.getBoundingClientRect();
      const inBooking = b.top < vh && b.bottom > 0;
      mbar.classList.toggle('is-visible', y > vh * 0.8 && !inBooking);
    }

    if (!reduceMotion) {
      parallaxEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const offset = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax);
        el.style.setProperty('--py', offset.toFixed(1) + 'px');
      });
      wheels.forEach((w) => w.style.setProperty('rotate', (y * 0.06).toFixed(1) + 'deg'));
    }

    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const line = vh * 0.62;
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      fuse.style.setProperty('--p', p.toFixed(4));
      tlItems.forEach((li) => li.classList.toggle('is-lit', li.getBoundingClientRect().top + 14 < line));
    }
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Lumina caldă care urmărește cursorul în hero ---------- */
  const hero = $('[data-hero]');
  if (hero && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  /* ---------- Scântei (canvas) ---------- */
  function Embers(canvas) {
    const ctx = canvas.getContext('2d');
    const density = parseFloat(canvas.dataset.density || '1');
    let w = 0;
    let h = 0;
    let parts = [];
    let raf = 0;
    let running = false;

    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: Math.random() * 1.9 + 0.5,
      vy: -(Math.random() * 0.7 + 0.25),
      vx: (Math.random() - 0.5) * 0.25,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.008,
      life: 0,
      max: Math.random() * 420 + 260,
      hue: 16 + Math.random() * 30
    });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(110, (w * h) / 13000) * density);
      parts = Array.from({ length: target }, () => spawn(true));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of parts) {
        p.life += 1;
        p.sway += p.swaySpeed;
        p.x += p.vx + Math.sin(p.sway) * 0.35;
        p.y += p.vy;
        const t = p.life / p.max;
        if (t >= 1 || p.y < -20) { Object.assign(p, spawn(false)); continue; }
        const a = Math.sin(Math.PI * t);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 55%, ${(a * 0.16).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsla(${p.hue + 14}, 100%, ${70 + 15 * (1 - t)}%, ${(a * 0.95).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }

    resize();
    if (reduceMotion) { draw(); return; }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) { running = true; loop(); }
      else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    });
    io.observe(canvas);

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });
  }
  $$('[data-embers]').forEach((c) => Embers(c));

  /* ---------- Povestea focului: pași sticky ---------- */
  const story = $('[data-story]');
  if (story) {
    const frame = $('.story__frame', story);
    const imgs = $$('.story__frame img', story);
    const steps = $$('.step', story);
    const num = $('[data-story-num]', story);
    const name = $('[data-story-name]', story);
    const setStep = (i) => {
      steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
      imgs.forEach((img, k) => img.classList.toggle('is-active', k === i));
      frame.style.setProperty('--heat', ((i + 1) / steps.length).toFixed(2));
      num.textContent = String(i + 1).padStart(2, '0');
      name.textContent = steps[i].dataset.name;
    };
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setStep(parseInt(entry.target.dataset.step, 10));
      });
    }, { rootMargin: '-48% 0px -48% 0px' });
    steps.forEach((s) => stepObserver.observe(s));
    setStep(0);
  }

  /* ---------- Countdown DESTIN ---------- */
  const countdown = $('[data-countdown]');
  if (countdown) {
    const target = new Date(countdown.dataset.countdown).getTime();
    const out = {
      d: $('[data-cd="d"]', countdown),
      h: $('[data-cd="h"]', countdown),
      m: $('[data-cd="m"]', countdown),
      s: $('[data-cd="s"]', countdown)
    };
    const pad = (n) => String(n).padStart(2, '0');
    const update = () => {
      let diff = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const d = Math.floor(diff / 86400); diff -= d * 86400;
      const h = Math.floor(diff / 3600); diff -= h * 3600;
      const m = Math.floor(diff / 60);
      const s = diff - m * 60;
      out.d.textContent = String(d);
      out.h.textContent = pad(h);
      out.m.textContent = pad(m);
      out.s.textContent = pad(s);
    };
    update();
    setInterval(update, 1000);
  }

  /* ---------- Adaugă în calendar (.ics) ---------- */
  const icsBtn = $('[data-ics]');
  if (icsBtn) {
    icsBtn.addEventListener('click', () => {
      const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const tickets = 'https://www.iabilet.ro/bilete-concert-damian-draghici-brothers-destin-131351';
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Damian Draghici & Brothers//Destin//RO',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'UID:destin-20270331@damian-and-brothers',
        'DTSTAMP:' + stamp,
        'DTSTART:20270331T170000Z',
        'DTEND:20270331T200000Z',
        'SUMMARY:Damian Drăghici & Brothers: DESTIN',
        'LOCATION:Sala Palatului\\, Strada Ion Câmpineanu 28\\, București',
        'DESCRIPTION:Acces de la 19:00. Bilete: ' + tickets,
        'URL:' + tickets,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
      const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'destin-damian-draghici-brothers.ics';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  /* ---------- Discografie: săgeți + drag cu mouse-ul ---------- */
  const rail = $('[data-rail]');
  if (rail) {
    const prev = $('[data-rail-prev]');
    const next = $('[data-rail-next]');
    const step = () => {
      const card = $('.album', rail);
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 40;
      return card ? card.getBoundingClientRect().width + gap : 360;
    };
    const updateArrows = () => {
      prev.disabled = rail.scrollLeft <= 4;
      next.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 4;
    };
    prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    rail.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();

    let down = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    rail.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = rail.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        rail.classList.add('is-dragging');
      }
      if (moved) rail.scrollLeft = startScroll - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      rail.classList.remove('is-dragging');
    });
    rail.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
    });
  }

  /* ---------- Galerie: lightbox ---------- */
  const lightbox = $('[data-lightbox]');
  const items = $$('[data-gallery] .g-item');
  if (lightbox && items.length && typeof lightbox.showModal === 'function') {
    const img = $('[data-lb-img]', lightbox);
    const cap = $('[data-lb-cap]', lightbox);
    let index = 0;
    let lastFocus = null;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const item = items[index];
      const thumb = $('img', item);
      img.src = item.dataset.full;
      img.alt = thumb.alt;
      cap.textContent = item.dataset.caption || '';
      // repornește animația de intrare
      img.style.animation = 'none';
      void img.offsetWidth;
      img.style.animation = '';
    };
    const open = (i) => {
      lastFocus = document.activeElement;
      show(i);
      lightbox.showModal();
      document.body.style.overflow = 'hidden';
    };
    const close = () => lightbox.close();

    items.forEach((item, i) => item.addEventListener('click', () => open(i)));
    $('[data-lb-prev]', lightbox).addEventListener('click', () => show(index - 1));
    $('[data-lb-next]', lightbox).addEventListener('click', () => show(index + 1));
    $('[data-lb-close]', lightbox).addEventListener('click', close);
    lightbox.addEventListener('close', () => {
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox__fig')) close();
    });
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') show(index + 1);
      if (e.key === 'ArrowLeft') show(index - 1);
    });

    let touchX = null;
    lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  }

  /* ---------- Formular de rezervare ---------- */
  const form = $('[data-booking]');
  if (form) {
    const select = $('#f-tip', form);
    const status = $('.form__status', form);
    const email = form.dataset.email;

    // Butoanele „Cere ofertă” precompletează tipul evenimentului
    $$('[data-event-type]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const wanted = btn.dataset.eventType;
        const option = Array.from(select.options).find((o) => o.text === wanted);
        if (option) select.value = option.value || option.text;
      });
    });

    const setInvalid = (field, bad) => field.closest('.field').classList.toggle('is-invalid', bad);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nume = (data.get('nume') || '').toString().trim();
      const mail = (data.get('email') || '').toString().trim();
      const tip = (data.get('tip') || '').toString().trim();
      const okNume = nume.length > 1;
      const okMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
      const okTip = tip.length > 0;
      setInvalid(form.elements.nume, !okNume);
      setInvalid(form.elements.email, !okMail);
      setInvalid(form.elements.tip, !okTip);

      if (!okNume || !okMail || !okTip) {
        status.className = 'form__status is-error';
        status.textContent = 'Te rugăm să completezi numele, un email valid și tipul evenimentului.';
        const firstBad = !okNume ? form.elements.nume : !okMail ? form.elements.email : form.elements.tip;
        firstBad.focus();
        return;
      }

      const line = (label, key) => {
        const v = (data.get(key) || '').toString().trim();
        return v ? `${label}: ${v}` : null;
      };
      const body = [
        'Bună ziua,',
        '',
        'Aș dori o ofertă pentru Damian Drăghici & Brothers.',
        '',
        line('Nume', 'nume'),
        line('Email', 'email'),
        line('Telefon', 'telefon'),
        line('Tip eveniment', 'tip'),
        line('Data', 'data'),
        line('Oraș / locație', 'locatie'),
        line('Invitați', 'invitati'),
        '',
        (data.get('mesaj') || '').toString().trim()
      ].filter((l) => l !== null).join('\n');

      const subject = `Cerere rezervare: ${tip}${data.get('data') ? ' · ' + data.get('data') : ''}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.className = 'form__status is-ok';
      status.textContent = `Mulțumim! Ți-am deschis aplicația de email cu cererea completată. Dacă nu s-a deschis, scrie-ne la ${email}.`;
    });

    $$('input, select', form).forEach((el) => {
      el.addEventListener('input', () => el.closest('.field').classList.remove('is-invalid'));
    });
  }

  /* ---------- Anul curent în footer ---------- */
  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
