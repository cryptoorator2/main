// ============================================================
// APPLICATION LOGIC (HUD SYSTEMS, AUDIO SYNTH, NET TESTS)
// ============================================================

// --- HUD TERMINAL LOGGER ---
const TerminalLog = {
  container: null,
  init() {
    this.container = document.getElementById('terminal-content');
    this.print("INITIALIZING GEOLOCATION PROTOCOLS...", "SYS");
    this.print("HUD VERSION 2.5 NOMINAL", "SYS");
  },
  print(text, type = "SYS") {
    if (!this.container) return;
    
    const time = new Date().toLocaleTimeString();
    
    const line = document.createElement('div');
    line.innerHTML = `<span class="term-tag" style="color:var(--cyan); font-weight:700;">[${time}] [${type}]</span> ${text}`;
    this.container.appendChild(line);
    
    // Auto scroll to bottom
    const consoleBox = this.container.parentElement;
    if (consoleBox) {
      consoleBox.scrollTop = consoleBox.scrollHeight;
    }
  }
};

// --- WEB AUDIO SYNTH ENGINE (CORS-FREE PROCEDURAL AUDIO) ---
const AudioSynth = {
  ctx: null,
  isMuted: true, // Start muted by default
  
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      TerminalLog.print("WEB AUDIO CONTEXT SYNTHESIZED SUCCESSFULLY", "SYS");
    } catch (e) {
      TerminalLog.print("AUDIO ENGINE BLOCKED/UNSUPPORTED BY HOST BROWSER", "ERR");
    }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playHover() {
    if (this.isMuted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    // Fast futuristic synth hum sweep (ascending pitch)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.012, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  },

  playClick() {
    if (this.isMuted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    // Glass chime sound sweep (descending pitch)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.22);

    gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  },

  playWarpSweep() {
    if (this.isMuted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    // Boot startup sound sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }
};

window.AudioSynth = AudioSynth;

function initAudioToggle() {
  const btn = document.getElementById('audio-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    AudioSynth.init();
    AudioSynth.resume();

    AudioSynth.isMuted = !AudioSynth.isMuted;
    
    if (AudioSynth.isMuted) {
      btn.className = "hud-btn sound-off";
      btn.innerHTML = '<i class="bi bi-volume-mute-fill"></i> SOUND: OFF';
      TerminalLog.print("HUD AUDIO MUTED BY USER COMMAND", "SYS");
    } else {
      btn.className = "hud-btn sound-on";
      btn.innerHTML = '<i class="bi bi-volume-up-fill"></i> SOUND: ON';
      TerminalLog.print("HUD AUDIO ENABLED. PREPARE FOR SYNTH TRANSMISSION", "SYS");
      AudioSynth.playWarpSweep();
    }
  });

  document.addEventListener('click', () => {
    AudioSynth.resume();
  }, { once: true });
}

// --- SYSTEM DIAGNOSTICS & SPEED TEST ENGINE ---
const Diagnostics = {
  isTesting: false,
  
  async init() {
    TerminalLog.print("RESOLVING LOCAL CLIENT NETWORK INTERFACE...", "SYS");
    
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      
      document.getElementById('ip-val').textContent = data.ip || 'UNKNOWN';
      document.getElementById('isp-val').textContent = (data.org || 'UNKNOWN').substring(0, 24);
      document.getElementById('loc-val').textContent = `${data.city || 'UNKNOWN'}, ${data.country_code || 'UN'}`;
      
      const pingTime = Math.round(4 + Math.random() * 22);
      document.getElementById('ping-val').textContent = pingTime;
      
      TerminalLog.print(`GEOLOC SYNCED. IP: ${data.ip} · carrier: ${data.org}`, "SYS");
    } catch (e) {
      document.getElementById('ip-val').textContent = '127.0.0.1 (LOCAL)';
      document.getElementById('isp-val').textContent = 'LOCALHOST INTERNET';
      document.getElementById('loc-val').textContent = 'LOCAL AREA';
      document.getElementById('ping-val').textContent = '0';
      TerminalLog.print("GEOLOCATION REQUEST RETURNING OFFLINE MODE STATS", "ERR");
    }
    
    this.bindButtons();
  },

  bindButtons() {
    const testBtn = document.getElementById('speed-test-btn');
    if (!testBtn) return;

    testBtn.addEventListener('click', () => {
      this.runDiagnosticsTest();
    });
  },

  async runDiagnosticsTest() {
    if (this.isTesting) return;
    this.isTesting = true;
    
    if (window.AudioSynth) window.AudioSynth.playClick();

    const testBtn = document.getElementById('speed-test-btn');
    testBtn.textContent = "CHECKING SPEED...";
    testBtn.disabled = true;

    TerminalLog.print("SPEED TEST LAUNCHED. PINGING CDN NODE...", "NET");

    const dialFill = document.getElementById('speed-meter-fill');
    const needle = document.getElementById('speed-needle');
    const speedVal = document.getElementById('speed-val');
    
    function updateMeterUI(mbps) {
      mbps = Math.min(100, Math.max(0, mbps));
      speedVal.textContent = mbps.toFixed(1);
      
      const angle = -90 + (mbps / 100) * 180;
      if (needle) needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      
      const offset = 188.5 - (mbps / 100) * 188.5;
      if (dialFill) dialFill.style.strokeDashoffset = offset;
    }

    let currentSpeed = 0;
    const interval = setInterval(() => {
      if (currentSpeed < 40) {
        currentSpeed += 2 + Math.random() * 4;
        updateMeterUI(currentSpeed);
      }
    }, 50);

    const testUrl = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    const fileSizeInBits = 614000 * 8; // Size of Three.js minified in bits

    try {
      const start = performance.now();
      const response = await fetch(`${testUrl}?t=${start}`);
      const blob = await response.blob();
      const end = performance.now();
      clearInterval(interval);

      const durationSec = (end - start) / 1000;
      const speedMbps = (fileSizeInBits / durationSec) / 1000000;
      const actualPing = Math.round(durationSec * 220);
      
      document.getElementById('ping-val').textContent = actualPing;
      
      gsap.to({ val: currentSpeed }, {
        val: speedMbps,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: function() {
          updateMeterUI(this.targets()[0].val);
        },
        onComplete: () => {
          this.isTesting = false;
          testBtn.textContent = "RUN NETWORK CHECK";
          testBtn.disabled = false;
          TerminalLog.print(`SPEED TEST COMPLETE. RATE: ${speedMbps.toFixed(2)} Mbps · RTT: ${actualPing}ms`, "NET");
        }
      });

    } catch (e) {
      clearInterval(interval);
      this.isTesting = false;
      testBtn.textContent = "RUN NETWORK CHECK";
      testBtn.disabled = false;
      updateMeterUI(0);
      TerminalLog.print("SPEED TEST ERROR. INTERFACE RESET", "ERR");
    }
  }
};

// --- CUSTOM FLUID MOUSE TRAIL & LIGHT SPOTLIGHTS ---
function initLiquidCursor() {
  const cursor = document.getElementById('fluid-cursor');
  const cursorRing = document.getElementById('fluid-cursor-ring');
  if (!cursor || !cursorRing) return;

  let cx = 0, cy = 0;
  let rx = 0, ry = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    cursor.style.display = 'block';
    cursorRing.style.display = 'block';
  } else {
    return;
  }

  window.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  });

  function updateRing() {
    rx += (cx - rx) * 0.12;
    ry += (cy - ry) * 0.12;
    
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    
    requestAnimationFrame(updateRing);
  }
  updateRing();

  // Hover triggers
  const interactives = document.querySelectorAll('a, button, .price-card, .strategy-card, .social-button');
  interactives.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.6)';
      cursor.style.backgroundColor = 'var(--cyan)';
      cursorRing.style.width = '56px';
      cursorRing.style.height = '56px';
      cursorRing.style.borderColor = 'var(--cyan)';
      
      if (window.AudioSynth) window.AudioSynth.playHover();
    });

    item.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.0)';
      cursor.style.backgroundColor = 'var(--gold)';
      cursorRing.style.width = '40px';
      cursorRing.style.height = '40px';
      cursorRing.style.borderColor = 'var(--gold)';
    });
  });
}

function initLiquidCards() {
  const cards = document.querySelectorAll('.liquid-glass');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      
      // 3D Parallax Tilt if it's a tilt-card
      if (card.classList.contains('tilt-card')) {
        const w = rect.width;
        const h = rect.height;
        // Calculate offset from center of card (-0.5 to 0.5)
        const offsetX = (x / w) - 0.5;
        const offsetY = (y / h) - 0.5;
        
        // Rotate max 12 degrees
        const rotX = -offsetY * 12;
        const rotY = offsetX * 12;
        
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      if (card.classList.contains('tilt-card')) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      }
    });
  });
}

// --- SMOOTH SCROLL-LINKED PARALLAX ASSETS ---
function initScrollParallax() {
  const assets = document.querySelectorAll('.glass-parallax-asset');
  if (assets.length === 0) return;
  
  // Speed values (alternate positive and negative drifts)
  const speeds = [0.12, -0.08, 0.16, -0.12, 0.08, -0.1, 0.14];
  
  let targetY = window.scrollY;
  let currentY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    targetY = window.scrollY;
  }, { passive: true });
  
  function updateParallax() {
    currentY += (targetY - currentY) * 0.08; // Smooth inertia interpolation
    
    assets.forEach((asset, index) => {
      const speed = speeds[index % speeds.length];
      const yTranslation = currentY * speed;
      asset.style.transform = `translate3d(0, ${yTranslation}px, 0)`;
    });
    
    requestAnimationFrame(updateParallax);
  }
  
  updateParallax();
}

// --- STARNET BACKGROUND CONSTALLATIONS ---
function initBackgroundStarnet() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const particles = [];
  const maxParticles = 55;
  const connectionDist = 110;

  // --- Watermark Trading Candles Setup ---
  class WatermarkCandle {
    constructor(x, centerY, width, green) {
      this.x = x;
      this.centerY = centerY;
      this.width = width;
      this.green = green;
      this.speed = 0.35 + Math.random() * 0.3;
      this.offset = Math.random() * Math.PI * 2;
      this.bodyHeight = 25 + Math.random() * 45;
      this.wickHeight = this.bodyHeight + 15 + Math.random() * 25;
    }
    
    update(time) {
      // Oscillate Y position slowly
      this.y = this.centerY + Math.sin(time * this.speed + this.offset) * 35;
      // Oscillate body height slightly
      this.h = this.bodyHeight + Math.cos(time * this.speed * 1.3 + this.offset) * 12;
    }

    draw() {
      // Faint green or red (watermark opacity - adjusted for screen visibility)
      const color = this.green ? 'rgba(16, 185, 129, 0.075)' : 'rgba(239, 68, 68, 0.075)';
      const wickColor = this.green ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      
      // Draw wick
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.wickHeight / 2);
      ctx.lineTo(this.x, this.y + this.wickHeight / 2);
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      
      // Draw body
      ctx.fillStyle = color;
      ctx.fillRect(this.x - this.width / 2, this.y - this.h / 2, this.width, this.h);
    }
  }

  const watermarkCandles = [];
  const spacing = 110;
  const candleWidth = 12;

  function initWatermarkCandles() {
    watermarkCandles.length = 0;
    const numCandles = Math.floor(W / spacing) + 1;
    let currentY = H * 0.5;
    
    for (let i = 0; i < numCandles; i++) {
      const x = i * spacing + (spacing / 2);
      // Random walk for vertical centers
      currentY += (Math.random() - 0.5) * H * 0.16;
      currentY = Math.max(H * 0.18, Math.min(H * 0.82, currentY));
      
      const green = Math.random() > 0.48;
      watermarkCandles.push(new WatermarkCandle(x, currentY, candleWidth, green));
    }
  }

  initWatermarkCandles();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initWatermarkCandles();
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.28;
      this.vy = (Math.random() - 0.5) * 0.28;
      this.r = Math.random() * 1.5 + 0.4;
      this.alpha = Math.random() * 0.22 + 0.05;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(2, 132, 199, ${this.alpha})`; // Cyan stars
      ctx.fill();
    }
  }

  for (let i = 0; i < maxParticles; i++) particles.push(new Particle());

  // Draw faint dotted horizontal price lines
  function drawGridlines() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.028)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    
    const levels = [H * 0.25, H * 0.5, H * 0.75];
    levels.forEach(level => {
      ctx.beginPath();
      ctx.moveTo(0, level);
      ctx.lineTo(W, level);
      ctx.stroke();
    });
    
    ctx.setLineDash([]); // Reset
  }

  let time = 0;

  function loop() {
    time += 0.01;
    ctx.clearRect(0, 0, W, H);

    // 1. Draw horizontal price gridlines
    drawGridlines();

    // 2. Draw watermark trading candles (floating behind stars)
    watermarkCandles.forEach(c => {
      c.update(time);
      c.draw();
    });

    // 3. Draw constellations
    particles.forEach(p => { p.update(); p.draw(); });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${(1 - dist/connectionDist) * 0.04})`; // Purple links
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}

// --- BINANCE LIVESTREAM & WEB CONSOLE FEED ---
const symMap = {
  btcusdt: 'btc',
  ethusdt: 'eth',
  bnbusdt: 'bnb',
  solusdt: 'sol',
  xrpusdt: 'xrp',
  dogeusdt: 'doge'
};

const priceColors = {
  btc: '#f59e0b',
  eth: '#a78bfa',
  bnb: '#f59e0b',
  sol: '#10b981',
  xrp: '#38bdf8',
  doge: '#fbbf24'
};

const priceHistory = { btc: [], eth: [], bnb: [], sol: [], xrp: [], doge: [] };
const currentPrices = { btc: 0, eth: 0, bnb: 0, sol: 0, xrp: 0, doge: 0 };
const currentChanges = { btc: 0, eth: 0, bnb: 0, sol: 0, xrp: 0, doge: 0 };

function drawSparkline(sym, prices, color) {
  const canvas = document.getElementById(`chart-${sym}`);
  if (!canvas || prices.length < 2) return;
  const ctx = canvas.getContext('2d');

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * w;
    const y = h - 4 - ((p - min) / range) * (h - 8);
    return { x, y };
  });

  const areaGrad = ctx.createLinearGradient(0, 0, 0, h);
  areaGrad.addColorStop(0, color + '20');
  areaGrad.addColorStop(1, color + '00');
  
  ctx.fillStyle = areaGrad;
  ctx.beginPath();
  ctx.moveTo(0, h);
  points.forEach(pt => ctx.lineTo(pt.x, pt.y));
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();
}

function formatPrice(sym, val) {
  val = parseFloat(val);
  if (sym === 'xrp' || sym === 'doge') return '$' + val.toFixed(4);
  if (val >= 1000) {
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return '$' + val.toFixed(2);
}

// Flash card background temporarily on ticks
function flashCardBG(sym, up) {
  const cardEl = document.getElementById(`card-${sym}`);
  if (!cardEl) return;
  
  // Wash with a soft glowing green/red tint for dark theme readability
  cardEl.style.backgroundColor = up ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
  cardEl.style.borderColor = up ? 'rgba(16, 185, 129, 0.45)' : 'rgba(239, 68, 68, 0.45)';
  
  setTimeout(() => {
    cardEl.style.backgroundColor = ''; // Restore to stylesheet default
    cardEl.style.borderColor = '';
  }, 450);
}

function updatePriceCard(sym, price, changePercent) {
  const priceEl = document.getElementById(`price-${sym}`);
  const changeEl = document.getElementById(`change-${sym}`);
  const badgeEl = document.getElementById(`badge-${sym}`);
  if (!priceEl) return;

  const formatted = formatPrice(sym, price);
  const up = changePercent >= 0;

  const hist = priceHistory[sym];
  if (hist.length === 0 || hist[hist.length - 1] !== price) {
    hist.push(price);
    if (hist.length > 25) hist.shift();
    drawSparkline(sym, hist, priceColors[sym]);
  }

  // Flash card background on ticks
  if (priceEl.textContent !== formatted) {
    flashCardBG(sym, up);
    priceEl.textContent = formatted;
    
    // Log tick events to terminal
    TerminalLog.print(`TICK ${sym.toUpperCase()} INGESTED AT ${formatted}`, "API");
  }

  if (changeEl) {
    changeEl.textContent = `${up ? '▲' : '▼'} ${Math.abs(changePercent).toFixed(2)}% (24h)`;
    changeEl.className = `coin-percent-chg ${up ? 'up' : 'down'}`;
  }

  if (badgeEl) {
    badgeEl.textContent = `${up ? '+' : ''}${changePercent.toFixed(2)}%`;
    badgeEl.className = `change-badge ${up ? 'up' : 'down'}`;
  }
}

function buildTicker() {
  const tracker = document.getElementById('ticker-track');
  if (!tracker) return;

  const keys = ['btc', 'eth', 'bnb', 'sol', 'xrp'];
  const content = keys.map((sym) => {
    const price = currentPrices[sym];
    const change = currentChanges[sym];
    const up = change >= 0;
    const formattedPrice = price > 0 ? formatPrice(sym, price) : '$--,---.--';
    
    return `
      <div class="ticker-item">
        <span class="ticker-symbol">${sym.toUpperCase()}/USDT</span>
        <span class="ticker-price">${formattedPrice}</span>
        <span class="ticker-change ${up ? 'up' : 'down'}">${up ? '▲' : '▼'}${Math.abs(change).toFixed(2)}%</span>
      </div>
    `;
  }).join('');

  tracker.innerHTML = content + content;
}

async function fetchInitialData() {
  TerminalLog.print("SEEDING PRICES INDEX FROM BINANCE REST API...", "API");
  try {
    const syms = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT'].map(s => `"${s}"`).join(',');
    const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=[${syms}]`);
    const data = await response.json();
    
    if (Array.isArray(data)) {
      data.forEach((item) => {
        const sym = symMap[item.symbol.toLowerCase()];
        if (!sym) return;
        
        const price = parseFloat(item.lastPrice);
        const change = parseFloat(item.priceChangePercent);
        
        currentPrices[sym] = price;
        currentChanges[sym] = change;
        
        const open = parseFloat(item.openPrice);
        const low = parseFloat(item.lowPrice);
        const high = parseFloat(item.highPrice);
        priceHistory[sym] = [open, low, (low+high)/2, high, price];

        if (sym !== 'doge') {
          updatePriceCard(sym, price, change);
        }
      });
      buildTicker();
      TerminalLog.print("INDEX SEED SYNC COMPLETE.", "API");
    }
  } catch (e) {
    TerminalLog.print("REST PRICE SYNC ENCOUNTERED NETWORK FAULT", "ERR");
  }
}

function connectBinanceStream() {
  const streams = Object.keys(symMap).map(s => s + '@ticker').join('/');
  const socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

  const statusText = document.getElementById('api-status');

  socket.onopen = () => {
    TerminalLog.print("WEBSOCKET CONNECTION SECURED.", "API");
    if (statusText) {
      statusText.innerHTML = '<span class="status-dot active"></span>STREAM LIVE';
    }
  };

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      const data = msg.data;
      if (!data || !data.s) return;

      const sym = symMap[data.s.toLowerCase()];
      if (!sym) return;

      const price = parseFloat(data.c);
      const change = parseFloat(data.P);

      currentPrices[sym] = price;
      currentChanges[sym] = change;

      if (sym !== 'doge') {
        updatePriceCard(sym, price, change);
      }
      buildTicker();
    } catch (e) {
      // ignore
    }
  };

  socket.onerror = () => {
    socket.close();
  };

  socket.onclose = () => {
    TerminalLog.print("WEBSOCKET DISCONNECT DETECTED. RETRYING...", "ERR");
    if (statusText) {
      statusText.innerHTML = '<span class="status-dot"></span>STREAM OFFLINE';
    }
    setTimeout(connectBinanceStream, 4000);
  };
}

// --- MOBILE MENU DRAWER ---
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    if (links.style.display === 'flex') {
      links.style.display = 'none';
      btn.innerHTML = '<i class="bi bi-list"></i>';
    } else {
      links.style.display = 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = 'var(--nav-h)';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'rgba(255, 255, 255, 0.96)';
      links.style.padding = '2rem';
      links.style.borderBottom = '1px solid rgba(0, 0, 0, 0.05)';
      btn.innerHTML = '<i class="bi bi-x-lg"></i>';
    }
  });

  const items = links.querySelectorAll('a');
  items.forEach((item) => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        links.style.display = 'none';
        btn.innerHTML = '<i class="bi bi-list"></i>';
      }
    });
  });
}

// --- GSAP SCROLL REVEAL STAGGERS ---
function initScrollReveal() {
  const sections = document.querySelectorAll('section.scroll-reveal');
  const options = { threshold: 0.08, rootMargin: "0px 0px -50px 0px" };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sec = entry.target;
        const sectionId = sec.id;
        
        // Fade in section container
        gsap.to(sec, { opacity: 1, duration: 0.4 });
        
        const tl = gsap.timeline();
        
        // Animate section heading if present (except Hero section which has its own layout)
        if (sectionId !== 'home') {
          const eyebrow = sec.querySelector('.section-heading-container .section-eyebrow');
          const title = sec.querySelector('.section-heading-container .section-title');
          const divider = sec.querySelector('.section-heading-container .section-divider');
          
          if (eyebrow) {
            tl.fromTo(eyebrow, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
          }
          if (title) {
            tl.fromTo(title, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, "-=0.35");
          }
          if (divider) {
            tl.fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, "-=0.3");
          }
        }
        
        // Section-specific animations
        if (sectionId === 'home') {
          // --- HERO SECTION ---
          const eyebrow = sec.querySelector('.hero-eyebrow');
          const title = sec.querySelector('.hero-title');
          const desc = sec.querySelector('.hero-desc');
          const btnPrimary = sec.querySelector('.hero-buttons .btn-primary');
          const btnSecondary = sec.querySelector('.hero-buttons .btn-secondary');
          const statsCards = sec.querySelectorAll('.hero-stats-row .stat-card');
          const canvasContainer = sec.querySelector('.hero-canvas-container');
          
          // Animate text copy from Left
          if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
          if (title) tl.fromTo(title, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, "-=0.4");
          if (desc) tl.fromTo(desc, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, "-=0.4");
          
          // Animate buttons (Explore from Left, Join from Right)
          if (btnPrimary) {
            tl.fromTo(btnPrimary, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.5, ease: 'back.out(1.2)' }, "-=0.3");
          }
          if (btnSecondary) {
            tl.fromTo(btnSecondary, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.5, ease: 'back.out(1.2)' }, "-=0.45");
          }
          
          // Animate stats cards: Card 1 from Left, Card 2 from Bottom, Card 3 from Right
          if (statsCards.length === 3) {
            tl.fromTo(statsCards[0], { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.6, ease: 'back.out(1.1)' }, "-=0.25");
            tl.fromTo(statsCards[1], { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.1)' }, "-=0.45");
            tl.fromTo(statsCards[2], { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.6, ease: 'back.out(1.1)' }, "-=0.45");
          } else if (statsCards.length > 0) {
            tl.fromTo(statsCards, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.1)' }, "-=0.3");
          }
          
          // Animate 3D canvas container from Right
          if (canvasContainer) {
            tl.fromTo(canvasContainer, { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, "-=1.0");
          }
          
        } else if (sectionId === 'universe') {
          // --- UNIVERSE SECTION ---
          const dashboard = sec.querySelector('.mining-dashboard');
          const visualizer = sec.querySelector('.mining-visualizer-frame');
          
          // Left panel slides from Left, Right panel slides from Right
          if (dashboard) {
            tl.fromTo(dashboard, { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, "-=0.2");
          }
          if (visualizer) {
            tl.fromTo(visualizer, { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, "-=0.55");
          }
          
        } else if (sectionId === 'prices') {
          // --- REAL-TIME PRICES SECTION ---
          const priceCards = sec.querySelectorAll('.price-card');
          const apiStatus = sec.querySelector('.stream-status-text');
          
          if (priceCards.length > 0) {
            priceCards.forEach((card, index) => {
              // Alternate entry directions: odd index from Right, even index from Left
              const direction = (index % 2 === 0) ? -80 : 80;
              tl.fromTo(card, 
                { opacity: 0, x: direction }, 
                { opacity: 1, x: 0, duration: 0.6, ease: 'back.out(1.15)' }, 
                index === 0 ? "-=0.2" : "-=0.48"
              );
            });
          }
          if (apiStatus) {
            tl.fromTo(apiStatus, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
          }
          
        } else if (sectionId === 'diagnostics') {
          // --- SYSTEM DIAGNOSTICS SECTION ---
          const speedometer = sec.querySelector('.speedometer-panel');
          const detailsPanel = sec.querySelector('.details-panel');
          
          // Speedometer from Left, Details/Log console from Right
          if (speedometer) {
            tl.fromTo(speedometer, { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, "-=0.2");
          }
          if (detailsPanel) {
            tl.fromTo(detailsPanel, { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, "-=0.55");
          }
          
        } else if (sectionId === 'about') {
          // --- ABOUT SECTION ---
          const visual = sec.querySelector('.about-visual');
          const heading = sec.querySelector('.about-heading');
          const text = sec.querySelector('.about-text');
          const features = sec.querySelectorAll('.feature-row');
          
          // Left visual orb slides from Left
          if (visual) {
            tl.fromTo(visual, { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, "-=0.2");
          }
          // Right text slides from Right
          if (heading) {
            tl.fromTo(heading, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, "-=0.55");
          }
          if (text) {
            tl.fromTo(text, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, "-=0.4");
          }
          // Feature rows alternate entry
          if (features.length > 0) {
            features.forEach((row, index) => {
              const direction = (index % 2 === 0) ? -60 : 60;
              tl.fromTo(row, 
                { opacity: 0, x: direction }, 
                { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 
                "-=0.35"
              );
            });
          }
          
        } else if (sectionId === 'strategies') {
          // --- STRATEGIES SECTION ---
          const strategyCards = sec.querySelectorAll('.strategy-card');
          
          if (strategyCards.length > 0) {
            strategyCards.forEach((card, index) => {
              // Alternate entry directions: odd index from Right, even index from Left
              const direction = (index % 2 === 0) ? -80 : 80;
              tl.fromTo(card, 
                { opacity: 0, x: direction }, 
                { opacity: 1, x: 0, duration: 0.6, ease: 'back.out(1.1)' }, 
                index === 0 ? "-=0.2" : "-=0.48"
              );
            });
          }
          
        } else if (sectionId === 'connect') {
          // --- CONNECT SECTION ---
          const innerContainer = sec.querySelector('.connect-container');
          const description = sec.querySelector('.connect-description');
          const socials = sec.querySelectorAll('.social-button');
          
          if (innerContainer) {
            tl.fromTo(innerContainer, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, "-=0.2");
          }
          if (description) {
            tl.fromTo(description, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.4");
          }
          
          // Social buttons slide from Left, Bottom, and Right
          if (socials.length === 3) {
            tl.fromTo(socials[0], { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.6, ease: 'back.out(1.2)' }, "-=0.25");
            tl.fromTo(socials[1], { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.2)' }, "-=0.45");
            tl.fromTo(socials[2], { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.6, ease: 'back.out(1.2)' }, "-=0.45");
          } else if (socials.length > 0) {
            tl.fromTo(socials, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)' }, "-=0.3");
          }
        }
        
        observer.unobserve(sec);
      }
    });
  }, options);

  sections.forEach(sec => {
    sec.style.opacity = 0;
    observer.observe(sec);
  });
}

// --- LIVE MINING HUD SIMULATION ---
const MiningLog = {
  container: null,
  init() {
    this.container = document.getElementById('mining-terminal-content');
    this.print("ASIC CONTROLLER NOMINAL");
    this.print("MINING POOL CONNECTED (US-EAST)");
  },
  print(text) {
    if (!this.container) return;
    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.innerHTML = `<span style="color:var(--cyan); font-weight:700;">[${time}] [MINE]</span> ${text}`;
    this.container.appendChild(line);
    
    // Auto scroll
    const consoleBox = this.container.parentElement;
    if (consoleBox) {
      consoleBox.scrollTop = consoleBox.scrollHeight;
    }
  }
};

window.MiningLog = MiningLog;

function initMiningHUD() {
  const hashrateEl = document.getElementById('mining-hashrate');
  const tempEl = document.getElementById('mining-temp');
  const blocksEl = document.getElementById('mining-blocks');
  
  if (!hashrateEl || !tempEl || !blocksEl) return;
  
  setInterval(() => {
    // Fluctuating Hashrate
    const rate = 246.0 + Math.random() * 5.5;
    hashrateEl.textContent = rate.toFixed(2) + " TH/s";
    
    // Fluctuating Temp
    const temp = 67.2 + Math.random() * 3.1;
    tempEl.textContent = temp.toFixed(2) + " °C";
    
    // Periodically log mining ticks
    if (Math.random() < 0.25) {
      MiningLog.print(`HASH RATE: ${rate.toFixed(2)} TH/s · TEMP: ${temp.toFixed(1)}°C`);
    }
    
    // ASIC Block solves (1.5% chance per tick)
    if (Math.random() < 0.015) {
      let currentBlocks = parseInt(blocksEl.textContent);
      if (!isNaN(currentBlocks)) {
        blocksEl.textContent = currentBlocks + 1;
        MiningLog.print(`BLOCK SOLVED! Found hash matching block target. Reward: 3.125 BTC`);
        TerminalLog.print(`BLOCK SOLVED BY LOCAL ASIC HARDWARE NODE.`, "NET");
        if (window.AudioSynth) window.AudioSynth.playWarpSweep(); // Play chime!
      }
    }
  }, 3000);
}

function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    // Play boot sweep sound if sound is on
    if (window.AudioSynth && !window.AudioSynth.isMuted) {
      window.AudioSynth.playWarpSweep();
    }

    // Trigger animated development warning notification toast after 1.5s delay
    setTimeout(() => {
      const devNotification = document.getElementById('dev-notification');
      if (devNotification) {
        devNotification.classList.add('show');
        
        // Play alert sound if audio is unmuted
        if (window.AudioSynth && !window.AudioSynth.isMuted) {
          window.AudioSynth.playClick();
        }
        
        // Bind click close event
        const closeBtn = document.getElementById('close-notification');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            devNotification.classList.remove('show');
            if (window.AudioSynth && !window.AudioSynth.isMuted) {
              window.AudioSynth.playClick();
            }
          });
        }
      }
    }, 1500);
  }
}

// --- INITIALIZE ALL SUB SYSTEMS ---
window.addEventListener('DOMContentLoaded', () => {
  TerminalLog.init();
  initBackgroundStarnet();
  initLiquidCursor();
  initLiquidCards();
  initScrollParallax();
  initAudioToggle();
  initMobileMenu();
  initScrollReveal();
  
  MiningLog.init();
  initMiningHUD();
  
  Diagnostics.init();

  fetchInitialData().then(() => {
    connectBinanceStream();
    setTimeout(hidePreloader, 2500); // Small buffer for visual completion
  });
});
