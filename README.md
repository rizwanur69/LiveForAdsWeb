# Live For Ads — website

Static multi-page site (no build step). Works on GitHub Pages as-is.

## Deploy on GitHub Pages
1. Create a repo and upload everything in this folder (keep the folder structure).
2. Repo → Settings → Pages → Source: "Deploy from a branch" → `main` / root.
3. Open the URL GitHub gives you.

## First-time setup
Edit `data/site.js`: set `telegramApp`, `telegramChannel`, and `nextWindowOpen` / `nextWindowClose`.

## Weekly update (leaderboard)
Edit `data/leaderboard.js`: copy the newest block inside `snapshots`, paste it **above** the old one, change `id`, `label`, `date` and the users.
Photos: crop each profile picture square (about 256px), save it in `assets/avatars/`, and point `avatar:` to it.

## Per-season update (payouts)
Edit `data/seasons.js`: set `status: "paid"` and fill participants, totalAp, apUsdt, totalUp, upUsdt and the `paid` list. Wallets are masked automatically (first 5 + last 5 characters).

## Pages
index · earn · points · leaderboard · seasons · referral · roadmap · whitepaper · faq · 404
Shared look: `css/style.css`. Shared header/footer/animations: `js/main.js`.

## Live data from the Admin Panel (auto-update)
`data/live.js` reads the public backend API (season name, withdraw window, season payout boxes, leaderboard, notices)
and fills the pages automatically. Nothing to edit weekly any more. If the backend is down, the static files
(`site.js`, `seasons.js`, `leaderboard.js`) are shown instead, so keep them as a fallback.
Options (top of `data/live.js`): `api`, `topN`, `maskNames`, `refreshMs`.
Never put an admin token in this repo.
