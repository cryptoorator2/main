# Crypto Orator: GitHub Pages deployment

Static site, no build step and no backend. Files: `index.html`, `blog.html`, `css/style.css`, `js/main.js`, `assets/logo.svg`, `bg.jpg`, `CNAME`.

## Deploy
1. **Create a repository** at github.com/new (for example `cryptoorator`, public).
2. **Upload files:** open the repository, choose *Add file → Upload files*, drag in the *contents* of this folder (keep the `css`, `js`, `assets` folders and `CNAME`), then commit.
3. **Enable Pages:** *Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save*.
4. **Custom domain:** in *Settings → Pages → Custom domain* enter `cryptoorator.com`. At your DNS provider add four `A` records for the apex domain (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and a `CNAME` record `www → <your-username>.github.io`.
5. **HTTPS:** once DNS has propagated (minutes to a few hours), tick *Enforce HTTPS*.

## Market data: read this
Exness has no public, key-free browser API, and putting a broker/API token in client-side code would expose it. The ticker therefore does **not** show Exness quotes and says so on screen.
- XAU/USD, US Oil, Nasdaq, BTC/USD: Binance public USDⓈ-M perpetual tickers (`XAUUSDT`, `CLUSDT`, `QQQUSDT`, `BTCUSDT`), USDT-quoted, last price and 24h change. Nasdaq uses the QQQ (Nasdaq-100 ETF) perpetual as a proxy, not the index.
- EUR/USD: ECB daily reference rate (Frankfurter), delayed, no bid/ask.
- If a request fails the item shows "Data Unavailable". No fake prices are ever inserted.
- Exact Exness prices would need a small server or serverless proxy holding a secret. Check Binance and Frankfurter usage terms before relying on this commercially.
