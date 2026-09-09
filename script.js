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

// ---------- settings modal demo (marketing mockup) ----------
document.querySelectorAll('.settings-fab').forEach(fab => {
  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    const modal = fab.parentElement.querySelector('.settings-modal');
    if (modal) modal.classList.toggle('open');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.settings-modal.open').forEach(m => m.classList.remove('open'));
});

// ---------- tab switch (Reward Wall / Ads, All Time / AP / UP) ----------
document.querySelectorAll('.tab-switch').forEach(group => {
  const buttons = group.querySelectorAll('button[data-tab]');
  const panelWrap = document.querySelector('[data-tab-panels]') || document;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active', 'ap-active', 'up-active'));
      const kind = btn.dataset.tabColor;
      btn.classList.add('active');
      if (kind) btn.classList.add(kind + '-active');
      const target = btn.dataset.tab;
      panelWrap.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.toggle('active', p.dataset.panel === target);
      });
    });
  });
});

// ---------- ad network popup mock ----------
document.querySelectorAll('[data-open-ad-popup]').forEach(btn => {
  btn.addEventListener('click', () => {
    const overlay = document.querySelector('.ad-popup-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    const timerEl = overlay.querySelector('.ad-popup-timer');
    let t = 14;
    if (timerEl) timerEl.textContent = '0:' + String(t).padStart(2, '0');
    const iv = setInterval(() => {
      t -= 1;
      if (timerEl) timerEl.textContent = '0:' + String(Math.max(t, 0)).padStart(2, '0');
      if (t <= 0) clearInterval(iv);
    }, 1000);
  });
});
document.querySelectorAll('[data-close-ad-popup]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.ad-popup-overlay')?.classList.remove('open');
  });
});

// ---------- ad slot cooldown countdown (demo) ----------
document.querySelectorAll('.watch-btn.cooling[data-cooldown]').forEach(btn => {
  let remaining = parseInt(btn.dataset.cooldown, 10) || 0;
  function fmt(s) {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return h + ':' + m + ':' + sec;
  }
  btn.textContent = fmt(remaining);
  const iv = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      btn.textContent = 'Watch ad';
      btn.classList.remove('cooling');
      clearInterval(iv);
      return;
    }
    btn.textContent = fmt(remaining);
  }, 1000);
});

// ---------- payout box expand ----------
document.querySelectorAll('.payout-head').forEach(head => {
  head.addEventListener('click', () => {
    const box = head.closest('.payout-box');
    box.querySelector('.payout-detail')?.classList.toggle('open');
    box.querySelector('.payout-toggle')?.classList.toggle('open');
  });
});

// ---------- swap MAX button ----------
document.querySelectorAll('.swap-max').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.closest('.swap-row').querySelector('input');
    if (input) input.value = btn.dataset.max || '0';
  });
});

// ---------- network toggle ----------
document.querySelectorAll('.network-toggle').forEach(group => {
  group.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});
