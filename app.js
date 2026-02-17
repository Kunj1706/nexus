/* ═══════════════════════════════════════
   NEXUS – College Event App
   app.js
═══════════════════════════════════════ */

// ════════════════════════════════════════
// DATA STORE (localStorage)
// ════════════════════════════════════════
const DB = {
  get:  (k)     => { try { return JSON.parse(localStorage.getItem('nexus_' + k)); } catch { return null; } },
  set:  (k, v)  => localStorage.setItem('nexus_' + k, JSON.stringify(v)),
  push: (k, item) => { let a = DB.get(k) || []; a.push(item); DB.set(k, a); return a; },
};

// ════════════════════════════════════════
// SEED DATA
// ════════════════════════════════════════
const EVENTS_SEED = [
  { id: 'ev001', name: 'Rhythm Night 2025',         category: 'Cultural',   status: 'live',      date: '2025-03-22', time: '7:00 PM',  venue: 'Main Auditorium, Block A', price: 150,  seats: 300,  booked: 158, org: 'Cultural Committee',     desc: 'The biggest musical night of the year! Enjoy live performances, DJ sets, and more. Dress to impress.',                                                            icon: '🎵', bg: 'e-bg-1' },
  { id: 'ev002', name: 'CodeStorm Hackathon',        category: 'Technical',  status: 'upcoming',  date: '2025-04-05', time: '9:00 AM',  venue: 'CS Lab Complex',           price: 200,  seats: 160,  booked: 71,  org: 'Tech Club',              desc: '48-hour coding marathon. Build real solutions. Win up to ₹50,000 in prizes. Team of 2-4.',                                                                         icon: '💻', bg: 'e-bg-2', prize: '₹50,000' },
  { id: 'ev003', name: 'Future Tech Summit',         category: 'Seminar',    status: 'upcoming',  date: '2025-03-28', time: '2:00 PM',  venue: 'Seminar Hall, Block B',    price: 0,    seats: 400,  booked: 210, org: 'Industry Relations Cell', desc: 'Connect with tech leaders, learn about AI, ML and future careers. Free entry for all students.',                                                               icon: '🎙️', bg: 'e-bg-3' },
  { id: 'ev004', name: 'Inter-Dept Football Cup',   category: 'Sports',     status: 'upcoming',  date: '2025-04-10', time: '8:00 AM',  venue: 'College Ground',           price: 500,  seats: 320,  booked: 264, org: 'Sports Committee',       desc: 'Annual inter-department football tournament. Register your team of 11. Winner gets trophy + ₹10,000.',                                                          icon: '⚽', bg: 'e-bg-4' },
  { id: 'ev005', name: 'UI/UX Design Bootcamp',     category: 'Workshop',   status: 'upcoming',  date: '2025-03-30', time: '10:00 AM', venue: 'Innovation Lab',           price: 300,  seats: 80,   booked: 24,  org: 'Design Club',            desc: 'Learn Figma, user research, and design thinking from industry pros. Certificate provided. Materials included.',                                                   icon: '🎨', bg: 'e-bg-5' },
  { id: 'ev006', name: 'Utkarsh Annual Fest',       category: 'Fest',       status: 'upcoming',  date: '2025-05-15', time: '10:00 AM', venue: 'College Campus',           price: 500,  seats: 2000, booked: 840, org: 'Student Council',        desc: 'The biggest 3-day college festival with celebrity performances, competitions, food stalls, and memories to last a lifetime.',                                    icon: '🎪', bg: 'e-bg-6' },
  { id: 'ev007', name: 'AI & ML Workshop',          category: 'Workshop',   status: 'upcoming',  date: '2025-04-02', time: '11:00 AM', venue: 'CS Seminar Room',          price: 0,    seats: 60,   booked: 57,  org: 'AI Club',                desc: 'Hands-on workshop on Python, TensorFlow, and machine learning basics. Bring your laptop.',                                                                         icon: '🤖', bg: 'e-bg-7' },
  { id: 'ev008', name: 'Classical Dance Competition', category: 'Cultural', status: 'completed', date: '2025-02-14', time: '5:00 PM',  venue: 'Open Air Theatre',         price: 100,  seats: 500,  booked: 498, org: 'Cultural Committee',     desc: 'Annual Bharatanatyam and folk dance competition. Categories for solo and group.',                                                                                  icon: '💃', bg: 'e-bg-8' },
];

const CATEGORIES = [
  { name: 'Cultural',       icon: '🎭', color: 'rgba(255,60,110,.15)'  },
  { name: 'Technical',      icon: '💻', color: 'rgba(0,229,255,.1)'    },
  { name: 'Sports',         icon: '⚽', color: 'rgba(34,197,94,.1)'    },
  { name: 'Workshop',       icon: '🛠️', color: 'rgba(124,58,237,.15)' },
  { name: 'Seminar',        icon: '🎙️', color: 'rgba(255,215,0,.1)'   },
  { name: 'Fest',           icon: '🎪', color: 'rgba(255,100,0,.12)'   },
  { name: 'Fresher Party',  icon: '🎉', color: 'rgba(200,0,200,.1)'    },
  { name: 'Inter-College',  icon: '🌐', color: 'rgba(0,100,255,.12)'   },
];

// ════════════════════════════════════════
// DB INIT
// ════════════════════════════════════════
function initDB() {
  if (!DB.get('events')) DB.set('events', EVENTS_SEED);
  if (!DB.get('users'))  DB.set('users', [
    { id: 'demo-student', fname: 'Arjun', lname: 'Sharma', cid: 'CSE-2023-0142', mobile: '9876543210', email: 'arjun@college.edu', dept: 'Computer Science', year: '2nd Year', pass: 'demo123', role: 'student' },
    { id: 'demo-admin',   fname: 'Admin', lname: 'NEXUS',  cid: 'ADMIN-001',     mobile: '9999999999', email: 'admin@nexus.edu',   dept: 'Administration',  year: '—',       pass: 'admin123', role: 'admin' },
  ]);
  if (!DB.get('tickets'))       DB.set('tickets', []);
  if (!DB.get('notifications')) DB.set('notifications', [
    { id: 'n1', title: 'Welcome to NEXUS!',     msg: 'Your account is ready. Explore events and book your passes.',             icon: '🎉', type: 'ni-cyan',   time: 'Just now',  read: false },
    { id: 'n2', title: 'Rhythm Night Tonight!', msg: 'Your ticket for Rhythm Night 2025 is confirmed. Gate 2 entry.',            icon: '🎵', type: 'ni-red',    time: '2 hrs ago', read: false },
    { id: 'n3', title: 'New Event Added',       msg: 'AI & ML Workshop added – Free entry, limited seats! Register now.',       icon: '🤖', type: 'ni-purple', time: 'Yesterday', read: true  },
    { id: 'n4', title: 'Payment Confirmed',     msg: '₹300 received for UI/UX Design Bootcamp. Receipt sent to email.',         icon: '✅', type: 'ni-green',  time: '2 days ago', read: true },
  ]);
}

// ════════════════════════════════════════
// STATE
// ════════════════════════════════════════
let currentUser = null;
let currentEventFilter = 'all';

// ════════════════════════════════════════
// AUTH
// ════════════════════════════════════════
function authTab(tab) {
  document.getElementById('auth-login').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('auth-register').style.display = tab === 'register' ? 'block' : 'none';

  const loginBtn = document.getElementById('auth-tab-login');
  const regBtn   = document.getElementById('auth-tab-register');

  loginBtn.className = 'btn btn-sm ' + (tab === 'login'    ? 'btn-primary' : 'btn-ghost');
  regBtn.className   = 'btn btn-sm ' + (tab === 'register' ? 'btn-primary' : 'btn-ghost');

  [loginBtn, regBtn].forEach(b => { b.style.flex = '1'; b.style.justifyContent = 'center'; });
}

function doLogin() {
  const id   = document.getElementById('login-id').value.trim();
  const pass = document.getElementById('login-pass').value;
  const err  = document.getElementById('login-err');

  if (!id || !pass) { err.style.display = 'block'; err.textContent = 'Please fill all fields'; return; }

  const users = DB.get('users') || [];
  const user  = users.find(u => (u.cid === id || u.email === id || u.mobile === id) && u.pass === pass);

  if (!user) { err.style.display = 'block'; err.textContent = 'Invalid credentials. Try demo account below.'; return; }
  err.style.display = 'none';
  loginSuccess(user);
}

function doRegister() {
  const fname  = v('reg-fname');
  const lname  = v('reg-lname');
  const cid    = v('reg-cid');
  const mobile = v('reg-mobile');
  const email  = v('reg-email');
  const dept   = v('reg-dept');
  const year   = v('reg-year');
  const pass   = v('reg-pass');
  const err    = document.getElementById('reg-err');

  if (!fname || !lname || !cid || !mobile || !email || !dept || !year || !pass) {
    err.style.display = 'block'; err.textContent = 'Please fill all fields'; return;
  }
  if (pass.length < 6) { err.style.display = 'block'; err.textContent = 'Password must be at least 6 characters'; return; }

  const users = DB.get('users') || [];
  if (users.find(u => u.cid === cid || u.email === email)) {
    err.style.display = 'block'; err.textContent = 'College ID or email already registered'; return;
  }

  const user = { id: 'u' + Date.now(), fname, lname, cid, mobile, email, dept, year, pass, role: 'student' };
  DB.push('users', user);
  addNotif(`Welcome ${fname}!`, 'Your NEXUS account has been created successfully. 🎉', '🎉', 'ni-cyan');
  err.style.display = 'none';
  loginSuccess(user);
  toast('Account created successfully! 🎉', 'success');
}

function demoLogin() {
  const users = DB.get('users') || [];
  loginSuccess(users[0]);
  toast('Logged in as demo student! 👋', 'success');
}

function demoAdmin() {
  const users = DB.get('users') || [];
  loginSuccess(users[1]);
  toast('Logged in as Admin! 🛡️', 'success');
}

function loginSuccess(user) {
  currentUser = user;
  DB.set('current_user', user.id);

  document.getElementById('screen-auth').classList.remove('active');
  document.getElementById('screen-app').classList.add('active');
  document.getElementById('admin-nav-btn').style.display = user.role === 'admin' ? '' : 'none';

  updateNavAvatar();
  showPage('home');
  renderAll();
}

function doLogout() {
  currentUser = null;
  DB.set('current_user', null);
  document.getElementById('screen-app').classList.remove('active');
  document.getElementById('screen-auth').classList.add('active');
  toast('Logged out successfully', 'info');
}

// ════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════
const pages = ['home', 'events', 'tickets', 'dashboard', 'admin', 'notifications', 'event-detail'];

function showPage(page) {
  pages.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.style.display = p === page ? 'block' : 'none';
  });

  // Top nav active state
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const nl = document.getElementById('nl-' + page);
  if (nl) nl.classList.add('active');

  // Bottom nav active state
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
  const bnavMap = { home: 0, events: 1, tickets: 2, dashboard: 3, notifications: 4 };
  if (bnavMap[page] !== undefined) document.querySelectorAll('.bnav-item')[bnavMap[page]]?.classList.add('active');

  // Page-specific rendering
  if (page === 'home')          renderHome();
  if (page === 'events')        renderEventsPage();
  if (page === 'tickets')       renderTicketsPage();
  if (page === 'dashboard')     renderDashboard();
  if (page === 'admin') {
    if (currentUser?.role !== 'admin') { toast('Admin access only!', 'error'); showPage('home'); return; }
    renderAdminOverview();
  }
  if (page === 'notifications') renderNotifications();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════
// RENDER FUNCTIONS
// ════════════════════════════════════════
function renderAll() {
  renderHome();
  populateCatFilter();
  startCountdown();
}

function renderHome() {
  const events  = DB.get('events')  || [];
  const users   = DB.get('users')   || [];
  const tickets = DB.get('tickets') || [];

  // Hero stats
  document.getElementById('hs-events').textContent  = events.length;
  document.getElementById('hs-students').textContent = users.length + 'K+';
  document.getElementById('hs-tickets').textContent  = tickets.length;

  // Category grid
  const cg = document.getElementById('home-cat-grid');
  if (cg) {
    cg.innerHTML = CATEGORIES.map(c => `
      <div class="cat-card" onclick="filterByCat('${c.name}')" style="border-top:2px solid ${c.color.replace('.1','').replace('.15','').replace('.12','')}">
        <span class="cat-icon">${c.icon}</span>
        <div class="cat-name">${c.name}</div>
        <div class="cat-count">${events.filter(e => e.category === c.name).length} events</div>
      </div>`).join('');
  }

  // Featured events (first 3 non-completed)
  const featured = events.filter(e => e.status !== 'completed').slice(0, 3);
  const hg = document.getElementById('home-events-grid');
  if (hg) hg.innerHTML = featured.map(e => eventCard(e)).join('');

  renderLeaderboard();
  renderPopularBars();
}

// ── Event Card HTML ──
function eventCard(e) {
  const pct = Math.round(e.booked / e.seats * 100);
  const badgeHtml =
    e.status === 'live'      ? '<span class="e-badge badge-live">● LIVE</span>' :
    e.price === 0            ? '<span class="e-badge badge-free">FREE</span>' :
    e.status === 'completed' ? '<span class="e-badge badge-completed">COMPLETED</span>' :
                               '<span class="e-badge badge-upcoming">UPCOMING</span>';

  return `
    <div class="event-card" onclick="viewEvent('${e.id}')">
      <div class="event-thumb ${e.bg}">
        <div class="event-thumb-glow">${e.icon}</div>
        <span style="position:relative;z-index:1">${e.icon}</span>
        ${badgeHtml}
        <div class="e-seats">🪑 ${e.seats - e.booked} left</div>
      </div>
      <div class="event-body">
        <div class="e-cat">${e.category}</div>
        <div class="e-title">${e.name}</div>
        <div class="e-meta">
          <div class="e-meta-row">📅 ${e.date} · ${e.time}</div>
          <div class="e-meta-row">📍 ${e.venue}</div>
          ${e.prize ? `<div class="e-meta-row">🏆 Prize: ${e.prize}</div>` : ''}
        </div>
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text2);margin-bottom:4px">
            <span>Booked</span><span>${pct}%</span>
          </div>
          <div style="background:var(--bg2);border-radius:4px;height:4px;overflow:hidden">
            <div style="width:${pct}%;height:100%;background:${pct > 80 ? 'var(--accent)' : pct > 50 ? 'var(--accent2)' : 'var(--green)'};border-radius:4px"></div>
          </div>
        </div>
        <div class="e-footer">
          <div class="e-price">${e.price === 0 ? 'FREE' : '₹' + e.price}<span>per ticket</span></div>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openBooking('${e.id}')">
            ${e.status === 'completed' ? 'View Details' : 'Book Now →'}
          </button>
        </div>
      </div>
    </div>`;
}

function renderEventsPage() {
  filterEvents();
}

function populateCatFilter() {
  const sel = document.getElementById('event-cat-filter');
  if (!sel) return;
  sel.innerHTML = '<option value="">All Categories</option>' +
    CATEGORIES.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
}

function filterEvents() {
  const search = (document.getElementById('event-search')?.value || '').toLowerCase();
  const cat    = document.getElementById('event-cat-filter')?.value || '';
  let events   = DB.get('events') || [];

  if (search) events = events.filter(e =>
    e.name.toLowerCase().includes(search) ||
    e.category.toLowerCase().includes(search) ||
    e.venue.toLowerCase().includes(search));

  if (cat)                               events = events.filter(e => e.category === cat);
  if (currentEventFilter === 'upcoming') events = events.filter(e => e.status === 'upcoming');
  if (currentEventFilter === 'live')     events = events.filter(e => e.status === 'live');
  if (currentEventFilter === 'free')     events = events.filter(e => e.price === 0);
  if (currentEventFilter === 'completed')events = events.filter(e => e.status === 'completed');

  const grid = document.getElementById('all-events-grid');
  if (!grid) return;

  grid.innerHTML = events.length
    ? events.map(e => eventCard(e)).join('')
    : '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><div class="empty-msg">No events found. Try different filters.</div></div>';
}

function setEventFilter(btn, filter) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentEventFilter = filter;
  filterEvents();
}

function filterByCat(cat) {
  showPage('events');
  setTimeout(() => {
    const sel = document.getElementById('event-cat-filter');
    if (sel) { sel.value = cat; filterEvents(); }
  }, 50);
}

function renderTicketsPage() {
  const tg = document.getElementById('tickets-grid');
  if (!tg) return;
  tg.innerHTML = `
    <div class="ticket-card t-free">
      <div class="t-type" style="color:var(--text2)">🎟️ Free Entry</div>
      <div class="t-price">FREE</div>
      <div class="t-price-sub">No payment required</div>
      <ul class="t-features">
        <li><span class="tick-y">✓</span> General event access</li>
        <li><span class="tick-y">✓</span> Digital QR pass</li>
        <li><span class="tick-y">✓</span> Event notifications</li>
        <li><span class="tick-n">✗</span> <span style="opacity:.4">Priority seating</span></li>
        <li><span class="tick-n">✗</span> <span style="opacity:.4">VIP lounge access</span></li>
      </ul>
      <button class="btn btn-outline btn-full" onclick="showPage('events')">Browse Free Events</button>
    </div>
    <div class="ticket-card t-regular">
      <div class="t-type" style="color:#a78bfa">🎫 Regular Pass</div>
      <div class="t-price" style="background:linear-gradient(135deg,#a78bfa,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent">₹150</div>
      <div class="t-price-sub">per event</div>
      <ul class="t-features">
        <li><span class="tick-y">✓</span> Full event access</li>
        <li><span class="tick-y">✓</span> Digital QR pass</li>
        <li><span class="tick-y">✓</span> Priority seating</li>
        <li><span class="tick-y">✓</span> Photo gallery access</li>
        <li><span class="tick-n">✗</span> <span style="opacity:.4">VIP lounge</span></li>
      </ul>
      <button class="btn btn-purple btn-full" onclick="openBooking('ev001')">Get Regular Pass</button>
    </div>
    <div class="ticket-card t-vip">
      <div class="t-type" style="color:var(--accent)">⭐ VIP Pass</div>
      <div class="t-price">₹500</div>
      <div class="t-price-sub">all-access pass</div>
      <ul class="t-features">
        <li><span class="tick-y">✓</span> All events access</li>
        <li><span class="tick-y">✓</span> VIP lounge & seating</li>
        <li><span class="tick-y">✓</span> Backstage access</li>
        <li><span class="tick-y">✓</span> Gift hamper included</li>
        <li><span class="tick-y">✓</span> Certificate + memories</li>
      </ul>
      <button class="btn btn-primary btn-full" onclick="openBooking('ev006')">🌟 Get VIP Pass</button>
    </div>`;
}

function renderDashboard() {
  if (!currentUser) return;
  const u = currentUser;
  document.getElementById('dash-av').textContent   = u.fname[0];
  document.getElementById('dash-name').textContent = u.fname + ' ' + u.lname;
  document.getElementById('dash-id').textContent   = 'ID: ' + u.cid;

  const myTickets  = (DB.get('tickets') || []).filter(t => t.userId === u.id);
  const totalSpend = myTickets.reduce((a, t) => a + t.price, 0);

  document.getElementById('dash-events-count').textContent = myTickets.length;
  document.getElementById('dash-certs-count').textContent  = myTickets.filter(t => t.status === 'used').length;
  document.getElementById('dash-spend').textContent        = '₹' + totalSpend;

  const badges = [];
  if (myTickets.length >= 1) badges.push('<span class="p-badge pb-gold">🏆 Event Member</span>');
  if (myTickets.length >= 5) badges.push('<span class="p-badge pb-purple">⚡ Active</span>');
  badges.push(`<span class="p-badge pb-cyan">${u.year || 'Student'}</span>`);
  document.getElementById('dash-badges').innerHTML = badges.join('');

  dashTab('my-tickets');
}

function dashTab(tab) {
  document.querySelectorAll('.s-menu-item').forEach(m => m.classList.remove('active'));
  event?.target?.classList?.add('active');

  const area      = document.getElementById('dash-content-area');
  const u         = currentUser;
  const myTickets = (DB.get('tickets') || []).filter(t => t.userId === u.id);

  if (tab === 'my-tickets') {
    area.innerHTML = `
      <div class="dash-card">
        <div class="dc-title">🎫 My Tickets <span class="badge badge-accent">${myTickets.length}</span></div>
        ${myTickets.length === 0
          ? `<div class="empty-state">
               <div class="empty-icon">🎟️</div>
               <div class="empty-msg">No tickets yet. Book your first event!</div>
               <button class="btn btn-primary" style="margin-top:16px" onclick="showPage('events')">Explore Events →</button>
             </div>`
          : myTickets.map(t => `
              <div class="my-ticket-item">
                <div class="ticket-qr" onclick="showQR('${t.id}')">▦</div>
                <div class="ticket-info">
                  <div class="ti-name">${t.eventName}</div>
                  <div class="ti-date">${t.date} · ${t.ticketType} · ₹${t.price}</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
                  <span class="ts-badge ${t.status === 'upcoming' ? 'ts-upcoming' : t.status === 'used' ? 'ts-used' : 'ts-valid'}">${t.status.toUpperCase()}</span>
                  <button class="btn btn-ghost btn-sm" onclick="showQR('${t.id}')">View QR</button>
                  ${t.status !== 'used' ? `<button class="btn btn-sm" style="background:rgba(255,60,110,.1);color:var(--accent);border:1px solid rgba(255,60,110,.2)" onclick="cancelTicket('${t.id}')">Cancel</button>` : ''}
                </div>
              </div>`).join('')}
      </div>`;
  }
  else if (tab === 'achievements') {
    area.innerHTML = `
      <div class="dash-card">
        <div class="dc-title">🏆 Achievements</div>
        ${myTickets.length === 0 ? `<div class="empty-state"><div class="empty-icon">🏅</div><div class="empty-msg">Attend events to unlock achievements!</div></div>` : ''}
        ${myTickets.length >= 1 ? `<div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)"><span style="font-size:2rem">🥇</span><div><div style="font-weight:600">First Event Booked!</div><div style="font-size:.78rem;color:var(--text2)">${myTickets[0]?.eventName}</div></div></div>` : ''}
        ${myTickets.length >= 3 ? `<div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)"><span style="font-size:2rem">🔥</span><div><div style="font-weight:600">Event Enthusiast</div><div style="font-size:.78rem;color:var(--text2)">Booked 3+ events</div></div></div>` : ''}
        ${myTickets.length >= 5 ? `<div style="display:flex;align-items:center;gap:14px;padding:14px 0"><span style="font-size:2rem">⭐</span><div><div style="font-weight:600">Campus Star</div><div style="font-size:.78rem;color:var(--text2)">Attended 5+ events</div></div></div>` : ''}
      </div>`;
  }
  else if (tab === 'certificates') {
    const done = myTickets.filter(t => t.status === 'used');
    area.innerHTML = `
      <div class="dash-card">
        <div class="dc-title">📜 Certificates</div>
        ${done.length === 0
          ? `<div class="empty-state"><div class="empty-icon">📜</div><div class="empty-msg">Complete events to earn certificates!</div></div>`
          : done.map(t => `
              <div class="my-ticket-item">
                <div style="font-size:2rem">🏅</div>
                <div class="ticket-info">
                  <div class="ti-name">${t.eventName}</div>
                  <div class="ti-date">Participation Certificate · ${t.date}</div>
                </div>
                <button class="btn btn-success btn-sm" onclick="downloadCert('${t.id}')">Download</button>
              </div>`).join('')}
      </div>`;
  }
  else if (tab === 'edit-profile') {
    area.innerHTML = `
      <div class="dash-card">
        <div class="dc-title">✏️ Edit Profile</div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">First Name</label><input class="form-input" id="ep-fname" value="${u.fname}" type="text"></div>
          <div class="form-group"><label class="form-label">Last Name</label><input class="form-input" id="ep-lname" value="${u.lname}" type="text"></div>
        </div>
        <div class="form-group"><label class="form-label">Mobile</label><input class="form-input" id="ep-mobile" value="${u.mobile}" type="tel"></div>
        <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="ep-email" value="${u.email}" type="email"></div>
        <div class="form-group"><label class="form-label">Department</label><input class="form-input" id="ep-dept" value="${u.dept}" type="text"></div>
        <button class="btn btn-primary" onclick="saveProfile()">Save Changes ✓</button>
      </div>`;
  }
  else if (tab === 'payment-history') {
    area.innerHTML = `
      <div class="dash-card">
        <div class="dc-title">💰 Payment History</div>
        ${myTickets.length === 0
          ? `<div class="empty-state"><div class="empty-icon">💳</div><div class="empty-msg">No transactions yet.</div></div>`
          : myTickets.map(t => `
              <div class="my-ticket-item">
                <div style="width:42px;height:42px;border-radius:8px;background:${t.price === 0 ? 'rgba(34,197,94,.15)' : 'rgba(124,58,237,.15)'};display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">${t.price === 0 ? '🆓' : '💳'}</div>
                <div class="ticket-info">
                  <div class="ti-name">${t.eventName}</div>
                  <div class="ti-date">${t.bookedOn} · ${t.ticketType}</div>
                </div>
                <div style="font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:${t.price === 0 ? 'var(--green)' : 'var(--gold)'}">
                  ${t.price === 0 ? 'FREE' : '₹' + t.price}
                </div>
              </div>`).join('')}
      </div>`;
  }
}

function saveProfile() {
  const fname  = document.getElementById('ep-fname')?.value.trim();
  const lname  = document.getElementById('ep-lname')?.value.trim();
  const mobile = document.getElementById('ep-mobile')?.value.trim();
  const email  = document.getElementById('ep-email')?.value.trim();
  const dept   = document.getElementById('ep-dept')?.value.trim();

  if (!fname || !lname) { toast('Name cannot be empty', 'error'); return; }

  const users = DB.get('users') || [];
  const idx   = users.findIndex(u => u.id === currentUser.id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], fname, lname, mobile, email, dept };
    DB.set('users', users);
    currentUser = { ...currentUser, fname, lname, mobile, email, dept };
  }
  renderDashboard();
  toast('Profile updated successfully! ✓', 'success');
}

function renderLeaderboard() {
  const users   = DB.get('users')   || [];
  const tickets = DB.get('tickets') || [];

  const ranked = users.map(u => ({
    name:  u.fname + ' ' + u.lname,
    dept:  u.dept || 'Student',
    count: tickets.filter(t => t.userId === u.id).length
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const colors = ['#ffd700', '#b0b0c0', '#cd7f32', '#a78bfa', '#00e5ff'];
  const cls    = ['gold', 'silver', 'bronze', '', ''];
  const emojis = ['👑', '🥈', '🥉', '4️⃣', '5️⃣'];

  const el = document.getElementById('leaderboard-list');
  if (!el) return;

  el.innerHTML = ranked.map((r, i) => `
    <div class="lb-row">
      <div class="lb-rank ${cls[i]}">${emojis[i]}</div>
      <div class="lb-av" style="background:linear-gradient(135deg,${colors[i]}55,${colors[i]}22)">${r.name[0]}</div>
      <div class="lb-info">
        <div class="lb-name">${r.name}</div>
        <div class="lb-pts">${r.dept}</div>
      </div>
      <div class="lb-score">${r.count} <span style="font-size:.7rem;font-family:'DM Sans'">events</span></div>
    </div>`).join('') ||
    '<div class="empty-state"><div class="empty-msg">Be the first to book events!</div></div>';
}

function renderPopularBars() {
  const events = DB.get('events') || [];
  const sorted = [...events].sort((a, b) => (b.booked / b.seats) - (a.booked / a.seats)).slice(0, 5);
  const colors = [
    'linear-gradient(90deg,var(--accent),#ff6b6b)',
    'linear-gradient(90deg,var(--accent2),#9f7aea)',
    'linear-gradient(90deg,var(--accent3),#00b4d8)',
    'linear-gradient(90deg,var(--gold),#f59e0b)',
    'linear-gradient(90deg,var(--green),#16a34a)',
  ];

  const el = document.getElementById('popular-events-bars');
  if (!el) return;

  el.innerHTML = sorted.map((e, i) => {
    const pct = Math.min(100, Math.round(e.booked / e.seats * 100));
    return `
      <div class="bar-row">
        <span class="bar-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.name.split(' ').slice(0, 2).join(' ')}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${colors[i]}"></div></div>
        <span class="bar-val">${pct}%</span>
      </div>`;
  }).join('');
}

// ════════════════════════════════════════
// BOOKING
// ════════════════════════════════════════
function openBooking(eventId) {
  const events = DB.get('events') || [];
  const e      = events.find(ev => ev.id === eventId);
  if (!e) { toast('Event not found', 'error'); return; }
  if (e.status === 'completed') { viewEvent(eventId); return; }

  const myTickets    = DB.get('tickets') || [];
  const alreadyBooked = myTickets.find(t => t.eventId === eventId && t.userId === currentUser.id);
  if (alreadyBooked) { showQR(alreadyBooked.id); return; }

  const content = document.getElementById('booking-modal-content');
  content.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <div style="font-size:2.5rem">${e.icon}</div>
      <div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.5rem;letter-spacing:.04em">${e.name}</div>
        <div style="color:var(--text2);font-size:.82rem">${e.date} · ${e.venue}</div>
      </div>
    </div>
    <div style="background:var(--surface2);border-radius:10px;padding:16px;margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--text2);font-size:.85rem">Event</span><span style="font-size:.85rem">${e.name}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--text2);font-size:.85rem">Date & Time</span><span style="font-size:.85rem">${e.date} at ${e.time}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--text2);font-size:.85rem">Venue</span><span style="font-size:.85rem;text-align:right;max-width:180px">${e.venue}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--text2);font-size:.85rem">Seats Available</span><span style="font-size:.85rem">${e.seats - e.booked}</span></div>
      <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid var(--border)">
        <span style="font-weight:700">Total Amount</span>
        <span style="font-family:'Bebas Neue';font-size:1.4rem;color:var(--gold)">${e.price === 0 ? 'FREE' : '₹' + e.price}</span>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Ticket Type</label>
      <select class="form-input" id="bk-type">
        <option value="regular">Regular (₹${e.price})</option>
        ${e.price > 0 ? `<option value="vip">VIP (₹${e.price * 3})</option>` : ''}
        <option value="group">Group of 4 (₹${e.price > 0 ? e.price * 4 * 0.8 : '0'})</option>
      </select>
    </div>
    ${e.price > 0 ? `
    <div class="form-group">
      <label class="form-label">Payment Method</label>
      <select class="form-input" id="bk-pay">
        <option>💳 UPI</option><option>🏦 Debit/Credit Card</option><option>👛 Wallet</option>
      </select>
    </div>` : ''}
    <div style="background:rgba(255,60,110,.05);border:1px solid rgba(255,60,110,.15);border-radius:8px;padding:12px;margin-bottom:18px;font-size:.8rem;color:var(--text2)">
      ✅ Digital QR pass will be generated instantly after booking.<br>
      📧 Confirmation will be sent to ${currentUser?.email || 'your email'}
    </div>
    <button class="btn btn-primary btn-full btn-lg" onclick="confirmBooking('${e.id}')">
      ${e.price === 0 ? '🎟️ Register Free →' : '💳 Pay & Book →'}
    </button>`;

  openModal('booking-overlay');
}

function confirmBooking(eventId) {
  const events = DB.get('events') || [];
  const idx    = events.findIndex(e => e.id === eventId);
  if (idx === -1) return;

  const e          = events[idx];
  const typeEl     = document.getElementById('bk-type');
  const ticketType = typeEl ? typeEl.value : 'regular';

  let price = e.price;
  if (ticketType === 'vip')   price = e.price * 3;
  if (ticketType === 'group') price = e.price > 0 ? Math.round(e.price * 4 * 0.8) : 0;

  const tid    = 'T' + Date.now();
  const ticket = {
    id: tid, eventId, userId: currentUser.id,
    eventName: e.name, date: e.date, venue: e.venue,
    ticketType, price, status: 'upcoming',
    bookedOn: new Date().toLocaleDateString('en-IN'),
    eventIcon: e.icon,
  };

  DB.push('tickets', ticket);
  events[idx].booked = Math.min(events[idx].booked + 1, events[idx].seats);
  DB.set('events', events);

  addNotif('Booking Confirmed! 🎉', `Your ticket for "${e.name}" is ready. Show QR at entry.`, '✅', 'ni-green');
  closeModal('booking-overlay');
  toast('🎉 Booking confirmed! QR pass generated.', 'success');
  setTimeout(() => showQR(tid), 600);
}

function showQR(ticketId) {
  const tickets = DB.get('tickets') || [];
  const t       = tickets.find(tk => tk.id === ticketId);
  if (!t) return;

  const qrData = `NEXUS-${t.id}-${t.userId}-${t.eventId}`;
  const qrSvg  = generateQRSVG(qrData);

  document.getElementById('qr-modal-content').innerHTML = `
    <div style="margin-bottom:20px">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:.06em;margin-bottom:4px">${t.eventName}</div>
      <div style="color:var(--text2);font-size:.85rem">${t.date} · ${t.venue}</div>
    </div>
    <div style="background:#fff;border-radius:14px;padding:20px;display:inline-block;margin-bottom:20px;box-shadow:0 0 32px rgba(255,60,110,.2)">
      ${qrSvg}
    </div>
    <div style="margin-bottom:16px">
      <div style="font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--accent3);letter-spacing:.1em;margin-bottom:6px">TICKET ID</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:.85rem;color:var(--text2)">${t.id}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;text-align:left">
      <div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">TYPE</div><div style="font-weight:600;font-size:.85rem;text-transform:capitalize">${t.ticketType}</div></div>
      <div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">STATUS</div><div style="font-weight:600;font-size:.85rem;color:${t.status === 'upcoming' ? '#a78bfa' : t.status === 'used' ? 'var(--text2)' : 'var(--green)'}">${t.status.toUpperCase()}</div></div>
      <div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">PAID</div><div style="font-weight:600;font-size:.85rem;color:var(--gold)">${t.price === 0 ? 'FREE' : '₹' + t.price}</div></div>
      <div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">BOOKED ON</div><div style="font-weight:600;font-size:.85rem">${t.bookedOn}</div></div>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="toast('Pass downloaded! 📥','success')">📥 Download Pass</button>
      <button class="btn btn-ghost" style="flex:1;justify-content:center" onclick="toast('Shared! 📤','info')">📤 Share</button>
    </div>`;

  openModal('qr-overlay');
}

function generateQRSVG(data) {
  const size  = 180;
  const cells = 21;
  const cell  = Math.floor(size / cells);
  let svg     = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${size}" height="${size}" fill="white"/>`;

  let seed = 0;
  for (let i = 0; i < data.length; i++) seed = (seed * 31 + data.charCodeAt(i)) & 0x7fffffff;
  function rand() { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed / 0x7fffffff; }

  function corner(x, y) {
    svg += `<rect x="${x}" y="${y}" width="${cell * 7}" height="${cell * 7}" fill="black"/>`;
    svg += `<rect x="${x + cell}" y="${y + cell}" width="${cell * 5}" height="${cell * 5}" fill="white"/>`;
    svg += `<rect x="${x + cell * 2}" y="${y + cell * 2}" width="${cell * 3}" height="${cell * 3}" fill="black"/>`;
  }
  corner(0, 0);
  corner((cells - 7) * cell, 0);
  corner(0, (cells - 7) * cell);

  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const inCorner = (r < 8 && c < 8) || (r < 8 && c > cells - 9) || (r > cells - 9 && c < 8);
      if (!inCorner && rand() > 0.5) svg += `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}" fill="black"/>`;
    }
  }
  return svg + '</svg>';
}

function cancelTicket(ticketId) {
  if (!confirm('Cancel this ticket? This cannot be undone.')) return;
  const tickets = DB.get('tickets') || [];
  const idx     = tickets.findIndex(t => t.id === ticketId);
  if (idx !== -1) {
    tickets[idx].status = 'cancelled';
    DB.set('tickets', tickets);
    toast('Ticket cancelled. Refund in 3-5 days.', 'info');
    dashTab('my-tickets');
  }
}

function downloadCert(ticketId) {
  toast('Certificate downloaded! 📜', 'success');
}

// ════════════════════════════════════════
// EVENT DETAIL
// ════════════════════════════════════════
function viewEvent(eventId) {
  const events = DB.get('events') || [];
  const e      = events.find(ev => ev.id === eventId);
  if (!e) return;

  const thumb = document.getElementById('edh-thumb');
  thumb.innerHTML  = `<span style="font-size:5rem">${e.icon}</span><span class="e-badge ${e.status === 'live' ? 'badge-live' : e.status === 'completed' ? 'badge-completed' : 'badge-upcoming'}" style="position:absolute;top:20px;right:24px;font-size:.9rem">${e.status === 'live' ? '● LIVE NOW' : e.status === 'completed' ? 'COMPLETED' : 'UPCOMING'}</span>`;
  thumb.className  = 'event-detail-header ' + e.bg;

  const myTickets = DB.get('tickets') || [];
  const booked    = myTickets.find(t => t.eventId === e.id && t.userId === currentUser.id);
  const pct       = Math.round(e.booked / e.seats * 100);

  document.getElementById('edh-body').innerHTML = `
    <div>
      <div class="info-section">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:.04em;margin-bottom:6px">${e.name}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
          <span class="tag">📁 ${e.category}</span>
          <span class="tag">👤 ${e.org}</span>
          ${e.prize ? `<span class="tag">🏆 ${e.prize}</span>` : ''}
        </div>
        <p style="color:var(--text2);line-height:1.7;font-size:.9rem">${e.desc || 'No description available.'}</p>
      </div>
      <div class="info-section">
        <div class="is-title">📋 Event Details</div>
        <div class="info-row"><div class="info-icon">📅</div><div class="info-val"><strong>Date & Time</strong>${e.date} at ${e.time}</div></div>
        <div class="info-row"><div class="info-icon">📍</div><div class="info-val"><strong>Venue</strong>${e.venue}</div></div>
        <div class="info-row"><div class="info-icon">👤</div><div class="info-val"><strong>Organizer</strong>${e.org}</div></div>
        <div class="info-row"><div class="info-icon">🪑</div><div class="info-val"><strong>Availability</strong>${e.seats - e.booked} of ${e.seats} seats left</div></div>
        <div style="margin-top:12px">
          <div style="display:flex;justify-content:space-between;font-size:.75rem;color:var(--text2);margin-bottom:6px"><span>Booking Progress</span><span>${pct}%</span></div>
          <div style="background:var(--bg);border-radius:6px;height:8px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${pct > 80 ? 'var(--accent)' : 'var(--green)'};border-radius:6px"></div></div>
        </div>
      </div>
    </div>
    <div>
      <div class="booking-box">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:.08em;margin-bottom:4px">BOOK YOUR PASS</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:2.8rem;letter-spacing:.04em;color:var(--gold);line-height:1;margin-bottom:4px">${e.price === 0 ? 'FREE' : '₹' + e.price}</div>
        <div style="color:var(--text2);font-size:.8rem;margin-bottom:20px">per ticket</div>
        ${booked
          ? `<div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);border-radius:8px;padding:14px;margin-bottom:14px;text-align:center">
               <div style="color:var(--green);font-weight:700;margin-bottom:4px">✅ Already Booked!</div>
               <div style="font-size:.8rem;color:var(--text2)">Ticket ID: ${booked.id}</div>
             </div>
             <button class="btn btn-ghost btn-full" onclick="showQR('${booked.id}')">View QR Pass →</button>`
          : e.status === 'completed'
            ? `<button class="btn btn-ghost btn-full" disabled>Event Completed</button>`
            : e.seats - e.booked === 0
              ? `<button class="btn btn-ghost btn-full" disabled>🔴 Sold Out</button>`
              : `<button class="btn btn-primary btn-full btn-lg" onclick="openBooking('${e.id}')">Book Now →</button>`}
        <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;align-items:center;gap:8px;font-size:.8rem;color:var(--text2)">✅ Instant QR pass generation</div>
          <div style="display:flex;align-items:center;gap:8px;font-size:.8rem;color:var(--text2)">✅ Email confirmation sent</div>
          ${e.price > 0 ? `<div style="display:flex;align-items:center;gap:8px;font-size:.8rem;color:var(--text2)">✅ Refundable up to 24hrs before</div>` : ''}
        </div>
      </div>
    </div>`;

  showPage('event-detail');
}

// ════════════════════════════════════════
// ADMIN PANEL
// ════════════════════════════════════════
function adminTab(btn, tab) {
  document.querySelectorAll('.admin-menu-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const tabMap = {
    'overview':       renderAdminOverview,
    'manage-events':  renderAdminEvents,
    'students':       renderAdminStudents,
    'scan':           renderAdminScan,
    'announcements':  renderAdminAnn,
    'revenue':        renderAdminRevenue,
  };
  if (tabMap[tab]) tabMap[tab]();
}

function renderAdminOverview() {
  const events  = DB.get('events')  || [];
  const users   = DB.get('users')   || [];
  const tickets = DB.get('tickets') || [];
  const revenue = tickets.reduce((a, t) => a + t.price, 0);

  const barColors = [
    'linear-gradient(90deg,var(--accent),#ff6b6b)',
    'linear-gradient(90deg,var(--accent2),#9f7aea)',
    'linear-gradient(90deg,var(--accent3),#00b4d8)',
    'linear-gradient(90deg,var(--gold),#f59e0b)',
    'linear-gradient(90deg,var(--green),#16a34a)',
  ];

  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header">
      <div class="admin-title">OVERVIEW DASHBOARD</div>
      <div style="display:flex;align-items:center;gap:6px;font-size:.8rem;color:var(--text2)">
        <div style="width:7px;height:7px;border-radius:50%;background:var(--accent);animation:pulse 1.5s ease infinite"></div>Live
      </div>
    </div>
    <div class="metrics-grid" style="margin-bottom:28px">
      <div class="metric-box"><div class="metric-val" style="color:var(--accent)">₹${revenue.toLocaleString()}</div><div class="metric-lbl">Total Revenue</div><div class="metric-chg chg-up">↑ Growing</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--accent3)">${tickets.length}</div><div class="metric-lbl">Tickets Sold</div><div class="metric-chg chg-up">↑ +${tickets.length} total</div></div>
      <div class="metric-box"><div class="metric-val" style="color:#a78bfa">${users.length}</div><div class="metric-lbl">Registered</div><div class="metric-chg chg-up">↑ Active</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--gold)">${events.filter(e => e.status === 'upcoming' || e.status === 'live').length}</div><div class="metric-lbl">Active Events</div><div class="metric-chg">Total: ${events.length}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div class="dash-card">
        <div class="dc-title">📈 Event Popularity</div>
        <div class="bar-list">
          ${[...events].sort((a, b) => (b.booked / b.seats) - (a.booked / a.seats)).slice(0, 5).map((e, i) => {
            const pct = Math.min(100, Math.round(e.booked / e.seats * 100));
            return `<div class="bar-row"><span class="bar-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.name.split(' ').slice(0,2).join(' ')}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${barColors[i]}"></div></div><span class="bar-val">${pct}%</span></div>`;
          }).join('')}
        </div>
      </div>
      <div class="dash-card">
        <div class="dc-title">📋 Recent Tickets</div>
        ${tickets.slice(-5).reverse().map(t => `
          <div class="my-ticket-item">
            <div style="font-size:1.4rem">🎫</div>
            <div class="ticket-info"><div class="ti-name">${t.eventName}</div><div class="ti-date">${t.bookedOn}</div></div>
            <div style="font-size:.8rem;color:var(--gold)">${t.price === 0 ? 'FREE' : '₹' + t.price}</div>
          </div>`).join('') || '<div class="empty-state"><div class="empty-msg">No tickets yet</div></div>'}
      </div>
    </div>
    <div class="dash-card">
      <div class="dc-title">⚡ Quick Actions</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="openModal('create-event-overlay')">➕ Create Event</button>
        <button class="btn btn-purple" onclick="openModal('ann-overlay')">📢 Send Announcement</button>
        <button class="btn btn-ghost" onclick="adminTab(document.querySelectorAll('.admin-menu-item')[3],'scan')">📷 Open QR Scanner</button>
        <button class="btn btn-ghost" onclick="exportData()">📊 Export Data</button>
      </div>
    </div>`;
}

function renderAdminEvents() {
  const events = DB.get('events') || [];
  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header">
      <div class="admin-title">MANAGE EVENTS</div>
      <button class="btn btn-primary" onclick="openModal('create-event-overlay')">➕ Create Event</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px">
      ${events.map(e => `
        <div class="dash-card" style="padding:18px">
          <div style="display:flex;align-items:center;gap:14px">
            <div style="font-size:2rem">${e.icon}</div>
            <div style="flex:1">
              <div style="font-weight:700;margin-bottom:3px">${e.name}</div>
              <div style="font-size:.78rem;color:var(--text2)">${e.category} · ${e.date} · ${e.venue}</div>
              <div style="display:flex;gap:8px;margin-top:8px">
                <span class="badge ${e.status === 'live' ? 'badge-accent' : e.status === 'completed' ? '' : 'badge-purple'}">${e.status.toUpperCase()}</span>
                <span class="badge" style="background:rgba(255,215,0,.1);color:var(--gold)">${e.booked}/${e.seats} booked</span>
                <span class="badge" style="background:rgba(34,197,94,.1);color:var(--green)">${e.price === 0 ? 'FREE' : '₹' + e.price}</span>
              </div>
            </div>
            <div style="display:flex;gap:8px;flex-shrink:0">
              <button class="btn btn-ghost btn-sm" onclick="editEvent('${e.id}')">✏️ Edit</button>
              <button class="btn btn-sm" style="background:rgba(34,197,94,.1);color:var(--green);border:1px solid rgba(34,197,94,.2)" onclick="toggleEventStatus('${e.id}')">🔄 Status</button>
              <button class="btn btn-sm" style="background:rgba(255,60,110,.1);color:var(--accent);border:1px solid rgba(255,60,110,.2)" onclick="deleteEvent('${e.id}')">🗑️</button>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
}

function renderAdminStudents() {
  const users   = DB.get('users')   || [];
  const tickets = DB.get('tickets') || [];
  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header">
      <div class="admin-title">STUDENTS (${users.length})</div>
      <input class="form-input" style="width:220px" placeholder="🔍 Search students..." oninput="filterStudents(this.value)">
    </div>
    <div style="display:flex;flex-direction:column;gap:12px" id="students-list">
      ${users.map(u => `
        <div class="dash-card" style="padding:16px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">${u.fname[0]}</div>
            <div style="flex:1">
              <div style="font-weight:700">${u.fname} ${u.lname} <span class="badge ${u.role === 'admin' ? 'badge-accent' : 'badge-purple'}">${u.role.toUpperCase()}</span></div>
              <div style="font-size:.75rem;color:var(--text2)">${u.cid} · ${u.email} · ${u.dept || '—'}</div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:var(--accent)">${tickets.filter(t => t.userId === u.id).length}</div>
              <div style="font-size:.68rem;color:var(--text2)">events</div>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
}

function filterStudents(q) {
  const users   = DB.get('users')   || [];
  const tickets = DB.get('tickets') || [];
  const filtered = users.filter(u => (u.fname + ' ' + u.lname + u.cid + u.email).toLowerCase().includes(q.toLowerCase()));
  document.getElementById('students-list').innerHTML = filtered.map(u => `
    <div class="dash-card" style="padding:16px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:1.2rem">${u.fname[0]}</div>
        <div style="flex:1">
          <div style="font-weight:700">${u.fname} ${u.lname}</div>
          <div style="font-size:.75rem;color:var(--text2)">${u.cid} · ${u.email}</div>
        </div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:var(--accent)">${tickets.filter(t => t.userId === u.id).length}</div>
      </div>
    </div>`).join('');
}

function renderAdminScan() {
  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header"><div class="admin-title">QR SCANNER</div></div>
    <div style="max-width:480px">
      <div style="background:var(--surface);border:2px dashed var(--border2);border-radius:var(--r);padding:40px;text-align:center;margin-bottom:20px">
        <div style="font-size:4rem;margin-bottom:12px">📷</div>
        <div style="font-weight:600;margin-bottom:8px">QR Code Scanner</div>
        <div style="color:var(--text2);font-size:.85rem;margin-bottom:20px">Scan student QR passes at event entry for instant verification</div>
        <button class="btn btn-primary btn-lg" onclick="simulateScan()">🔍 Simulate Scan</button>
      </div>
      <div class="dash-card">
        <div class="dc-title">🔍 Manual Ticket Lookup</div>
        <div style="display:flex;gap:10px;margin-bottom:16px">
          <input class="form-input" id="scan-input" placeholder="Enter Ticket ID (e.g. T1234567890)" style="flex:1">
          <button class="btn btn-primary" onclick="manualScan()">Verify</button>
        </div>
        <div id="scan-result"></div>
      </div>
    </div>`;
}

function simulateScan() {
  const tickets = DB.get('tickets') || [];
  if (!tickets.length) { toast('No tickets to scan. Book an event first!', 'info'); return; }
  verifyScanResult(tickets[tickets.length - 1].id);
}

function manualScan() {
  const id = document.getElementById('scan-input')?.value.trim();
  if (!id) { toast('Enter a ticket ID', 'error'); return; }
  verifyScanResult(id);
}

function verifyScanResult(ticketId) {
  const tickets = DB.get('tickets') || [];
  const users   = DB.get('users')   || [];
  const idx     = tickets.findIndex(t => t.id === ticketId);
  const result  = document.getElementById('scan-result');

  if (idx === -1) {
    if (result) result.innerHTML = `<div style="background:rgba(255,60,110,.1);border:1px solid rgba(255,60,110,.3);border-radius:10px;padding:16px;text-align:center"><div style="color:var(--accent);font-size:2rem;margin-bottom:8px">❌</div><div style="font-weight:700;color:var(--accent)">INVALID TICKET</div></div>`;
    toast('Invalid ticket ID!', 'error'); return;
  }

  const t = tickets[idx];
  if (t.status === 'used') {
    if (result) result.innerHTML = `<div style="background:rgba(255,215,0,.1);border:1px solid rgba(255,215,0,.3);border-radius:10px;padding:16px;text-align:center"><div style="font-size:2rem;margin-bottom:8px">⚠️</div><div style="font-weight:700;color:var(--gold)">ALREADY SCANNED</div><div style="font-size:.8rem;color:var(--text2);margin-top:4px">${t.eventName}</div></div>`;
    return;
  }

  tickets[idx].status = 'used';
  DB.set('tickets', tickets);

  const user = users.find(u => u.id === t.userId);
  if (result) result.innerHTML = `
    <div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:10px;padding:16px;text-align:center">
      <div style="color:var(--green);font-size:2.5rem;margin-bottom:8px">✅</div>
      <div style="font-weight:700;color:var(--green);font-size:1.1rem;margin-bottom:12px">ENTRY GRANTED</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:left">
        <div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-size:.65rem;color:var(--text2)">NAME</div><div style="font-weight:600;font-size:.82rem">${user?.fname || 'Unknown'} ${user?.lname || ''}</div></div>
        <div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-size:.65rem;color:var(--text2)">EVENT</div><div style="font-weight:600;font-size:.82rem">${t.eventName}</div></div>
        <div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-size:.65rem;color:var(--text2)">TICKET ID</div><div style="font-weight:600;font-size:.75rem">${t.id}</div></div>
        <div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-size:.65rem;color:var(--text2)">TYPE</div><div style="font-weight:600;font-size:.82rem;text-transform:capitalize">${t.ticketType}</div></div>
      </div>
    </div>`;
  toast('✅ Entry granted!', 'success');
}

function renderAdminAnn() {
  const notifs = DB.get('notifications') || [];
  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header">
      <div class="admin-title">ANNOUNCEMENTS</div>
      <button class="btn btn-primary" onclick="openModal('ann-overlay')">📢 New Announcement</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px">
      ${notifs.map(n => `
        <div class="notif-item">
          <div class="notif-icon-wrap ${n.type}">${n.icon}</div>
          <div class="notif-body-text">
            <div class="notif-title-text">${n.title}</div>
            <div class="notif-body-msg">${n.msg}</div>
          </div>
          <div style="font-size:.7rem;color:var(--text2)">${n.time}</div>
        </div>`).join('')}
    </div>`;
}

function renderAdminRevenue() {
  const tickets = DB.get('tickets') || [];
  const events  = DB.get('events')  || [];
  const total   = tickets.reduce((a, t) => a + t.price, 0);

  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header"><div class="admin-title">REVENUE</div></div>
    <div class="metrics-grid" style="margin-bottom:24px">
      <div class="metric-box"><div class="metric-val" style="color:var(--gold)">₹${total.toLocaleString()}</div><div class="metric-lbl">Total Revenue</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--green)">${tickets.length}</div><div class="metric-lbl">Transactions</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--accent)">${tickets.filter(t => t.price === 0).length}</div><div class="metric-lbl">Free Registrations</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--accent3)">₹${tickets.length ? Math.round(total / tickets.length) : 0}</div><div class="metric-lbl">Avg Ticket Price</div></div>
    </div>
    <div class="dash-card">
      <div class="dc-title">💰 Revenue by Event</div>
      ${events.map(e => {
        const evTickets = tickets.filter(t => t.eventId === e.id);
        const rev = evTickets.reduce((a, t) => a + t.price, 0);
        return `<div class="my-ticket-item">
          <div style="font-size:1.5rem">${e.icon}</div>
          <div class="ticket-info"><div class="ti-name">${e.name}</div><div class="ti-date">${evTickets.length} tickets sold</div></div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:var(--gold)">₹${rev}</div>
        </div>`;
      }).join('')}
    </div>`;
}

function editEvent(eventId) {
  const events = DB.get('events') || [];
  const e      = events.find(ev => ev.id === eventId);
  if (!e) return;

  document.getElementById('ce-name').value   = e.name;
  document.getElementById('ce-cat').value    = e.category;
  document.getElementById('ce-status').value = e.status;
  document.getElementById('ce-date').value   = e.date;
  document.getElementById('ce-time').value   = e.time;
  document.getElementById('ce-venue').value  = e.venue;
  document.getElementById('ce-price').value  = e.price;
  document.getElementById('ce-seats').value  = e.seats;
  document.getElementById('ce-desc').value   = e.desc  || '';
  document.getElementById('ce-org').value    = e.org   || '';

  openModal('create-event-overlay');
  const btn = document.querySelector('#create-event-overlay .btn-primary');
  btn.textContent = 'Update Event →';
  btn.onclick     = () => updateEvent(eventId);
}

function updateEvent(eventId) {
  const events = DB.get('events') || [];
  const idx    = events.findIndex(e => e.id === eventId);
  if (idx === -1) return;

  events[idx] = {
    ...events[idx],
    name:     v('ce-name'),
    category: v('ce-cat'),
    status:   v('ce-status'),
    date:     v('ce-date'),
    time:     v('ce-time'),
    venue:    v('ce-venue'),
    price:    parseInt(v('ce-price') || 0),
    seats:    parseInt(v('ce-seats') || 100),
    desc:     v('ce-desc'),
    org:      v('ce-org'),
  };
  DB.set('events', events);
  closeModal('create-event-overlay');
  toast('Event updated!', 'success');
  renderAdminEvents();
}

function toggleEventStatus(eventId) {
  const events   = DB.get('events') || [];
  const idx      = events.findIndex(e => e.id === eventId);
  if (idx === -1) return;

  const statuses = ['upcoming', 'live', 'completed'];
  const cur      = statuses.indexOf(events[idx].status);
  events[idx].status = statuses[(cur + 1) % statuses.length];
  DB.set('events', events);
  toast(`Status → ${events[idx].status}`, 'info');
  renderAdminEvents();
}

function deleteEvent(eventId) {
  if (!confirm('Delete this event? This cannot be undone.')) return;
  let events = DB.get('events') || [];
  events = events.filter(e => e.id !== eventId);
  DB.set('events', events);
  toast('Event deleted', 'info');
  renderAdminEvents();
}

function createEvent() {
  const name = v('ce-name');
  if (!name) { toast('Event name is required', 'error'); return; }

  const events  = DB.get('events') || [];
  const icons   = { Cultural: '🎭', Technical: '💻', Sports: '⚽', Workshop: '🛠️', Seminar: '🎙️', Fest: '🎪', 'Fresher Party': '🎉', 'Inter-College': '🌐' };
  const bgs     = ['e-bg-1', 'e-bg-2', 'e-bg-3', 'e-bg-4', 'e-bg-5', 'e-bg-6', 'e-bg-7', 'e-bg-8'];
  const cat     = v('ce-cat');

  const newEvent = {
    id:       'ev' + Date.now(),
    name,
    category: cat,
    status:   v('ce-status') || 'upcoming',
    date:     v('ce-date')   || new Date().toISOString().split('T')[0],
    time:     v('ce-time')   || '10:00 AM',
    venue:    v('ce-venue')  || 'To be announced',
    price:    parseInt(v('ce-price') || 0),
    seats:    parseInt(v('ce-seats') || 100),
    booked:   0,
    org:      v('ce-org')    || 'College',
    desc:     v('ce-desc')   || '',
    icon:     icons[cat]     || '🎯',
    bg:       bgs[events.length % 8],
  };

  DB.push('events', newEvent);
  addNotif('New Event Added!', `"${name}" has been published.`, '🎪', 'ni-purple');
  closeModal('create-event-overlay');
  toast('Event created successfully! 🎉', 'success');
  renderAdminEvents();

  // Reset the button back to "create" mode
  const btn = document.querySelector('#create-event-overlay .btn-primary');
  btn.textContent = 'Create Event →';
  btn.onclick     = createEvent;
}

function sendAnnouncement() {
  const title = v('ann-title');
  const msg   = v('ann-msg');
  if (!title || !msg) { toast('Fill all fields', 'error'); return; }

  const typeMap = { info: 'ni-cyan', success: 'ni-green', warning: 'ni-gold', event: 'ni-purple' };
  const iconMap = { info: 'ℹ️', success: '✅', warning: '⚠️', event: '🎪' };
  const type    = document.getElementById('ann-type')?.value || 'info';

  addNotif(title, msg, iconMap[type], typeMap[type]);
  closeModal('ann-overlay');
  toast('Announcement sent to all students!', 'success');
  renderAdminAnn();
  document.getElementById('ann-title').value = '';
  document.getElementById('ann-msg').value   = '';
}

function exportData() {
  const events  = DB.get('events')  || [];
  const tickets = DB.get('tickets') || [];
  const users   = DB.get('users')   || [];
  const data    = { events, tickets, users: users.map(u => ({ ...u, pass: '[HIDDEN]' })) };
  const blob    = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement('a');
  a.href = url; a.download = 'nexus-data.json'; a.click();
  toast('Data exported!', 'success');
}

// ════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════
function addNotif(title, msg, icon, type) {
  DB.push('notifications', { id: 'n' + Date.now(), title, msg, icon, type, time: 'Just now', read: false });
  const dot = document.getElementById('notif-dot');
  if (dot) dot.style.display = 'block';
}

function renderNotifications() {
  const notifs = DB.get('notifications') || [];
  const list   = document.getElementById('notif-list');
  if (!list) return;

  list.innerHTML = notifs.slice().reverse().map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markRead('${n.id}')">
      <div class="notif-icon-wrap ${n.type}">${n.icon}</div>
      <div class="notif-body-text">
        <div class="notif-title-text">${n.title}</div>
        <div class="notif-body-msg">${n.msg}</div>
      </div>
      <div class="notif-time-text">${n.time}</div>
    </div>`).join('') ||
    '<div class="empty-state"><div class="empty-icon">🔔</div><div class="empty-msg">No notifications</div></div>';
}

function markRead(id) {
  const notifs = DB.get('notifications') || [];
  const idx    = notifs.findIndex(n => n.id === id);
  if (idx !== -1) { notifs[idx].read = true; DB.set('notifications', notifs); }
  updateUnreadDot();
  renderNotifications();
}

function markAllRead() {
  const notifs = DB.get('notifications') || [];
  notifs.forEach(n => n.read = true);
  DB.set('notifications', notifs);
  updateUnreadDot();
  renderNotifications();
  toast('All notifications marked as read', 'info');
}

function updateUnreadDot() {
  const notifs = DB.get('notifications') || [];
  const unread = notifs.some(n => !n.read);
  const dot    = document.getElementById('notif-dot');
  if (dot) dot.style.display = unread ? 'block' : 'none';
}

// ════════════════════════════════════════
// COUNTDOWN
// ════════════════════════════════════════
function startCountdown() {
  const target = new Date('2025-05-15T10:00:00');
  function tick() {
    const diff = target - new Date();
    if (diff <= 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val).padStart(2, '0'); };
    set('cd-d', d); set('cd-h', h); set('cd-m', m); set('cd-s', s);
  }
  tick();
  setInterval(tick, 1000);
}

// ════════════════════════════════════════
// FEEDBACK
// ════════════════════════════════════════
let fbRating = 0;

function openFeedback()  { openModal('feedback-overlay'); }

function setRating(r) {
  fbRating = r;
  document.querySelectorAll('#fb-stars span').forEach((s, i) => s.style.opacity = i < r ? '1' : '0.3');
}

function submitFeedback() {
  const subject = v('fb-subject');
  const msg     = v('fb-message');
  if (!subject || !msg) { toast('Please fill all fields', 'error'); return; }
  closeModal('feedback-overlay');
  toast('Thank you for your feedback! ⭐', 'success');
  document.getElementById('fb-subject').value = '';
  document.getElementById('fb-message').value = '';
}

// ════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════
function v(id) { return document.getElementById(id)?.value?.trim() || ''; }

function showForgotPass() { toast('Password reset link sent to your email!', 'info'); }

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function updateNavAvatar() {
  const av = document.getElementById('nav-avatar');
  if (av && currentUser) av.textContent = currentUser.fname[0];
}

function toast(msg, type = 'info') {
  const container = document.getElementById('toast');
  const icons     = { success: '✅', error: '❌', info: 'ℹ️' };
  const item      = document.createElement('div');
  item.className  = `toast-item ${type}`;
  item.innerHTML  = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(item);
  setTimeout(() => {
    item.style.opacity   = '0';
    item.style.transform = 'translateX(20px)';
    item.style.transition = 'all .3s';
    setTimeout(() => item.remove(), 300);
  }, 3000);
}

// ════════════════════════════════════════
// OVERLAY CLOSE HANDLERS
// ════════════════════════════════════════
document.querySelectorAll('.overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.overlay.open').forEach(o => o.classList.remove('open'));
});

// ════════════════════════════════════════
// SCROLL REVEAL
// ════════════════════════════════════════
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
initDB();

// Auto-login from saved session
const savedId = DB.get('current_user');
if (savedId) {
  const users = DB.get('users') || [];
  const user  = users.find(u => u.id === savedId);
  if (user) loginSuccess(user);
}

startCountdown();
populateCatFilter();
