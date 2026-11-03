/* ==========================================================
   LIVE DATA — pulls season / leaderboard / notices from the
   Live For Ads backend, which the Admin Panel controls.
   If the backend is slow or down, the site falls back to the
   static data in site.js / seasons.js / leaderboard.js.
   Only PUBLIC endpoints are used here. Never put an admin
   token in this file.
   ========================================================== */
(function () {
  "use strict";
  var CFG = window.LFA_LIVE = Object.assign({
    api: "https://liveforadsbot-backend.onrender.com/api",
    timeoutMs: 12000,      // backend on free hosting can be slow to wake up
    topN: 10,              // how many leaderboard rows to show
    maskNames: true,       // "Rizwan" -> "R..."   (set false to show full names)
    refreshMs: 60000       // re-fetch every 60s (notices + stats only; page reload for the rest)
  }, window.LFA_LIVE || {});

  var page = document.body.getAttribute("data-page");
  var S = window.LFA_SITE = window.LFA_SITE || {};

  function get(path, ms) {
    var ctl = ("AbortController" in window) ? new AbortController() : null;
    var t = ctl ? setTimeout(function () { ctl.abort(); }, ms || CFG.timeoutMs) : null;
    return fetch(CFG.api + path, ctl ? { signal: ctl.signal } : {}).then(function (r) {
      if (t) clearTimeout(t);
      if (!r.ok) throw new Error(path + " " + r.status);
      return r.json();
    });
  }
  function safe(p) { return p.then(function (v) { return { ok: true, v: v }; }, function () { return { ok: false }; }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function maskName(n) { n = String(n || "User").trim(); return CFG.maskNames && n.length > 1 ? n.charAt(0) + "..." : n; }
  function prettyDate(d) { return d ? String(d).slice(0, 10) : ""; }

  /* ---------- settings -> site.js values ---------- */
  function applySettings(st) {
    if (!st) return;
    if (st.seasonName) S.currentSeason = st.seasonName;
    var span = (Date.parse(S.nextWindowClose) - Date.parse(S.nextWindowOpen));
    if (!(span > 0)) span = 2 * 864e5 - 6 * 36e5;
    if (st.windowClosesAt) {                       // window is open right now
      S.nextWindowOpen = st.serverNow || new Date().toISOString();
      S.nextWindowClose = st.windowClosesAt;
    } else if (st.nextWindowOpensAt) {             // next window
      S.nextWindowOpen = st.nextWindowOpensAt;
      S.nextWindowClose = new Date(Date.parse(st.nextWindowOpensAt) + span).toISOString();
    }
    S.withdrawNotice = st.withdrawNotice || "";
    S.withdrawOpen = !!(st.withdrawOpen || st.withdrawWindowOpen);
  }

  /* ---------- season boxes -> seasons.js ---------- */
  function mapBox(b, staticByName, parts) {
    var st = staticByName[(b.seasonName || "").toLowerCase()] || {};
    var status = b.status === "active" ? "live" : (b.status === "ended" || b.status === "legacy") ? "paid" : "upcoming";
    var o = {
      id: b.id, name: b.seasonName || "Season", status: status,
      period: (b.startDate && b.endDate) ? prettyDate(b.startDate) + " → " + prettyDate(b.endDate) : (st.period || ""),
      note: st.note || "",
      withdrawal: st.withdrawal || (status === "live" ? "Opens after the season closes" : "")
    };
    if (status === "paid") {
      o.participants = b.totalUsers || b.participants || 0;   // total users of that season
      o.totalAp = b.totalPointsEarned || 0;
      o.apUsdt = b.apAllocation || 0;
      o.totalUp = b.totalUp || 0;
      o.upUsdt = b.totalUpUsdt || 0;
      o.paid = (parts || []).map(function (p) { return { user: p.name || "User", wallet: p.maskedAddress || "", usdt: p.totalUsdt || 0 }; });
    } else {
      o.participants = null; o.totalAp = null; o.apUsdt = null; o.totalUp = null; o.upUsdt = null; o.paid = [];
    }
    return o;
  }
  function applySeasons(boxes, partsById) {
    if (!boxes || !boxes.length) return;
    var staticList = window.LFA_SEASONS || [], staticByName = {}, liveByName = {};
    staticList.forEach(function (s) { staticByName[s.name.toLowerCase()] = s; });
    var mapped = boxes.map(function (b) { var m = mapBox(b, staticByName, partsById[b.id]); liveByName[m.name.toLowerCase()] = m; return m; });
    // live ones replace static ones with the same name; static-only ones (future seasons) stay
    var rest = staticList.filter(function (s) { return !liveByName[s.name.toLowerCase()]; });
    var rank = { upcoming: 0, live: 1, paid: 2 };
    window.LFA_SEASONS = rest.concat(mapped).sort(function (a, b) { return rank[a.status] - rank[b.status]; });
    // the seasons page opens the 3rd card by default; make it the live one if there is one
  }

  /* ---------- leaderboard -> leaderboard.js ---------- */
  function avatarOf(r) {
    if (r.avatarUrl) return r.avatarUrl;
    if (r.hasTelegramAvatar && r.tgId) return CFG.api + "/avatar/" + encodeURIComponent(r.tgId);
    return null;
  }
  function snapFrom(res, label, season, view) {
    if (!res || !res.top || !res.top.length) return null;
    var today = new Date().toISOString().slice(0, 10);
    return {
      id: "live-" + view.replace(/\W+/g, "").toLowerCase(), label: label, date: today, season: season, view: view,
      users: res.top.slice(0, CFG.topN).map(function (r) {
        return { name: maskName(r.name), ap: r.points || 0, up: r.up || 0, streak: r.streak || 0, avatar: avatarOf(r) };   // tgId is never exposed
      })
    };
  }
  function applyLeaderboard(all, cur, seasonName) {
    var live = [snapFrom(all, "Live · All Time", seasonName || S.currentSeason || "", "All Time"),
                snapFrom(cur, "Live · This Season", (cur && cur.seasonName) || seasonName || S.currentSeason || "", "Current Season")].filter(Boolean);
    if (!live.length) return;
    var old = (window.LFA_LEADERBOARD && window.LFA_LEADERBOARD.snapshots) || [];
    window.LFA_LEADERBOARD = { snapshots: live.concat(old) };      // old weekly snapshots stay as history
  }

  /* ---------- notices (rendered into #lfa-notices if the page has it) ---------- */
  var TYPE_ICON = { manual: "📢", season: "🏆", payout: "💸", withdraw: "💸", update: "🛠️" };
  function renderNotices(list) {
    var box = document.getElementById("lfa-notices");
    if (!box) return;
    if (!list || !list.length) { box.innerHTML = '<div class="card"><p>No notices right now.</p></div>'; return; }
    box.innerHTML = list.slice(0, 6).map(function (n) {
      return '<div class="card rv in"><h3>' + (TYPE_ICON[n.type] || "📢") + " " + esc(n.title) + '</h3><p>' + esc(n.body) +
             '</p><small class="mute">' + esc(prettyDate(n.createdAt)) + "</small></div>";
    }).join("");
  }
  function renderBanner() {
    var host = document.getElementById("lfa-banner");
    if (host && S.withdrawNotice) { host.hidden = false; host.textContent = S.withdrawNotice; }
    document.querySelectorAll("[data-live='season']").forEach(function (el) { el.textContent = S.currentSeason || ""; });
  }
  function renderStats(ps) {
    if (!ps) return;
    document.querySelectorAll("[data-live-stat]").forEach(function (el) {
      var v = ps[el.getAttribute("data-live-stat")];
      if (v != null && !isNaN(v)) el.textContent = Number(v).toLocaleString("en-US");
    });
  }

  /* ---------- main load (main.js waits for this) ---------- */
  var cached = {};
  window.LFA_READY = Promise.all([
    safe(get("/settings")), safe(get("/season-boxes")), safe(get("/leaderboard/0?scope=all")),
    safe(get("/leaderboard/0?scope=current")), safe(get("/notices")), safe(get("/public-stats"))
  ]).then(function (r) {
    var settings = r[0].ok ? r[0].v : null, boxes = r[1].ok ? r[1].v : null;
    window.LFA_LIVE_OK = r.some(function (x) { return x.ok; });
    applySettings(settings);
    cached.notices = r[4].ok ? r[4].v : null; cached.stats = r[5].ok ? r[5].v : null;
    applyLeaderboard(r[2].ok ? r[2].v : null, r[3].ok ? r[3].v : null, settings && settings.seasonName);
    // payout lists for finished seasons (only needed on the seasons page)
    var need = (page === "seasons" && boxes) ? boxes.filter(function (b) { return b.status !== "active"; }) : [];
    return Promise.all(need.map(function (b) {
      return safe(get("/season-boxes/" + encodeURIComponent(b.id) + "/participants")).then(function (p) { return [b.id, p.ok ? p.v : []]; });
    })).then(function (pairs) {
      var map = {}; pairs.forEach(function (p) { map[p[0]] = p[1]; });
      applySeasons(boxes, map);
    });
  }).catch(function () { /* fall back to static data */ }).then(function () {
    document.addEventListener("DOMContentLoaded", paint);
    if (document.readyState !== "loading") paint();
    // page was already drawn with static data (slow backend) -> reload once to show live data
    if (window.LFA_STATIC_BOOT && window.LFA_LIVE_OK && !sessionStorage.getItem("lfaReloaded")) {
      try { sessionStorage.setItem("lfaReloaded", "1"); location.reload(); } catch (e) {}
    }
  });

  function paint() { renderBanner(); renderNotices(cached.notices); renderStats(cached.stats); }

  // light auto-refresh for notices / stats while the page stays open
  if (CFG.refreshMs) setInterval(function () {
    safe(get("/notices")).then(function (n) { if (n.ok) { cached.notices = n.v; renderNotices(n.v); } });
    safe(get("/public-stats")).then(function (n) { if (n.ok) { cached.stats = n.v; renderStats(n.v); } });
  }, CFG.refreshMs);
})();
