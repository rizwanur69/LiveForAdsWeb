// ---------- mobile nav ----------
const navToggle = document.querySelector('.navtoggle');
const navLinks = document.querySelector('.navlinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const expanded = navLinks.classList.contains('open');
    navToggle.setAttribute('aria-expanded', expanded);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ---------- scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ---------- count-up numbers ----------
// usage: <b class="count" data-to="128450" data-prefix="" data-suffix=""></b>
function animateCount(el) {
  const to = parseFloat(el.dataset.to || '0');
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const dur = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = to * eased;
    el.textContent = prefix + val.toLocaleString(undefined, {
      minimumFractionDigits: decimals, maximumFractionDigits: decimals
    }) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countEls = document.querySelectorAll('.count');
if ('IntersectionObserver' in window && countEls.length) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        cio.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  countEls.forEach(el => cio.observe(el));
} else {
  countEls.forEach(animateCount);
}

// ---------- orb status pulse (no fake numbers — just a gentle live-status blink) ----------
const orbStatusDot = document.querySelector('.orb-core .status-dot');
if (orbStatusDot) {
  orbStatusDot.classList.add('is-live');
}
