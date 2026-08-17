/* ============================================================
   CRAFTSFLOW MAIN.JS — Clean, complete, no duplicates
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     0. LIGHT / DARK THEME TOGGLER
  ---------------------------------------------------------- */
  const themeToggleBtn  = document.getElementById('themeToggleBtn');
  const themeToggleIcon = document.getElementById('themeToggleIcon');

  function getActiveTheme() {
    return document.documentElement.getAttribute('data-theme') || localStorage.getItem('craftsflow-theme') || 'light';
  }

  function updateThemeUI(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('craftsflow-theme', theme);
    if (themeToggleIcon) {
      themeToggleIcon.textContent = theme === 'light' ? '☀️' : '🌙';
    }
  }

  if (themeToggleBtn) {
    updateThemeUI(getActiveTheme());
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = getActiveTheme() === 'dark' ? 'light' : 'dark';
      updateThemeUI(newTheme);
    });
  }

  /* ----------------------------------------------------------
     1. NAV SCROLL + SCROLL PROGRESS BAR
  ---------------------------------------------------------- */
  const navWrap   = document.querySelector('.nav-wrap');
  const scrollBar = document.getElementById('scrollBar');

  function onScroll() {
    if (!navWrap) return;
    navWrap.classList.toggle('scrolled', window.scrollY > 20);
    if (scrollBar) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollBar.style.width = (docH > 0 ? (window.scrollY / docH) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------
     2. MOBILE NAV TOGGLE
  ---------------------------------------------------------- */
  const navToggle = document.querySelector('.mobile-nav-toggle');
  if (navToggle && navWrap) {
    navToggle.addEventListener('click', () => {
      navWrap.classList.toggle('menu-open');
      const isOpen = navWrap.classList.contains('menu-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.classList.toggle('active', isOpen);
    });
  }

  /* ----------------------------------------------------------
     3. PERSONA / HEADLINE SWITCHER
  ---------------------------------------------------------- */
  const headlineData = {
    '1': {
      h: 'You\'re Either Losing Leads You Already Have, Or Not Getting Enough To Lose. <em>We Fix Both.</em>',
      s: 'One system underneath both. If you\'re already getting inquiries, we catch every one slipping through. If you\'re not getting enough, we go get you more, then catch those too. <strong>All automatic. Zero new software to learn.</strong>'
    },
    '2': {
      h: 'Every Missed Call Is A Customer Your Competitor Just Booked. <em>Every Empty Week Is One We Can Fill.</em>',
      s: 'You don\'t lose jobs because you\'re bad at your trade. You lose them because you missed the call. We text back in 60 seconds — before they dial the next name on Google. <strong>All automatic. Zero new software to learn.</strong>'
    },
    '3': {
      h: 'Got Calls Coming In? We Stop The Leak. Got Nothing Coming In? <em>We Build The Pipe.</em>',
      s: 'No guesswork. No bundled packages. We figure out which problem you actually have — then we fix that one specifically. <strong>All automatic. Zero new software to learn.</strong>'
    }
  };

  const heroH1   = document.getElementById('hero-headline');
  const heroSub  = document.getElementById('hero-subhead');
  const hBtns    = document.querySelectorAll('.headline-btn');

  hBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      hBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const d = headlineData[btn.dataset.headline];
      if (d && heroH1 && heroSub) {
        heroH1.style.opacity = '0';
        heroSub.style.opacity = '0';
        setTimeout(() => {
          heroH1.innerHTML = d.h;
          heroSub.innerHTML = d.s;
          heroH1.style.opacity = '1';
          heroSub.style.opacity = '1';
        }, 180);
      }
    });
  });

  /* ----------------------------------------------------------
     4. VSL VIDEO LIGHTBOX
  ---------------------------------------------------------- */
  const videoModal  = document.getElementById('video-modal');
  const openBtn     = document.getElementById('open-video-btn');
  const closeBtn    = document.getElementById('close-video-btn');
  const vslPoster   = document.getElementById('vslPoster');
  const videoIframe = document.getElementById('video-iframe');

  function openVideoModal(e) {
    if (e) e.preventDefault();
    if (!videoModal) return;
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
    if (videoIframe) {
      const src = videoIframe.src;
      videoIframe.src = '';
      setTimeout(() => { videoIframe.src = src; }, 50);
    }
  }

  if (openBtn)    openBtn.addEventListener('click', openVideoModal);
  if (vslPoster)  vslPoster.addEventListener('click', openVideoModal);
  if (closeBtn)   closeBtn.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', e => { if (e.target === videoModal) closeVideoModal(); });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideoModal(); });

  /* ----------------------------------------------------------
     5. SCROLL-REVEAL
  ---------------------------------------------------------- */
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ----------------------------------------------------------
     6. INIT CALCULATORS ON LOAD
  ---------------------------------------------------------- */
  if (document.getElementById('leak-calls'))  updateLeakCalc();
  if (document.getElementById('growth-spend')) updateGrowthCalc();

  /* ----------------------------------------------------------
     7. BACK TO TOP
  ---------------------------------------------------------- */
  const backTop = document.querySelector('.back-to-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ----------------------------------------------------------
     8. FILTER (case studies, etc.)
  ---------------------------------------------------------- */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const caseCards   = document.querySelectorAll('.case-card-item');
  if (filterBtns.length && caseCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        caseCards.forEach(card => {
          const show = f === 'all' || card.dataset.category === f;
          card.style.display = show ? 'block' : 'none';
        });
      });
    });
  }

}); /* end DOMContentLoaded */

/* ==============================================================
   GLOBAL FUNCTIONS  (called via inline onclick in HTML)
   ============================================================== */

/* ---- FORK PATH SELECTION ---- */
function selectForkPath(path) {
  const cardA = document.getElementById('fork-card-a');
  const cardB = document.getElementById('fork-card-b');
  if (!cardA || !cardB) return;

  if (path === 'A') {
    cardA.classList.add('active');
    cardB.classList.remove('active');
    switchCalcTab('leak');
  } else {
    cardB.classList.add('active');
    cardA.classList.remove('active');
    switchCalcTab('growth');
  }

  const calcSection = document.getElementById('leak');
  if (calcSection) calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---- CALCULATOR TAB SWITCHER ---- */
function switchCalcTab(tab) {
  const tabLeak   = document.getElementById('tab-calc-leak');
  const tabGrowth = document.getElementById('tab-calc-growth');
  const wrapLeak  = document.getElementById('calc-leak-wrapper');
  const wrapGrowth= document.getElementById('calc-growth-wrapper');

  if (!tabLeak || !tabGrowth || !wrapLeak || !wrapGrowth) return;

  if (tab === 'leak') {
    tabLeak.classList.add('active');
    tabGrowth.classList.remove('active');
    wrapLeak.style.display  = 'block';
    wrapGrowth.style.display= 'none';
    updateLeakCalc();
  } else {
    tabGrowth.classList.add('active');
    tabLeak.classList.remove('active');
    wrapGrowth.style.display= 'block';
    wrapLeak.style.display  = 'none';
    updateGrowthCalc();
  }
}

/* ---- LEAK CALCULATOR MATH ---- */
function updateLeakCalc() {
  const callsEl = document.getElementById('leak-calls');
  const valEl   = document.getElementById('leak-value');
  const rateEl  = document.getElementById('leak-rate');
  if (!callsEl || !valEl || !rateEl) return;

  const calls = parseInt(callsEl.value);         // calls/week
  const value = parseInt(valEl.value);           // $ per job
  const rate  = parseInt(rateEl.value) / 100;    // close rate 0-1

  // Display slider values
  _setText('leak-calls-val',  calls);
  _setText('leak-value-val',  '$' + value.toLocaleString());
  _setText('leak-rate-val',   Math.round(rate * 100) + '%');

  // MATH:  missed jobs/month = calls_per_week × 4.33 × close_rate
  //        monthly loss = missed_jobs × avg_value
  const missedJobsPerMonth = calls * 4.33 * rate;
  const monthlyLoss  = Math.round(missedJobsPerMonth * value);
  const annualLoss   = monthlyLoss * 12;

  // Update results
  _setText('leak-result-monthly', '$' + monthlyLoss.toLocaleString());
  const annualEl = document.getElementById('leak-result-annual');
  if (annualEl) {
    annualEl.innerHTML = 'Annual Loss: <b style="color:var(--loss)">' +
      '$' + annualLoss.toLocaleString() + '/yr</b>';
  }

  // Animate the number
  _pulseEl('leak-result-monthly');
}

/* ---- GROWTH CALCULATOR MATH ---- */
function updateGrowthCalc() {
  const spendEl = document.getElementById('growth-spend');
  const cplEl   = document.getElementById('growth-cpl');
  const valEl   = document.getElementById('growth-val');
  if (!spendEl || !cplEl || !valEl) return;

  const spend = parseInt(spendEl.value);   // monthly ad budget
  const cpl   = parseInt(cplEl.value);     // cost per lead
  const val   = parseInt(valEl.value);     // avg customer value

  // Display slider values
  _setText('growth-spend-val', '$' + spend.toLocaleString());
  _setText('growth-cpl-val',   '$' + cpl.toLocaleString());
  _setText('growth-val-val',   '$' + val.toLocaleString());

  // MATH:  leads = budget / CPL
  //        booked = leads × 25% close rate
  //        revenue = booked × avg value
  //        ROI = revenue / spend
  const leads     = Math.floor(spend / cpl);
  const closeRate = 0.25;
  const booked    = Math.round(leads * closeRate);
  const revenue   = booked * val;
  const roi       = spend > 0 ? (revenue / spend).toFixed(1) : 0;

  // Update results
  _setText('growth-result-monthly', '$' + revenue.toLocaleString());

  const leadsEl = document.getElementById('growth-result-leads');
  if (leadsEl) {
    leadsEl.textContent = 'from ~' + booked + ' booked jobs (' + leads + ' leads generated)';
  }

  const roiEl = document.getElementById('growth-result-roi');
  if (roiEl) {
    roiEl.innerHTML = 'ROI: <b style="color:var(--ok)">' + roi + 'x Return on Ad Spend</b>';
  }

  _pulseEl('growth-result-monthly');
}

/* ---- SMS SIMULATOR ---- */
let _smsStep = 0;
const _smsScript = [
  { side: 'incoming',  text: 'Hi, I need a quote for my bathroom — can you come out this week?' },
  { side: 'outgoing',  text: 'Hey! Thanks for reaching out. We\'d love to help. Would Wednesday or Thursday work for a quick visit?' },
  { side: 'incoming',  text: 'Thursday at 10am works great!' },
  { side: 'outgoing',  text: '✓ Confirmed! Thursday at 10am. A reminder will come through the day before. See you then!' },
];

function triggerSMSSimulation() {
  const stream = document.getElementById('sms-stream');
  const btn    = document.querySelector('.sms-trigger-btn');
  if (!stream) return;

  if (_smsStep >= _smsScript.length) {
    // Reset
    _smsStep = 0;
    stream.innerHTML = `
      <div class="sms-bubble incoming">[Missed Call Detected from +1 (555) 234-5678 at 6:14 PM]</div>
      <div class="sms-bubble outgoing">Hi! Thanks for calling Apex Contracting. We're on a job but saw your call — how can we help you today?</div>
    `;
    if (btn) btn.textContent = 'Simulate Customer Reply 💬';
    return;
  }

  const msg = _smsScript[_smsStep];
  const bubble = document.createElement('div');
  bubble.className = 'sms-bubble ' + msg.side;
  bubble.textContent = msg.text;
  bubble.style.opacity = '0';
  bubble.style.transform = 'translateY(10px)';
  stream.appendChild(bubble);
  stream.scrollTop = stream.scrollHeight;

  requestAnimationFrame(() => {
    bubble.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    bubble.style.opacity = '1';
    bubble.style.transform = 'translateY(0)';
  });

  _smsStep++;

  if (_smsStep >= _smsScript.length && btn) {
    btn.textContent = '↺ Reset Simulation';
  }
}

/* ---- FAQ ACCORDION ---- */
function toggleFAQ(questionEl) {
  const item = questionEl.parentElement;
  if (!item) return;

  const isActive = item.classList.contains('active');

  // Close all
  document.querySelectorAll('.faq-dark-item').forEach(i => i.classList.remove('active'));

  // Toggle current (open if was closed)
  if (!isActive) item.classList.add('active');
}

/* ---- HELPERS ---- */
function _setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function _pulseEl(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transition = 'transform 0.15s ease';
  el.style.transform = 'scale(1.05)';
  setTimeout(() => { el.style.transform = 'scale(1)'; }, 150);
}
