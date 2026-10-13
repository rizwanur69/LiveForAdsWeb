/* ==========================================================
   Live For Ads — site script
   Shared chrome (header/footer/transitions) + per-page logic.
   Pages are selected by <body data-page="...">.
   ========================================================== */
(function () {
  "use strict";
  var S = window.LFA_SITE || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n, d) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d || 0 }); };
  var page = document.body.getAttribute("data-page");

  /* ---------- shared chrome ---------- */
  var NAV = [
    ["index.html", "Home", "home"], ["earn.html", "Earn", "earn"], ["points.html", "Points", "points"],
    ["leaderboard.html", "Leaderboard", "leaderboard"], ["seasons.html", "Seasons", "seasons"],
    ["referral.html", "Referral", "referral"], ["roadmap.html", "Roadmap", "roadmap"], ["whitepaper.html", "Whitepaper", "whitepaper"]
  ];
  var LOGO = '<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#13261f" stroke="rgba(190,255,230,.2)"/><circle cx="25" cy="33" r="14" fill="#f4b43c"/><circle cx="40" cy="33" r="14" fill="#4fe3a3" fill-opacity=".9"/><path d="M25 26v14M19 33h12" stroke="#1b1300" stroke-width="3" stroke-linecap="round"/></svg>';

  function chrome() {
    var b = document.body;
    b.insertAdjacentHTML("afterbegin",
      '<div class="curtain" id="curtain"><b><span></span>Live For Ads</b></div>' +
      '<div class="progress" id="progress"></div><div class="ambient"><i></i><i></i><i></i></div><div class="grain"></div>' +
      '<header class="hdr"><div class="hdr-in"><a class="logo" href="index.html" aria-label="Live For Ads home">' + LOGO + 'Live For Ads</a>' +
      '<nav class="nav" id="nav">' + NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[2] === page ? ' class="on"' : '') + '>' + n[1] + '</a>'; }).join("") + '</nav>' +
      '<a class="btn btn-p btn-s hdr-cta" href="' + (S.telegramApp || "#") + '" target="_blank" rel="noopener">Open in Telegram</a>' +
      '<button class="burger" id="burger" aria-label="Menu"><i></i></button></div></header>');
    b.insertAdjacentHTML("beforeend",
      '<footer class="ftr"><div class="wrap"><div class="ftr-g"><div><a class="logo" href="index.html" style="padding:0">' + LOGO + 'Live For Ads</a>' +
      '<p style="margin-top:16px;font-size:.95rem">Ad-to-Earn Telegram Mini App. Built for and by its community.</p></div>' +
      '<div><h4>Product</h4><a href="earn.html">How to earn</a><a href="points.html">AP &amp; UP points</a><a href="leaderboard.html">Leaderboard</a><a href="referral.html">Referral program</a></div>' +
      '<div><h4>Payouts</h4><a href="seasons.html">Seasons &amp; payouts</a><a href="seasons.html#withdraw">Withdrawal window</a><a href="faq.html">Anti-fraud &amp; FAQ</a></div>' +
      '<div><h4>Project</h4><a href="whitepaper.html">Whitepaper v' + (S.whitepaperVersion || "4.0") + '</a><a href="roadmap.html">Roadmap &amp; LFA token</a><a href="' + (S.telegramChannel || "#") + '" target="_blank" rel="noopener">Telegram channel</a></div></div>' +
      '<small>Disclaimer: This website describes the intended design and mechanics of Live For Ads at its current stage. Features, point values, ratios and timelines may change. AP payouts depend on actual advertising revenue and community size; UP payouts depend on offerwall partner availability. Nothing here is financial or investment advice, and no LFA token exists yet. &copy; Live For Ads.</small></div></footer>' +
      '<div class="toast" id="toast"></div>');

    // burger
    var bg = $("#burger"), nv = $("#nav");
    bg.addEventListener("click", function () { bg.classList.toggle("open"); nv.classList.toggle("open"); });

    // scroll progress
    var pr = $("#progress");
    function onScroll() { var h = document.documentElement; pr.style.transform = "scaleX(" + (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) + ")"; }
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    // page transition curtain
    var cu = $("#curtain");
    requestAnimationFrame(function () { setTimeout(function () { cu.classList.add("out"); }, 120); });
    window.addEventListener("pageshow", function (e) { if (e.persisted) cu.classList.add("out"); });
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || /^(https?:|mailto:|tel:)/.test(href) || reduce) return;
      var u = new URL(a.href, location.href);
      if (u.pathname === location.pathname && u.hash) return;
      e.preventDefault();
      cu.classList.remove("out"); cu.classList.add("in");
      setTimeout(function () { location.href = a.href; }, 460);
    });

    // card spotlight
    document.addEventListener("pointermove", function (e) {
      var c = e.target.closest && e.target.closest(".card");
      if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  }

  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- helpers ---------- */
  function reveal() {
    var els = $$(".rv");
    if (!("IntersectionObserver" in window) || reduce) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (e, i) { e.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(e); });
  }
  function counters() {
    var els = $$("[data-count]"); if (!els.length) return;
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return; io.unobserve(x.target);
        var el = x.target, to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || 0, 10), t0 = performance.now(), d = reduce ? 1 : 1600;
        (function tick(t) { var p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(to * e, dec) + (el.dataset.suffix || ""); if (p < 1) requestAnimationFrame(tick); })(t0);
      });
    }, { threshold: .4 });
    els.forEach(function (e) { io.observe(e); });
  }
  function fillRange(r) { r.style.setProperty("--fill", ((r.value - r.min) / (r.max - r.min) * 100) + "%"); }
  function ranges() { $$("input[type=range]").forEach(function (r) { fillRange(r); r.addEventListener("input", function () { fillRange(r); }); }); }
  function faq() {
    $$(".q").forEach(function (q) {
      q.querySelector("button").addEventListener("click", function () {
        var o = q.classList.contains("open");
        $$(".q.open").forEach(function (x) { x.classList.remove("open"); });
        if (!o) q.classList.add("open");
      });
    });
  }
  var PALETTE = ["#f4b43c", "#4fe3a3", "#ff7b47", "#7cc4ff", "#c79bff", "#ff8fb1", "#b5e86a", "#ffd37a"];
  function colorFor(name) { var h = 0; for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0; return PALETTE[h % PALETTE.length]; }
  function avatar(u, cls) {
    var st = u.avatar ? "background-image:url('" + u.avatar + "')" : "background:" + colorFor(u.name);
    return '<div class="avatar ' + (cls || "") + '" style="' + st + '">' + (u.avatar ? "" : u.name.replace(/[^A-Za-z0-9]/g, "").charAt(0).toUpperCase()) + "</div>";
  }
  function trend(t) { return t === "up" ? '<span class="tr u">▲</span>' : t === "down" ? '<span class="tr d">▼</span>' : ""; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- HOME ---------- */
  function home() {
    // top-3 inside phone from data
    var snap = ((window.LFA_LEADERBOARD || {}).snapshots || [])[0];
    var box = $("#phone-list");
    if (snap && box) {
      box.innerHTML = snap.users.slice(0, 3).map(function (u, i) {
        return '<div class="p-row"><span>' + ["🥇", "🥈", "🥉"][i] + '</span><span class="av" style="background:' + (u.avatar ? "url(" + u.avatar + ") center/cover" : colorFor(u.name)) + '">' + (u.avatar ? "" : esc(u.name.charAt(0))) + '</span>' + esc(u.name) + '<em>' + fmt(u.ap) + ' AP</em></div>';
      }).join("");
    }
    // ticking balances
    var ap = $("#ph-ap"), up = $("#ph-up"), a = 2450, u = 340;
    function paint() { ap.textContent = fmt(a); up.textContent = fmt(u); }
    paint();
    if (!reduce) setInterval(function () { a += 50; if (Math.random() > .6) u += 20; paint(); ap.parentNode.animate([{ transform: "scale(1.06)" }, { transform: "scale(1)" }], 380); }, 2600);

    // phone tilt
    var ph = $(".phone"), st = $(".phone-stage");
    if (ph && !reduce && matchMedia("(hover:hover)").matches) {
      st.addEventListener("pointermove", function (e) {
        var r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        ph.style.transform = "rotateY(" + (-14 + x * 16) + "deg) rotateX(" + (6 - y * 12) + "deg) rotateZ(1.5deg)";
      });
      st.addEventListener("pointerleave", function () { ph.style.transform = ""; });
    }

    // coin rain canvas
    var cv = $("#coins"); if (!cv || reduce) return;
    var cx = cv.getContext("2d"), W, H, P = [], dpr = Math.min(devicePixelRatio || 1, 2);
    function size() { W = cv.width = cv.offsetWidth * dpr; H = cv.height = cv.offsetHeight * dpr; }
    size(); addEventListener("resize", size);
    for (var i = 0; i < 34; i++) P.push({ x: Math.random(), y: Math.random(), r: 2 + Math.random() * 5, v: .0004 + Math.random() * .0009, c: Math.random() > .5 ? "226,150,20" : "20,170,120", o: .2 + Math.random() * .4, ph: Math.random() * 6 });
    (function loop(t) {
      cx.clearRect(0, 0, W, H);
      P.forEach(function (p) {
        p.y -= p.v; if (p.y < -.05) { p.y = 1.05; p.x = Math.random(); }
        var x = (p.x + Math.sin(t / 1800 + p.ph) * .015) * W, y = p.y * H;
        cx.beginPath(); cx.arc(x, y, p.r * dpr, 0, 6.283); cx.fillStyle = "rgba(" + p.c + "," + p.o + ")"; cx.fill();
        cx.beginPath(); cx.arc(x, y, p.r * dpr * 3, 0, 6.283); cx.fillStyle = "rgba(" + p.c + "," + p.o * .12 + ")"; cx.fill();
      });
      requestAnimationFrame(loop);
    })(0);
  }

  /* ---------- EARN ---------- */
  function earn() {
    // streak simulator
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], state = [0, 0, 0, 0, 0, 0, 0], wk = $("#week");
    function pts(n) { return 10 + 5 * n; }
    var cursor = 0;
    wk.addEventListener("click", function (e) {
      var b = e.target.closest(".day"); if (!b) return;
      var d = +b.dataset.d;
      if (d === cursor) { state[d] = 1; cursor++; }
      else if (d > cursor) { for (var i = cursor; i < d; i++) state[i] = 2; state[d] = 1; cursor = d + 1; toast("Missed a day — streak restarts at 10 AP"); }
      drawWeek();
    });
    // missed-day logic: after a miss the streak restarts, so recompute payouts by runs
    function pointsByRuns() {
      var run = 0, total = 0;
      state.forEach(function (s) { if (s === 1) { run++; total += pts(run - 1); } else if (s === 2) run = 0; });
      return total;
    }
    function drawWeek() {
      var run = 0, proj = 0, next = -1, html = "";
      for (var i = 0; i < 7; i++) if (state[i] === 0) { next = i; break; }
      for (var d = 0; d < 7; d++) {
        var cls = "day", val;
        if (state[d] === 1) { run++; proj = run; cls += " done"; val = pts(run - 1); }
        else if (state[d] === 2) { run = 0; proj = 0; cls += " miss"; val = 0; }
        else { val = pts(proj); proj++; if (d === next) cls += " next"; }
        html += '<button class="' + cls + '" data-d="' + d + '"><small>' + days[d] + '</small><b>' + (state[d] === 2 ? "✕" : val) + '</b></button>';
      }
      wk.innerHTML = html; $("#st-total").textContent = fmt(pointsByRuns()); $("#st-streak").textContent = run;
    }
    $("#st-reset").addEventListener("click", function () { state = [0, 0, 0, 0, 0, 0, 0]; cursor = 0; drawWeek(); });
    $("#st-perfect").addEventListener("click", function () { state = [1, 1, 1, 1, 1, 1, 1]; cursor = 7; drawWeek(); });
    drawWeek();

    // reward wall example
    var of = $("#of-in"); function ofc() { $("#of-out").textContent = fmt(Math.round((+of.value || 0) * 100)) + " UP"; } of.addEventListener("input", ofc); ofc();

    // ad slots simulator
    var slots = $$(".slot"), watched = 0, busy = false, apTot = 0, cdT;
    function paintSlots() {
      slots.forEach(function (s, i) {
        s.className = "slot " + (i < watched ? "done" : i === watched && watched < 5 ? "ready" : "lock");
        s.querySelector(".lbl").innerHTML = i < watched ? "✓<small style='display:block'>+50 AP</small>" : i === watched && watched < 5 ? "<b>Watch</b><small>14 s</small>" : "<b>" + (i + 1) + "</b>";
      });
      $("#ad-bar").style.width = (watched / 5 * 100) + "%"; $("#ad-ap").textContent = fmt(apTot);
    }
    function cooldown() {
      var left = 3 * 3600, last = slots[4].querySelector(".lbl"), tick = function () {
        var h = Math.floor(left / 3600), m = Math.floor(left % 3600 / 60), s = left % 60;
        last.innerHTML = "<small>Cooldown</small><b style='font-size:1rem'>" + h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0") + "</b>"; left -= 600 * (reduce ? 1 : 1);
        if (left < 0) { clearInterval(cdT); watched = 0; paintSlots(); }
      };
      tick(); clearInterval(cdT); cdT = setInterval(tick, 120); // sped up ×600 so you can see it
    }
    slots.forEach(function (s, i) {
      s.addEventListener("click", function () {
        if (busy || i !== watched || watched >= 5) return;
        busy = true; var fill = s.querySelector(".fillbg"), t0 = performance.now(), lbl = s.querySelector(".lbl");
        (function f(t) {
          var p = Math.min(1, (t - t0) / 2800); fill.style.height = (p * 100) + "%"; lbl.innerHTML = "<b>" + Math.ceil(14 - p * 14) + "s</b>";
          if (p < 1) requestAnimationFrame(f); else { fill.style.height = 0; watched++; apTot += 50; busy = false; paintSlots(); if (watched === 5) { toast("Batch done · +250 AP · 3-hour cooldown starts"); cooldown(); } }
        })(t0);
      });
    });
    paintSlots();
  }

  /* ---------- POINTS ---------- */
  function points() {
    var rev = $("#c-rev"), tot = $("#c-tot"), my = $("#c-my");
    function calc() {
      var R = +rev.value, T = +tot.value, M = +my.value, rate = R / T, out = rate * M;
      $("#o-rev").textContent = "$" + fmt(R); $("#o-tot").textContent = fmt(T) + " AP"; $("#o-my").textContent = fmt(M) + " AP";
      $("#r-out").textContent = "$" + fmt(out, 2); $("#r-rate").textContent = "$" + rate.toFixed(6); $("#r-share").textContent = (M / T * 100).toFixed(3) + "%";
      $("#r-per1k").textContent = "$" + fmt(rate * 1000, 2);
    }
    [rev, tot, my].forEach(function (r) { r.addEventListener("input", calc); }); calc();
    var upr = $("#u-in"), upMax = $("#u-max");
    function upc() { var v = Math.max(0, +upr.value || 0); $("#u-out").textContent = "$" + fmt(v / 100, 2); }
    upr.addEventListener("input", upc); upMax.addEventListener("click", function () { upr.value = 536; upc(); toast("Max = your whole UP balance"); }); upc();
  }

  /* ---------- LEADERBOARD ---------- */
  function leaderboard() {
    var D = window.LFA_LEADERBOARD, sel = $("#snap"), view = "ap";
    D.snapshots.forEach(function (s, i) { sel.insertAdjacentHTML("beforeend", '<option value="' + i + '">' + esc(s.label) + "</option>"); });
    function render() {
      var s = D.snapshots[+sel.value], users = s.users.slice();
      if (view === "ap") users.sort(function (a, b) { return b.ap - a.ap; }); else users.sort(function (a, b) { return b.up - a.up; });
      var key = view === "ap" ? "ap" : "up", unit = view === "ap" ? "AP" : "UP", max = users[0][key] || 1;
      $("#snap-meta").innerHTML = '<span class="chip mute">' + esc(s.season) + '</span> <span class="chip mute">' + esc(s.view) + " ranking</span> <span class=\"chip mute\">Updated " + esc(s.date) + "</span>";
      var top = users.slice(0, 3), order = [1, 0, 2], cls = ["p1", "", ""], medals = ["👑", "🥈", "🥉"];
      $("#podium").innerHTML = order.map(function (idx) {
        var u = top[idx]; if (!u) return "";
        return '<div class="pod ' + (idx === 0 ? "p1" : "") + '"><span class="medal">' + medals[idx] + "</span>" + avatar(u) + "<h3>" + esc(u.name) + " " + trend(u.trend) + '</h3><div class="pts" style="color:' + (view === "ap" ? "var(--ap-ink)" : "var(--up-ink)") + '">' + fmt(u[key]) + " " + unit + '</div><div class="chips">' + (view === "ap" ? '<span class="chip up">' + fmt(u.up) + " UP</span>" : '<span class="chip ap">' + fmt(u.ap) + " AP</span>") + '<span class="chip hot">🔥 ' + u.streak + "</span></div></div>";
      }).join("");
      $("#rows").innerHTML = users.slice(3).map(function (u, i) {
        return '<div class="lb-row"><div class="rk">' + (i + 4) + "</div>" + avatar(u) + '<div class="nm">' + esc(u.name) + " " + trend(u.trend) + '</div><span class="chip ' + (view === "ap" ? "ap" : "up") + '">' + fmt(u[key]) + " " + unit + '</span><span class="chip ' + (view === "ap" ? "up" : "ap") + '">' + fmt(view === "ap" ? u.up : u.ap) + (view === "ap" ? " UP" : " AP") + '</span><span class="chip hot">🔥 ' + u.streak + '</span><div class="lb-bar"><i data-w="' + (u[key] / max * 100) + '"></i></div></div>';
      }).join("");
      requestAnimationFrame(function () { $$(".lb-bar i").forEach(function (b) { b.style.width = b.dataset.w + "%"; }); });
      // stats
      var sumAp = users.reduce(function (a, u) { return a + u.ap; }, 0), sumUp = users.reduce(function (a, u) { return a + u.up; }, 0), best = Math.max.apply(null, users.map(function (u) { return u.streak; }));
      $("#k-ap").textContent = fmt(sumAp); $("#k-up").textContent = fmt(sumUp); $("#k-usd").textContent = "$" + fmt(sumUp / 100, 2); $("#k-streak").textContent = best + " days";
    }
    $$("#seg button").forEach(function (b) { b.addEventListener("click", function () { $$("#seg button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); view = b.dataset.v; render(); }); });
    sel.addEventListener("change", render); render();
  }

  /* ---------- SEASONS ---------- */
  function mask(w) { return w && w.length > 12 ? w.slice(0, 5) + "••••••••" + w.slice(-5) : w || ""; }
  function seasons() {
    var list = $("#season-list"), money = function (v) { return v == null ? "—" : "$" + fmt(v, 2); };
    list.innerHTML = window.LFA_SEASONS.map(function (s, i) {
      var badge = s.status === "live" ? '<span class="chip up"><span class="dot"></span>Live now</span>' : s.status === "paid" ? '<span class="chip ap">Paid out</span>' : '<span class="chip mute">Upcoming</span>';
      var body;
      if (s.status === "paid") {
        var total = (s.apUsdt || 0) + (s.upUsdt || 0);
        body = '<div class="kpis"><div class="kpi"><small>Participants</small><b>' + fmt(s.participants) + '</b></div><div class="kpi"><small>Total AP</small><b class="ap">' + fmt(s.totalAp) + '</b></div><div class="kpi"><small>AP allocation</small><b>' + money(s.apUsdt) + '</b></div><div class="kpi"><small>Total UP</small><b class="up">' + fmt(s.totalUp) + '</b></div><div class="kpi"><small>UP converted</small><b>' + money(s.upUsdt) + '</b></div><div class="kpi total"><small>Total paid out</small><b>' + money(total) + '</b></div></div>' +
          '<div class="scroll-x"><table class="tbl"><thead><tr><th>User</th><th>Wallet</th><th>USDT withdrawn</th></tr></thead><tbody>' + (s.paid || []).map(function (p) { return "<tr><td>" + esc(p.user) + '</td><td class="wallet">' + esc(mask(p.wallet)) + "</td><td>$" + fmt(p.usdt, 2) + "</td></tr>"; }).join("") + "</tbody></table></div>";
      } else {
        body = '<div class="kpis"><div class="kpi"><small>Participants</small><b>—</b></div><div class="kpi"><small>Total AP</small><b>—</b></div><div class="kpi"><small>AP allocation</small><b>$0.00</b></div><div class="kpi"><small>Total UP</small><b>—</b></div><div class="kpi"><small>UP converted</small><b>—</b></div><div class="kpi total"><small>Total paid out</small><b>—</b></div></div><div class="empty">' + (s.status === "live" ? "This season is running. The payout summary and paid list appear here once the pool is finalised and withdrawals are approved." : "This season hasn’t started yet. Its payout summary will appear here after it closes.") + "</div>";
      }
      return '<div class="card season rv' + (i === 2 ? " open" : "") + '"><button class="season-h" aria-expanded="false"><div><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:8px">' + badge + '<span class="chip mute">' + esc(s.period) + "</span></div><h3>" + esc(s.name) + '</h3><p style="font-size:.95rem">' + esc(s.note || "") + '</p></div><span class="caret">⌄</span></button><div class="season-b"><div><div class="season-in">' + body + '<p class="note">Withdrawal window: ' + esc(s.withdrawal || "—") + "</p></div></div></div></div>";
    }).join("");
    $$(".season-h").forEach(function (h) { h.addEventListener("click", function () { h.parentNode.classList.toggle("open"); }); });

    // countdown to withdrawal window
    var open = new Date(S.nextWindowOpen).getTime(), close = new Date(S.nextWindowClose).getTime();
    function tick() {
      var now = Date.now(), tgt = now < open ? open : close, left = Math.max(0, tgt - now), lbl = now < open ? "Opens in" : now < close ? "Closes in" : "Closed";
      $("#cd-label").textContent = lbl;
      var d = Math.floor(left / 864e5), h = Math.floor(left % 864e5 / 36e5), m = Math.floor(left % 36e5 / 6e4), s = Math.floor(left % 6e4 / 1e3);
      $("#cd-d").textContent = d; $("#cd-h").textContent = String(h).padStart(2, "0"); $("#cd-m").textContent = String(m).padStart(2, "0"); $("#cd-s").textContent = String(s).padStart(2, "0");
    }
    tick(); setInterval(tick, 1000);
  }

  /* ---------- REFERRAL ---------- */
  function referral() {
    var demo = [{ n: "Sample user A", ads: 100, ci: 7 }, { n: "Sample user B", ads: 64, ci: 5 }, { n: "Sample user C", ads: 22, ci: 2 }, { n: "Sample user D", ads: 3, ci: 1 }];
    function colorAt(p) { var h = p < .5 ? 5 + p * 2 * 30 : 35 + (p - .5) * 2 * 90, l = 38 + 4 * p; return "hsl(" + h + ",78%," + l + "%)"; }
    $("#ref-list").innerHTML = demo.map(function (u) {
      var p = (Math.min(u.ads / 100, 1) + Math.min(u.ci / 7, 1)) / 2, ok = u.ads >= 100 && u.ci >= 7, com = Math.round(u.ads * 50 * .1 + u.ci * 15 * .1);
      return `<div class="ref-item"><div><strong>${u.n}</strong><div class="prog"><span>Ads ${Math.min(u.ads, 100)} / 100</span><span>Check-in days ${Math.min(u.ci, 7)} / 7</span></div></div><div class="mid"><small>Commission earned</small><span class="chip ap">${fmt(com)} AP</span></div><div class="st"><span class="chip ${ok ? "up" : "mute"}">${ok ? "Eligible" : "Pending"}</span><div class="pb"><i data-w="${p * 100}" data-c="${colorAt(p)}"></i></div></div></div>`;
    }).join("");
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { $$("#ref-list .pb i").forEach(function (b) { b.style.width = b.dataset.w + "%"; b.style.background = b.dataset.c; }); io.disconnect(); } }); }, { threshold: .3 });
    io.observe($("#ref-list"));

    var n = $("#rf-n"), a = $("#rf-a");
    function calc() {
      var N = +n.value, A = +a.value, bonus = N * 100, com = Math.round(N * A * .1);
      $("#o-n").textContent = N; $("#o-a").textContent = fmt(A) + " AP";
      $("#r-bonus").textContent = fmt(bonus) + " AP"; $("#r-com").textContent = fmt(com) + " AP"; $("#r-tot").textContent = fmt(bonus + com);
    }
    [n, a].forEach(function (r) { r.addEventListener("input", calc); }); calc();
    $("#copy-link").addEventListener("click", function () {
      var t = "Join me on Live For Ads: " + (S.telegramApp || ""); if (navigator.clipboard) navigator.clipboard.writeText(t); toast("Invite text copied");
    });
  }

  /* ---------- WHITEPAPER ---------- */
  function whitepaper() {
    var links = $$(".toc a"), secs = links.map(function (a) { return $(a.getAttribute("href")); });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { links.forEach(function (l) { l.classList.toggle("on", l.getAttribute("href") === "#" + x.target.id); }); } });
    }, { rootMargin: "-20% 0px -70% 0px" });
    secs.forEach(function (s) { if (s) io.observe(s); });
  }

  /* ---------- boot ---------- */
  chrome();
  ({ home: home, earn: earn, points: points, leaderboard: leaderboard, seasons: seasons, referral: referral, whitepaper: whitepaper }[page] || function () {})();
  ranges(); faq(); counters(); reveal();
})();
