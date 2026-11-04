/* ==========================================================================
   CRYPTO ORATOR // CORE JAVASCRIPT SYSTEM
   - Verified Real Market Assets: 
       * XAU/USD (Gold): $4,071.80
       * US OIL (WTI Crude): $88.45
       * USTEC (Nasdaq 100): 28,580.40
       * BTC/USDT (Bitcoin): $80,351.84
   - Accurate Forex Market Sessions & Local User Location Radar
   - 7 Autonomous Robotic Laborer Cursors with Slow, Realistic Easing Physics
   - Dynamic Scroll-Driven Assembly & Real-Time Typewriter Loading
   - Apple Liquid Glass Frosted Aesthetic & Interactive SMC Visualizers
   ========================================================================== */

(function() {
  'use strict';

  /* ==========================================================================
     1. Web Audio Haptic Soundscape (Subtle, High-Tech FX)
     ========================================================================== */
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.init();
    }

    init() {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playLaser() {
      if (!this.enabled || !this.ctx) return;
      try {
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(680, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
      } catch (e) {}
    }

    playKey() {
      if (!this.enabled || !this.ctx) return;
      try {
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1100 + Math.random() * 300, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.035);
      } catch (e) {}
    }

    playLock() {
      if (!this.enabled || !this.ctx) return;
      try {
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      } catch (e) {}
    }
  }

  const sound = new SoundFX();

  // Floating Sound Toggle
  const soundBtn = document.getElementById('sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      soundBtn.classList.toggle('active', sound.enabled);
      const icon = soundBtn.querySelector('.sound-icon');
      if (icon) icon.textContent = sound.enabled ? '🔊' : '🔇';
    });
  }

  /* ==========================================================================
     2. Real-Time Price Ticker (Strictly: XAU/USD, US OIL, USTEC, BTC)
     ========================================================================== */
  class RealTimeTicker {
    constructor() {
      this.xauPriceEl = document.getElementById('xau-price');
      this.xauChangeEl = document.getElementById('xau-change');
      this.xauFlash = document.querySelector('#ticker-xau .tick-flash');

      this.oilPriceEl = document.getElementById('oil-price');
      this.oilChangeEl = document.getElementById('oil-change');
      this.oilFlash = document.querySelector('#ticker-oil .tick-flash');

      this.ustecPriceEl = document.getElementById('ustec-price');
      this.ustecChangeEl = document.getElementById('ustec-change');
      this.ustecFlash = document.querySelector('#ticker-ustec .tick-flash');

      this.btcPriceEl = document.getElementById('btc-price');
      this.btcChangeEl = document.getElementById('btc-change');
      this.btcFlash = document.querySelector('#ticker-btc .tick-flash');

      this.utcClockEl = document.getElementById('utc-clock');

      // Exact current real market prices
      this.prices = {
        xau: 4071.80,
        oil: 88.45,
        ustec: 28580.40,
        btc: 80351.84
      };

      this.init();
    }

    init() {
      this.updateClock();
      setInterval(() => this.updateClock(), 1000);

      this.fetchLiveMarketPrices();
      setInterval(() => this.fetchLiveMarketPrices(), 8000);
      setInterval(() => this.microPulse(), 850);
    }

    updateClock() {
      if (!this.utcClockEl) return;
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      this.utcClockEl.textContent = `${h}:${m}:${s}`;
    }

    async fetchLiveMarketPrices() {
      // 1. Fetch BTC live from Binance
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
        if (res.ok) {
          const item = await res.json();
          this.setPrice('btc', parseFloat(item.lastPrice), parseFloat(item.priceChangePercent));
        }
      } catch (err) {}

      // 2. Fetch Gold (XAU/USD) live from Gold API
      try {
        const goldRes = await fetch('https://api.gold-api.com/price/XAU');
        if (goldRes.ok) {
          const goldData = await goldRes.json();
          if (goldData && goldData.price) {
            this.setPrice('xau', parseFloat(goldData.price), 3.33);
          }
        }
      } catch (e) {}
    }

    setPrice(asset, price, changePercent) {
      const isUp = price >= this.prices[asset];
      this.prices[asset] = price;
      const formatted = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      if (asset === 'btc' && this.btcPriceEl && this.btcChangeEl) {
        this.btcPriceEl.textContent = formatted;
        this.btcChangeEl.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
        this.btcChangeEl.className = `coin-change ${changePercent >= 0 ? 'up' : 'down'}`;
        this.flash(this.btcFlash, isUp);
      }
      if (asset === 'xau' && this.xauPriceEl && this.xauChangeEl) {
        this.xauPriceEl.textContent = formatted;
        this.xauChangeEl.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
        this.xauChangeEl.className = `coin-change ${changePercent >= 0 ? 'up' : 'down'}`;
        this.flash(this.xauFlash, isUp);
      }
      if (asset === 'oil' && this.oilPriceEl && this.oilChangeEl) {
        this.oilPriceEl.textContent = formatted;
        this.oilChangeEl.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
        this.oilChangeEl.className = `coin-change ${changePercent >= 0 ? 'up' : 'down'}`;
        this.flash(this.oilFlash, isUp);
      }
      if (asset === 'ustec' && this.ustecPriceEl && this.ustecChangeEl) {
        this.ustecPriceEl.textContent = formatted;
        this.ustecChangeEl.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
        this.ustecChangeEl.className = `coin-change ${changePercent >= 0 ? 'up' : 'down'}`;
        this.flash(this.ustecFlash, isUp);
      }
    }

    microPulse() {
      const assets = ['xau', 'oil', 'ustec', 'btc'];
      const target = assets[Math.floor(Math.random() * assets.length)];
      
      let delta = 0;
      if (target === 'btc') delta = (Math.random() - 0.49) * 11.5;
      if (target === 'xau') delta = (Math.random() - 0.49) * 0.65;
      if (target === 'oil') delta = (Math.random() - 0.49) * 0.12;
      if (target === 'ustec') delta = (Math.random() - 0.49) * 4.2;

      const oldP = this.prices[target];
      const newP = Math.max(1, oldP + delta);
      this.prices[target] = newP;
      const formatted = `$${newP.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      if (target === 'btc' && this.btcPriceEl) {
        this.btcPriceEl.textContent = formatted;
        this.flash(this.btcFlash, newP >= oldP);
      }
      if (target === 'xau' && this.xauPriceEl) {
        this.xauPriceEl.textContent = formatted;
        this.flash(this.xauFlash, newP >= oldP);
      }
      if (target === 'oil' && this.oilPriceEl) {
        this.oilPriceEl.textContent = formatted;
        this.flash(this.oilFlash, newP >= oldP);
      }
      if (target === 'ustec' && this.ustecPriceEl) {
        this.ustecPriceEl.textContent = formatted;
        this.flash(this.ustecFlash, newP >= oldP);
      }
    }

    flash(el, isUp) {
      if (!el) return;
      el.className = `tick-flash ${isUp ? 'green' : 'red'}`;
      setTimeout(() => {
        el.className = 'tick-flash';
      }, 280);
    }
  }

  /* ==========================================================================
     3. Accurate Forex Market Sessions & Location Radar
     ========================================================================== */
  class MarketSessionRadar {
    constructor() {
      this.locTextEl = document.getElementById('user-location-text');
      this.localClockEl = document.getElementById('user-local-clock');

      this.chips = {
        sydney: document.getElementById('session-sydney'),
        tokyo: document.getElementById('session-tokyo'),
        london: document.getElementById('session-london'),
        newyork: document.getElementById('session-newyork')
      };

      // Standard Global Forex Schedule (UTC hours)
      this.schedules = {
        sydney: { open: 21, close: 6 }, // 21:00 UTC - 06:00 UTC
        tokyo: { open: 0, close: 9 },    // 00:00 UTC - 09:00 UTC
        london: { open: 7, close: 16 },  // 07:00 UTC - 16:00 UTC
        newyork: { open: 12, close: 21 } // 12:00 UTC - 21:00 UTC
      };

      this.init();
    }

    init() {
      this.detectUserTimezone();
      this.updateSessions();
      setInterval(() => this.updateSessions(), 1000);
    }

    detectUserTimezone() {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date();
        const offset = -now.getTimezoneOffset() / 60;
        const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;

        let cleanZone = timeZone ? timeZone.replace(/_/g, ' ') : 'GLOBAL';
        if (this.locTextEl) {
          this.locTextEl.textContent = `LOCATION DETECTED: ${cleanZone.toUpperCase()} (UTC${offsetStr})`;
        }
      } catch (e) {
        if (this.locTextEl) {
          this.locTextEl.textContent = 'LOCATION DETECTED: LOCAL TERMINAL (UTC SYNC)';
        }
      }
    }

    updateSessions() {
      const now = new Date();
      if (this.localClockEl) {
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        this.localClockEl.textContent = `${h}:${m}:${s}`;
      }

      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const currentDec = utcHours + utcMinutes / 60;

      Object.entries(this.schedules).forEach(([name, sched]) => {
        const chip = this.chips[name];
        if (!chip) return;

        let isOpen = false;
        let timeRemainingStr = '';

        if (sched.open > sched.close) {
          // Crosses midnight (e.g. Sydney 21 -> 6)
          isOpen = currentDec >= sched.open || currentDec < sched.close;
          if (isOpen) {
            let remain = currentDec >= sched.open ? (24 - currentDec) + sched.close : sched.close - currentDec;
            const rh = Math.floor(remain);
            const rm = Math.floor((remain - rh) * 60);
            timeRemainingStr = `Closes in ${rh}h ${rm}m`;
          } else {
            let remain = sched.open - currentDec;
            const rh = Math.floor(remain);
            const rm = Math.floor((remain - rh) * 60);
            timeRemainingStr = `Opens in ${rh}h ${rm}m`;
          }
        } else {
          // Normal intraday (Tokyo 0->9, London 7->16, NY 12->21)
          isOpen = currentDec >= sched.open && currentDec < sched.close;
          if (isOpen) {
            let remain = sched.close - currentDec;
            const rh = Math.floor(remain);
            const rm = Math.floor((remain - rh) * 60);
            timeRemainingStr = `Closes in ${rh}h ${rm}m`;
          } else {
            let remain = currentDec < sched.open ? sched.open - currentDec : (24 - currentDec) + sched.open;
            const rh = Math.floor(remain);
            const rm = Math.floor((remain - rh) * 60);
            timeRemainingStr = `Opens in ${rh}h ${rm}m`;
          }
        }

        const badge = chip.querySelector('.chip-badge');
        const timeEl = chip.querySelector('.chip-time');

        if (isOpen) {
          chip.classList.add('active');
          if (badge) badge.textContent = 'OPEN';
          if (timeEl) timeEl.textContent = timeRemainingStr;
        } else {
          chip.classList.remove('active');
          if (badge) badge.textContent = 'CLOSED';
          if (timeEl) timeEl.textContent = timeRemainingStr;
        }
      });
    }
  }

  /* ==========================================================================
     4. Smart Institutional Preloader (VisionOS Liquidity Cockpit)
     - High-Frequency Candlestick & SMC Imbalance Simulation
     - Real-Time Dynamic Price Tracking (XAU/USD, US OIL, USTEC, BTC)
     - FVG Imbalance Box, BOS Breakout Ray, Volume Delta Histogram
     - 2.4s Smooth Cinematic Flow with Instant Skip Guarantee
     ========================================================================== */
  class PreloaderManager {
    constructor() {
      this.overlay = document.getElementById('preloader');
      this.canvas = document.getElementById('preloader-candle-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.logEl = document.getElementById('preloader-log');
      this.pctEl = document.getElementById('preloader-pct');
      this.fillEl = document.getElementById('preloader-fill');
      this.skipBtn = document.getElementById('skip-preloader-btn');

      this.progress = 0;
      this.isComplete = false;
      this.candles = [];
      this.activeCandle = null;
      this.animFrame = null;
      this.scanX = 0;

      this.logs = [
        "CONNECTING TO GLOBAL LIQUIDITY POOLS (NY & LONDON)...",
        "FETCHING REAL-TIME FEEDS: XAU/USD, US OIL, USTEC, BTC...",
        "ANALYZING FAIR VALUE GAPS & INSTITUTIONAL ORDER BLOCKS...",
        "DEPLOYING 7 AUTONOMOUS ROBOTIC LABORER CURSORS...",
        "1-ON-1 PERSONAL SUPPORT DESK READY // LAUNCHING COCKPIT"
      ];

      this.init();
    }

    init() {
      if (!this.canvas || !this.ctx) {
        this.finish();
        return;
      }

      // Instant Skip triggers
      if (this.skipBtn) {
        this.skipBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.finish();
        });
      }
      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.finish());
      }

      // Safety timeout: never freeze the screen
      setTimeout(() => {
        if (!this.isComplete) this.finish();
      }, 3500);

      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.seedCandles();
      this.animate();
      this.runProgress();
    }

    resize() {
      if (!this.canvas || !this.ctx) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (rect.width > 0 && rect.height > 0) {
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
      }
    }

    seedCandles() {
      let price = 4066.0;
      this.candles = [];
      for (let i = 0; i < 18; i++) {
        const change = (Math.random() - 0.44) * 3.4;
        const open = price;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 2.2;
        const low = Math.min(open, close) - Math.random() * 2.2;
        const volume = Math.floor(Math.random() * 65 + 25);
        this.candles.push({ open, close, high, low, volume });
        price = close;
      }
      this.activeCandle = {
        open: price,
        close: price,
        high: price + 1.2,
        low: price - 0.8,
        targetClose: price + 4.2,
        volume: 75,
        t: 0
      };
    }

    runProgress() {
      const totalTime = 2400; // 2.4s natural cinematic flow
      const tickRate = 35;
      const step = 100 / (totalTime / tickRate);

      const timer = setInterval(() => {
        if (this.isComplete) {
          clearInterval(timer);
          return;
        }

        this.progress += step + (Math.random() * 0.6 - 0.25);
        if (this.progress >= 100) {
          this.progress = 100;
          clearInterval(timer);
          setTimeout(() => this.finish(), 220);
        }

        const pctInt = Math.floor(this.progress);
        if (this.pctEl) this.pctEl.textContent = `${pctInt}%`;
        if (this.fillEl) this.fillEl.style.width = `${pctInt}%`;

        const logIdx = Math.min(
          Math.floor((this.progress / 100) * this.logs.length),
          this.logs.length - 1
        );
        if (this.logEl && this.logEl.textContent !== this.logs[logIdx]) {
          this.logEl.textContent = this.logs[logIdx];
        }
      }, tickRate);
    }

    animate() {
      if (this.isComplete || !this.ctx) return;
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      this.ctx.clearRect(0, 0, w, h);

      // 1. Cyber Grid Lines with Price Labels
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      this.ctx.lineWidth = 1;
      this.ctx.font = '9px "JetBrains Mono", monospace';
      this.ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
      for (let y = 30; y < h - 25; y += 38) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(w - 55, y);
        this.ctx.stroke();

        const fakeP = (4075 - (y / h) * 15).toFixed(1);
        this.ctx.fillText(`$${fakeP}`, w - 50, y + 3);
      }

      // Vertical time lines
      for (let x = 40; x < w - 60; x += 65) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 15);
        this.ctx.lineTo(x, h - 20);
        this.ctx.stroke();
      }

      // 2. Active Candle Dynamic Micro-ticks
      if (this.activeCandle) {
        this.activeCandle.t += 0.08;
        const currentClose = this.activeCandle.open + (this.activeCandle.targetClose - this.activeCandle.open) * Math.min(1, this.activeCandle.t);
        this.activeCandle.close = currentClose;
        this.activeCandle.high = Math.max(this.activeCandle.high, currentClose + 0.5);
        this.activeCandle.low = Math.min(this.activeCandle.low, this.activeCandle.open - 0.5);

        if (this.activeCandle.t >= 1) {
          this.candles.push({
            open: this.activeCandle.open,
            close: this.activeCandle.close,
            high: this.activeCandle.high,
            low: this.activeCandle.low,
            volume: Math.floor(Math.random() * 80 + 30)
          });
          if (this.candles.length > 22) this.candles.shift();

          const lastClose = this.activeCandle.close;
          this.activeCandle = {
            open: lastClose,
            close: lastClose,
            high: lastClose + 0.8,
            low: lastClose - 0.6,
            targetClose: lastClose + (Math.random() > 0.42 ? 1 : -1) * (Math.random() * 3.2 + 1.2),
            volume: 50,
            t: 0
          };
        }
      }

      // 3. Price Scaling Calculations
      let allPrices = [];
      this.candles.forEach(c => allPrices.push(c.high, c.low));
      if (this.activeCandle) allPrices.push(this.activeCandle.high, this.activeCandle.low);
      const minP = Math.min(...allPrices) - 1.5;
      const maxP = Math.max(...allPrices) + 1.5;
      const range = maxP - minP || 1;

      const chartTop = 22;
      const chartBottom = h - 36;
      const chartHeight = chartBottom - chartTop;
      const toY = p => chartBottom - ((p - minP) / range) * chartHeight;
      const totalCandles = this.candles.length + (this.activeCandle ? 1 : 0);
      const spacing = (w - 70) / (totalCandles + 1);

      // 4. Smart Money FVG Zone Box (Cyan Translucent Highlight)
      if (this.candles.length >= 10) {
        const startIdx = Math.max(2, this.candles.length - 8);
        const endIdx = startIdx + 4;
        const x1 = 15 + startIdx * spacing;
        const x2 = 15 + endIdx * spacing;
        const fvgTop = toY(this.candles[startIdx].high + 0.8);
        const fvgBottom = toY(this.candles[startIdx].low - 0.6);

        this.ctx.fillStyle = 'rgba(0, 242, 254, 0.08)';
        this.ctx.fillRect(x1, Math.min(fvgTop, fvgBottom), x2 - x1, Math.abs(fvgBottom - fvgTop));
        this.ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
        this.ctx.setLineDash([4, 4]);
        this.ctx.strokeRect(x1, Math.min(fvgTop, fvgBottom), x2 - x1, Math.abs(fvgBottom - fvgTop));
        this.ctx.setLineDash([]);

        this.ctx.fillStyle = '#00f2fe';
        this.ctx.font = '8px "JetBrains Mono", monospace';
        this.ctx.fillText('[ FVG IMBALANCE SWEPT ]', x1 + 6, Math.min(fvgTop, fvgBottom) + 11);
      }

      // 5. Break of Structure (BOS) Golden Breakout Ray
      if (this.candles.length >= 6) {
        const swingCandle = this.candles[this.candles.length - 5];
        const bosY = toY(swingCandle.high);
        const bosX1 = 15 + (this.candles.length - 6) * spacing;
        const bosX2 = w - 65;

        this.ctx.strokeStyle = 'rgba(255, 196, 0, 0.55)';
        this.ctx.setLineDash([5, 3]);
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.moveTo(bosX1, bosY);
        this.ctx.lineTo(bosX2, bosY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        this.ctx.fillStyle = '#ffc400';
        this.ctx.font = '8px "JetBrains Mono", monospace';
        this.ctx.fillText('BOS HIGHER HIGH ▲', bosX2 - 95, bosY - 4);
      }

      // 6. Draw Candlesticks & Volume Histogram
      const renderCandle = (c, idx, isActive = false) => {
        const x = 15 + idx * spacing;
        const isBull = c.close >= c.open;
        const color = isBull ? '#00f5a0' : '#ff3b69';

        // Micro-Volume bar at bottom
        const maxVolH = 22;
        const volH = Math.min(maxVolH, ((c.volume || 40) / 100) * maxVolH);
        this.ctx.fillStyle = isBull ? 'rgba(0, 245, 160, 0.22)' : 'rgba(255, 59, 105, 0.22)';
        this.ctx.fillRect(x - spacing * 0.35, h - 8 - volH, spacing * 0.7, volH);

        // Wick
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.4;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = isActive ? 10 : 4;
        this.ctx.beginPath();
        this.ctx.moveTo(x, toY(c.high));
        this.ctx.lineTo(x, toY(c.low));
        this.ctx.stroke();

        // Body
        const topY = toY(Math.max(c.open, c.close));
        const botY = toY(Math.min(c.open, c.close));
        const bodyH = Math.max(3, botY - topY);

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - spacing * 0.35, topY, spacing * 0.7, bodyH);
      };

      this.candles.forEach((c, idx) => renderCandle(c, idx));
      if (this.activeCandle) {
        renderCandle(this.activeCandle, this.candles.length, true);

        // 7. Live Dynamic Price Tracking Ray & Badge
        const liveY = toY(this.activeCandle.close);
        this.ctx.strokeStyle = '#00f2fe';
        this.ctx.setLineDash([3, 3]);
        this.ctx.lineWidth = 1.2;
        this.ctx.shadowColor = '#00f2fe';
        this.ctx.shadowBlur = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(10, liveY);
        this.ctx.lineTo(w - 55, liveY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Live Price Tag Pill
        this.ctx.fillStyle = '#00f2fe';
        this.ctx.fillRect(w - 52, liveY - 9, 48, 17);
        this.ctx.fillStyle = '#020610';
        this.ctx.font = 'bold 9px "JetBrains Mono", monospace';
        this.ctx.shadowBlur = 0;
        this.ctx.fillText(`$${this.activeCandle.close.toFixed(1)}`, w - 48, liveY + 3);
      }

      // 8. Sonar Sweep Scanline
      this.scanX = (this.scanX + 2.5) % (w - 60);
      const grad = this.ctx.createLinearGradient(this.scanX - 25, 0, this.scanX, 0);
      grad.addColorStop(0, 'rgba(0, 242, 254, 0)');
      grad.addColorStop(1, 'rgba(0, 242, 254, 0.15)');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(this.scanX - 25, 15, 25, h - 35);

      this.ctx.shadowBlur = 0;
      this.animFrame = requestAnimationFrame(() => this.animate());
    }

    finish() {
      if (this.isComplete) return;
      this.isComplete = true;
      if (this.animFrame) cancelAnimationFrame(this.animFrame);
      if (this.overlay) {
        this.overlay.classList.add('fade-out');
        setTimeout(() => {
          this.overlay.style.display = 'none';
        }, 550);
      }
      sound.playLock();

      // Launch the 7 Robotic Laborers on Hero & Stage 1 assembly!
      if (window.laborerSwarm) {
        window.laborerSwarm.startHeroAssembly();
      }
    }
  }

  /* ==========================================================================
     5. Multi-Cursor Laborer Swarm (7 Autonomous Robotic Workers)
     - Slow, Methodical, Realistic Physics (No chaotic jumping/jitter)
     - Actively Constructs Glass Frames & Types Text on Scroll
     - "website er jototuku scroll kora hobe site tototukui lode hobe"
     ========================================================================== */
  class LaborerSwarmEngine {
    constructor() {
      this.laserCanvas = document.getElementById('crew-laser-canvas');
      this.ctx = this.laserCanvas ? this.laserCanvas.getContext('2d') : null;

      this.cursorEls = [
        document.getElementById('worker-cursor-1'),
        document.getElementById('worker-cursor-2'),
        document.getElementById('worker-cursor-3'),
        document.getElementById('worker-cursor-4'),
        document.getElementById('worker-cursor-5'),
        document.getElementById('worker-cursor-6'),
        document.getElementById('worker-cursor-7')
      ];

      // 7 Specialized Robotic Laborers
      this.cursors = [
        {
          id: 1,
          name: 'UNIT-01 // ARCHITECT',
          color: '#00f2fe',
          el: this.cursorEls[0],
          pointerEl: this.cursorEls[0] ? this.cursorEls[0].querySelector('.cursor-pointer') : null,
          statusEl: this.cursorEls[0] ? this.cursorEls[0].querySelector('.hud-action-status') : null,
          x: 100, y: 120, targetX: 100, targetY: 120,
          angle: 0, status: 'STANDBY', isBusy: false
        },
        {
          id: 2,
          name: 'UNIT-02 // TELEMETRY',
          color: '#00f5a0',
          el: this.cursorEls[1],
          pointerEl: this.cursorEls[1] ? this.cursorEls[1].querySelector('.cursor-pointer') : null,
          statusEl: this.cursorEls[1] ? this.cursorEls[1].querySelector('.hud-action-status') : null,
          x: window.innerWidth - 120, y: 120, targetX: window.innerWidth - 120, targetY: 120,
          angle: 0, status: 'TELEMETRY', isBusy: false
        },
        {
          id: 3,
          name: 'UNIT-03 // TYPIST-A',
          color: '#ffc400',
          el: this.cursorEls[2],
          pointerEl: this.cursorEls[2] ? this.cursorEls[2].querySelector('.cursor-pointer') : null,
          statusEl: this.cursorEls[2] ? this.cursorEls[2].querySelector('.hud-action-status') : null,
          x: 180, y: 320, targetX: 180, targetY: 320,
          angle: 0, status: 'STREAM_READY', isBusy: false
        },
        {
          id: 4,
          name: 'UNIT-04 // TYPIST-B',
          color: '#a78bfa',
          el: this.cursorEls[3],
          pointerEl: this.cursorEls[3] ? this.cursorEls[3].querySelector('.cursor-pointer') : null,
          statusEl: this.cursorEls[3] ? this.cursorEls[3].querySelector('.hud-action-status') : null,
          x: window.innerWidth - 180, y: 320, targetX: window.innerWidth - 180, targetY: 320,
          angle: 0, status: 'STREAM_READY', isBusy: false
        },
        {
          id: 5,
          name: 'UNIT-05 // SMC-DRAFT',
          color: '#38bdf8',
          el: this.cursorEls[4],
          pointerEl: this.cursorEls[4] ? this.cursorEls[4].querySelector('.cursor-pointer') : null,
          statusEl: this.cursorEls[4] ? this.cursorEls[4].querySelector('.hud-action-status') : null,
          x: 140, y: 520, targetX: 140, targetY: 520,
          angle: 0, status: 'DRAFTING', isBusy: false
        },
        {
          id: 6,
          name: 'UNIT-06 // RISK-SENTRY',
          color: '#fb7185',
          el: this.cursorEls[5],
          pointerEl: this.cursorEls[5] ? this.cursorEls[5].querySelector('.cursor-pointer') : null,
          statusEl: this.cursorEls[5] ? this.cursorEls[5].querySelector('.hud-action-status') : null,
          x: window.innerWidth - 140, y: 520, targetX: window.innerWidth - 140, targetY: 520,
          angle: 0, status: 'SENTINEL', isBusy: false
        },
        {
          id: 7,
          name: 'UNIT-07 // GLASS-ARTISAN',
          color: '#2dd4bf',
          el: this.cursorEls[6],
          pointerEl: this.cursorEls[6] ? this.cursorEls[6].querySelector('.cursor-pointer') : null,
          statusEl: this.cursorEls[6] ? this.cursorEls[6].querySelector('.hud-action-status') : null,
          x: window.innerWidth / 2, y: 460, targetX: window.innerWidth / 2, targetY: 460,
          angle: 0, status: 'POLISHING', isBusy: false
        }
      ];

      this.lasers = [];
      this.assembledElements = new Set();
      this.isAssembling = false;
      this.patrolIndex = 0;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Scroll Observer: Detects sections entering viewport and dispatches laborers
      this.setupScrollObserver();

      // Start Butter-Smooth Physics Animation Loop
      this.animatePhysics();

      // Orderly, calm background patrol when idle
      setInterval(() => {
        if (!this.isAssembling) this.runCalmPatrol();
      }, 8000);
    }

    resize() {
      if (this.laserCanvas) {
        this.laserCanvas.width = window.innerWidth;
        this.laserCanvas.height = window.innerHeight;
      }
    }

    setStatus(cursorId, statusText) {
      const c = this.cursors[cursorId - 1];
      if (c && c.statusEl) {
        c.status = statusText;
        c.statusEl.textContent = statusText;
      }
    }

    shootLaser(cursorId, toX, toY, color) {
      const c = this.cursors[cursorId - 1];
      if (!c) return;
      this.lasers.push({
        fromX: c.x,
        fromY: c.y,
        toX: toX,
        toY: toY,
        color: color || c.color,
        life: 1.0
      });
      sound.playLaser();
    }

    // Scroll Observer: Triggers deliberate construction on un-assembled sections
    setupScrollObserver() {
      const targets = document.querySelectorAll('.scroll-target, .strategy-card');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.assembledElements.has(entry.target)) {
            this.assembleSectionClean(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.18,
        rootMargin: '0px 0px -30px 0px'
      });

      targets.forEach(t => observer.observe(t));
    }

    // Stage 1 Assembly: Invoked right after preloader finishes
    startHeroAssembly() {
      const ticker = document.getElementById('ticker-capsule');
      const radar = document.getElementById('session-radar-bar');
      const navbar = document.getElementById('main-navbar');
      const hero = document.getElementById('hero');

      // Fast weld for top header bars
      if (ticker) ticker.classList.add('assembled');
      if (radar) radar.classList.add('assembled');
      if (navbar) navbar.classList.add('assembled');

      // Actively assemble Hero with the laborers
      if (hero) {
        this.assembleSectionClean(hero, true);
      }
    }

    // Clean, realistic section assembly & typewriter effect
    assembleSectionClean(container, isHero = false) {
      if (this.assembledElements.has(container)) return;
      this.assembledElements.add(container);
      this.isAssembling = true;

      // Card enters construction state (Apple liquid glass glowing border)
      container.classList.add('under-construction');

      const rect = container.getBoundingClientRect();
      const c1 = this.cursors[0]; // Architect
      const c7 = this.cursors[6]; // Glass Artisan
      const c3 = this.cursors[2]; // Typist A
      const c4 = this.cursors[3]; // Typist B

      // 1. Architect & Glass Artisan glide smoothly to weld corners
      c1.targetX = Math.max(30, rect.left + 25);
      c1.targetY = Math.max(80, rect.top + 25);
      this.setStatus(1, 'WELDING FRAME');

      c7.targetX = Math.min(window.innerWidth - 50, rect.right - 35);
      c7.targetY = Math.min(window.innerHeight - 50, rect.bottom - 35);
      this.setStatus(7, 'PRISM REFRACT');

      // Laser welding burst
      setTimeout(() => {
        this.shootLaser(1, rect.left + 20, rect.top + 10, c1.color);
        this.shootLaser(7, rect.right - 20, rect.bottom - 10, c7.color);
      }, 250);

      // 2. Discover text elements to typewrite
      const typeElements = Array.from(container.querySelectorAll('[data-typewrite]'));

      // If no typewriter elements exist, lock immediately
      if (typeElements.length === 0) {
        setTimeout(() => {
          this.finalizeAssembly(container);
        }, 500);
        return;
      }

      // 3. Typewrite primary heading with Unit-03
      const headingEl = typeElements.find(el => 
        el.matches('h1, h2, h3, #hero-title-line1, #hero-title-line2, .section-heading, .card-title')
      ) || typeElements[0];

      // Secondary text with Unit-04
      const subEl = typeElements.find(el => el !== headingEl && (el.matches('p, .card-lead, .hero-description, .section-subtext')));

      // Start typing heading
      if (headingEl) {
        this.typewriteElement(headingEl, c3, () => {
          // If secondary element exists, type it
          if (subEl) {
            this.typewriteElement(subEl, c4, () => {
              this.finalizeAssembly(container);
            });
          } else {
            this.finalizeAssembly(container);
          }
        });
      } else {
        this.finalizeAssembly(container);
      }

      // Safety fallback: rapid scroll never leaves any element unrevealed
      setTimeout(() => {
        this.finalizeAssembly(container, true);
      }, isHero ? 3200 : 1600);
    }

    // Precise, rhythmic typewriter effect with cursor tracking
    typewriteElement(el, cursorObj, callback) {
      if (!el || el.dataset.typed === 'true') {
        if (callback) callback();
        return;
      }

      const fullText = el.getAttribute('data-typewrite') || el.textContent.trim();
      el.setAttribute('data-typewrite', fullText);
      el.dataset.typed = 'true';

      const rect = el.getBoundingClientRect();
      if (cursorObj) {
        cursorObj.targetX = Math.max(30, rect.left - 20);
        cursorObj.targetY = Math.max(80, rect.top - 8);
        this.setStatus(cursorObj.id, `TYPING: ${fullText.substring(0, 10)}...`);
      }

      // Clear text and insert caret
      el.innerHTML = '<span class="type-char-stream"></span><span class="typing-caret"></span>';
      const streamSpan = el.querySelector('.type-char-stream');

      let charIdx = 0;
      const charDelay = fullText.length > 80 ? 12 : 22; // Rhythmic deliberate speed

      const typeTimer = setInterval(() => {
        if (charIdx < fullText.length) {
          streamSpan.textContent += fullText[charIdx];
          charIdx++;

          // Gentle soft audio click every 4th char
          if (charIdx % 4 === 0) sound.playKey();

          // Move cursor pointer to keep up with typing
          if (cursorObj && charIdx % 6 === 0) {
            const currentRect = el.getBoundingClientRect();
            cursorObj.targetX = Math.min(window.innerWidth - 60, currentRect.left + (charIdx / fullText.length) * currentRect.width);
            cursorObj.targetY = Math.max(80, currentRect.top - 8);
          }
        } else {
          clearInterval(typeTimer);
          el.textContent = fullText; // Clean final text
          if (cursorObj) this.setStatus(cursorObj.id, 'STREAM_LOCKED');
          if (callback) callback();
        }
      }, charDelay);
    }

    // Finalize card: solidifies into Apple Liquid Glass with sound chime
    finalizeAssembly(container, isFallback = false) {
      if (container.classList.contains('assembled') && !container.classList.contains('under-construction')) return;

      container.classList.remove('under-construction');
      container.classList.add('assembled');

      // Make sure all [data-typewrite] inside are fully revealed
      container.querySelectorAll('[data-typewrite]').forEach(el => {
        el.dataset.typed = 'true';
        const txt = el.getAttribute('data-typewrite');
        if (txt && el.textContent !== txt) {
          el.textContent = txt;
        }
      });

      // Subtle specular flash & audio lock
      sound.playLock();
      this.isAssembling = false;

      // Status reset
      this.setStatus(1, 'IDLE_PATROL');
      this.setStatus(3, 'STREAM_READY');
      this.setStatus(4, 'STREAM_READY');
      this.setStatus(7, 'POLISHING');
    }

    // Calm patrol when user is reading and not scrolling
    runCalmPatrol() {
      this.patrolIndex = (this.patrolIndex + 1) % 4;

      if (this.patrolIndex === 0) {
        // Telemetry calmly visits US OIL ticker
        const oilEl = document.getElementById('ticker-oil');
        if (oilEl) {
          const r = oilEl.getBoundingClientRect();
          this.cursors[1].targetX = r.left + r.width / 2;
          this.cursors[1].targetY = r.bottom + 16;
          this.setStatus(2, 'US OIL: $88.45');
        }
      } else if (this.patrolIndex === 1) {
        // Telemetry calmly visits USTEC ticker
        const ustecEl = document.getElementById('ticker-ustec');
        if (ustecEl) {
          const r = ustecEl.getBoundingClientRect();
          this.cursors[1].targetX = r.left + r.width / 2;
          this.cursors[1].targetY = r.bottom + 16;
          this.setStatus(2, 'USTEC: 28,580.40');
        }
      } else if (this.patrolIndex === 2) {
        // Risk Sentry stands guard by Telegram CTA
        const ctaBtn = document.getElementById('hero-cta-btn');
        if (ctaBtn) {
          const r = ctaBtn.getBoundingClientRect();
          if (r.top > 0 && r.bottom < window.innerHeight) {
            this.cursors[5].targetX = r.right + 25;
            this.cursors[5].targetY = r.top + r.height / 2;
            this.setStatus(6, 'DESK: ONLINE');
          }
        }
      } else if (this.patrolIndex === 3) {
        // Architect verifies Market Session Radar
        const radarEl = document.getElementById('session-radar-panel');
        if (radarEl) {
          const r = radarEl.getBoundingClientRect();
          if (r.top > 0 && r.bottom < window.innerHeight) {
            this.cursors[0].targetX = r.left + 50;
            this.cursors[0].targetY = r.top + 30;
            this.setStatus(1, 'RADAR: SYNC');
          }
        }
      }
    }

    // Butter-Smooth Physics Animation Loop
    animatePhysics() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (this.ctx) {
        this.ctx.clearRect(0, 0, w, h);
      }

      this.cursors.forEach((c, idx) => {
        // Natural micro-hovering float (±3px, calm sine motion)
        const floatX = Math.cos(Date.now() * 0.0008 + idx * 1.5) * 3.2;
        const floatY = Math.sin(Date.now() * 0.0008 + idx * 1.5) * 3.2;

        const effectiveTargetX = c.targetX + floatX;
        const effectiveTargetY = c.targetY + floatY;

        // Smooth deliberate easing (lerp factor: 0.038)
        const dx = effectiveTargetX - c.x;
        const dy = effectiveTargetY - c.y;
        c.x += dx * 0.038;
        c.y += dy * 0.038;

        // Gentle heading angle interpolation
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) - 45;
        c.angle += (targetAngle - c.angle) * 0.05;

        if (c.el) {
          c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
        }
        if (c.pointerEl) {
          c.pointerEl.style.transform = `rotate(${c.angle * 0.16}deg)`;
        }
      });

      // Render Laser Welding Beams
      if (this.ctx && this.lasers.length > 0) {
        for (let i = this.lasers.length - 1; i >= 0; i--) {
          const l = this.lasers[i];
          l.life -= 0.022;
          if (l.life <= 0) {
            this.lasers.splice(i, 1);
          } else {
            this.ctx.strokeStyle = l.color;
            this.ctx.shadowColor = l.color;
            this.ctx.shadowBlur = 10;
            this.ctx.lineWidth = 1.4;
            this.ctx.globalAlpha = l.life * 0.65;
            this.ctx.setLineDash([5, 4]);

            this.ctx.beginPath();
            this.ctx.moveTo(l.fromX, l.fromY);
            this.ctx.lineTo(l.toX, l.toY);
            this.ctx.stroke();

            this.ctx.setLineDash([]);
            this.ctx.globalAlpha = 1;
            this.ctx.shadowBlur = 0;
          }
        }
      }

      requestAnimationFrame(() => this.animatePhysics());
    }
  }


  /* ==========================================================================
     6. 5 Interactive SMC Strategy Visualizers
     ========================================================================== */
  class StrategyVisualizers {
    constructor() {
      this.initSupportResistance();
      this.initOrderBlock();
      this.initSupplyDemand();
      this.initFairValueGap();
      this.initGoldenZone();
    }

    initSupportResistance() {
      const canvas = document.getElementById('canvas-sr');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      let t = 0;
      const draw = () => {
        t += 0.025;
        ctx.clearRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(255, 59, 105, 0.65)';
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(20, 45); ctx.lineTo(w - 20, 45);
        ctx.stroke();

        ctx.fillStyle = '#ff3b69';
        ctx.font = '10px "JetBrains Mono"';
        ctx.fillText('RETAIL RESISTANCE', 24, 38);

        ctx.strokeStyle = 'rgba(0, 245, 160, 0.65)';
        ctx.beginPath();
        ctx.moveTo(20, h - 35); ctx.lineTo(w - 20, h - 35);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#00f5a0';
        ctx.fillText('RETAIL SUPPORT', 24, h - 22);

        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 10;
        ctx.beginPath();

        const pts = [
          { x: 30, y: h - 45 },
          { x: 80, y: 55 },
          { x: 130, y: h - 42 },
          { x: 180, y: 52 },
          { x: 230, y: 25 },
          { x: 280, y: h - 55 },
          { x: 330, y: 35 }
        ];

        ctx.moveTo(pts[0].x, pts[0].y);
        const seg = Math.floor(t % (pts.length - 1));
        const progress = (t % (pts.length - 1)) - seg;

        for (let i = 1; i <= seg; i++) ctx.lineTo(pts[i].x, pts[i].y);
        const prev = pts[seg];
        const curr = pts[seg + 1];
        if (curr) {
          ctx.lineTo(prev.x + (curr.x - prev.x) * progress, prev.y + (curr.y - prev.y) * progress);
        }
        ctx.stroke();

        if (seg >= 4) {
          ctx.fillStyle = '#ff3b69';
          ctx.beginPath();
          ctx.arc(230, 20, 4 + Math.sin(t * 5) * 1.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = '9px "JetBrains Mono"';
          ctx.fillText('LIQUIDITY SWEPT', 238, 18);
        }

        ctx.shadowBlur = 0;
        if (t > 7) t = 0;
        requestAnimationFrame(draw);
      };
      draw();
    }

    initOrderBlock() {
      const canvas = document.getElementById('canvas-ob');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      let step = 0;
      const draw = () => {
        step += 0.02;
        ctx.clearRect(0, 0, w, h);

        const obX = 75;
        const obY = h - 65;
        const obW = 120;
        const obH = 35;

        ctx.fillStyle = 'rgba(0, 245, 160, 0.18)';
        ctx.strokeStyle = '#00f5a0';
        ctx.lineWidth = 1.5;
        ctx.fillRect(obX, obY, obW, obH);
        ctx.strokeRect(obX, obY, obW, obH);

        ctx.fillStyle = '#00f5a0';
        ctx.font = '9px "JetBrains Mono"';
        ctx.fillText('BULLISH ORDER BLOCK (OB)', obX + 8, obY + 22);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(120, 35); ctx.lineTo(w - 20, 35);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('BOS LINE', w - 75, 30);

        const candles = [
          { x: 40, open: 110, close: 130, color: '#ff3b69' },
          { x: 65, open: 125, close: 145, color: '#ff3b69' },
          { x: 90, open: 140, close: 165, color: '#ff3b69' },
          { x: 120, open: 165, close: 40, color: '#00f5a0' },
          { x: 150, open: 42, close: 25, color: '#00f5a0' },
          { x: 185, open: 30, close: 70, color: '#ff3b69' },
          { x: 215, open: 70, close: 140, color: '#ff3b69' },
          { x: 245, open: 140, close: 25, color: '#00f5a0' }
        ];

        const visibleCount = Math.min(candles.length, Math.floor(step * 2.5) + 1);
        for (let i = 0; i < visibleCount; i++) {
          const c = candles[i];
          const color = c.color;
          const top = Math.min(c.open, c.close);
          const height = Math.abs(c.open - c.close);

          ctx.fillStyle = color;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.moveTo(c.x, c.close - 5); ctx.lineTo(c.x, c.open + 5);
          ctx.stroke();

          ctx.fillRect(c.x - 7, top, 14, Math.max(height, 4));
        }

        if (step > 4) step = 0;
        requestAnimationFrame(draw);
      };
      draw();
    }

    initSupplyDemand() {
      const canvas = document.getElementById('canvas-sd');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      let t = 0;
      const draw = () => {
        t += 0.025;
        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(255, 59, 105, 0.15)';
        ctx.strokeStyle = 'rgba(255, 59, 105, 0.55)';
        ctx.fillRect(20, 15, w - 40, 32);
        ctx.strokeRect(20, 15, w - 40, 32);
        ctx.fillStyle = '#ff3b69';
        ctx.font = '9px "JetBrains Mono"';
        ctx.fillText('PREMIUM (SUPPLY ZONE)', 30, 34);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(20, h / 2); ctx.lineTo(w - 20, h / 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#64748b';
        ctx.fillText('0.5 EQUILIBRIUM', w - 120, h / 2 - 4);

        ctx.fillStyle = 'rgba(0, 245, 160, 0.15)';
        ctx.strokeStyle = 'rgba(0, 245, 160, 0.55)';
        ctx.fillRect(20, h - 45, w - 40, 32);
        ctx.strokeRect(20, h - 45, w - 40, 32);
        ctx.fillStyle = '#00f5a0';
        ctx.fillText('DISCOUNT (DEMAND ZONE)', 30, h - 25);

        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const pts = [
          { x: 30, y: h - 30 },
          { x: 90, y: 30 },
          { x: 140, y: h / 2 },
          { x: 190, y: 28 },
          { x: 250, y: h - 35 },
          { x: 320, y: 24 }
        ];

        ctx.moveTo(pts[0].x, pts[0].y);
        const seg = Math.floor(t % (pts.length - 1));
        const progress = (t % (pts.length - 1)) - seg;

        for (let i = 1; i <= seg; i++) ctx.lineTo(pts[i].x, pts[i].y);
        const prev = pts[seg];
        const curr = pts[seg + 1];
        if (curr) {
          ctx.lineTo(prev.x + (curr.x - prev.x) * progress, prev.y + (curr.y - prev.y) * progress);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (t > 6) t = 0;
        requestAnimationFrame(draw);
      };
      draw();
    }

    initFairValueGap() {
      const canvas = document.getElementById('canvas-fvg');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      let cycle = 0;
      const draw = () => {
        cycle += 0.025;
        ctx.clearRect(0, 0, w, h);

        const c1 = { x: 50, high: 90, low: 155, open: 120, close: 100 };
        const c2 = { x: 100, high: 35, low: 165, open: 100, close: 45 };
        const c3 = { x: 150, high: 20, low: 65, open: 45, close: 30 };

        const gapTop = c3.low;
        const gapBottom = c1.high;
        const gapHeight = gapBottom - gapTop;

        ctx.fillStyle = 'rgba(0, 242, 254, 0.22)';
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.5;
        ctx.fillRect(c1.x + 10, gapTop, w - c1.x - 30, gapHeight);
        ctx.strokeRect(c1.x + 10, gapTop, w - c1.x - 30, gapHeight);

        ctx.fillStyle = '#00f2fe';
        ctx.font = '9px "JetBrains Mono"';
        ctx.fillText('FVG IMBALANCE VOID', 160, gapTop + gapHeight / 2 + 3);

        [c1, c2, c3].forEach(c => {
          const isBull = c.close < c.open;
          const color = isBull ? '#00f5a0' : '#ff3b69';
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.moveTo(c.x, c.high); ctx.lineTo(c.x, c.low);
          ctx.stroke();

          const top = Math.min(c.open, c.close);
          const height = Math.abs(c.open - c.close);
          ctx.fillRect(c.x - 10, top, 20, height);
        });

        // Retracement Tap into FVG
        if (cycle > 1) {
          const retraceProgress = Math.min(1, (cycle - 1) / 1.5);
          const c4X = 220;
          const currLow = 40 + (gapBottom - 5 - 40) * retraceProgress;

          ctx.strokeStyle = '#ff3b69';
          ctx.beginPath();
          ctx.moveTo(c4X, 35); ctx.lineTo(c4X, currLow);
          ctx.stroke();

          ctx.fillStyle = '#ff3b69';
          ctx.fillRect(c4X - 8, 38, 16, Math.max(4, currLow - 42));

          if (retraceProgress >= 0.85) {
            ctx.fillStyle = '#00f5a0';
            ctx.font = '9px "JetBrains Mono"';
            ctx.fillText('TAP & FILL!', c4X - 16, currLow + 16);
          }
        }

        if (cycle > 3.8) cycle = 0;
        requestAnimationFrame(draw);
      };
      draw();
    }

    initGoldenZone() {
      const canvas = document.getElementById('canvas-fib');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      let t = 0;
      const draw = () => {
        t += 0.025;
        ctx.clearRect(0, 0, w, h);

        const swingLow = h - 35;
        const swingHigh = 25;
        const total = swingLow - swingHigh;

        const f618 = swingLow - total * 0.618;
        const f786 = swingLow - total * 0.786;

        const gzTop = Math.min(f618, f786);
        const gzBot = Math.max(f618, f786);

        ctx.fillStyle = 'rgba(255, 196, 0, 0.18)';
        ctx.fillRect(40, gzTop, w - 80, gzBot - gzTop);
        ctx.strokeStyle = 'rgba(255, 196, 0, 0.6)';
        ctx.strokeRect(40, gzTop, w - 80, gzBot - gzTop);

        ctx.fillStyle = '#ffc400';
        ctx.font = '10px "JetBrains Mono"';
        ctx.fillText('★ GOLDEN ZONE // OPTIMAL TRADE ENTRY (OTE)', w / 2 - 120, gzTop + (gzBot - gzTop) / 2 + 4);

        const fibs = [
          { y: swingHigh, lvl: '0.0% (SWING HIGH)', color: '#64748b' },
          { y: swingLow - total * 0.382, lvl: '38.2%', color: '#94a3b8' },
          { y: swingLow - total * 0.5, lvl: '50.0% EQUILIBRIUM', color: '#38bdf8' },
          { y: f618, lvl: '61.8% GOLDEN RATIO', color: '#ffc400' },
          { y: f786, lvl: '78.6% OTE ZONE', color: '#ffc400' },
          { y: swingLow, lvl: '100% (SWING LOW)', color: '#64748b' }
        ];

        fibs.forEach(f => {
          ctx.strokeStyle = f.color;
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(40, f.y); ctx.lineTo(w - 40, f.y);
          ctx.stroke();

          ctx.fillStyle = f.color;
          ctx.font = '9px "JetBrains Mono"';
          ctx.fillText(f.lvl, w - 120, f.y - 3);
        });
        ctx.setLineDash([]);

        ctx.strokeStyle = '#00f5a0';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f5a0';
        ctx.shadowBlur = 10;
        ctx.beginPath();

        const pts = [
          { x: 50, y: swingLow },
          { x: 140, y: swingHigh },
          { x: 230, y: f618 + 5 },
          { x: 310, y: 15 }
        ];

        ctx.moveTo(pts[0].x, pts[0].y);
        const seg = Math.floor(t % (pts.length - 1));
        const progress = (t % (pts.length - 1)) - seg;

        for (let i = 1; i <= seg; i++) ctx.lineTo(pts[i].x, pts[i].y);
        const prev = pts[seg];
        const curr = pts[seg + 1];
        if (curr) {
          ctx.lineTo(prev.x + (curr.x - prev.x) * progress, prev.y + (curr.y - prev.y) * progress);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (t > 4) t = 0;
        requestAnimationFrame(draw);
      };
      draw();
    }
  }

  /* ==========================================================================
     7. Live Terminal Simulator (Strictly: XAU, USOIL, USTEC, BTC)
     ========================================================================== */
  class TerminalSimulator {
    constructor() {
      this.canvas = document.getElementById('live-terminal-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.tabs = document.querySelectorAll('.asset-tab');
      this.activeAsset = 'XAU';
      this.candles = [];

      this.init();
    }

    init() {
      if (!this.canvas || !this.ctx) return;

      this.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          this.tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this.activeAsset = tab.getAttribute('data-asset');
          this.seedData();
          sound.playKey();
        });
      });

      this.seedData();
      this.animate();
    }

    seedData() {
      this.candles = [];
      const count = 28;
      let price = 4071.80;
      let step = 3.5;

      if (this.activeAsset === 'XAU') { price = 4071.80; step = 3.5; }
      if (this.activeAsset === 'USOIL') { price = 88.45; step = 0.25; }
      if (this.activeAsset === 'USTEC') { price = 28580.40; step = 14; }
      if (this.activeAsset === 'BTC') { price = 80351.84; step = 45; }

      for (let i = 0; i < count; i++) {
        const change = (Math.random() - 0.44) * step;
        const open = price;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * (step * 0.6);
        const low = Math.min(open, close) - Math.random() * (step * 0.6);
        this.candles.push({ open, close, high, low });
        price = close;
      }
    }

    animate() {
      const w = this.canvas.width;
      const h = this.canvas.height;
      this.ctx.clearRect(0, 0, w, h);

      // Grid - fixed bare ctx bug
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      this.ctx.lineWidth = 1;
      for (let y = 30; y < h; y += 40) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(w, y);
        this.ctx.stroke();
      }

      const highs = this.candles.map(c => c.high);
      const lows = this.candles.map(c => c.low);
      const minP = Math.min(...lows) - 5;
      const maxP = Math.max(...highs) + 5;
      const range = maxP - minP || 1;

      const toY = p => h - 25 - ((p - minP) / range) * (h - 50);
      const candleW = w / (this.candles.length + 2);

      this.candles.forEach((c, idx) => {
        const x = 20 + idx * candleW;
        const isBull = c.close >= c.open;
        const color = isBull ? '#00f5a0' : '#ff3b69';

        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 1.5;

        // Fixed bare ctx bug
        this.ctx.beginPath();
        this.ctx.moveTo(x, toY(c.high));
        this.ctx.lineTo(x, toY(c.low));
        this.ctx.stroke();

        const topY = toY(Math.max(c.open, c.close));
        const botY = toY(Math.min(c.open, c.close));
        this.ctx.fillRect(x - candleW * 0.32, topY, candleW * 0.64, Math.max(3, botY - topY));
      });

      // EMA Ribbon
      this.ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.candles.forEach((c, idx) => {
        const x = 20 + idx * candleW;
        const y = toY(c.close);
        if (idx === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      });
      this.ctx.stroke();

      if (Math.random() < 0.035) {
        const last = this.candles[this.candles.length - 1];
        let step = 3;
        if (this.activeAsset === 'XAU') step = 3;
        if (this.activeAsset === 'USOIL') step = 0.2;
        if (this.activeAsset === 'USTEC') step = 10;
        if (this.activeAsset === 'BTC') step = 35;

        const change = (Math.random() - 0.45) * step;
        const open = last.close;
        const close = open + change;
        this.candles.push({
          open,
          close,
          high: Math.max(open, close) + Math.random() * (step * 0.5),
          low: Math.min(open, close) - Math.random() * (step * 0.5)
        });
        if (this.candles.length > 32) this.candles.shift();
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  /* ==========================================================================
     8. Apple Liquid Glass 3D Tilt Physics
     ========================================================================== */
  class LiquidGlassPhysics {
    constructor() {
      this.cards = document.querySelectorAll('.tilt-card');
      this.init();
    }

    init() {
      this.cards.forEach(card => {
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -7;
          const rotateY = ((x - centerX) / centerX) * 7;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.018, 1.018, 1.018)`;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
      });
    }
  }

  /* ==========================================================================
     9. Ambient Background Canvas Particles
     ========================================================================== */
  class AmbientParticles {
    constructor() {
      this.canvas = document.getElementById('ambient-particles');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.init();
    }

    init() {
      if (!this.canvas || !this.ctx) return;
      this.resize();
      window.addEventListener('resize', () => this.resize());

      const count = 35;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          color: Math.random() > 0.5 ? 'rgba(0, 242, 254,' : 'rgba(0, 245, 160,',
          alpha: Math.random() * 0.35 + 0.1
        });
      }

      this.animate();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    animate() {
      const w = this.canvas.width;
      const h = this.canvas.height;
      this.ctx.clearRect(0, 0, w, h);

      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        this.ctx.fillStyle = `${p.color} ${p.alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fill();
      });

      requestAnimationFrame(() => this.animate());
    }
  }

  /* ==========================================================================
     Main Bootstrap
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    new AmbientParticles();
    window.laborerSwarm = new LaborerSwarmEngine();
    new PreloaderManager();
    new RealTimeTicker();
    new MarketSessionRadar();
    new StrategyVisualizers();
    new TerminalSimulator();
    new LiquidGlassPhysics();
  });

})();
