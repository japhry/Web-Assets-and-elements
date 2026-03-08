// RADIO ALERT
function showRadioAlert(){
  const now=new Date(),day=now.getDay(),hour=now.getHours();
  const alertBox=document.querySelector('.radio-alert');
  if(day===0 && hour>=6 && hour<7){ if(alertBox) alertBox.style.display='block'; }
  else{ if(alertBox) alertBox.style.display='none'; }
}
setInterval(showRadioAlert,60000); showRadioAlert();

// YEAR FOOTER
document.getElementById('year').textContent=new Date().getFullYear();

// MENU TOGGLE
const menuToggle=document.querySelector('.menu-toggle');
const navMenu=document.querySelector('.nav-menu');
menuToggle?.addEventListener('click',()=>{ navMenu.style.display=navMenu.style.display==='flex'?'none':'flex'; });

// NAVIGATION
const navButtons=document.querySelectorAll('.nav-menu button');
const pages=document.querySelectorAll('.page');
const backButtons=document.querySelectorAll('.back');
const heroSlider=document.querySelector('.hero-slider');

navButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    const target=btn.getAttribute('data-target');
    pages.forEach(p=>p.classList.remove('active'));
    const page=document.getElementById(target);
    if(page) page.classList.add('active');
    heroSlider.style.display='none';
    window.scrollTo({top:0,behavior:'smooth'});
  });
});
backButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    btn.closest('.page').classList.remove('active');
    heroSlider.style.display='block';
    window.scrollTo({top:0,behavior:'smooth'});
  });
});

// SLIDER FUNCTION
function initSlider(container){
  const slides=container.querySelectorAll('img');
  let index=0;
  const showSlide=i=>{ slides.forEach((s,j)=>s.classList.toggle('active', j===i)); };
  showSlide(index);
  const nextBtn=container.querySelector('.arrow.right');
  const prevBtn=container.querySelector('.arrow.left');
  nextBtn?.addEventListener('click',()=>{ index=(index+1)%slides.length; showSlide(index); });
  prevBtn?.addEventListener('click',()=>{ index=(index-1+slides.length)%slides.length; showSlide(index); });
  setInterval(()=>{ index=(index+1)%slides.length; showSlide(index); },5000);
}
document.querySelectorAll('.slider').forEach(initSlider);

// GALLERY THUMBNAILS
document.querySelectorAll('.gallery-widget').forEach(gallery=>{
  const main=gallery.querySelector('.gallery-main img');
  const thumbs=gallery.querySelectorAll('.gallery-thumbs .thumb');
  thumbs.forEach(thumb=>{
    thumb.addEventListener('click',()=>{
      main.src=thumb.querySelector('img').src;
      thumbs.forEach(t=>t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
});

// NAV BAR SCROLL EFFECT
window.addEventListener('scroll',()=>{ if(window.scrollY>50) navMenu.classList.add('scrolled'); else navMenu.classList.remove('scrolled'); });
// ======================
// CHANGED / NEW: Enhanced JS to support:
// - Hero slider with arrows + autoplay + pause on hover
// - Per-section gallery widgets with prev/next buttons & autoplay
// - Event ads are static in HTML (no extra JS required), kept here in case of future rotation
// - YouTube clickable thumbnails that replace iframe src
// - Logo animation handled by CSS keyframes (no JS required), but we keep a small class toggle for replays if wanted
// - Navigation and radio alert preserved
// ======================

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------
  // HERO SLIDER (slides are .hero-slider .slide)
  // ----------------------
  (function heroSliderModule(){
    const hero = document.querySelector('.hero-slider');
    if(!hero) return;

    const slides = Array.from(hero.querySelectorAll('.slide'));
    const prevBtn = hero.querySelector('.hero-prev');
    const nextBtn = hero.querySelector('.hero-next');

    let current = 0;
    let autoplayInterval = 5000;
    let timer = null;
    function show(index){
      slides.forEach((s,i) => {
        s.classList.toggle('active', i===index);
      });
      current = index;
    }
    function next(){
      show((current + 1) % slides.length);
    }
    function prev(){
      show((current - 1 + slides.length) % slides.length);
    }

    show(0);

    // autoplay
    function start(){
      stop();
      timer = setInterval(next, autoplayInterval);
    }
    function stop(){
      if(timer) { clearInterval(timer); timer = null; }
    }

    // event handlers
    if(nextBtn) nextBtn.addEventListener('click', () => { next(); start(); });
    if(prevBtn) prevBtn.addEventListener('click', () => { prev(); start(); });

    // pause on hover to allow manual control
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);

    start();
  })();

  // ----------------------
  // NAVIGATION BETWEEN PAGES
  // ----------------------
  (function navigation(){
    const navButtons = document.querySelectorAll('.nav-menu button');
    const pages = document.querySelectorAll('.page');
    const backButtons = document.querySelectorAll('.back');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        if(!targetId) return;
        pages.forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById(targetId);
        if(targetPage) targetPage.classList.add('active');
        window.scrollTo(0,0);
      });
    });

    // Back buttons hide their page (goes back to previous which depending on your UI will be home)
    backButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.closest('.page');
        if(page) page.classList.remove('active');
        // show home as fallback
        const home = document.getElementById('home');
        if(home) home.classList.add('active');
        window.scrollTo(0,0);
      });
    });

    // Buttons added in topbar (Donate / Volunteer)
    const topDonate = document.querySelector('.btn-donate-top');
    const topVolunteer = document.querySelector('.btn-volunteer-top');
    if(topDonate) topDonate.addEventListener('click', () => {
      document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
      const d = document.getElementById('donate');
      if(d) d.classList.add('active');
      window.scrollTo(0,0);
    });
    if(topVolunteer) topVolunteer.addEventListener('click', () => {
      document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
      const v = document.getElementById('volunteer');
      if(v) v.classList.add('active');
      window.scrollTo(0,0);
    });

    // Make quick-links "Open" buttons open fully (NEW: class .open-full)
    const openFullBtns = document.querySelectorAll('.open-full');
    openFullBtns.forEach(b => {
      b.addEventListener('click', () => {
        const t = b.getAttribute('data-target');
        if(!t) return;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(t);
        if(target) target.classList.add('active');
        window.scrollTo(0,0);
      });
    });

  })();

  // ----------------------
  // GALLERY THUMBNAILS & PER-WIDGET SLIDERS
  // - Thumbs click to set main image (existing behaviour preserved)
  // - Each gallery-widget has optional prev/next buttons that navigate through thumbs
  // - Adds autoplay per gallery (pauses on hover)
  // ----------------------
  (function galleriesModule(){
    const galleries = document.querySelectorAll('.gallery-widget');

    galleries.forEach(gallery => {
      const mainImgEl = gallery.querySelector('.gallery-main img');
      const thumbs = Array.from(gallery.querySelectorAll('.gallery-thumbs .thumb'));
      const prevBtn = gallery.querySelector('.gallery-prev');
      const nextBtn = gallery.querySelector('.gallery-next');

      if(!mainImgEl || thumbs.length === 0) return;

      let current = thumbs.findIndex(t => t.classList.contains('active'));
      if(current < 0) current = 0;
      // helper to set
      function setByIndex(i){
        i = (i + thumbs.length) % thumbs.length;
        const thumb = thumbs[i];
        const img = thumb.querySelector('img');
        if(img) mainImgEl.src = img.src;
        thumbs.forEach(t => t.classList.toggle('active', t === thumb));
        current = i;
      }

      // click handlers for thumbs (preserve existing)
      thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
          setByIndex(idx);
        });
      });

      // prev/next handlers (NEW)
      function next(){
        setByIndex(current + 1);
      }
      function prev(){
        setByIndex(current - 1);
      }
      if(nextBtn) nextBtn.addEventListener('click', next);
      if(prevBtn) prevBtn.addEventListener('click', prev);

      // autoplay per gallery (optional, small interval)
      let timer = null;
      const autoplayDelay = 6000;
      function start(){
        stop();
        timer = setInterval(next, autoplayDelay);
      }
      function stop(){
        if(timer){ clearInterval(timer); timer = null; }
      }
      gallery.addEventListener('mouseenter', stop);
      gallery.addEventListener('mouseleave', start);

      // initialize
      setByIndex(current);
      start();
    });
  })();

  // ----------------------
  // RADIO LIVE ALERT
  // ----------------------
  (function radioAlert(){
    function showRadioAlert() {
      const now = new Date();
      const day = now.getDay(); // Sunday = 0
      const hour = now.getHours();
      const alertBox = document.querySelector('.radio-alert');
      if(day === 0 && hour >=6 && hour <7){
        if(alertBox) alertBox.style.display = 'block';
      } else {
        if(alertBox) alertBox.style.display = 'none';
      }
    }
    setInterval(showRadioAlert, 60000); // check every minute
    showRadioAlert();
  })();

  // ----------------------
  // MENU TOGGLE (Mobile)
  // ----------------------
  (function menuToggle(){
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if(menuToggle && navMenu){
      menuToggle.addEventListener('click', () => {
        const isShown = navMenu.style.display === 'flex' || window.getComputedStyle(navMenu).display === 'flex';
        navMenu.style.display = isShown ? 'none' : 'flex';
        menuToggle.setAttribute('aria-expanded', (!isShown).toString());
      });
    }
  })();

  // ----------------------
  // YouTube list (watch page)
  // - Clicking a thumbnail button replaces iframe src
  // - Each data-video should be a full embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID)
  // ----------------------
  (function youtubeList(){
    const ytButtons = document.querySelectorAll('.youtube-list .yt-thumb');
    const mainIframe = document.getElementById('main-video');
    if(!mainIframe) return;
    ytButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-video');
        if(src){
          mainIframe.src = src + '?autoplay=1';
          // make sure watch section active
          document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
          const w = document.getElementById('watch');
          if(w) w.classList.add('active');
          window.scrollTo(0,0);
        }
      });
    });
  })();

  // ----------------------
  // YEAR IN FOOTER
  // ----------------------
  (function footerYear(){
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
  })();

  // ----------------------
  // Optional: small utility to replay the logo pop (if you ever want)
  // ----------------------
  (function logoReplay(){
    const logo = document.querySelector('.pop-logo');
    if(!logo) return;
    // Example: when clicked replay animation
    logo.addEventListener('click', () => {
      logo.style.animation = 'none';
      // force reflow
      void logo.offsetWidth;
      logo.style.animation = '';
    });
  })();

}); // DOMContentLoaded
