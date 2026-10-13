/* ==========================================================
   LEADERBOARD DATA — update every week
   ----------------------------------------------------------
   1. Copy the newest block inside "snapshots" and paste it
      ABOVE the old one (newest first).
   2. Change id / label / date and the numbers.
   3. Photos live in assets/avatars/ (see AV below).
      Optional per user:  trend: "up" | "down"
   Names can be shortened (e.g. "M...") exactly like the app.
   ========================================================== */
var AV = {
  rizwanur: "assets/avatars/rizwanur.jpg",
  rai:      "assets/avatars/rai.jpg",
  akhi:     "assets/avatars/akhi.jpg",
  m:  "assets/avatars/u-m.jpg",
  n:  "assets/avatars/u-n.jpg",
  s1: "assets/avatars/u-s1.jpg",
  j:  "assets/avatars/u-j.jpg",
  y:  "assets/avatars/u-y.jpg",
  a:  "assets/avatars/u-a.jpg",
  s2: "assets/avatars/u-s2.jpg"
};

window.LFA_LEADERBOARD = {
  snapshots: [
    {
      id: "2026-10-13",
      label: "Update: Oct 13, 2026",
      date: "2026-10-13",
      season: "Testing Season",
      view: "All Time",
      users: [
        { name: "RIzwanUR", ap: 5970, up: 536, streak: 40, avatar: AV.rizwanur },
        { name: "RAI",      ap: 1665, up: 0,   streak: 1,  avatar: AV.rai },
        { name: "Akhi",     ap: 1165, up: 464, streak: 1,  avatar: AV.akhi },
        { name: "M...",     ap: 1145, up: 92,  streak: 1,  avatar: AV.m },
        { name: "N...",     ap: 965,  up: 89,  streak: 1,  avatar: AV.n },
        { name: "S...",     ap: 965,  up: 109, streak: 1,  avatar: AV.s1 },
        { name: "J...",     ap: 905,  up: 172, streak: 1,  avatar: AV.j },
        { name: "Y...",     ap: 875,  up: 108, streak: 1,  avatar: AV.y },
        { name: "A...",     ap: 865,  up: 101, streak: 1,  avatar: AV.a },
        { name: "S...",     ap: 805,  up: 156, streak: 1,  avatar: AV.s2 }
      ]
    },
    {
      id: "2026-10-12",
      label: "Week of Oct 12, 2026",
      date: "2026-10-12",
      season: "Testing Season",
      view: "All Time",
      users: [
        { name: "RIzwanUR", ap: 5765, up: 536, streak: 39, avatar: AV.rizwanur },
        { name: "RAI",      ap: 1665, up: 0,   streak: 1,  avatar: AV.rai },
        { name: "Akhi",     ap: 1165, up: 464, streak: 1,  avatar: AV.akhi },
        { name: "M...",     ap: 1145, up: 92,  streak: 1,  avatar: AV.m },
        { name: "N...",     ap: 965,  up: 89,  streak: 1,  avatar: AV.n },
        { name: "S...",     ap: 965,  up: 109, streak: 1,  avatar: AV.s1 },
        { name: "J...",     ap: 905,  up: 172, streak: 1,  avatar: AV.j },
        { name: "Y...",     ap: 875,  up: 108, streak: 1,  avatar: AV.y },
        { name: "A...",     ap: 865,  up: 101, streak: 1,  avatar: AV.a },
        { name: "S...",     ap: 805,  up: 156, streak: 1,  avatar: AV.s2 }
      ]
    }
  ]
};
