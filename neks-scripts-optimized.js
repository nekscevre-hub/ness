/**
 * NEKS Çevre Teknolojileri - Optimized Scripts
 * Mobile Menu, Form Validation, Navigation & Interactive Features
 */

// ============================================
// 1. MOBILE MENU FUNCTIONALITY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.nav-mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  
  // Toggle mobile menu
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }
  
  // Close menu when link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideMenu = mobileMenu.contains(event.target);
    const isClickInsideToggle = menuToggle.contains(event.target);
    
    if (!isClickInsideMenu && !isClickInsideToggle && mobileMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });
  
  // ============================================
  // 2. ACTIVE NAVIGATION LINK
  // ============================================
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
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
  const contactForm = document.querySelector('.contact-form-wrap');
  if (contactForm) {
    const formInputs = {
      name: contactForm.querySelector('input[placeholder*="Adınız"]'),
      email: contactForm.querySelector('input[placeholder*="email"]'),
      company: contactForm.querySelector('input[placeholder*="Kurumunuz"]'),
      phone: contactForm.querySelector('input[placeholder*="+90"]'),
      service: contactForm.querySelector('select'),
      message: contactForm.querySelector('textarea')
    };
    
    const submitButton = contactForm.querySelector('.btn-dark');
    
    // Form validation function
    function validateForm() {
      const errors = [];
      
      if (!formInputs.name || !formInputs.name.value.trim()) {
        errors.push('Ad Soyad gereklidir');
      }
      
      if (!formInputs.email || !formInputs.email.value.trim()) {
        errors.push('E-posta gereklidir');
      } else if (!isValidEmail(formInputs.email.value)) {
        errors.push('Geçerli bir e-posta adresi girin');
      }
      
      if (!formInputs.message || !formInputs.message.value.trim()) {
        errors.push('Mesaj gereklidir');
      }
      
      return errors;
    }
    
    // Email validation helper
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    // Form submit handler
    if (submitButton) {
      submitButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Validate form
        const errors = validateForm();
        
        if (errors.length > 0) {
          alert('Lütfen aşağıdaki hatalarını düzeltiniz:\n\n' + errors.join('\n'));
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
          // Send to Netlify Forms (if deployed on Netlify)
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
            contactForm.querySelector('form') ? contactForm.querySelector('form').reset() : resetFormInputs();
            
          } else {
            throw new Error('Form gönderilemedi');
          }
        } catch (error) {
          console.error('Form submission error:', error);
          
          // Fallback: Show email and instructions
          alert('Mesaj gönderilemedi. Lütfen doğrudan aşağıdaki e-posta adresine yazınız:\n\nnekscevre@gmail.com\n\nAdınız: ' + formData.name + '\nKonu: ' + formData.service);
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
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  
  // ============================================
  // 6. LAZY LOADING & PERFORMANCE
  // ============================================
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src; // Trigger load
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // ============================================
  // 7. VIDEO AUTOPLAY OPTIMIZATION
  // ============================================
  const video = document.querySelector('.hero-video-bg');
  if (video) {
    // Attempt autoplay
    video.muted = true;
    video.play().catch(error => {
      console.log('Autoplay prevented:', error);
      // Fallback: show poster
      video.controls = true;
    });
  }
  
  // ============================================
  // 8. ANALYTICS & TRACKING (Optional)
  // ============================================
  // Track page views
  function trackPageView() {
    const pageTitle = document.title;
    const pagePath = window.location.pathname;
    
    if (window.gtag) {
      gtag('config', 'GA_MEASUREMENT_ID', {
        'page_title': pageTitle,
        'page_path': pagePath
      });
    }
  }
  
  trackPageView();
  
  // ============================================
  // 9. ACCESSIBILITY IMPROVEMENTS
  // ============================================
  // Add focus visible styles for keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });
  
  // ============================================
  // 10. PRINT OPTIMIZATION
  // ============================================
  window.addEventListener('beforeprint', function() {
    document.body.style.backgroundColor = 'white';
  });
  
  window.addEventListener('afterprint', function() {
    document.body.style.backgroundColor = '';
  });
});

// ============================================
// 11. UTILITY FUNCTIONS
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
// 12. SERVICE WORKER REGISTRATION (Optional - for PWA)
// ============================================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(err => {
    console.log('Service worker registration failed:', err);
  });
}
