/* ══════════════════════════════════════
   AgentShare Tamagotchi — main.js
   3D PIXEL (영화 "픽셀" 스타일) — v3
══════════════════════════════════════ */

/* ── COLOR HELPERS ── */
function shadeColor(hex, pct) {
  const n = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + pct));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + pct));
  const b = Math.min(255, Math.max(0, (n & 0xff) + pct));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2,'0')).join('');
}

/* ── 3D PIXEL CUBE ──
   col, row : 그리드 위치
   color    : 앞면 색상
   S        : 픽셀 한 변 길이 (px)
   D        : 아이소 깊이 오프셋 (px)
*/
function px3d(col, row, color, S, D) {
  const x = col * S;
  const y = row * S;

  const front = `<rect x="${x}" y="${y}" width="${S}" height="${S}" fill="${color}"/>`;

  // 상단면 (가장 밝음) — x,y → x+D,y-D → x+S+D,y-D → x+S,y
  const topC = shadeColor(color, 70);
  const top  = `<path d="M${x},${y} L${x+D},${y-D} L${x+S+D},${y-D} L${x+S},${y} Z" fill="${topC}"/>`;

  // 우측면 (어두움) — x+S,y → x+S+D,y-D → x+S+D,y+S-D → x+S,y+S
  const rightC = shadeColor(color, -55);
  const right  = `<path d="M${x+S},${y} L${x+S+D},${y-D} L${x+S+D},${y+S-D} L${x+S},${y+S} Z" fill="${rightC}"/>`;

  // 크롬 하이라이트 (상단 모서리 흰 반사선)
  const chrome = `<line x1="${x}" y1="${y}" x2="${x+S}" y2="${y}" stroke="rgba(255,255,255,0.55)" stroke-width="1.2"/>`;

  return front + top + right + chrome;
}

/* ── BUILD PIXEL CHARACTER SVG ──
   pixels = [[col, row, color], ...]
   S      = 픽셀 한 변 (기본 9)
   D      = 아이소 깊이 (기본 3)
   pad    = 여백 (0 = 완전 없앰)
*/
function buildPixelChar(pixels, S, D, pad) {
  S   = S   !== undefined ? S   : 9;
  D   = D   !== undefined ? D   : 3;
  pad = pad !== undefined ? pad : 0;

  if (!pixels || pixels.length === 0) return '<svg width="1" height="1"></svg>';

  /* 바운딩박스 계산 */
  let minCol = Infinity, maxCol = -Infinity;
  let minRow = Infinity, maxRow = -Infinity;
  pixels.forEach(([c, r]) => {
    if (c < minCol) minCol = c;
    if (c > maxCol) maxCol = c;
    if (r < minRow) minRow = r;
    if (r > maxRow) maxRow = r;
  });

  /* 실제 캔버스 크기
     — 우측/상단에 아이소 돌출 D 만큼 추가 */
  const cols = maxCol - minCol + 1;
  const rows = maxRow - minRow + 1;

  const W = cols * S + D + pad * 2;   // 가로: 픽셀 + 우측 돌출 + 패딩
  const H = rows * S + D + pad * 2;   // 세로: 픽셀 + 상단 돌출 + 패딩

  /* 오프셋: 정규화 (minCol, minRow → 0,0) + 패딩 + 상단 돌출 보상 */
  const ox = -minCol * S + pad;
  const oy = -minRow * S + pad + D;   // 상단 돌출(D)만큼 아래로 밀어 잘리지 않게

  const id = 'pc' + Math.random().toString(36).slice(2, 7);

  let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<defs>
    <filter id="${id}-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="${id}-outer" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>`;

  /* 글로우 레이어 (뒤에 흐릿하게) */
  svg += `<g transform="translate(${ox},${oy})" filter="url(#${id}-outer)" opacity="0.45">`;
  pixels.forEach(([c, r, color]) => { svg += px3d(c, r, color, S, D); });
  svg += `</g>`;

  /* 실제 3D 레이어 */
  svg += `<g transform="translate(${ox},${oy})" filter="url(#${id}-glow)">`;
  pixels.forEach(([c, r, color]) => { svg += px3d(c, r, color, S, D); });
  svg += `</g>`;

  svg += `</svg>`;
  return svg;
}

/* ══════════════════════════════════════
   LEVEL-BASED CHARACTER BUILDERS
══════════════════════════════════════ */

/* ── LV1: 픽셀 계란 ── */
function buildEgg(color) {
  const S = 9, D = 3;
  const C  = color;
  const CL = shadeColor(color, 40);   // 하이라이트
  const CD = shadeColor(color, -30);  // 그림자
  const W  = '#ffffff';
  const Y  = '#f9e04b';               // 노른자 빛 안쪽

  // 7열 × 9행 타원형 계란 모양
  // 열: 0-6, 행: 0-8
  const pixels = [
    // 행0 — 꼭대기 (좁음)
    [2,0,C],[3,0,C],[4,0,C],
    // 행1
    [1,1,C],[2,1,C],[3,1,C],[4,1,C],[5,1,C],
    // 행2
    [1,2,C],[2,2,CL],[3,2,CL],[4,2,C],[5,2,C],
    // 행3
    [0,3,C],[1,3,C],[2,3,C],[3,3,C],[4,3,C],[5,3,C],[6,3,C],
    // 행4 (중간 — 가장 넓음)
    [0,4,C],[1,4,C],[2,4,C],[3,4,Y],[4,4,C],[5,4,C],[6,4,C],
    // 행5
    [0,5,C],[1,5,C],[2,5,C],[3,5,C],[4,5,C],[5,5,C],[6,5,C],
    // 행6
    [1,6,C],[2,6,CD],[3,6,CD],[4,6,CD],[5,6,C],
    // 행7
    [1,7,C],[2,7,C],[3,7,C],[4,7,C],[5,7,C],
    // 행8 — 밑둥 (좁음)
    [2,8,CD],[3,8,CD],[4,8,CD],
    // 하이라이트 점
    [2,2,CL],[3,1,CL],
  ];
  return buildPixelChar(pixels, S, D, 1);
}

/* ── LV2~3: 부화 직후 아기 ── */
function buildBaby(color) {
  const S = 9, D = 3;
  const C  = color;
  const CL = shadeColor(color, 50);
  const CD = shadeColor(color, -40);
  const W  = '#f5f5ff';
  const BK = '#111133';
  const PK = '#ff8fab';
  const EG = shadeColor('#f9e04b', -10); // 껍데기 노랑

  // 5열 × 7행 (껍데기에서 막 나온 느낌)
  const pixels = [
    // 껍데기 조각 (위)
    [1,0,EG],[3,0,EG],
    // 머리 (동그스름)
    [1,1,C],[2,1,C],[3,1,C],
    [0,2,C],[1,2,CL],[2,2,C],[3,2,C],[4,2,C],
    [0,3,C],[1,3,C],[2,3,C],[3,3,C],[4,3,C],
    // 눈
    [1,2,W],[3,2,W],
    [1,2,BK],[3,2,BK],
    // 입 (작은 웃음)
    [2,3,PK],
    // 몸통 (작음)
    [1,4,C],[2,4,C],[3,4,C],
    [1,5,CD],[2,5,C],[3,5,CD],
    // 발
    [1,6,CD],[3,6,CD],
  ];
  return buildPixelChar(pixels, S, D, 1);
}

/* ══════════════════════════════════════
   FULL CHARACTER PIXEL MAPS
══════════════════════════════════════ */

/* ── 잼미나이 풀 (보라) ── */
function buildGeminiFull() {
  const S = 9, D = 3;
  const P  = '#8B5CF6';  // 메인 보라
  const PL = '#C4B5FD';  // 연보라
  const PD = '#5B21B6';  // 진보라
  const W  = '#f5f3ff';  // 흰 눈
  const BK = '#1e1b4b';  // 눈동자
  const PK = '#E879F9';  // 핑크 입

  const pixels = [
    // 행0 — 뿔 2개
    [1,0,PD],[5,0,PD],
    // 행1 — 뿔 아래 + 머리 시작
    [1,1,PD],[2,1,P],[3,1,P],[4,1,P],[5,1,PD],
    // 행2 — 이마
    [0,2,P],[1,2,P],[2,2,P],[3,2,P],[4,2,P],[5,2,P],[6,2,P],
    // 행3 — 눈 줄
    [0,3,P],[1,3,P],[2,3,W],[3,3,P],[4,3,W],[5,3,P],[6,3,P],
    // 행3b — 눈동자 (W 위에 BK — SVG 순서로 덮어쓰기)
    [2,3,BK],[4,3,BK],
    // 행4 — 볼
    [0,4,PL],[1,4,P],[2,4,P],[3,4,P],[4,4,P],[5,4,P],[6,4,PL],
    // 행5 — 입
    [0,5,P],[1,5,P],[2,5,PK],[3,5,PK],[4,5,P],[5,5,P],[6,5,P],
    // 행6 — 턱
    [1,6,P],[2,6,P],[3,6,P],[4,6,P],[5,6,P],
    // 행7 — 어깨 (넓음)
    [0,7,P],[1,7,P],[2,7,P],[3,7,P],[4,7,P],[5,7,P],[6,7,P],
    // 행8 — 팔 + 몸
    [0,8,PL],[1,8,P],[2,8,P],[3,8,P],[4,8,P],[5,8,P],[6,8,PL],
    // 행9 — 하체
    [1,9,P],[2,9,P],[3,9,P],[4,9,P],[5,9,P],
    // 행10 — 발
    [1,10,PD],[2,10,PD],[4,10,PD],[5,10,PD],
  ];
  return buildPixelChar(pixels, S, D, 0);
}

/* ── 쥐피티 풀 (초록 로봇) ── */
function buildGptFull() {
  const S = 9, D = 3;
  const P  = '#10B981';  // 메인 초록
  const PL = '#6EE7B7';  // 연초록
  const PD = '#065F46';  // 진초록
  const W  = '#ecfdf5';  // 흰 눈
  const BK = '#022c22';  // 눈동자
  const Y  = '#fbbf24';  // 노랑 버튼

  const pixels = [
    // 행-1 — 안테나 막대
    [3,-1,PD],[3,-2,Y],
    // 행0 — 안테나 볼
    [2,0,PD],[3,0,Y],[4,0,PD],
    // 행1 — 머리 위
    [1,1,P],[2,1,P],[3,1,P],[4,1,P],[5,1,P],
    // 행2 — 얼굴 위
    [0,2,P],[1,2,P],[2,2,P],[3,2,P],[4,2,P],[5,2,P],[6,2,P],
    // 행3 — 눈 줄 (사각 LED)
    [0,3,P],[1,3,W],[2,3,W],[3,3,P],[4,3,W],[5,3,W],[6,3,P],
    // 눈동자
    [1,3,BK],[2,3,BK],[4,3,BK],[5,3,BK],
    // 행4 — 콧대
    [0,4,P],[1,4,P],[2,4,P],[3,4,PL],[4,4,P],[5,4,P],[6,4,P],
    // 행5 — 입 라인
    [0,5,P],[1,5,PL],[2,5,PL],[3,5,PL],[4,5,PL],[5,5,PL],[6,5,P],
    // 행6 — 턱
    [0,6,P],[1,6,P],[2,6,P],[3,6,P],[4,6,P],[5,6,P],[6,6,P],
    // 행7 — 어깨 (귀볼트 포함)
    [0,7,PD],[1,7,P],[2,7,P],[3,7,P],[4,7,P],[5,7,P],[6,7,PD],
    // 행8 — 가슴 (버튼)
    [0,8,P],[1,8,P],[2,8,Y],[3,8,P],[4,8,Y],[5,8,P],[6,8,P],
    // 행9 — 하체
    [1,9,P],[2,9,P],[3,9,P],[4,9,P],[5,9,P],
    // 행10 — 발
    [1,10,PD],[2,10,PD],[4,10,PD],[5,10,PD],
  ];
  return buildPixelChar(pixels, S, D, 0);
}

/* ── 클로드 풀 (주황 고양이) ── */
function buildClaudeFull() {
  const S = 9, D = 3;
  const P  = '#F97316';  // 메인 주황
  const PL = '#FBBF24';  // 노란 하이라이트
  const PD = '#C2410C';  // 진주황
  const W  = '#fff7ed';  // 흰 눈
  const BK = '#431407';  // 눈동자
  const PK = '#fda4af';  // 핑크 코

  const pixels = [
    // 행0 — 고양이 귀 끝 (뾰족)
    [0,0,PD],[6,0,PD],
    // 행1 — 귀
    [0,1,P],[1,1,P],[5,1,P],[6,1,P],
    // 행2 — 이마
    [1,2,P],[2,2,P],[3,2,P],[4,2,P],[5,2,P],
    // 행3 — 눈 줄
    [0,3,P],[1,3,P],[2,3,W],[3,3,P],[4,3,W],[5,3,P],[6,3,P],
    // 눈동자
    [2,3,BK],[4,3,BK],
    // 행4 — 코 + 볼
    [0,4,P],[1,4,PL],[2,4,P],[3,4,PK],[4,4,P],[5,4,PL],[6,4,P],
    // 행5 — 입 (W자)
    [0,5,P],[1,5,P],[2,5,PD],[3,5,P],[4,5,PD],[5,5,P],[6,5,P],
    // 행6 — 턱
    [1,6,P],[2,6,P],[3,6,P],[4,6,P],[5,6,P],
    // 행7 — 어깨
    [0,7,P],[1,7,P],[2,7,P],[3,7,P],[4,7,P],[5,7,P],[6,7,P],
    // 행8 — 몸 + 꼬리(우측)
    [0,8,P],[1,8,P],[2,8,P],[3,8,P],[4,8,P],[5,8,P],[7,8,PD],
    // 행9 — 하체 + 꼬리
    [1,9,P],[2,9,P],[3,9,P],[4,9,P],[5,9,P],[7,9,PD],[8,9,PD],
    // 행10 — 발
    [1,10,PD],[2,10,PD],[4,10,PD],[5,10,PD],
  ];
  return buildPixelChar(pixels, S, D, 0);
}

/* ══════════════════════════════════════
   CHARACTER DEFS
══════════════════════════════════════ */
const CHARS = {
  gemini: {
    name:'잼미나이', emoji:'⭐',
    color: '#8B5CF6',
    foods:[
      {icon:'🍬',name:'별사탕',hunger:20,happy:5},
      {icon:'🔮',name:'크리스탈',hunger:35,happy:10},
      {icon:'🌙',name:'달빛젤리',hunger:50,happy:15}
    ],
    responses:[
      '오 진짜?! 더 알려줘! 🌟','와 그거 신기하다!','음... 궁금한데?','나도 알고 싶어! ⭐',
      '오오 흥미진진! 🔮','진짜? 더 얘기해줘~','우와~ 멋지다!','그거 해볼래!'
    ],
    svg: function() {
      const p = pet();
      const lv = p ? p.level : 1;
      if (lv <= 1) return buildEgg(CHARS.gemini.color);
      if (lv <= 3) return buildBaby(CHARS.gemini.color);
      return buildGeminiFull();
    }
  },
  gpt: {
    name:'쥐피티', emoji:'🧠',
    color: '#10B981',
    foods:[
      {icon:'🧪',name:'데이터칩',hunger:20,happy:5},
      {icon:'📚',name:'지식젤리',hunger:35,happy:10},
      {icon:'💊',name:'뉴런캡슐',hunger:50,happy:15}
    ],
    responses:[
      '흥미로운 질문이네! 🤔','데이터를 분석해볼게...','논리적으로 생각하면~','알고리즘이 말해주는데...',
      '패턴을 발견했어! 📊','좋은 관점이야!','계산해볼게... 완료! ✅','더 깊이 파보자!'
    ],
    svg: function() {
      const p = pet();
      const lv = p ? p.level : 1;
      if (lv <= 1) return buildEgg(CHARS.gpt.color);
      if (lv <= 3) return buildBaby(CHARS.gpt.color);
      return buildGptFull();
    }
  },
  claude: {
    name:'클로드', emoji:'🎭',
    color: '#F97316',
    foods:[
      {icon:'🍊',name:'오렌지칩',hunger:20,happy:5},
      {icon:'☕',name:'에스프레소',hunger:35,happy:10},
      {icon:'🎂',name:'시나몬케이크',hunger:50,happy:15}
    ],
    responses:[
      '그건 좀 복잡한데... 같이 생각해볼까? 🤔','재밌는 관점이야!','솔직히 말하면~','다른 각도에서 보면...',
      '흠, 좋은 질문이야! 🎭','나라면 이렇게 할 것 같아','공감해! 맞는 말이야~','깊이 있는 대화 좋아! ☕'
    ],
    svg: function() {
      const p = pet();
      const lv = p ? p.level : 1;
      if (lv <= 1) return buildEgg(CHARS.claude.color);
      if (lv <= 3) return buildBaby(CHARS.claude.color);
      return buildClaudeFull();
    }
  }
};

const EXP_THRESHOLDS = [0, 5, 20, 50, 100, 200, 400, 800];

/* ── STATE ── */
let currentChar = 'gemini';
let pets = {};
let fainted = false;
let activePanel = null;
let decayTimer = null;

function defaultPet(){ return {hunger:80, happy:80, exp:0, level:1}; }

function loadState(){
  try {
    const d = JSON.parse(localStorage.getItem('agentshare_tama') || '{}');
    currentChar = d.currentChar || 'gemini';
    pets = d.pets || {};
  } catch(e){ pets={}; }
  ['gemini','gpt','claude'].forEach(c=>{ if(!pets[c]) pets[c]=defaultPet(); });
}

function saveState(){
  localStorage.setItem('agentshare_tama', JSON.stringify({currentChar, pets}));
}

function pet(){ return pets[currentChar]; }

/* ── UI UPDATE ── */
function updateUI(){
  const p = pet(), c = CHARS[currentChar];
  document.getElementById('char-name').textContent = c.name;
  // char-lv = 배지 숫자
  const lvEl = document.getElementById('char-lv');
  if(lvEl) lvEl.textContent = p.level;

  // exp
  const curThresh  = EXP_THRESHOLDS[p.level] || EXP_THRESHOLDS[EXP_THRESHOLDS.length-1];
  const prevThresh = EXP_THRESHOLDS[p.level-1] || 0;
  const range  = curThresh - prevThresh;
  const prog   = range > 0 ? Math.min(((p.exp - prevThresh) / range) * 100, 100) : 100;
  const expFill = document.getElementById('exp-fill');
  if(expFill) expFill.style.width = prog + '%';
  document.getElementById('exp-next').textContent = 'EXP ' + p.exp + '/' + curThresh;

  // stats
  const hf = document.getElementById('hunger-fill');
  if(hf) hf.style.width = Math.max(0,p.hunger) + '%';
  document.getElementById('hunger-pct').textContent = Math.max(0,p.hunger);
  const hpf = document.getElementById('happy-fill');
  if(hpf) hpf.style.width = Math.max(0,p.happy) + '%';
  document.getElementById('happy-pct').textContent  = Math.max(0,p.happy);

  // avatar — SVG를 직접 삽입, wrapper 크기는 CSS가 처리
  document.getElementById('avatar-svg').innerHTML = c.svg();

  // fainted
  if(p.hunger <= 0 && !fainted) triggerFainted();
  if(p.hunger > 0 && fainted)   recoverFainted();

  saveState();
}

/* ── TABS ── */
function switchChar(c){
  if(c === currentChar) return;
  currentChar = c;
  document.body.setAttribute('data-char', c);
  document.querySelectorAll('.char-tab, .csw-btn').forEach(t => t.classList.remove('active'));
  const tabEl = document.getElementById('tab-'+c);
  if(tabEl) tabEl.classList.add('active');
  setBubble(CHARS[c].name + ' 등장! ' + CHARS[c].emoji);
  addChat('sys', CHARS[c].name + ' 등장! ' + CHARS[c].emoji);
  buildFeedItems();
  updateUI();
  saveState();
}

/* ── FEED ── */
function buildFeedItems(){
  const el = document.getElementById('feed-items');
  const foods = CHARS[currentChar].foods;
  el.innerHTML = foods.map((f,i) =>
    '<div class="fitem" onclick="feedPet('+i+')">'
    +'<div class="ficon">'+f.icon+'</div>'
    +'<div class="fname">'+f.name+'</div>'
    +'<div class="fval">+'+f.hunger+'🍖</div></div>'
  ).join('');
}

function feedPet(idx){
  if(fainted){
    const p = pet();
    p.hunger = 30; p.happy = Math.min(100, p.happy+10);
    recoverFainted();
    setBubble('살았다... 고마워... 😭');
    addChat('sys','부활!');
    updateUI(); return;
  }
  const f = CHARS[currentChar].foods[idx];
  const p = pet();
  p.hunger = Math.min(100, p.hunger + f.hunger);
  p.happy  = Math.min(100, p.happy  + f.happy);
  gainExp(10);
  setBubble('냠냠~ '+f.name+' 맛있어! '+f.icon);
  addChat('agent', f.name + ' 먹었다! (hunger +'+f.hunger+')');
  showExpFlash('+10 EXP');
  updateUI();
}

/* ── PET CLICK ── */
let petClicks = 0;
function petClick(){
  if(fainted) return;
  petClicks++;
  if(petClicks > 8){
    petClicks = 0;
    setBubble('아야!! 너무 많이 만지지 마!! 😡');
    const p = pet(); p.happy = Math.max(0, p.happy-5);
    const appEl = document.querySelector('.app') || document.getElementById('device');
    if(appEl) { appEl.classList.add('shaking'); setTimeout(()=>appEl.classList.remove('shaking'),500); }
    updateUI(); return;
  }
  setTimeout(()=>{ petClicks = Math.max(0, petClicks-1); }, 3000);
  const p = pet();
  p.happy = Math.min(100, p.happy + 15);
  gainExp(5);
  setBubble(pick(['좋아좋아~ 🥰','기분 좋다! 💕','더 해줘! ✨','행복해~ 😊','으히히~ 💖']));
  showHearts();
  showExpFlash('+5 EXP');
  updateUI();
}

/* ── PLAY ── */
function playGame(name){
  if(fainted) return;
  const vals = {'가위바위보':10, '퀴즈':20, '노래방':15};
  const v = vals[name] || 10;
  const p = pet();
  p.happy = Math.min(100, p.happy + v);
  gainExp(8);
  setBubble(name + ' 재밌다!! 🎮');
  addChat('agent', name + ' 놀이 완료! (happy +'+v+')');
  showExpFlash('+8 EXP');
  updateUI();
}

/* ── CHAT ── */
function addChat(type, text){
  // 새 tg-chat ID 우선, 구버전 chat-area 폴백
  const area = document.getElementById('tg-chat') || document.getElementById('chat-area');
  if(!area) return;
  const div  = document.createElement('div');
  div.className = 'chat-line ' + type;
  div.textContent = text;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
  if(area.children.length > 80) area.removeChild(area.firstChild);
}

function sendChat(){
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if(!msg) return;
  input.value = '';
  addChat('user', msg);
  if(fainted){ addChat('agent','...'); return; }
  gainExp(3);
  updateUI();

  // Gemini API가 있으면 실제 대화
  if(window.agentShare && window.agentShare.chat){
    // 타이핑 인디케이터
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    const area = document.getElementById('chat-area');
    if(area){ area.appendChild(typingDiv); area.scrollTop = area.scrollHeight; }

    window.agentShare.chat(msg).then(reply => {
      typingDiv.remove();
      addChat('agent', reply);
      setBubble(reply);
    }).catch(() => {
      typingDiv.remove();
      const resp = pick(CHARS[currentChar].responses);
      addChat('agent', resp);
      setBubble(resp);
    });
  } else {
    const resp = pick(CHARS[currentChar].responses);
    setTimeout(()=>{
      addChat('agent', resp);
      setBubble(resp);
    }, 400 + Math.random()*600);
  }
}

/* ── EXP / LEVEL ── */
function gainExp(n){
  const p = pet();
  p.exp += n;
  const threshold = EXP_THRESHOLDS[p.level] || EXP_THRESHOLDS[EXP_THRESHOLDS.length-1];
  if(p.exp >= threshold && p.level < EXP_THRESHOLDS.length){
    p.level++;
    showLevelUp(p.level);
  }
  saveState();
}

function showLevelUp(lv){
  const ol = document.getElementById('levelup-overlay');
  document.getElementById('levelup-sub').textContent = 'LV.' + lv + ' UNLOCKED';
  ol.classList.add('show');
  addChat('sys','🎉 LEVEL UP! → LV.'+lv);
  showFanfare('🎉 LEVEL ' + lv + '!');
  setTimeout(()=>ol.classList.remove('show'), 2500);
}

/* ── FAINTED ── */
function triggerFainted(){
  fainted = true;
  document.getElementById('fainted-overlay').classList.add('show');
  setBubble('배고파... 힘이 없어...');
  addChat('sys','⚠ FAINTED — 먹이를 줘서 살려줘!');
}
function recoverFainted(){
  fainted = false;
  document.getElementById('fainted-overlay').classList.remove('show');
}

/* ── BUBBLE ── */
function setBubble(text){
  // 구버전 bubble 요소 (숨겨져 있어도 에러 없이)
  const bel = document.getElementById('bubble');
  if(bel) bel.textContent = text;
  // 새 UI: agent-status-text에 반영
  const sts = document.getElementById('agent-status-text');
  if(sts && text) sts.textContent = text.slice(0, 30);
}

/* ── PANELS ── */
function togglePanel(name){
  const panelArea = document.getElementById('panel-area');
  // 모든 패널 숨기기 (.tg-panel + 구버전 .panel 모두)
  document.querySelectorAll('.tg-panel, .panel').forEach(p=> p.style.display = 'none');
  document.querySelectorAll('.qa-btn, .tg-act-btn, .qbtn').forEach(b=>b.classList.remove('active'));

  if(activePanel === name){
    activePanel = null;
    panelArea.style.display = 'none';
    return;
  }
  activePanel = name;
  panelArea.style.display = 'block';
  const panel = document.getElementById('panel-'+name);
  if(panel) panel.style.display = 'block';
  const btn = document.getElementById('btn-'+name);
  if(btn) btn.classList.add('active');
}

/* ── EFFECTS ── */
function showExpFlash(text){
  const el = document.createElement('div');
  el.className = 'exp-flash';
  el.textContent = text;
  const aw = document.getElementById('agent-avatar-wrap') || document.getElementById('avatar-wrap');
  const rect = aw ? aw.getBoundingClientRect() : {left:100,top:100,width:50};
  el.style.left = (rect.left + rect.width/2 - 30) + 'px';
  el.style.top  = (rect.top - 10) + 'px';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 1200);
}

function showHearts(){
  const aw2 = document.getElementById('agent-avatar-wrap') || document.getElementById('avatar-wrap');
  const rect = aw2 ? aw2.getBoundingClientRect() : {left:100,top:100,width:50};
  for(let i=0; i<5; i++){
    const h = document.createElement('div');
    h.className = 'heart-ptcl';
    h.textContent = pick(['💕','💖','❤️','💗','✨']);
    h.style.left = (rect.left + Math.random()*rect.width) + 'px';
    h.style.top  = (rect.top  + Math.random()*20) + 'px';
    h.style.animationDelay = (i*0.12)+'s';
    document.body.appendChild(h);
    setTimeout(()=>h.remove(), 1600);
  }
}

function showFanfare(text){
  const el = document.createElement('div');
  el.className = 'fanfare';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 2800);
}

/* ── DECAY TIMER ── */
function startDecay(){
  if(decayTimer) clearInterval(decayTimer);
  decayTimer = setInterval(()=>{
    if(fainted) return;
    const p = pet();
    p.hunger = Math.max(0, p.hunger - 3);
    p.happy  = Math.max(0, p.happy  - 2);
    updateUI();
  }, 30000);
}

/* ── BG PARTICLES ── */
function initParticles(){
  const container = document.getElementById('bg-particles');
  if(!container) return;
  for(let i=0; i<25; i++){
    const span = document.createElement('span');
    span.style.left = Math.random()*100 + '%';
    span.style.setProperty('--dx', (Math.random()*60-30)+'px');
    span.style.animationDuration  = (6 + Math.random()*10) + 's';
    span.style.animationDelay     = (Math.random()*8) + 's';
    container.appendChild(span);
  }
}

/* ── ELECTRON IPC ── */
let pollTimer = null;
function pollStatus(){
  if(!window.agentShare) return;
  try {
    window.agentShare.getStatus().then(s=>{
      const dot  = document.getElementById('conn-dot');
      const text = document.getElementById('conn-text');
      if(s && s.connected){ dot.className='ndot ok'; text.textContent='Connected'; }
      else { dot.className='ndot off'; text.textContent='Offline'; }
      document.getElementById('peer-count').textContent = (s&&s.peerCount||0) + ' peers';
      if(s&&s.walletAddress){
        const a = s.walletAddress;
        document.getElementById('wallet-addr').textContent = a.slice(0,4)+'...'+a.slice(-4);
      }
      document.getElementById('sol-balance').textContent = ((s&&s.balance)||0).toFixed(4)+' SOL';
    }).catch(()=>{});
  } catch(e){}
}

/* ── UTILS ── */
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

/* ── INIT ── */
(function init(){
  loadState();
  document.body.setAttribute('data-char', currentChar);
  document.querySelectorAll('.char-tab, .csw-btn').forEach(t=>t.classList.remove('active'));
  const tabEl = document.getElementById('tab-'+currentChar);
  if(tabEl) tabEl.classList.add('active');
  buildFeedItems();
  updateUI();
  initParticles();
  startDecay();

  // chat input
  document.getElementById('chat-input').addEventListener('keydown', e=>{
    if(e.key==='Enter') sendChat();
  });
  document.getElementById('send-btn').addEventListener('click', sendChat);

  // action buttons
  document.querySelectorAll('.action-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const panel = btn.dataset.panel;
      if(panel) togglePanel(panel);
    });
  });

  // electron polling
  if(window.agentShare){
    pollStatus();
    pollTimer = setInterval(pollStatus, 3000);
  }

  // greeting
  addChat('agent', CHARS[currentChar].name + ' 등장! ' + CHARS[currentChar].emoji);
  addChat('sys', '먹이를 주고 놀아주면서 키워보세요!');
})();
