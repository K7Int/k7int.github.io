/**
 * K7I Core — Navigation, scroll reveal, spotlight tracking, mobile menu.
 */

class K7IApp {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.mobileBtn = document.getElementById('mobileMenuBtn');
    this.navLinks = document.getElementById('navLinks');
    this.revealElements = document.querySelectorAll('.reveal');
    this.init();
  }

  init() {
    this.injectIcons();
    this.setupStickyNav();
    this.setupScrollObserver();
    this.setupSpotlightCards();
    this.setupMobileMenu();
    this.setupActiveNav();
  }

  injectIcons() {
    if (!window.renderIcon) return;
    document.querySelectorAll('[data-icon]').forEach(el => {
      const name = el.getAttribute('data-icon');
      const cls = el.getAttribute('data-icon-class') || '';
      el.innerHTML = window.renderIcon(name, cls);
    });
  }

  setupStickyNav() {
    if (!this.navbar) return;
    const onScroll = () => {
      if (window.scrollY > 10) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  setupScrollObserver() {
    if (!('IntersectionObserver' in window)) {
      this.revealElements.forEach(el => el.classList.add('active'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    this.revealElements.forEach(el => observer.observe(el));
  }

  setupSpotlightCards() {
    document.querySelectorAll('.product-card, .about-card, .darshana-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  }

  setupMobileMenu() {
    if (!this.mobileBtn || !this.navLinks) return;
    this.mobileBtn.addEventListener('click', () => {
      this.navLinks.classList.toggle('open');
    });
    this.navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.navLinks.classList.remove('open'));
    });
  }

  setupActiveNav() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const items = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY > s.offsetTop - 200) current = s.getAttribute('id');
      });
      items.forEach(item => {
        item.classList.toggle('active', item.getAttribute('href') === '#' + current);
      });
    }, { passive: true });
  }
}

document.addEventListener('DOMContentLoaded', () => { window.k7iApp = new K7IApp(); });
