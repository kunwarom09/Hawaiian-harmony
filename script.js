// ==========================================================================
// Hawaiian Harmony - Interactive Client Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Shadow & Dynamic Active Section Navigation (ScrollSpy)
  const siteHeader = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const trackedSections = [];

  navLinks.forEach(link => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      const el = document.querySelector(targetId);
      if (el) trackedSections.push({ link, el });
    }
  });

  function updateActiveNavLink() {
    const headerHeight = siteHeader ? siteHeader.offsetHeight : 80;
    let currentLink = null;

    trackedSections.forEach(({ link, el }) => {
      const rect = el.getBoundingClientRect();
      // Section is active if top is near/above header and bottom is still below header
      if (rect.top <= headerHeight + 120 && rect.bottom >= headerHeight + 60) {
        currentLink = link;
      }
    });

    navLinks.forEach(l => l.classList.remove('active', 'highlight'));
    if (currentLink) {
      currentLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', () => {
    if (siteHeader) {
      if (window.scrollY > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
    updateActiveNavLink();
  }, { passive: true });

  updateActiveNavLink();

  // 2. Interactive FAQ Accordion
  const faqButtons = document.querySelectorAll('.faq-question-btn');
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.closest('.faq-item');
      if (!faqItem) return;
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      // Close all other open FAQ items so each stands by itself
      faqButtons.forEach(otherBtn => {
        if (otherBtn !== button) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherItem = otherBtn.closest('.faq-item');
          if (otherItem) otherItem.classList.remove('open');
        }
      });

      // Toggle clicked item
      if (isExpanded) {
        button.setAttribute('aria-expanded', 'false');
        faqItem.classList.remove('open');
      } else {
        button.setAttribute('aria-expanded', 'true');
        faqItem.classList.add('open');
      }
    });
  });

  // 3. Checkout Modal Triggers
  const modalBackdrop = document.getElementById('checkout-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const triggerLinks = document.querySelectorAll('a[href="#checkout-modal"]');
  const proceedBtn = document.getElementById('proceed-checkout-btn');

  function openModal(planNumber = '6') {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // select matching radio button
    const radio = modalBackdrop.querySelector(`input[name="modal-plan"][value="${planNumber}"]`);
    if (radio) radio.checked = true;
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = link.getAttribute('data-plan') || '6';
      openModal(plan);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      proceedBtn.textContent = 'Redirecting to Encrypted Order Page...';
      window.location.href = 'https://secureofficialsite.store/buy-hawaiian-harmony';
    });
  }

  // 4. Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#checkout-modal') return; // Handled by modal logic

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // 5. Mobile Navigation Menu Toggle
  const navToggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  function closeMobileNav() {
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (navToggleBtn) {
        navToggleBtn.classList.remove('active');
        navToggleBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.toggle('active');
      navToggleBtn.classList.toggle('active', isActive);
      navToggleBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggleBtn.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileNav();
      }
    });
  }
});

