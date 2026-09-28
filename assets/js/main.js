/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/



let portraitTrigger = null;

function openModal() {
  var modal = document.getElementById("imageModal");
  var modalImg = document.getElementById("imgInModal");
  var img = document.querySelector(".profile-img img");
  if (!modal || !modalImg || !img) return;
  portraitTrigger = document.activeElement;
  modal.style.display = "grid";
  modal.setAttribute("aria-hidden", "false");
  modalImg.src = img.src;
  document.body.classList.add("portrait-open");
  modal.querySelector(".close")?.focus();
}

function closeModal() {
  var modal = document.getElementById("imageModal");
  if (!modal) return;
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("portrait-open");
  portraitTrigger?.focus({ preventScroll: true });
}

(function() {
  "use strict";

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileMenu = window.matchMedia('(max-width: 1199px)');

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');
  const header = document.querySelector('#header');
  const backdrop = document.querySelector('.nav-backdrop');
  const pageSurfaces = document.querySelectorAll('main, #footer, .mobile-dock');

  function headerToggle(force) {
    if (!header || !headerToggleBtn) return;
    const open = typeof force === 'boolean' ? force : !header.classList.contains('header-show');
    header.classList.toggle('header-show', open);
    headerToggleBtn.classList.toggle('bi-list', !open);
    headerToggleBtn.classList.toggle('bi-x', open);
    headerToggleBtn.setAttribute('aria-expanded', String(open));
    headerToggleBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('nav-open', open);
    if (backdrop) backdrop.hidden = !open;
    pageSurfaces.forEach(surface => { surface.inert = open; });
    [...header.children].forEach(child => {
      if (child !== headerToggleBtn && child.id !== 'imageModal') child.inert = mobileMenu.matches && !open;
    });
  }
  headerToggleBtn?.addEventListener('click', () => headerToggle());
  backdrop?.addEventListener('click', () => {
    headerToggle(false);
    headerToggleBtn?.focus();
  });
  mobileMenu.addEventListener('change', () => headerToggle(false));
  headerToggle(false);

  document.querySelector('.profile-img img')?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal();
    }
  });
  document.addEventListener('keydown', event => {
    const portraitOpen = document.body.classList.contains('portrait-open');
    const navigationOpen = header?.classList.contains('header-show');
    if (!portraitOpen && !navigationOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      if (portraitOpen) closeModal();
      else {
        headerToggle(false);
        headerToggleBtn?.focus();
      }
    }
    if (event.key === 'Tab') {
      const scope = portraitOpen ? document.getElementById('imageModal') : header;
      const controls = [...scope.querySelectorAll('a[href], button, [tabindex="0"]')]
        .filter(control => control.getClientRects().length && !control.closest('[inert]'));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (navmenu.hash.length > 1 && document.querySelector('.header-show')) {
        headerToggle(false);
        const section = document.getElementById(navmenu.hash.slice(1));
        if (section) {
          section.setAttribute('tabindex', '-1');
          section.focus({ preventScroll: true });
        }
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    // The page is ready at DOMContentLoaded; don't wait for maps and remote fonts.
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => preloader.remove(), { once: true });
    else preloader.remove();
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 45,
      disable: () => reducedMotion.matches
    });
  }
  aosInit();
  reducedMotion.addEventListener('change', aosInit);

  /**
   * Hero identity: a one-time name reveal and a layout-stable role sequence.
   * Stops when offscreen, in a background tab, paused, or reduced motion is on.
   */
  const hero = document.querySelector('#hero');
  const heroName = document.querySelector('.hero-name');
  const roleRotator = document.querySelector('[data-role-rotator]');
  if (hero && heroName && roleRotator) {
    let characterIndex = 0;
    heroName.querySelectorAll('.name-word').forEach(word => {
      const fragment = document.createDocumentFragment();
      Array.from(word.textContent).forEach(character => {
        const span = document.createElement('span');
        span.className = 'name-character' + (character === '.' ? ' name-period' : '');
        span.textContent = character;
        span.style.setProperty('--character-delay', (characterIndex++ * 32) + 'ms');
        fragment.append(span);
      });
      word.replaceChildren(fragment);
    });

    const roles = [...roleRotator.querySelectorAll('.role-word')];
    const captions = [...roleRotator.querySelectorAll('.role-caption')];
    const toggle = roleRotator.querySelector('.role-toggle');
    const toggleIcon = toggle?.querySelector('i');
    const counter = roleRotator.querySelector('[data-role-current]');
    const progress = roleRotator.querySelector('.role-progress-fill');
    const interval = 4200;
    let activeRole = 0;
    let manualPause = false;
    let heroVisible = true;
    let roleTimer;

    function displayRole(index) {
      roles.forEach((role, roleIndex) => {
        role.classList.toggle('is-leaving', roleIndex === activeRole && roleIndex !== index);
        role.classList.toggle('is-active', roleIndex === index);
      });
      captions.forEach((caption, captionIndex) => caption.classList.toggle('is-active', captionIndex === index));
      activeRole = index;
      if (counter) counter.textContent = String(index + 1).padStart(2, '0');
    }

    function stopRoleTimer() {
      window.clearTimeout(roleTimer);
      roleRotator.classList.remove('is-running');
    }

    function syncHeroMotion() {
      stopRoleTimer();
      if (heroVisible && !document.hidden) heroName.classList.add('is-revealed');
      if (toggle) {
        toggle.hidden = reducedMotion.matches || roles.length < 2;
        toggle.setAttribute('aria-pressed', String(manualPause));
        toggle.setAttribute('aria-label', manualPause ? 'Resume changing specialties' : 'Pause changing specialties');
      }
      if (toggleIcon) toggleIcon.className = manualPause ? 'bi bi-play-fill' : 'bi bi-pause-fill';
      if (reducedMotion.matches) {
        displayRole(0);
        return;
      }
      if (manualPause || !heroVisible || document.hidden || roles.length < 2) return;
      // Reset only this tiny progress track; role widths never need measurement.
      if (progress) void progress.offsetWidth;
      roleRotator.classList.add('is-running');
      roleTimer = window.setTimeout(() => {
        displayRole((activeRole + 1) % roles.length);
        syncHeroMotion();
      }, interval);
    }

    toggle?.addEventListener('click', () => {
      manualPause = !manualPause;
      syncHeroMotion();
    });
    document.addEventListener('visibilitychange', syncHeroMotion);
    reducedMotion.addEventListener('change', syncHeroMotion);
    window.addEventListener('pagehide', stopRoleTimer);
    window.addEventListener('pageshow', syncHeroMotion);
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver(entries => {
        const entry = entries[0];
        heroVisible = entry.isIntersecting && entry.intersectionRatio >= .1;
        syncHeroMotion();
      }, { threshold: [0, .1] });
      heroObserver.observe(hero);
    }
    syncHeroMotion();
  }

  /**
   * Keep the template's typed-text support for pages that still use it.
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped && typeof Typed !== 'undefined' && !reducedMotion.matches) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    const typed = new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 75,
      backSpeed: 40,
      backDelay: 2000
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden || reducedMotion.matches) typed.stop();
      else typed.start();
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) {
        typed.stop();
        selectTyped.textContent = typed_strings[0];
      }
    });
  }

  /**
   * Initiate Pure Counter
   */
  if (reducedMotion.matches) {
    document.querySelectorAll('[data-purecounter-end]').forEach(counter => {
      counter.textContent = counter.getAttribute('data-purecounter-end').trim();
    });
  } else if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    if (reducedMotion.matches || typeof Waypoint === 'undefined') {
      item.querySelectorAll('.progress-bar').forEach(el => { el.style.width = el.getAttribute('aria-valuenow') + '%'; });
      return;
    }
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox !== 'undefined') GLightbox({
    selector: '.glightbox',
    openEffect: reducedMotion.matches ? 'none' : 'zoom',
    closeEffect: reducedMotion.matches ? 'none' : 'fade',
    slideEffect: reducedMotion.matches ? 'none' : 'slide'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    if (typeof Isotope === 'undefined' || typeof imagesLoaded === 'undefined') return;
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    const container = isotopeItem.querySelector('.isotope-container');
    let initIsotope = new Isotope(container, {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort,
        transitionDuration: reducedMotion.matches ? 0 : '0.4s'
    });
    imagesLoaded(container).on('progress', () => initIsotope.layout());
    if (document.fonts?.ready) document.fonts.ready.then(() => initIsotope.layout());
    reducedMotion.addEventListener('change', () => {
      initIsotope.options.transitionDuration = reducedMotion.matches ? 0 : '0.4s';
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.setAttribute('role', 'button');
      filters.setAttribute('tabindex', '0');
      filters.setAttribute('aria-pressed', String(filters.classList.contains('filter-active')));
      filters.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          filters.click();
        }
      });
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active')?.classList.remove('filter-active');
        isotopeItem.querySelectorAll('.isotope-filters li').forEach(button => button.setAttribute('aria-pressed', 'false'));
        this.classList.add('filter-active');
        this.setAttribute('aria-pressed', 'true');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof AOS !== 'undefined') AOS.refresh();
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.getElementById(window.location.hash.slice(1))) {
        setTimeout(() => {
          let section = document.getElementById(window.location.hash.slice(1));
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.getBoundingClientRect().top + window.scrollY - (parseInt(scrollMarginTop) || 0),
            behavior: reducedMotion.matches ? 'auto' : 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  const navmenulinks = [...document.querySelectorAll('.navmenu a, .mobile-dock a')]
    .filter(link => link.hash.length > 1 && document.getElementById(link.hash.slice(1)));
  const sections = [...document.querySelectorAll('main>section[id]')];
  const readingProgress = document.querySelector('.reading-progress');
  let scrollQueued = false;

  function navmenuScrollspy() {
    scrollQueued = false;
    let activeId = sections[0]?.id;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= 180 && navmenulinks.some(link => link.hash === '#' + section.id)) activeId = section.id;
    });
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
    if (progress > .99 && document.getElementById('contact')) activeId = 'contact';
    navmenulinks.forEach(link => {
      const active = link.hash === '#' + activeId;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (readingProgress) readingProgress.style.transform = 'scaleX(' + progress + ')';
    toggleScrollTop();
  }
  function queueScrollUpdate() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(navmenuScrollspy);
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', queueScrollUpdate, { passive: true });
  window.addEventListener('resize', queueScrollUpdate, { passive: true });
  queueScrollUpdate();

})();
