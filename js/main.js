(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],RM=matchMedia('(prefers-reduced-motion:reduce)').matches,M=innerWidth<700,HE=document.documentElement,clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),E=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
if(!RM)HE.classList.add('sw');
/* ---------- preloader: canvas pseudo-3D candles -> logo -> slogan -> glass fade ---------- */
function preload(done){const pre=$('#pre'),c=$('#pc'),g=c.getContext&&c.getContext('2d');let W,H,fin=0;
const end=()=>{if(fin)return;fin=1;pre.classList.add('out');setTimeout(()=>{pre.remove();done()},900)};$('#skip').onclick=end;
if(!g||RM){pre.classList.add('l','n','s');return setTimeout(end,RM?1200:300)}
const fit=()=>{W=c.width=innerWidth;H=c.height=innerHeight};fit();addEventListener('resize',fit);
const N=11,t0=performance.now(),cs=[...Array(N)].map((_,i)=>({u:i%3!=1,h:34+i*37%66,p:i*.5}));
const box=(x,y,w,h,d,col)=>{const a=x-w/2,b=y-h/2;g.fillStyle=col;g.fillRect(a,b,w,h);g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.moveTo(a,b);g.lineTo(a+d,b-d);g.lineTo(a+w+d,b-d);g.lineTo(a+w,b);g.fill();g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.moveTo(a+w,b);g.lineTo(a+w+d,b-d);g.lineTo(a+w+d,b+h-d);g.lineTo(a+w,b+h);g.fill()};
(function f(){if(fin)return;const t=(performance.now()-t0)/1e3;g.clearRect(0,0,W,H);
const cw=Math.min(W/(N*2),30),gap=cw*1.9,cy=H*.4,cv=clamp((t-2.3)/.9),ec=cv*cv*(3-2*cv),d=cw*.4*(1+.5*Math.sin(t*.9));
cs.forEach((o,i)=>{const gi=clamp(t*1.4-i*.12),x=W/2+(i-(N-1)/2)*gap*(1-ec),y=cy+(Math.sin(t*1.7+o.p)*14+Math.min(t,2.3)*(o.u?-9:9))*gi,h=o.h*gi*(1-ec*.9);
g.globalAlpha=(1-ec)*gi;g.strokeStyle='#9fd0ff';g.lineWidth=1.5;g.beginPath();g.moveTo(x,y-h/2-18);g.lineTo(x,y+h/2+18);g.stroke();box(x,y,cw,h,d,o.u?'#3fbf92':'#d95f5f')});
g.globalAlpha=1;t>2.9&&pre.classList.add('l');t>3.6&&pre.classList.add('n');t>4.2&&pre.classList.add('s');
if(t>5.4)return end();requestAnimationFrame(f)})()}
/* ---------- cursor swarm assembly ---------- */
const fx=$('#fx'),cx=fx.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),S=M?.9:1.15;let FW,FH;
const fit=()=>{FW=innerWidth;FH=innerHeight;fx.width=FW*dpr;fx.height=FH*dpr;cx.setTransform(dpr,0,0,dpr,0,0)};fit();addEventListener('resize',fit);
const spr=document.createElement('canvas');spr.width=spr.height=44;
{const s=spr.getContext('2d');s.translate(10,8);s.shadowColor='#9fd0ff';s.shadowBlur=10;const p=new Path2D('M0 0V17L4.6 13 7.6 20 10.2 18.8 7.2 12.2H12.6Z'),l=s.createLinearGradient(0,0,12,20);l.addColorStop(0,'#fff');l.addColorStop(.5,'#b8c2d2');l.addColorStop(1,'#6e7a8e');s.fillStyle=l;s.fill(p);s.shadowBlur=0;s.strokeStyle='#fffc';s.lineWidth=.8;s.stroke(p)}
const jobs=[],pts=[];let run=0;
const edge=()=>{const s=Math.random()*4|0,r=Math.random();return s<1?[r*FW,-30]:s<2?[FW+30,r*FH]:s<3?[r*FW,FH+30]:[-30,r*FH]};
function build(u,sp){const now=performance.now();let i=0;
$$('.b',u).filter(e=>e.closest('[data-u]')===u).forEach(el=>{const w=el.offsetWidth,n=M?2:clamp(Math.round(w/260)+1,2,4);
el.classList.remove('on');el.style.clipPath='inset(0 100% 0 0)';
jobs.push({el,t0:now+i++*230/sp,F:650/sp,B:(800+Math.min(w,700)*.9)/sp,L:600/sp,c:[...Array(n)].map((_,k)=>({row:(k+.5)/n,s:edge(),e:edge(),tr:[]}))})});
if(!run){run=1;requestAnimationFrame(tick)}}
function tick(now){cx.clearRect(0,0,FW,FH);
for(let j=jobs.length;j--;){const o=jobs[j],a=now-o.t0;if(a<0)continue;
const r=o.el.getBoundingClientRect(),p=E(clamp((a-o.F)/o.B)),lv=clamp((a-o.F-o.B)/o.L),fr=r.left+p*r.width;
if(a>=o.F+o.B&&!o.d){o.d=1;o.el.style.clipPath='';o.el.classList.add('on')}else if(!o.d)o.el.style.clipPath=`inset(0 ${(1-p)*100}% 0 0)`;
if(a>o.F+o.B+o.L){jobs.splice(j,1);continue}
if(!o.d&&a>o.F){cx.globalAlpha=.55;cx.fillStyle='#9fd0ff';cx.fillRect(fr-1,r.top,2,r.height)}
o.c.forEach(c=>{let x,y;const ty=r.top+c.row*r.height+Math.sin(a/300+c.row*6)*3;
if(a<o.F){const k=E(a/o.F);x=c.s[0]+(r.left-c.s[0])*k;y=c.s[1]+(ty-c.s[1])*k-Math.sin(k*Math.PI)*40}
else if(lv>0){const k=E(lv);x=r.right+(c.e[0]-r.right)*k;y=ty+(c.e[1]-ty)*k}else{x=fr;y=ty}
c.tr.push([x,y]);if(c.tr.length>12)c.tr.shift();
cx.globalAlpha=(1-lv*lv)*.4;cx.strokeStyle='#9fd0ff';cx.lineWidth=1.5;cx.beginPath();c.tr.forEach((q,i)=>i?cx.lineTo(q[0],q[1]):cx.moveTo(q[0],q[1]));cx.stroke();
cx.globalAlpha=1-lv*lv;cx.drawImage(spr,x-10*S,y-8*S,44*S,44*S);
if(a>o.F&&!lv&&pts.length<240&&Math.random()<(M?.35:.6))pts.push({x,y,vx:Math.random()-.5,vy:Math.random()*.7-.2,l:1,s:1.5+Math.random()*2.5,r:Math.random()*6})})}
for(let i=pts.length;i--;){const p=pts[i];p.x+=p.vx;p.y+=p.vy+.02;p.l-=.018;if(p.l<=0){pts.splice(i,1);continue}
cx.globalAlpha=p.l*.8;cx.fillStyle='rgba(200,230,255,.5)';cx.strokeStyle='#cfe8ff';cx.lineWidth=.7;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r+=.05);cx.beginPath();cx.moveTo(0,-p.s);cx.lineTo(p.s,p.s);cx.lineTo(-p.s,p.s*.6);cx.closePath();cx.fill();cx.stroke();cx.restore()}
cx.globalAlpha=1;if(jobs.length||pts.length)requestAnimationFrame(tick);else{run=0;cx.clearRect(0,0,FW,FH)}}
function init(){if(RM)return;
const io=new IntersectionObserver(es=>es.forEach(e=>{const u=e.target;
if(!u._in&&(e.intersectionRatio>=.15||e.intersectionRect.height>innerHeight*.45)){u._in=1;u._v=(u._v||0)+1;build(u,u._v>1?1.5:1)}
else if(u._in&&e.intersectionRatio<.04)u._in=0}),{threshold:[0,.04,.15,.3,.5]});
$$('[data-u]').forEach(u=>io.observe(u))}
/* ---------- background parallax + sticky offset ---------- */
const bg=$('#bg'),ov=$('#ov'),hd=$('header');
const sc=()=>{const y=scrollY,k=clamp(y/(innerHeight*1.1));bg.style.transform=`translate3d(0,${-y*.15}px,0) scale(1.12)`;bg.style.opacity=1-k;ov.style.opacity=.45+.55*k};
const hh=()=>HE.style.setProperty('--hh',hd.offsetHeight+'px');
addEventListener('scroll',sc,{passive:true});addEventListener('resize',hh);addEventListener('load',hh);sc();hh();
/* ---------- forex sessions (Intl timezone + DST aware) ---------- */
const Z=[['Sydney','Australia/Sydney',7,16],['Tokyo','Asia/Tokyo',9,18],['London','Europe/London',8,17],['New York','America/New_York',8,17]],fm={};
const P=(z,d)=>{const f=fm[z]||(fm[z]=new Intl.DateTimeFormat('en-US',{timeZone:z,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'})),o={};f.formatToParts(d).forEach(x=>o[x.type]=+x.value);return o};
const off=(z,ms)=>{const o=P(z,new Date(ms));return Date.UTC(o.year,o.month-1,o.day,o.hour,o.minute,o.second)-Math.floor(ms/1e3)*1e3};
const at=(z,y,m,d,h)=>{const g=Date.UTC(y,m,d,h),r=g-off(z,g);return g-off(z,r)};
const st=(s,n)=>{const o=P(s[1],new Date(n));for(let k=0;k<9;k++){if(new Date(Date.UTC(o.year,o.month-1,o.day+k)).getUTCDay()%6==0)continue;const a=at(s[1],o.year,o.month-1,o.day+k,s[2]),b=at(s[1],o.year,o.month-1,o.day+k,s[3]);if(n<a)return[0,a];if(n<b)return[1,b]}return[0,n]};
const z2=n=>String(n).padStart(2,'0'),fmt=ms=>{let s=Math.max(0,Math.floor(ms/1e3));const d=s/86400|0,h=s%86400/3600|0,m=s%3600/60|0;return(d?d+'d ':'')+z2(h)+':'+z2(m)+':'+z2(s%60)};
const sess=$('#sess'),tzn=Intl.DateTimeFormat().resolvedOptions().timeZone;
sess.innerHTML=Z.map(z=>`<div class="sc"><i></i><b>${z[0]}</b> <span></span><small></small></div>`).join('');
function clock(){const n=Date.now(),act=[];
$$('.sc',sess).forEach((e,i)=>{const s=Z[i],[o,t]=st(s,n),p=P(s[1],new Date(n));e.classList.toggle('on',!!o);if(o)act.push(s[0]);$('span',e).textContent=z2(p.hour)+':'+z2(p.minute);$('small',e).textContent=(o?'closes ':'opens ')+fmt(t-n)});
const y=P('America/New_York',new Date(n)),dw=new Date(Date.UTC(y.year,y.month-1,y.day)).getUTCDay(),wk=dw==6||(dw==0&&y.hour<17)||(dw==5&&y.hour>=17);
$('#info').textContent=`Your time ${new Date(n).toLocaleTimeString()} (${tzn}) · `+(act.length>1?'Overlap: '+act.join(' + '):act.length?act[0]+' session active':wk?'Weekend: forex market closed':'Between sessions')+' · conventional session hours'}
setInterval(clock,1000);clock();
/* ---------- ticker: real data only, otherwise "Data Unavailable" ---------- */
const T=[['XAU/USD',2,'XAUUSDT','Binance gold perpetual (XAUUSDT), USDT-quoted'],['US Oil',2,'CLUSDT','Binance crude oil perpetual (CLUSDT), USDT-quoted'],['NASDAQ / US Tech',2,'QQQUSDT','Binance QQQ (Nasdaq-100 ETF) perpetual, a proxy and not the index'],['EUR/USD',4,0,'ECB daily reference rate via Frankfurter (delayed)'],['BTC/USD',1,'BTCUSDT','Binance BTCUSDT perpetual, USDT-quoted']],tk=$('#tick'),V=T.map(()=>null);let ok=0;
tk.innerHTML=T.map(t=>`<div class="ti" title="${t[3]}"><b>${t[0]}</b><span>Loading…</span><em></em></div>`).join('');
function show(i,p,c){const e=tk.children[i],s=e.children[1],m=e.children[2];
if(p==null){e.className='ti na';s.textContent='Data Unavailable';m.textContent='';return}
ok=Date.now();const o=V[i],f=o==null?p:o,t0=performance.now(),d=T[i][1];V[i]=p;e.className='ti';
if(o!=null&&p!==o){void e.offsetWidth;e.classList.add(p>o?'up':'dn')}
(function s_(n){const k=clamp((n-t0)/500);s.textContent=(f+(p-f)*k).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});k<1&&requestAnimationFrame(s_)})(t0);
m.className=typeof c=='number'?c>=0?'p':'n':'';m.textContent=typeof c=='number'?(c>=0?'▲ +':'▼ ')+c.toFixed(2)+'%':c||''}
async function J(u){const a=new AbortController(),t=setTimeout(()=>a.abort(),6e3);try{const r=await fetch(u,{signal:a.signal});if(!r.ok)throw 0;return await r.json()}finally{clearTimeout(t)}}
const stamp=()=>$('#tsn').textContent=ok?'Updated '+new Date(ok).toLocaleTimeString():'No live data';
async function poll(){await Promise.all(T.map(async(t,i)=>{if(!t[2])return;try{const r=await J('https://fapi.binance.com/fapi/v1/ticker/24hr?symbol='+t[2]);show(i,+r.lastPrice,+r.priceChangePercent)}catch(e){show(i,null)}}));stamp()}
async function eur(){try{const r=await J('https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD');show(3,r.rates.USD,'ECB '+r.date)}catch(e){show(3,null)}stamp()}
poll();eur();setInterval(poll,5e3);setInterval(eur,18e5);
/* ---------- educational diagrams (illustrative, looping) ---------- */
const sup='rgba(239,107,107,.22)',dem='rgba(79,209,161,.22)',D=[
{p:[.4,.3,.25,.4,.55,.7,.75,.6,.45,.3,.25,.4,.6,.75,.7,.5,.3,.25],z:[[.23,.27,dem,0,'Support'],[.73,.77,sup,0,'Resistance']]},
{p:[.5,.45,.4,.34,.55,.7,.8,.7,.6,.5,.4,.37,.5,.7,.85],z:[[.32,.4,'rgba(159,208,255,.25)',3,'Order block']]},
{p:[.4,.42,.4,.46,.72,.76,.73,.7,.6,.5,.46,.5,.62,.74],z:[[.47,.6,'rgba(190,160,255,.25)',4,'Fair value gap']]},
{p:Array.from({length:20},(_,i)=>.26+.032*i+.07*Math.abs(Math.sin(i*.9))),tl:[.2,.84]},
{p:[.45,.55,.6,.5,.42,.5,.58,.6,.52,.45,.58,.66,.75,.8,.72,.64,.7,.82,.9],z:[[.59,.61,'rgba(239,107,107,.6)',0,'Resistance (breakout)']]},
{p:[.15,.3,.45,.6,.75,.85,.78,.68,.58,.5,.45,.42,.46,.55,.7,.82,.9],z:[[.417,.5,'rgba(255,215,140,.28)',5,'Golden zone']],l:[[.85,'0'],[.583,'38.2'],[.5,'50'],[.417,'61.8'],[.3,'78.6'],[.15,'100']]},
{p:[.5,.55,.6,.52,.48,.55,.65,.7,.62,.55,.45,.4,.48,.58,.66,.6,.5,.42,.5,.6],h:1},
{p:[.5,.6,.7,.78,.7,.55,.4,.28,.2,.3,.5,.65,.76,.8,.68,.5,.35,.22,.28,.45],z:[[.74,.82,sup,0,'Supply'],[.16,.24,dem,0,'Demand']]}];
function dia(cv,d){const g=cv.getContext('2d'),n=d.p.length;let W=0,Hh,vis=0;
const fit=()=>{const r=cv.getBoundingClientRect(),k=Math.min(devicePixelRatio||1,2);cv.width=r.width*k;cv.height=r.height*k;g.setTransform(k,0,0,k,0,0);W=r.width;Hh=r.height};fit();new ResizeObserver(fit).observe(cv);new IntersectionObserver(e=>vis=e[e.length-1].isIntersecting).observe(cv);
const Y=v=>Hh*(.94-v*.88),X=i=>W*.04+i*W*.92/n,bw=Math.max(4,W*.92/n*.55);
return t=>{if(!vis||!W)return;g.clearRect(0,0,W,Hh);g.font='10px system-ui';const m=RM?n:(t/1e3*3.5)%(n+8);
if(d.h)for(let i=0;i<14;i++){g.fillStyle=`rgba(${i%3?'120,180,255':'190,160,255'},${.1+.3*Math.abs(Math.sin(t/900+i*1.9))*(.4+.6*Math.abs(Math.sin(i*2.3)))})`;g.fillRect(W*.04,Hh*.06+i*Hh*.062,W*.92,Hh*.05)}
(d.z||[]).forEach(z=>{if(m<z[3])return;g.fillStyle=z[2];g.fillRect(X(z[3]),Y(z[1]),W*.96-X(z[3]),Y(z[0])-Y(z[1]));g.fillStyle='#cfd8e6';g.fillText(z[4],W*.96-g.measureText(z[4]).width-4,Y(z[0])+11)});
(d.l||[]).forEach(l=>{g.strokeStyle='#ffffff30';g.beginPath();g.moveTo(W*.04,Y(l[0]));g.lineTo(W*.96,Y(l[0]));g.stroke();g.fillStyle='#9aa6b8';g.fillText(l[1],W*.04+2,Y(l[0])-2)});
if(d.tl){const q=Math.min(n,m);g.strokeStyle='#9fd0ff';g.setLineDash([5,4]);g.beginPath();g.moveTo(X(0),Y(d.tl[0]));g.lineTo(X(q),Y(d.tl[0]+(d.tl[1]-d.tl[0])*q/n));g.stroke();g.setLineDash([])}
for(let i=0;i<Math.min(n,Math.ceil(m));i++){const f=clamp(m-i),a=i?d.p[i-1]:d.p[0]-.03,b=a+(d.p[i]-a)*f,x=X(i)+bw/2;g.strokeStyle=g.fillStyle=b>=a?'#4fd1a1':'#ef6b6b';g.beginPath();g.moveTo(x,Y(Math.max(a,b)+.025));g.lineTo(x,Y(Math.min(a,b)-.025));g.stroke();g.fillRect(x-bw/2,Y(Math.max(a,b)),bw,Math.max(2,Math.abs(Y(a)-Y(b))))}}}
const dr=$$('canvas[data-d]').map(c=>dia(c,D[+c.dataset.d]));
(function L(t){dr.forEach(f=>f(t));requestAnimationFrame(L)})(0);
preload(init);
})();
