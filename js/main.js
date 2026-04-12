/**
 * 道前工業株式会社 - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // Hero Slider
  // ============================================
  const slides     = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator');

  if (slides.length > 0) {
    let current  = 0;
    let interval = null;

    function goTo(index) {
      slides[current].classList.remove('active');
      indicators[current]?.classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      indicators[current]?.classList.add('active');
    }

    function startAuto() {
      interval = setInterval(function () {
        goTo((current + 1) % slides.length);
      }, 5000); // ★ スライド切替間隔（ミリ秒）
    }

    startAuto();

    indicators.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        clearInterval(interval);
        goTo(i);
        startAuto();
      });
    });
  }


  // ============================================
  // Header — スクロールで影
  // ============================================
  const header = document.querySelector('.site-header');

  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }


  // ============================================
  // Mobile Menu
  // ============================================
  const menuToggle = document.querySelector('.menu-toggle');
  const globalNav  = document.querySelector('.global-nav');

  if (menuToggle && globalNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = globalNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    globalNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        globalNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }


  // ============================================
  // Active Nav Link
  // ============================================
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.global-nav a, .footer-nav a').forEach(function (link) {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('current');
    }
  });


  // ============================================
  // Scroll Animation — フェードイン
  // data-animate 属性を持つ要素が画面内に入ると
  // is-visible クラスが付与されてフェードインします
  // ============================================
  const animateTargets = document.querySelectorAll('[data-animate]');

  if (animateTargets.length > 0 && 'IntersectionObserver' in window) {
    const isDesktop = window.matchMedia && window.matchMedia('(min-width: 769px)').matches;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = isDesktop ? 0 : parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(function () {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animateTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // IntersectionObserver 非対応ブラウザはすべて表示
    animateTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  // ============================================
  // Smooth Scroll
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h')
      ) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

});
