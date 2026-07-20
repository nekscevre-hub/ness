/**
 * NEKS Çevre Teknolojileri - Optimized Scripts
 * Mobile Menu, Form Validation, Navigation & Interactive Features
 * v2.0 - Fully Mobile Optimized
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ============================================
  // 1. MOBILE MENU FUNCTIONALITY
  // ============================================
  const menuToggle = document.querySelector('.nav-mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  const body = document.body;

  // Toggle mobile menu
  if (menuToggle) {
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const isActive = menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      // Announce state to assistive technology
      menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      // Prevent body scroll when menu is open
      body.style.overflow = isActive ? 'hidden' : '';
    });
  }

  // Close menu when link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (mobileMenu && menuToggle) {
      const isClickInsideMenu = mobileMenu.contains(event.target);
      const isClickInsideToggle = menuToggle.contains(event.target);

      if (!isClickInsideMenu && !isClickInsideToggle && mobileMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        body.style.overflow = '';
      }
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      body.style.overflow = '';
    }
  });

  // ============================================
  // 2. ACTIVE NAVIGATION LINK
  // ============================================
  function setActiveNavLink() {
    const toSlug = (p) => (p || '').split('#')[0].split('?')[0]
      .replace(/\/+$/, '').split('/').pop().replace(/\.html$/, '');
    const currentSlug = toSlug(window.location.pathname);
    const isHome = currentSlug === '' || currentSlug === 'index';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

    navLinks.forEach(link => {
      const hrefSlug = toSlug(link.getAttribute('href'));
      const linkIsHome = hrefSlug === '' || hrefSlug === 'index';
      if ((isHome && linkIsHome) || (hrefSlug && hrefSlug === currentSlug)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setActiveNavLink();

  // ============================================
  // 3. CONTACT FORM FUNCTIONALITY
  // ============================================
  const contactFormWrap = document.querySelector('.contact-form-wrap');

  if (contactFormWrap) {
    const form = contactFormWrap.querySelector('form');
    const formInputs = {
      name: contactFormWrap.querySelector('input[name="name"]'),
      email: contactFormWrap.querySelector('input[name="email"]'),
      company: contactFormWrap.querySelector('input[name="company"]'),
      phone: contactFormWrap.querySelector('input[name="phone"]'),
      service: contactFormWrap.querySelector('select[name="service"]'),
      message: contactFormWrap.querySelector('textarea[name="message"]')
    };

    const submitButton = contactFormWrap.querySelector('.btn-dark') || contactFormWrap.querySelector('button[type="submit"]');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Form validation function
    function validateForm() {
      const errors = [];

      if (!formInputs.name || !formInputs.name.value.trim()) {
        errors.push('Ad Soyad gereklidir');
        formInputs.name?.classList.add('error');
      } else {
        formInputs.name?.classList.remove('error');
      }

      if (!formInputs.email || !formInputs.email.value.trim()) {
        errors.push('E-posta gereklidir');
        formInputs.email?.classList.add('error');
      } else if (!emailRegex.test(formInputs.email.value)) {
        errors.push('Geçerli bir e-posta adresi girin');
        formInputs.email?.classList.add('error');
      } else {
        formInputs.email?.classList.remove('error');
      }

      if (!formInputs.message || !formInputs.message.value.trim()) {
        errors.push('Mesaj gereklidir');
        formInputs.message?.classList.add('error');
      } else {
        formInputs.message?.classList.remove('error');
      }

      return errors;
    }

    // Form submit handler
    if (submitButton) {
      submitButton.addEventListener('click', async function(e) {
        e.preventDefault();

        // Validate form
        const errors = validateForm();

        if (errors.length > 0) {
          alert('Lütfen aşağıdaki hataları düzeltiniz:\n\n' + errors.join('\n'));
          return;
        }

        // Prepare form data
        const formData = {
          name: formInputs.name.value.trim(),
          email: formInputs.email.value.trim(),
          company: formInputs.company ? formInputs.company.value.trim() : '',
          phone: formInputs.phone ? formInputs.phone.value.trim() : '',
          service: formInputs.service ? formInputs.service.value : '',
          message: formInputs.message.value.trim(),
          timestamp: new Date().toISOString()
        };

        // Show loading state
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Gönderiliyor...';

        try {
          // If form has Netlify attributes, let it handle it
          if (form && form.getAttribute('name') === 'contact') {
            // Submit via Netlify Forms
            const response = await fetch('/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                'form-name': 'contact',
                'name': formData.name,
                'email': formData.email,
                'company': formData.company,
                'phone': formData.phone,
                'service': formData.service,
                'message': formData.message
              }).toString()
            });

            if (response.ok) {
              // Success message
              alert('✓ Mesajınız başarıyla gönderildi!\n\nEn kısa sürede sizinle iletişime geçeceğiz.');

              // Reset form
              if (form) {
                form.reset();
              } else {
                resetFormInputs();
              }

              // Clear error classes
              Object.values(formInputs).forEach(input => {
                if (input) input.classList.remove('error');
              });
            } else {
              throw new Error('Form gönderilemedi');
            }
          }
        } catch (error) {
          console.error('Form submission error:', error);

          // Fallback: Show email and instructions
          alert('Mesaj gönderilemedi.\n\nLütfen doğrudan aşağıdaki adrese yazınız:\nE-posta: nekscevre@gmail.com\n\nAdınız: ' + formData.name);
        } finally {
          // Reset button state
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      });
    }

    // Helper function to reset form inputs manually
    function resetFormInputs() {
      Object.values(formInputs).forEach(input => {
        if (input) input.value = '';
      });
    }

    // Add real-time validation feedback
    if (formInputs.email) {
      formInputs.email.addEventListener('blur', function() {
        if (this.value && !emailRegex.test(this.value)) {
          this.classList.add('error');
        } else {
          this.classList.remove('error');
        }
      });
    }

    // Prevent form submission with Enter key in message field (allow line breaks)
    if (formInputs.message) {
      formInputs.message.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
          submitButton.click();
        }
      });
    }
  }

  // ============================================
  // 4. SMOOTH SCROLL BEHAVIOR
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          // Close mobile menu if open
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
          }
          // Scroll to target
          const headerHeight = document.querySelector('nav')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          // Move keyboard focus for skip-link / in-page anchors
          if (target.hasAttribute('tabindex')) {
            target.focus({ preventScroll: true });
          }
        }
      }
    });
  });

  // ============================================
  // 5. FORM INPUT ENHANCEMENTS
  // ============================================
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      // Allow only numbers, spaces, +, -, ()
      this.value = this.value.replace(/[^\d\s+\-()]/g, '');
    });
  });

  // Number input formatting
  const numberInputs = document.querySelectorAll('input[type="number"]');
  numberInputs.forEach(input => {
    input.addEventListener('change', function() {
      if (this.value && isNaN(this.value)) {
        this.value = '';
      }
    });
  });

  // ============================================
  // 6. LAZY LOADING & PERFORMANCE
  // ============================================
  // Native lazy-loading (loading="lazy") already defers off-screen images.
  // The previous JS re-assigned img.src = img.src, which forced a redundant
  // re-fetch and effectively cancelled the native optimization. Removed.

  // ============================================
  // 7. VIDEO AUTOPLAY OPTIMIZATION
  // ============================================
  const video = document.querySelector('.hero-video-bg');
  if (video) {
    // Attempt autoplay
    video.muted = true;
    video.play().catch(error => {
      console.log('Autoplay prevented:', error);
      // Fallback: show controls
      video.controls = false;
    });
  }

  // ============================================
  // 8. ACCESSIBILITY IMPROVEMENTS
  // ============================================
  // Add focus visible styles for keyboard navigation
  let isKeyboardNavigation = false;

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      isKeyboardNavigation = true;
      body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    isKeyboardNavigation = false;
    body.classList.remove('keyboard-nav');
  });

  // ============================================
  // 9. PRINT OPTIMIZATION
  // ============================================
  window.addEventListener('beforeprint', function() {
    body.style.backgroundColor = 'white';
  });

  window.addEventListener('afterprint', function() {
    body.style.backgroundColor = '';
  });

  // ============================================
  // 10. HANDLE ORIENTATION CHANGE
  // ============================================
  window.addEventListener('orientationchange', function() {
    // Close mobile menu on orientation change
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      body.style.overflow = '';
    }
  });

  // ============================================
  // 11. SCROLL LOCK FOR MOBILE MENU
  // ============================================
  function disableBodyScroll() {
    body.style.overflow = 'hidden';
    body.style.paddingRight = getScrollbarWidth() + 'px';
  }

  function enableBodyScroll() {
    body.style.overflow = '';
    body.style.paddingRight = '';
  }

  function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  }
});

// ============================================
// 12. UTILITY FUNCTIONS
// ============================================

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Debounce function for scroll/resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Get URL parameter
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Log page performance metrics (optional)
if (window.performance && window.performance.timing) {
  window.addEventListener('load', function() {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load time: ' + pageLoadTime + 'ms');
  });
}

// ============================================
// 13. SERVICE WORKER REGISTRATION
// ============================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(err => {
      console.log('Service worker registration failed:', err);
    });
  });
}

// ============================================
// 14. HANDLE VIEWPORT META TAG
// ============================================
// Ensure proper viewport settings on mobile
window.addEventListener('load', function() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    const newViewport = document.createElement('meta');
    newViewport.name = 'viewport';
    newViewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
    document.head.appendChild(newViewport);
  }
});

// ============================================
// 15. TOUCH-FRIENDLY ENHANCEMENTS
// ============================================
document.addEventListener('touchstart', function() {
  // Reduce touch delay
  document.body.style.touchAction = 'manipulation';
}, { passive: true });

// ============================================
// 16. FORM STATUS MESSAGES
// ============================================
function showFormMessage(type, message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'form-' + type;
  messageDiv.textContent = message;

  const form = document.querySelector('.contact-form-wrap form');
  if (form) {
    form.insertBefore(messageDiv, form.firstChild);
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

// ============================================
// 17. PREFETCH NAVIGATION LINKS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Prefetch the main navigation destinations (clean, extensionless URLs).
  const seen = new Set();
  document.querySelectorAll('.nav-links a[href], .mobile-menu a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) return;
    if (seen.has(href)) return;
    seen.add(href);
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = href;
    document.head.appendChild(prefetchLink);
  });
});
