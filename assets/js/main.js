/* ============================================================
   Leishka Pagan - Portfolio
   Shared JavaScript. One file. No build step.
   Handles: current-page nav highlight, mobile nav toggle,
            fade-in on scroll, cert image lightbox.
   ============================================================ */

(function () {
  'use strict';

  // flag the <html> so CSS can target JS-enabled state
  document.documentElement.classList.add('js');


  /* ----------------------------------------------------------
     1. Current-page nav highlight
     Marks the nav link matching the current URL with .current.
     ---------------------------------------------------------- */

  function markCurrentPage() {
    var path = window.location.pathname.replace(/\/$/, '');
    var links = document.querySelectorAll('.nav-links a');

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPath = href.replace(/\/$/, '').replace(/^\.\//, '');

      // match exact page, or index.html when path is empty/root
      var current = (path === linkPath) ||
                    (path === '' && (linkPath === 'index.html' || linkPath === '/')) ||
                    (path.endsWith('/' + linkPath));

      if (current) {
        link.classList.add('current');
      }
    });
  }


  /* ----------------------------------------------------------
     2. Mobile nav toggle
     ---------------------------------------------------------- */

  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // close menu when a link is clicked
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ----------------------------------------------------------
     3. Fade-in on scroll
     Elements with .fade-in get .visible once they enter viewport.
     Falls back to showing everything immediately if IntersectionObserver is missing.
     ---------------------------------------------------------- */

  function initFadeIn() {
    var els = document.querySelectorAll('.fade-in');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }


  /* ----------------------------------------------------------
     4. Lightbox for cert images
     Any <img> inside .proof-card (or [data-lightbox]) opens
     in a fullscreen overlay on click. Esc or click closes it.
     ---------------------------------------------------------- */

  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var lbImg = lightbox.querySelector('img');
    if (!lbImg) return;

    // triggers: .proof-card or anything with data-lightbox
    var triggers = document.querySelectorAll('.proof-card, [data-lightbox]');

    triggers.forEach(function (el) {
      el.addEventListener('click', function (e) {
        // allow links inside the card (like "verify") to still work
        if (e.target.closest('a')) return;

        var img = el.querySelector('img') || el;
        var src = img.getAttribute('src') || el.getAttribute('data-lightbox');
        if (!src) return;

        lbImg.setAttribute('src', src);
        lbImg.setAttribute('alt', img.getAttribute('alt') || 'Expanded image');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function close() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      // clear src after transition to free memory
      setTimeout(function () { lbImg.setAttribute('src', ''); }, 200);
    }

    lightbox.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        close();
      }
    });
  }


  /* ----------------------------------------------------------
     Boot
     ---------------------------------------------------------- */

  function boot() {
    markCurrentPage();
    initMobileNav();
    initFadeIn();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
