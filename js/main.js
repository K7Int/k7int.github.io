/**
 * K7I System 7 — menu bar, dropdowns, mobile menu, scroll reveal, active item.
 */

class K7IApp {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.mobileBtn = document.getElementById('mobileMenuBtn');
    this.menubarLeft = document.querySelector('.menubar-left');
    this.revealElements = document.querySelectorAll('.reveal');
    this.init();
  }

  init() {
    this.injectIcons();
    this.setupStickyMenu();
    this.setupScrollObserver();
    this.setupDropdowns();
    this.setupMobileMenu();
    this.setupActiveMenu();
  }

  injectIcons() {
    if (!window.renderIcon) return;
    document.querySelectorAll('[data-icon]').forEach(el => {
      const name = el.getAttribute('data-icon');
      const cls = el.getAttribute('data-icon-class') || '';
      el.innerHTML = window.renderIcon(name, cls);
    });
  }

  setupStickyMenu() {
    if (!this.navbar) return;
    const onScroll = () => {
      this.navbar.classList.toggle('scrolled', window.scrollY > 10);
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
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    this.revealElements.forEach(el => observer.observe(el));
  }

  setupDropdowns() {
    document.querySelectorAll('.menu-group').forEach(group => {
      const btn = group.querySelector('.has-dropdown');
      const dropdown = group.querySelector('.dropdown');
      if (!btn || !dropdown) return;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        this.closeAllDropdowns();
        if (!isOpen) dropdown.classList.add('open');
      });
    });

    document.addEventListener('click', () => this.closeAllDropdowns());
  }

  closeAllDropdowns() {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  }

  setupMobileMenu() {
    if (!this.mobileBtn || !this.menubarLeft) return;
    this.mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.menubarLeft.classList.toggle('open');
      this.mobileBtn.classList.toggle('open');
      this.closeAllDropdowns();
    });

    this.menubarLeft.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.menubarLeft.classList.remove('open');
        this.mobileBtn.classList.remove('open');
      });
    });
  }

  setupActiveMenu() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const items = document.querySelectorAll('.menu-item[href^="#"]');
    if (!sections.length || !items.length) return;

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY > s.offsetTop - 200) current = s.getAttribute('id');
      });
      items.forEach(item => {
        const href = item.getAttribute('href');
        item.classList.toggle('active', href === '#' + current);
      });
    }, { passive: true });
  }
}

document.addEventListener('DOMContentLoaded', () => { window.k7iApp = new K7IApp(); });
