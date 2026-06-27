/* ── TASKFLOW ENHANCED SCRIPT ── */

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

const ICONS = ['📁','📚','💼','🏋️','🧠','🎯','💻','🎨','🌱','🏠','✈️','🎵','📝','🔬','🍎','⚡','🎮','🌟','💡','🚀'];

const COLORS = ['purple','pink','amber','teal','blue','coral'];
const COLOR_HEX = {
  purple:'#7c5cfc', pink:'#ff6bb5', amber:'#f59e0b',
  teal:'#10b981',   blue:'#3b82f6', coral:'#ef4444'
};

const QUOTES = [
  'Discipline beats motivation every single time. 💪',
  'Small steps every day. Big results over time.',
  'Focus on progress, not perfection.',
  '"The secret of getting ahead is getting started." — Mark Twain',
  '"Don\'t count the days, make the days count." — Ali',
  'Consistency is what turns average into excellence.',
  'A goal without a plan is just a wish.',
  'You don\'t rise to the level of your goals — you fall to the level of your systems.',
  'Do something today your future self will thank you for. 🙌',
];

const DEFAULT_DATA = {
  DSA: {
    name:'DSA', icon:'🧠', color:'purple',
    tasks:{
      monday:   [{text:'Leetcode ×2',done:false,priority:'medium'}],
      tuesday:  [{text:'Leetcode ×2',done:false,priority:'medium'}],
      wednesday:[{text:'Leetcode ×2',done:false,priority:'medium'}],
      thursday: [{text:'Leetcode ×2',done:false,priority:'medium'}],
      friday:   [{text:'Leetcode ×2',done:false,priority:'medium'}],
      saturday: [{text:'Leetcode ×3',done:false,priority:'high'}],
      sunday:   [{text:'Leetcode ×3',done:false,priority:'high'}]
    }
  },
  Full_Stack: {
    name:'Full-Stack', icon:'💻', color:'blue',
    tasks:{
      monday:   [{text:'Weather App',done:false,priority:'medium'},{text:'Capstone',done:false,priority:'high'}],
      tuesday:  [{text:'Capstone',done:false,priority:'high'}],
      wednesday:[{text:'To-Do-List',done:false,priority:'medium'},{text:'Capstone',done:false,priority:'high'}],
      thursday: [],
      friday:   [{text:'Job Board',done:false,priority:'medium'},{text:'Capstone',done:false,priority:'high'}],
      saturday: [],
      sunday:   [{text:'Revise',done:false,priority:'low'},{text:'Capstone',done:false,priority:'high'}]
    }
  },
  Aptitude: {
    name:'Aptitude & Grammar', icon:'📚', color:'amber',
    tasks:{
      monday:   [{text:'Profit & Loss',done:false,priority:'medium'},{text:'Soft-skills',done:false,priority:'low'}],
      tuesday:  [{text:'Average',done:false,priority:'medium'}],
      wednesday:[],
      thursday: [{text:'Error Correction',done:false,priority:'medium'}],
      friday:   [],
      saturday: [{text:'Soft Skills',done:false,priority:'low'}],
      sunday:   []
    }
  }
};

/* ── STATE ── */
let cats = {};
let selCat = null;
let selIcon = ICONS[0];
let selColor = COLORS[0];
let quoteIdx = 0;
let dark = false;

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  buildIconGrid();
  buildColorRow();
  injectRingGradient();
  setQuote();
});

function loadState() {
  try {
    const s = localStorage.getItem('taskflow_v3');
    if (s) {
      const d = JSON.parse(s);
      cats = d.cats || clone(DEFAULT_DATA);
      selCat = d.selCat || null;
      dark = !!d.dark;
    } else {
      cats = clone(DEFAULT_DATA);
    }
  } catch { cats = clone(DEFAULT_DATA); }

  // migrate plain strings
  for (const id in cats) {
    if (!cats[id].color) cats[id].color = 'purple';
    if (!cats[id].icon)  cats[id].icon  = '📁';
    for (const d of DAYS) {
      if (!cats[id].tasks[d]) cats[id].tasks[d] = [];
      cats[id].tasks[d] = cats[id].tasks[d].map(t =>
        typeof t === 'string' ? {text:t,done:false,priority:'medium'} : t
      );
    }
  }

  if (dark) applyTheme(true);
}

function save() {
  try { localStorage.setItem('taskflow_v3', JSON.stringify({cats,selCat,dark})); } catch {}
}

function clone(o) { return JSON.parse(JSON.stringify(o)); }

/* ── WELCOME → APP ── */
function showMainApp() {
  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'flex';
  renderSidebar();
  if (selCat && cats[selCat]) renderWeek();
  else showEmpty();
  updateRing();
  toast('Welcome back! 🚀');
}

/* ── SIDEBAR ── */
function renderSidebar() {
  const list = document.getElementById('catList');
  list.innerHTML = '';
  for (const id in cats) {
    const c = cats[id];
    const total = countAll(c.tasks), done = countDone(c.tasks);
    const el = document.createElement('div');
    el.className = 'cat-item' + (selCat === id ? ' active' : '');
    el.onclick = () => pick(id);
    el.innerHTML = `
      <span class="cat-dot" style="background:${COLOR_HEX[c.color]||'#7c5cfc'}"></span>
      <span class="cat-emoji">${c.icon}</span>
      <span class="cat-label">${esc(c.name)}</span>
      <span class="cat-count">${done}/${total}</span>
      <button class="cat-del" onclick="event.stopPropagation();delCat('${id}')" title="Delete">×</button>
    `;
    list.appendChild(el);
  }
}

function toggleSidebar() {
  const s = document.getElementById('sidebar');
  s.classList.toggle('hidden');
  s.classList.toggle('open');
  document.getElementById('content').classList.toggle('wide');
}

/* ── CATEGORY CRUD ── */
function pick(id) {
  selCat = id; save();
  renderSidebar(); renderWeek(); updateRing();
  if (window.innerWidth <= 700) document.getElementById('sidebar').classList.remove('open');
}

function delCat(id) {
  if (!confirm(`Delete "${cats[id].name}"?`)) return;
  const name = cats[id].name;
  delete cats[id];
  if (selCat === id) { selCat = null; showEmpty(); }
  save(); renderSidebar(); updateRing();
  toast(`"${name}" deleted 🗑️`);
}

/* ── ADD CATEGORY MODAL ── */
function buildIconGrid() {
  const g = document.getElementById('iconGrid');
  g.innerHTML = '';
  ICONS.forEach((ic, i) => {
    const b = document.createElement('button');
    b.className = 'icon-btn' + (i===0?' sel':'');
    b.textContent = ic;
    b.onclick = () => {
      document.querySelectorAll('.icon-btn').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel'); selIcon = ic;
    };
    g.appendChild(b);
  });
  selIcon = ICONS[0];
}

function buildColorRow() {
  const r = document.getElementById('colorRow');
  r.innerHTML = '';
  COLORS.forEach((c, i) => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch' + (i===0?' sel':'');
    sw.style.background = COLOR_HEX[c];
    sw.title = c;
    sw.onclick = () => {
      document.querySelectorAll('.color-swatch').forEach(x=>x.classList.remove('sel'));
      sw.classList.add('sel'); selColor = c;
    };
    r.appendChild(sw);
  });
  selColor = COLORS[0];
}

function openAddCat() {
  document.getElementById('catName').value = '';
  buildIconGrid(); buildColorRow();
  document.getElementById('catModal').classList.add('open');
  setTimeout(()=>document.getElementById('catName').focus(), 60);
}
function closeCatModal() { document.getElementById('catModal').classList.remove('open'); }
function overlayClose(e) { if (e.target===e.currentTarget) closeCatModal(); }

document.addEventListener('keydown', e => {
  if (e.key==='Escape') closeCatModal();
  if (e.key==='Enter' && document.getElementById('catModal').classList.contains('open')) confirmCat();
});

function confirmCat() {
  const name = document.getElementById('catName').value.trim();
  if (!name) { toast('Enter a name first ✏️'); return; }
  const id = 'cat_' + Date.now();
  cats[id] = {
    name, icon:selIcon, color:selColor,
    tasks: Object.fromEntries(DAYS.map(d=>[d,[]]))
  };
  save(); renderSidebar(); closeCatModal();
  pick(id);
  toast(`"${name}" created! 🎉`);
}

/* ── WEEK PLANNER ── */
function showEmpty() {
  document.getElementById('emptyState').style.display = 'flex';
  document.getElementById('weekGrid').style.display = 'none';
  document.getElementById('quoteStrip').style.display = 'none';
  document.getElementById('topTitle').textContent = 'Welcome! 👋';
  document.getElementById('topSub').textContent = 'Choose a category to see your week';
}

function renderWeek() {
  if (!selCat || !cats[selCat]) return showEmpty();
  const cat = cats[selCat];
  const total = countAll(cat.tasks), done = countDone(cat.tasks);

  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('weekGrid').style.display = 'grid';
  document.getElementById('quoteStrip').style.display = 'flex';
  document.getElementById('topTitle').textContent = cat.icon + '  ' + cat.name;
  document.getElementById('topSub').textContent = `${done} of ${total} tasks complete this week`;

  const grid = document.getElementById('weekGrid');
  grid.innerHTML = '';

  const todayName = new Date().toLocaleDateString('en-US',{weekday:'long'}).toLowerCase();

  DAYS.forEach(day => {
    const tasks = cat.tasks[day] || [];
    const isToday = day === todayName;
    const dayDone = tasks.filter(t=>t.done).length;
    const pct = tasks.length ? Math.round(dayDone/tasks.length*100) : 0;

    const card = document.createElement('div');
    card.className = 'day-card' + (isToday?' today':'');
    card.setAttribute('data-color', cat.color);

    const taskItems = tasks.map((t,i) => taskHTML(day,i,t)).join('') ||
      '<div class="empty-day-msg">Nothing yet — add one below!</div>';

    card.innerHTML = `
      <div class="day-header">
        <span class="day-name">${day.slice(0,3).toUpperCase()}</span>
        ${isToday ? '<span class="today-tag">TODAY</span>' : ''}
        <span class="day-done-count">${dayDone}/${tasks.length}</span>
      </div>
      <div class="day-minibar">
        <div class="day-minibar-fill" style="width:${pct}%;background:${COLOR_HEX[cat.color]||'#7c5cfc'}"></div>
      </div>
      <div class="task-list" id="tl-${day}">${taskItems}</div>
      <div class="add-row">
        <input class="add-input" type="text" placeholder="Add task…" data-day="${day}" onkeydown="handleAdd(event,'${day}')"/>
        <select class="pri-sel" id="ps-${day}">
          <option value="low">🟢</option>
          <option value="medium" selected>🟡</option>
          <option value="high">🔴</option>
        </select>
      </div>
    `;
    grid.appendChild(card);
  });
}

function taskHTML(day, i, t) {
  const p = t.priority || 'medium';
  return `
    <div class="task-item${t.done?' done':''}">
      <div class="task-chk${t.done?' checked':''}" onclick="toggleTask('${day}',${i})"></div>
      <div class="pri-pip ${p}"></div>
      <span class="task-txt">${esc(t.text)}</span>
      <button class="task-del" onclick="delTask('${day}',${i})" title="Remove">×</button>
    </div>`;
}

function handleAdd(e, day) {
  if (e.key !== 'Enter') return;
  const input = e.target;
  const text = input.value.trim();
  if (!text || !selCat) return;
  const pri = document.getElementById('ps-' + day).value;
  cats[selCat].tasks[day].push({text, done:false, priority:pri});
  input.value = '';
  save(); renderWeek(); updateRing();
  toast('Task added ✅');
}

function toggleTask(day, i) {
  if (!selCat) return;
  const t = cats[selCat].tasks[day][i];
  t.done = !t.done;
  save(); renderWeek(); updateRing();
}

function delTask(day, i) {
  if (!selCat) return;
  cats[selCat].tasks[day].splice(i,1);
  save(); renderWeek(); updateRing();
  toast('Task removed ❌');
}

/* ── PROGRESS RING ── */
function injectRingGradient() {
  const svg = document.querySelector('.progress-ring');
  if (!svg) return;
  const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
  defs.innerHTML = `
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#7c5cfc"/>
      <stop offset="100%" stop-color="#f472b6"/>
    </linearGradient>`;
  svg.prepend(defs);
}

function updateRing() {
  let total=0, done=0;
  if (selCat && cats[selCat]) {
    total = countAll(cats[selCat].tasks);
    done  = countDone(cats[selCat].tasks);
  } else {
    for (const id in cats) { total+=countAll(cats[id].tasks); done+=countDone(cats[id].tasks); }
  }
  const pct = total>0 ? Math.round(done/total*100) : 0;
  const circ = 2*Math.PI*32; // r=32
  document.getElementById('ringFill').style.strokeDashoffset = circ - (circ*pct/100);
  document.getElementById('ringPct').textContent = pct+'%';
  document.getElementById('progressNote').textContent =
    selCat && cats[selCat] ? `${done}/${total} tasks` : 'All categories';

  if (selCat && cats[selCat]) {
    document.getElementById('topSub').textContent =
      `${done} of ${total} tasks complete this week`;
  }
}

function countAll(wt)  { return Object.values(wt).reduce((s,a)=>s+a.length,0); }
function countDone(wt) { return Object.values(wt).reduce((s,a)=>s+a.filter(t=>t.done).length,0); }

/* ── THEME ── */
function applyTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark?'dark':'light');
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = isDark?'☀️':'🌙';
}
function toggleTheme() {
  dark = !dark; applyTheme(dark); save();
}

/* ── QUOTE ── */
function setQuote() {
  const el = document.getElementById('quoteText');
  if (el) el.textContent = QUOTES[quoteIdx];
}
function nextQuote() {
  quoteIdx = (quoteIdx+1)%QUOTES.length; setQuote();
}

/* ── TOAST ── */
function toast(msg) {
  const c = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  c.appendChild(t);
  setTimeout(()=>{ t.classList.add('out'); setTimeout(()=>t.remove(),300); }, 2300);
}

/* ── UTIL ── */
function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}