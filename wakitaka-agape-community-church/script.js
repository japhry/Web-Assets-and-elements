/* ===================================================
   AGAPE COMMUNITY MINISTRIES — Main Script
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===================== THEME TOGGLE =====================
  (function themeModule() {
    const toggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const saved = localStorage.getItem('agape-theme') || 'light';

    function applyTheme(theme) {
      html.setAttribute('data-theme', theme);
      toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      localStorage.setItem('agape-theme', theme);
    }

    applyTheme(saved);

    toggle?.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  })();

  // ===================== YEAR FOOTER =====================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===================== RADIO ALERT =====================
  (function radioAlert() {
    function check() {
      const now = new Date();
      const box = document.querySelector('.radio-alert');
      if (!box) return;
      box.style.display = (now.getDay() === 0 && now.getHours() >= 6 && now.getHours() < 7) ? 'block' : 'none';
    }
    setInterval(check, 60000);
    check();
  })();

  // ===================== MENU TOGGLE (mobile) =====================
  (function menuModule() {
    const btn = document.getElementById('menuToggle');
    const nav = document.getElementById('main-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open.toString());
      btn.textContent = open ? '✕' : '☰';
    });

    // close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && e.target !== btn) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = '☰';
      }
    });
  })();

  // ===================== NAVIGATION =====================
  (function navigationModule() {
    const pages = document.querySelectorAll('.page');
    const navBtns = document.querySelectorAll('.nav-menu button[data-target], button[data-target]');

    function showPage(id) {
      pages.forEach(p => p.classList.remove('active'));
      const target = document.getElementById(id);
      if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Update nav active state
      document.querySelectorAll('.nav-menu button').forEach(b => {
        b.classList.toggle('active-nav', b.getAttribute('data-target') === id);
      });

      // Close mobile nav
      const nav = document.getElementById('main-nav');
      const menuBtn = document.getElementById('menuToggle');
      if (nav) nav.classList.remove('open');
      if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = '☰'; }

      // Hide hero slider only on non-home pages
      const heroSlider = document.querySelector('.hero-slider');
      const ticker = document.querySelector('.event-ticker');
      if (heroSlider) heroSlider.style.display = (id === 'home') ? '' : 'none';
      if (ticker) ticker.style.display = (id === 'home') ? '' : 'none';
    }

    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-target');
        if (id) showPage(id);
      });
    });

    // Back buttons → always home
    document.querySelectorAll('.back').forEach(btn => {
      btn.addEventListener('click', () => showPage('home'));
    });

    // Also handle footer buttons and quick-link buttons with data-target
    document.querySelectorAll('button[data-target]').forEach(btn => {
      if (!btn.closest('.nav-menu') && !btn.classList.contains('back')) {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-target');
          if (id) showPage(id);
        });
      }
    });

    // Initialize: show home
    showPage('home');
  })();

  // ===================== HERO SLIDER =====================
  (function heroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dots = Array.from(slider.querySelectorAll('.hero-dots .dot'));
    const prev = slider.querySelector('.hero-prev');
    const next = slider.querySelector('.hero-next');
    let current = 0;
    let timer = null;

    function show(i) {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
    }

    function start() {
      stop();
      timer = setInterval(() => show(current + 1), 5500);
    }
    function stop() { clearInterval(timer); timer = null; }

    prev?.addEventListener('click', () => { show(current - 1); start(); });
    next?.addEventListener('click', () => { show(current + 1); start(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);

    start();
  })();

  // ===================== GALLERY WIDGETS =====================
  (function galleriesModule() {
    document.querySelectorAll('.gallery-widget').forEach(gallery => {
      const mainImg = gallery.querySelector('.gallery-main img');
      const thumbs = Array.from(gallery.querySelectorAll('.gallery-thumbs .thumb'));
      const prevBtn = gallery.querySelector('.gallery-prev');
      const nextBtn = gallery.querySelector('.gallery-next');
      if (!mainImg || thumbs.length === 0) return;

      let current = 0;
      let timer = null;

      function set(i) {
        i = (i + thumbs.length) % thumbs.length;
        const img = thumbs[i].querySelector('img');
        if (img) mainImg.src = img.src;
        thumbs.forEach((t, j) => t.classList.toggle('active', j === i));
        current = i;
      }

      thumbs.forEach((t, i) => t.addEventListener('click', () => { set(i); startAuto(); }));
      prevBtn?.addEventListener('click', () => { set(current - 1); startAuto(); });
      nextBtn?.addEventListener('click', () => { set(current + 1); startAuto(); });

      function startAuto() {
        clearInterval(timer);
        timer = setInterval(() => set(current + 1), 6000);
      }
      gallery.addEventListener('mouseenter', () => clearInterval(timer));
      gallery.addEventListener('mouseleave', startAuto);

      set(0);
      startAuto();
    });
  })();

  // ===================== YOUTUBE LIST =====================
  (function youtubeModule() {
    const mainVideo = document.getElementById('main-video');
    if (!mainVideo) return;
    document.querySelectorAll('.yt-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-video');
        if (src) {
          mainVideo.src = src + '?autoplay=1';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  })();

  // ===================== LOGO REPLAY =====================
  (function logoReplay() {
    const logo = document.getElementById('logo-replay');
    if (!logo) return;
    logo.addEventListener('click', () => {
      logo.style.animation = 'none';
      void logo.offsetWidth;
      logo.style.animation = '';
    });
  })();

  // ===================== NAV SCROLL SHADOW =====================
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (header) header.style.boxShadow = window.scrollY > 10
      ? '0 4px 30px rgba(0,0,0,0.6)'
      : '0 4px 30px rgba(0,0,0,0.45)';
  });

}); // DOMContentLoaded
