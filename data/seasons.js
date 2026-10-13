/* ==========================================================
   SEASON PAYOUT DATA — update after every season is paid
   ----------------------------------------------------------
   status: "live" | "upcoming" | "paid"
   For a paid season fill: participants, totalAp, apUsdt,
   totalUp, upUsdt  (combined total is calculated for you)
   and the paid list:  { user, wallet, usdt }
   Wallets are masked automatically (first 5 + last 5 chars).
   ========================================================== */
window.LFA_SEASONS = [
  {
    id: "s1",
    name: "Season 1",
    period: "January onward",
    status: "upcoming",
    note: "Full public rollout and community growth push.",
    withdrawal: "Jan 1, 6:00 AM UTC – Jan 2, 11:59 PM UTC"
  },
  {
    id: "s0",
    name: "Season 0",
    period: "November – December",
    status: "upcoming",
    note: "First live season and the first AP pool distribution.",
    withdrawal: "Nov 1, 6:00 AM UTC – Nov 2, 11:59 PM UTC (window follows the season calendar)"
  },
  {
    id: "test",
    name: "Testing Season",
    period: "September – October",
    status: "live",
    note: "Check-in streaks, the Earn page, tasks and the Leaderboard are live for feedback and bug fixes.",
    withdrawal: "Opens after the season closes",
    participants: null, totalAp: null, apUsdt: null, totalUp: null, upUsdt: null,
    paid: []
  }
  /* ---- EXAMPLE of a finished season (copy, fill, remove the comment) ----
  {
    id: "test", name: "Testing Season", period: "September – October", status: "paid",
    participants: 1240, totalAp: 2400000, apUsdt: 310.5, totalUp: 52000, upUsdt: 520,
    paid: [ { user: "@username", wallet: "0x1234567890abcdef1234567890abcdef12345678", usdt: 14.2 } ]
  }
  ------------------------------------------------------------------------ */
];
