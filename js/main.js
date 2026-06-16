document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Logic
  const header = document.querySelector('header.site-header');
  const adjustHeader = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', adjustHeader);
  adjustHeader(); // Run on load

  // 2. Mobile Nav Toggle
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // 3. Tab Switching (Homepage Services Overview)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        const activeContent = document.getElementById(targetTab);
        if (activeContent) {
          activeContent.classList.add('active');
          // Re-trigger reveal animation inside active tab
          const reveals = activeContent.querySelectorAll('.reveal');
          reveals.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('revealed');
            }, index * 80);
          });
        }
      });
    });
  }

  // 4. Custom CountUp.js Functionality on Scroll
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-count-target'));
    const prefix = el.getAttribute('data-count-prefix') || '';
    const suffix = el.getAttribute('data-count-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-count-decimals')) || 0;
    const duration = 2000; // 2 seconds
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing out quad
      const easeProgress = progress * (2 - progress);
      const currentValue = easeProgress * target;
      
      el.textContent = `${prefix}${currentValue.toFixed(decimals)}${suffix}`;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      }
    };
    
    window.requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.1 });

  const counters = document.querySelectorAll('.stat-num[data-count-target]');
  counters.forEach(counter => counterObserver.observe(counter));

  // 5. Section/Elements Reveals (fade-up 40px)
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => revealObserver.observe(el));

  // Stagger entry helper for specific cards lists
  const staggeredContainers = document.querySelectorAll('.stagger-grid');
  staggeredContainers.forEach(container => {
    const children = container.querySelectorAll('.reveal');
    children.forEach((child, index) => {
      child.style.transitionDelay = `${index * 0.08}s`;
    });
  });

  // 6. Back-to-Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 7. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question-btn');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answerPanel = item.querySelector('.faq-answer-panel');
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer-panel').style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      if (isActive) {
        item.classList.remove('active');
        answerPanel.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answerPanel.style.maxHeight = `${answerPanel.scrollHeight}px`;
      }
    });
  });

  // 8. Case Studies Filter Logic
  const filterButtons = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-card-item');
  if (filterButtons.length > 0 && caseCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        caseCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
});
