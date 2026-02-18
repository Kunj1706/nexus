/* ═══════════════════════════════════════
   NEXUS – College Event App  |  Firebase Edition
   app.js
═══════════════════════════════════════

   🔴 SETUP (one-time, 5 minutes):
   1. Go to https://console.firebase.google.com
   2. Click "Add Project" → name it "nexus-events" → Create
   3. Click the </> Web icon → Register app → Copy the firebaseConfig object
   4. Paste it below replacing the FIREBASE_CONFIG placeholder
   5. Authentication → Sign-in method → Enable "Email/Password"
   6. Firestore Database → Create database → "Start in test mode" → Done
   7. Upload to GitHub Pages — works for all students instantly!
*/

// ════════════════════════════════════════
// 🔴 PASTE YOUR FIREBASE CONFIG HERE
// ════════════════════════════════════════
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDXea8Fq7QOD5LlVEkKY4jF4fYr6RbKCSI",
  authDomain:        "nexus-events-61635.firebaseapp.com",
  projectId:         "nexus-events-61635",
  storageBucket:     "nexus-events-61635.firebasestorage.app",
  messagingSenderId: "948665337108",
  appId:             "1:948665337108:web:cb8a706b6c1c8bb89eae01"
};

firebase.initializeApp(FIREBASE_CONFIG);
const auth = firebase.auth();
const db   = firebase.firestore();

const COL = {
  events:  db.collection('events'),
  users:   db.collection('users'),
  tickets: db.collection('tickets'),
  notifs:  db.collection('notifications'),
};

// ── Seed data ──────────────────────────
const EVENTS_SEED = [
  { id:'ev001', name:'Rhythm Night 2025',           category:'Cultural',  status:'live',      date:'2025-03-22', time:'7:00 PM',  venue:'Main Auditorium, Block A', price:150, seats:300,  booked:158, org:'Cultural Committee',     desc:'The biggest musical night of the year! Enjoy live performances, DJ sets, and more.',          icon:'🎵', bg:'e-bg-1' },
  { id:'ev002', name:'CodeStorm Hackathon',          category:'Technical', status:'upcoming',  date:'2025-04-05', time:'9:00 AM',  venue:'CS Lab Complex',           price:200, seats:160,  booked:71,  org:'Tech Club',              desc:'48-hour coding marathon. Win up to ₹50,000 in prizes. Team of 2–4.',                          icon:'💻', bg:'e-bg-2', prize:'₹50,000' },
  { id:'ev003', name:'Future Tech Summit',           category:'Seminar',   status:'upcoming',  date:'2025-03-28', time:'2:00 PM',  venue:'Seminar Hall, Block B',    price:0,   seats:400,  booked:210, org:'Industry Relations Cell', desc:'Connect with tech leaders. Learn about AI, ML and future careers. Free entry.',               icon:'🎙️',bg:'e-bg-3' },
  { id:'ev004', name:'Inter-Dept Football Cup',     category:'Sports',    status:'upcoming',  date:'2025-04-10', time:'8:00 AM',  venue:'College Ground',           price:500, seats:320,  booked:264, org:'Sports Committee',       desc:'Annual inter-department football tournament. Register your team of 11.',                      icon:'⚽', bg:'e-bg-4' },
  { id:'ev005', name:'UI/UX Design Bootcamp',       category:'Workshop',  status:'upcoming',  date:'2025-03-30', time:'10:00 AM', venue:'Innovation Lab',           price:300, seats:80,   booked:24,  org:'Design Club',            desc:'Learn Figma, user research, and design thinking. Certificate provided.',                      icon:'🎨', bg:'e-bg-5' },
  { id:'ev006', name:'Utkarsh Annual Fest',         category:'Fest',      status:'upcoming',  date:'2025-05-15', time:'10:00 AM', venue:'College Campus',           price:500, seats:2000, booked:840, org:'Student Council',        desc:'The biggest 3-day college festival with celebrity performances and competitions.',              icon:'🎪', bg:'e-bg-6' },
  { id:'ev007', name:'AI & ML Workshop',            category:'Workshop',  status:'upcoming',  date:'2025-04-02', time:'11:00 AM', venue:'CS Seminar Room',          price:0,   seats:60,   booked:57,  org:'AI Club',                desc:'Hands-on workshop on Python, TensorFlow, and ML basics. Bring your laptop.',                  icon:'🤖', bg:'e-bg-7' },
  { id:'ev008', name:'Classical Dance Competition', category:'Cultural',  status:'completed', date:'2025-02-14', time:'5:00 PM',  venue:'Open Air Theatre',         price:100, seats:500,  booked:498, org:'Cultural Committee',     desc:'Annual Bharatanatyam and folk dance competition.',                                             icon:'💃', bg:'e-bg-8' },
];

const CATEGORIES = [
  { name:'Cultural',      icon:'🎭', color:'rgba(255,60,110,.15)' },
  { name:'Technical',     icon:'💻', color:'rgba(0,229,255,.1)'   },
  { name:'Sports',        icon:'⚽', color:'rgba(34,197,94,.1)'   },
  { name:'Workshop',      icon:'🛠️',color:'rgba(124,58,237,.15)' },
  { name:'Seminar',       icon:'🎙️',color:'rgba(255,215,0,.1)'   },
  { name:'Fest',          icon:'🎪', color:'rgba(255,100,0,.12)'  },
  { name:'Fresher Party', icon:'🎉', color:'rgba(200,0,200,.1)'   },
  { name:'Inter-College', icon:'🌐', color:'rgba(0,100,255,.12)'  },
];

// ── In-memory cache ──────────────────
let cachedEvents  = [];
let cachedTickets = [];
let cachedUsers   = [];
let cachedNotifs  = [];

// ════════════════════════════════════════
// SEED FIRESTORE (first run only)
// ════════════════════════════════════════
async function seedFirestoreIfEmpty() {
  try {
    const snap = await COL.events.limit(1).get();
    if (!snap.empty) return;
    const batch = db.batch();
    EVENTS_SEED.forEach(e => batch.set(COL.events.doc(e.id), e));
    batch.set(COL.notifs.doc('n-welcome'), { id:'n-welcome', title:'Welcome to NEXUS!', msg:'Explore events and book your passes.', icon:'🎉', type:'ni-cyan', time:'Just now', global:true, read:false });
    await batch.commit();
    console.log('Firestore seeded ✓');
  } catch(e) { console.warn('Seed skipped (check config):', e.message); }
}

// ════════════════════════════════════════
// LOAD ALL DATA
// ════════════════════════════════════════
async function loadAllData() {
  showLoader(true);
  try {
    const [evSnap, tickSnap, userSnap, notifSnap] = await Promise.all([
      COL.events.get(),
      COL.tickets.get(),
      COL.users.get(),
      COL.notifs.get(),
    ]);
    cachedEvents  = evSnap.docs.map(d  => ({ id:d.id, ...d.data() }));
    cachedTickets = tickSnap.docs.map(d => ({ id:d.id, ...d.data() }));
    cachedUsers   = userSnap.docs.map(d => ({ id:d.id, ...d.data() }));
    cachedNotifs  = notifSnap.docs.map(d => ({ id:d.id, ...d.data() }));
  } catch(e) {
    console.error('Load error:', e);
    toast('Could not load data. Check your Firebase config.', 'error');
  }
  showLoader(false);
}

function showLoader(show) {
  let el = document.getElementById('global-loader');
  if (!el) {
    el = document.createElement('div');
    el.id = 'global-loader';
    el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent2))';
    document.body.appendChild(el);
  }
  el.style.display = show ? 'block' : 'none';
}

// ════════════════════════════════════════
// STATE
// ════════════════════════════════════════
let currentUser        = null;
let currentAuthUser    = null;
let currentEventFilter = 'all';

// ════════════════════════════════════════
// AUTH — FIREBASE
// ════════════════════════════════════════
auth.onAuthStateChanged(async (fbUser) => {
  if (fbUser) {
    currentAuthUser = fbUser;
    const userDoc = await COL.users.doc(fbUser.uid).get();
    if (userDoc.exists) {
      currentUser = { id:fbUser.uid, ...userDoc.data() };
      await loadAllData();
      document.getElementById('screen-auth').classList.remove('active');
      document.getElementById('screen-app').classList.add('active');
      const adminBtn = document.getElementById('admin-nav-btn');
      if (adminBtn) adminBtn.style.display = currentUser.role === 'admin' ? '' : 'none';
      updateNavAvatar();
      showPage('home');
      renderAll();
    }
  } else {
    currentAuthUser = null; currentUser = null;
    document.getElementById('screen-app').classList.remove('active');
    document.getElementById('screen-auth').classList.add('active');
  }
});

function authTab(tab) {
  document.getElementById('auth-login').style.display    = tab==='login'    ? 'block' : 'none';
  document.getElementById('auth-register').style.display = tab==='register' ? 'block' : 'none';
  const lb = document.getElementById('auth-tab-login'), rb = document.getElementById('auth-tab-register');
  lb.className = 'btn btn-sm ' + (tab==='login'    ? 'btn-primary' : 'btn-ghost');
  rb.className = 'btn btn-sm ' + (tab==='register' ? 'btn-primary' : 'btn-ghost');
  [lb,rb].forEach(b => { b.style.flex='1'; b.style.justifyContent='center'; });
}

async function doLogin() {
  const id   = document.getElementById('login-id').value.trim();
  const pass = document.getElementById('login-pass').value;
  const err  = document.getElementById('login-err');
  if (!id || !pass) { err.style.display='block'; err.textContent='Please fill all fields'; return; }

  let email = id;
  if (!id.includes('@')) {
    try {
      let snap = await COL.users.where('cid','==',id).limit(1).get();
      if (snap.empty) snap = await COL.users.where('mobile','==',id).limit(1).get();
      if (snap.empty) { err.style.display='block'; err.textContent='No account found with this ID/mobile'; return; }
      email = snap.docs[0].data().email;
    } catch(e) { err.style.display='block'; err.textContent='Try using your email address.'; return; }
  }
  try {
    err.style.display='none';
    await auth.signInWithEmailAndPassword(email, pass);
    toast('Welcome back! 👋', 'success');
  } catch(e) {
    err.style.display='block';
    err.textContent = e.code==='auth/wrong-password' ? 'Incorrect password.' :
                      e.code==='auth/user-not-found'  ? 'No account found.' : e.message;
  }
}

async function doRegister() {
  const fname=v('reg-fname'),lname=v('reg-lname'),cid=v('reg-cid'),mobile=v('reg-mobile');
  const email=v('reg-email'),dept=v('reg-dept'),year=v('reg-year'),pass=v('reg-pass');
  const err = document.getElementById('reg-err');
  if (!fname||!lname||!cid||!mobile||!email||!dept||!year||!pass) { err.style.display='block'; err.textContent='Please fill all fields'; return; }
  if (pass.length<6) { err.style.display='block'; err.textContent='Password must be at least 6 characters'; return; }
  const cidSnap = await COL.users.where('cid','==',cid).limit(1).get();
  if (!cidSnap.empty) { err.style.display='block'; err.textContent='College ID already registered'; return; }
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await COL.users.doc(cred.user.uid).set({ fname,lname,cid,mobile,email,dept,year,role:'student', createdAt:firebase.firestore.FieldValue.serverTimestamp() });
    await COL.notifs.add({ userId:cred.user.uid, title:`Welcome ${fname}!`, msg:'Your NEXUS account is ready. Explore events! 🎉', icon:'🎉', type:'ni-cyan', time:'Just now', read:false, global:false, createdAt:firebase.firestore.FieldValue.serverTimestamp() });
    err.style.display='none';
    toast('Account created! 🎉', 'success');
  } catch(e) {
    err.style.display='block';
    err.textContent = e.code==='auth/email-already-in-use' ? 'Email already registered.' : e.message;
  }
}

async function demoLogin() {
  try { await auth.signInWithEmailAndPassword('arjun@college.edu','demo123'); toast('Demo student logged in! 👋','success'); }
  catch(e) {
    try {
      const c = await auth.createUserWithEmailAndPassword('arjun@college.edu','demo123');
      await COL.users.doc(c.user.uid).set({ fname:'Arjun',lname:'Sharma',cid:'CSE-2023-0142',mobile:'9876543210',email:'arjun@college.edu',dept:'Computer Science',year:'2nd Year',role:'student' });
      toast('Demo account ready! 👋','success');
    } catch(e2) { toast('Demo login failed. Check Firebase config.','error'); }
  }
}

async function demoAdmin() {
  try { await auth.signInWithEmailAndPassword('admin@nexus.edu','admin123'); toast('Admin logged in! 🛡️','success'); }
  catch(e) {
    try {
      const c = await auth.createUserWithEmailAndPassword('admin@nexus.edu','admin123');
      await COL.users.doc(c.user.uid).set({ fname:'Admin',lname:'NEXUS',cid:'ADMIN-001',mobile:'9999999999',email:'admin@nexus.edu',dept:'Administration',year:'—',role:'admin' });
      toast('Admin account ready! 🛡️','success');
    } catch(e2) { toast('Admin login failed. Check Firebase config.','error'); }
  }
}

async function doLogout() {
  await auth.signOut();
  currentUser=null; currentAuthUser=null;
  cachedEvents=[]; cachedTickets=[]; cachedUsers=[]; cachedNotifs=[];
  toast('Logged out successfully','info');
}

// ════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════
const pages = ['home','events','tickets','dashboard','admin','notifications','event-detail'];

function showPage(page) {
  pages.forEach(p => { const el=document.getElementById('page-'+p); if(el) el.style.display=p===page?'block':'none'; });
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  const nl=document.getElementById('nl-'+page); if(nl) nl.classList.add('active');
  document.querySelectorAll('.bnav-item').forEach(b=>b.classList.remove('active'));
  const bm={home:0,events:1,tickets:2,dashboard:3,notifications:4};
  if(bm[page]!==undefined) document.querySelectorAll('.bnav-item')[bm[page]]?.classList.add('active');
  if(page==='home')          renderHome();
  if(page==='events')        renderEventsPage();
  if(page==='tickets')       renderTicketsPage();
  if(page==='dashboard')     renderDashboard();
  if(page==='admin') {
    if(currentUser?.role!=='admin'){toast('Admin access only!','error');showPage('home');return;}
    renderAdminOverview();
  }
  if(page==='notifications') renderNotifications();
  window.scrollTo({top:0,behavior:'smooth'});
}

// ════════════════════════════════════════
// RENDER
// ════════════════════════════════════════
function renderAll() { renderHome(); populateCatFilter(); startCountdown(); }

function renderHome() {
  const sel = id => document.getElementById(id);
  if(sel('hs-events'))   sel('hs-events').textContent   = cachedEvents.length;
  if(sel('hs-students')) sel('hs-students').textContent = cachedUsers.length+'+';
  if(sel('hs-tickets'))  sel('hs-tickets').textContent  = cachedTickets.length;
  const cg=sel('home-cat-grid');
  if(cg) cg.innerHTML=CATEGORIES.map(c=>`<div class="cat-card" onclick="filterByCat('${c.name}')" style="border-top:2px solid ${c.color.replace(/\.[0-9]+\)/,')')}"><span class="cat-icon">${c.icon}</span><div class="cat-name">${c.name}</div><div class="cat-count">${cachedEvents.filter(e=>e.category===c.name).length} events</div></div>`).join('');
  const hg=sel('home-events-grid');
  if(hg) hg.innerHTML=cachedEvents.filter(e=>e.status!=='completed').slice(0,3).map(e=>eventCard(e)).join('');
  renderLeaderboard(); renderPopularBars();
}

function eventCard(e) {
  const pct=Math.round(e.booked/e.seats*100);
  const badge=e.status==='live'?'<span class="e-badge badge-live">● LIVE</span>':e.price===0?'<span class="e-badge badge-free">FREE</span>':e.status==='completed'?'<span class="e-badge badge-completed">COMPLETED</span>':'<span class="e-badge badge-upcoming">UPCOMING</span>';
  return `<div class="event-card" onclick="viewEvent('${e.id}')">
    <div class="event-thumb ${e.bg}"><div class="event-thumb-glow">${e.icon}</div><span style="position:relative;z-index:1">${e.icon}</span>${badge}<div class="e-seats">🪑 ${e.seats-e.booked} left</div></div>
    <div class="event-body">
      <div class="e-cat">${e.category}</div><div class="e-title">${e.name}</div>
      <div class="e-meta"><div class="e-meta-row">📅 ${e.date} · ${e.time}</div><div class="e-meta-row">📍 ${e.venue}</div>${e.prize?`<div class="e-meta-row">🏆 ${e.prize}</div>`:''}</div>
      <div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text2);margin-bottom:4px"><span>Booked</span><span>${pct}%</span></div><div style="background:var(--bg2);border-radius:4px;height:4px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${pct>80?'var(--accent)':pct>50?'var(--accent2)':'var(--green)'};border-radius:4px"></div></div></div>
      <div class="e-footer"><div class="e-price">${e.price===0?'FREE':'₹'+e.price}<span>per ticket</span></div><button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openBooking('${e.id}')">${e.status==='completed'?'View Details':'Book Now →'}</button></div>
    </div></div>`;
}

function renderEventsPage() { filterEvents(); }

function populateCatFilter() {
  const sel=document.getElementById('event-cat-filter');
  if(!sel) return;
  sel.innerHTML='<option value="">All Categories</option>'+CATEGORIES.map(c=>`<option value="${c.name}">${c.name}</option>`).join('');
}

function filterEvents() {
  const search=(document.getElementById('event-search')?.value||'').toLowerCase();
  const cat=document.getElementById('event-cat-filter')?.value||'';
  let ev=[...cachedEvents];
  if(search) ev=ev.filter(e=>e.name.toLowerCase().includes(search)||e.category.toLowerCase().includes(search)||e.venue.toLowerCase().includes(search));
  if(cat) ev=ev.filter(e=>e.category===cat);
  if(currentEventFilter==='upcoming')  ev=ev.filter(e=>e.status==='upcoming');
  if(currentEventFilter==='live')      ev=ev.filter(e=>e.status==='live');
  if(currentEventFilter==='free')      ev=ev.filter(e=>e.price===0);
  if(currentEventFilter==='completed') ev=ev.filter(e=>e.status==='completed');
  const grid=document.getElementById('all-events-grid');
  if(!grid) return;
  grid.innerHTML=ev.length?ev.map(e=>eventCard(e)).join(''):'<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><div class="empty-msg">No events found.</div></div>';
}

function setEventFilter(btn,filter) {
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active'); currentEventFilter=filter; filterEvents();
}
function filterByCat(cat) { showPage('events'); setTimeout(()=>{const s=document.getElementById('event-cat-filter');if(s){s.value=cat;filterEvents();}},50); }

function renderTicketsPage() {
  const tg=document.getElementById('tickets-grid');
  if(!tg) return;
  tg.innerHTML=`
    <div class="ticket-card t-regular">
      <div class="t-type" style="color:#a78bfa">🎫 Regular Pass</div>
      <div class="t-price" style="background:linear-gradient(135deg,#a78bfa,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent">₹150</div>
      <div class="t-price-sub">per event</div>
      <ul class="t-features"><li><span class="tick-y">✓</span> Full event access</li><li><span class="tick-y">✓</span> Digital QR pass</li><li><span class="tick-y">✓</span> Priority seating</li><li><span class="tick-y">✓</span> Photo gallery access</li><li><span class="tick-n">✗</span> <span style="opacity:.4">VIP lounge</span></li></ul>
      <button class="btn btn-purple btn-full" onclick="openBooking('ev001')">Get Regular Pass</button>
    </div>
    <div class="ticket-card t-vip">
      <div class="t-type" style="color:var(--accent)">⭐ VIP Pass</div>
      <div class="t-price">₹500</div>
      <div class="t-price-sub">all-access pass</div>
      <ul class="t-features"><li><span class="tick-y">✓</span> All events access</li><li><span class="tick-y">✓</span> VIP lounge & seating</li><li><span class="tick-y">✓</span> Backstage access</li><li><span class="tick-y">✓</span> Gift hamper included</li><li><span class="tick-y">✓</span> Certificate + memories</li></ul>
      <button class="btn btn-primary btn-full" onclick="openBooking('ev006')">🌟 Get VIP Pass</button>
    </div>`;
}

function renderDashboard() {
  if(!currentUser) return;
  const u=currentUser;
  document.getElementById('dash-av').textContent=u.fname[0];
  document.getElementById('dash-name').textContent=u.fname+' '+u.lname;
  document.getElementById('dash-id').textContent='ID: '+u.cid;
  const mt=cachedTickets.filter(t=>t.userId===u.id);
  const ts=mt.reduce((a,t)=>a+t.price,0);
  document.getElementById('dash-events-count').textContent=mt.length;
  document.getElementById('dash-certs-count').textContent=mt.filter(t=>t.status==='used').length;
  document.getElementById('dash-spend').textContent='₹'+ts;
  const badges=[];
  if(mt.length>=1) badges.push('<span class="p-badge pb-gold">🏆 Event Member</span>');
  if(mt.length>=5) badges.push('<span class="p-badge pb-purple">⚡ Active</span>');
  badges.push(`<span class="p-badge pb-cyan">${u.year||'Student'}</span>`);
  document.getElementById('dash-badges').innerHTML=badges.join('');
  dashTab('my-tickets');
}

function dashTab(tab) {
  document.querySelectorAll('.s-menu-item').forEach(m=>m.classList.remove('active'));
  event?.target?.classList?.add('active');
  const area=document.getElementById('dash-content-area');
  const u=currentUser, mt=cachedTickets.filter(t=>t.userId===u.id);

  if(tab==='my-tickets') {
    area.innerHTML=`<div class="dash-card"><div class="dc-title">🎫 My Tickets <span class="badge badge-accent">${mt.length}</span></div>${mt.length===0?`<div class="empty-state"><div class="empty-icon">🎟️</div><div class="empty-msg">No tickets yet!</div><button class="btn btn-primary" style="margin-top:16px" onclick="showPage('events')">Explore Events →</button></div>`:mt.map(t=>`<div class="my-ticket-item"><div class="ticket-qr" onclick="showQR('${t.id}')">▦</div><div class="ticket-info"><div class="ti-name">${t.eventName}</div><div class="ti-date">${t.date} · ${t.ticketType} · ₹${t.price}</div></div><div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end"><span class="ts-badge ${t.status==='upcoming'?'ts-upcoming':t.status==='used'?'ts-used':'ts-valid'}">${t.status.toUpperCase()}</span><button class="btn btn-ghost btn-sm" onclick="showQR('${t.id}')">View QR</button>${t.status!=='used'?`<button class="btn btn-sm" style="background:rgba(255,60,110,.1);color:var(--accent);border:1px solid rgba(255,60,110,.2)" onclick="cancelTicket('${t.id}')">Cancel</button>`:''}</div></div>`).join('')}</div>`;
  } else if(tab==='achievements') {
    area.innerHTML=`<div class="dash-card"><div class="dc-title">🏆 Achievements</div>${mt.length===0?`<div class="empty-state"><div class="empty-icon">🏅</div><div class="empty-msg">Attend events to unlock achievements!</div></div>`:''}${mt.length>=1?`<div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)"><span style="font-size:2rem">🥇</span><div><div style="font-weight:600">First Event Booked!</div><div style="font-size:.78rem;color:var(--text2)">${mt[0]?.eventName}</div></div></div>`:''}${mt.length>=3?`<div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)"><span style="font-size:2rem">🔥</span><div><div style="font-weight:600">Event Enthusiast</div><div style="font-size:.78rem;color:var(--text2)">Booked 3+ events</div></div></div>`:''}${mt.length>=5?`<div style="display:flex;align-items:center;gap:14px;padding:14px 0"><span style="font-size:2rem">⭐</span><div><div style="font-weight:600">Campus Star</div></div></div>`:''}</div>`;
  } else if(tab==='certificates') {
    const done=mt.filter(t=>t.status==='used');
    area.innerHTML=`<div class="dash-card"><div class="dc-title">📜 Certificates</div>${done.length===0?`<div class="empty-state"><div class="empty-icon">📜</div><div class="empty-msg">Complete events to earn certificates!</div></div>`:done.map(t=>`<div class="my-ticket-item"><div style="font-size:2rem">🏅</div><div class="ticket-info"><div class="ti-name">${t.eventName}</div><div class="ti-date">Participation Certificate · ${t.date}</div></div><button class="btn btn-success btn-sm" onclick="downloadCert('${t.id}')">Download</button></div>`).join('')}</div>`;
  } else if(tab==='edit-profile') {
    area.innerHTML=`<div class="dash-card"><div class="dc-title">✏️ Edit Profile</div><div class="form-row"><div class="form-group"><label class="form-label">First Name</label><input class="form-input" id="ep-fname" value="${u.fname}" type="text"></div><div class="form-group"><label class="form-label">Last Name</label><input class="form-input" id="ep-lname" value="${u.lname}" type="text"></div></div><div class="form-group"><label class="form-label">Mobile</label><input class="form-input" id="ep-mobile" value="${u.mobile}" type="tel"></div><div class="form-group"><label class="form-label">Email</label><input class="form-input" value="${u.email}" type="email" disabled style="opacity:.5"></div><div class="form-group"><label class="form-label">Department</label><input class="form-input" id="ep-dept" value="${u.dept}" type="text"></div><button class="btn btn-primary" onclick="saveProfile()">Save Changes ✓</button></div>`;
  } else if(tab==='payment-history') {
    area.innerHTML=`<div class="dash-card"><div class="dc-title">💰 Payment History</div>${mt.length===0?`<div class="empty-state"><div class="empty-icon">💳</div><div class="empty-msg">No transactions yet.</div></div>`:mt.map(t=>`<div class="my-ticket-item"><div style="width:42px;height:42px;border-radius:8px;background:${t.price===0?'rgba(34,197,94,.15)':'rgba(124,58,237,.15)'};display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">${t.price===0?'🆓':'💳'}</div><div class="ticket-info"><div class="ti-name">${t.eventName}</div><div class="ti-date">${t.bookedOn} · ${t.ticketType} · via ${t.payMethod||'N/A'}</div>${t.razorpayId?`<div style="font-size:.7rem;color:var(--text2);font-family:monospace">ID: ${t.razorpayId}</div>`:''}</div><div style="font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:${t.price===0?'var(--green)':'var(--gold)'}">${t.price===0?'FREE':'₹'+t.price}</div></div>`).join('')}</div>`;
  }
}

async function saveProfile() {
  const fname=document.getElementById('ep-fname')?.value.trim(), lname=document.getElementById('ep-lname')?.value.trim();
  const mobile=document.getElementById('ep-mobile')?.value.trim(), dept=document.getElementById('ep-dept')?.value.trim();
  if(!fname||!lname){toast('Name cannot be empty','error');return;}
  try {
    await COL.users.doc(currentUser.id).update({fname,lname,mobile,dept});
    currentUser={...currentUser,fname,lname,mobile,dept};
    const i=cachedUsers.findIndex(u=>u.id===currentUser.id);
    if(i!==-1) cachedUsers[i]={...cachedUsers[i],fname,lname,mobile,dept};
    renderDashboard(); toast('Profile updated! ✓','success');
  } catch(e){toast('Update failed: '+e.message,'error');}
}

function renderLeaderboard() {
  const ranked=cachedUsers.map(u=>({name:u.fname+' '+u.lname,dept:u.dept||'Student',count:cachedTickets.filter(t=>t.userId===u.id).length})).sort((a,b)=>b.count-a.count).slice(0,5);
  const colors=['#ffd700','#b0b0c0','#cd7f32','#a78bfa','#00e5ff'];
  const cls=['gold','silver','bronze','',''],emojis=['👑','🥈','🥉','4️⃣','5️⃣'];
  const el=document.getElementById('leaderboard-list');
  if(!el) return;
  el.innerHTML=ranked.map((r,i)=>`<div class="lb-row"><div class="lb-rank ${cls[i]}">${emojis[i]}</div><div class="lb-av" style="background:linear-gradient(135deg,${colors[i]}55,${colors[i]}22)">${r.name[0]}</div><div class="lb-info"><div class="lb-name">${r.name}</div><div class="lb-pts">${r.dept}</div></div><div class="lb-score">${r.count} <span style="font-size:.7rem">events</span></div></div>`).join('')||'<div class="empty-state"><div class="empty-msg">Be the first to book!</div></div>';
}

function renderPopularBars() {
  const sorted=[...cachedEvents].sort((a,b)=>(b.booked/b.seats)-(a.booked/a.seats)).slice(0,5);
  const colors=['linear-gradient(90deg,var(--accent),#ff6b6b)','linear-gradient(90deg,var(--accent2),#9f7aea)','linear-gradient(90deg,var(--accent3),#00b4d8)','linear-gradient(90deg,var(--gold),#f59e0b)','linear-gradient(90deg,var(--green),#16a34a)'];
  const el=document.getElementById('popular-events-bars');
  if(!el) return;
  el.innerHTML=sorted.map((e,i)=>{const p=Math.min(100,Math.round(e.booked/e.seats*100));return`<div class="bar-row"><span class="bar-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.name.split(' ').slice(0,2).join(' ')}</span><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${colors[i]}"></div></div><span class="bar-val">${p}%</span></div>`;}).join('');
}

// ════════════════════════════════════════
// BOOKING
// ════════════════════════════════════════
function openBooking(eventId) {
  const e=cachedEvents.find(ev=>ev.id===eventId);
  if(!e){toast('Event not found','error');return;}
  if(e.status==='completed'){viewEvent(eventId);return;}
  const already=cachedTickets.find(t=>t.eventId===eventId&&t.userId===currentUser.id);
  if(already){showQR(already.id);return;}
  const content=document.getElementById('booking-modal-content');
  content.innerHTML=`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px"><div style="font-size:2.5rem">${e.icon}</div><div><div style="font-family:'Bebas Neue',sans-serif;font-size:1.5rem;letter-spacing:.04em">${e.name}</div><div style="color:var(--text2);font-size:.82rem">${e.date} · ${e.venue}</div></div></div>
    <div style="background:var(--surface2);border-radius:10px;padding:16px;margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--text2);font-size:.85rem">Date & Time</span><span style="font-size:.85rem">${e.date} at ${e.time}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--text2);font-size:.85rem">Venue</span><span style="font-size:.85rem;text-align:right;max-width:180px">${e.venue}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--text2);font-size:.85rem">Seats Available</span><span style="font-size:.85rem">${e.seats-e.booked}</span></div>
      <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid var(--border)"><span style="font-weight:700">Total Amount</span><span style="font-family:'Bebas Neue';font-size:1.4rem;color:var(--gold)">${e.price===0?'FREE':'₹'+e.price}</span></div>
    </div>
    <div class="form-group"><label class="form-label">Ticket Type</label><select class="form-input" id="bk-type"><option value="regular">Regular (₹${e.price})</option>${e.price>0?`<option value="vip">VIP (₹${e.price*3})</option>`:''}<option value="group">Group of 4 (₹${e.price>0?e.price*4*0.8:0})</option></select></div>
    ${e.price>0?`<div style="background:var(--surface2);border-radius:12px;padding:14px;margin-bottom:18px"><div style="font-size:.75rem;color:var(--text2);margin-bottom:10px;font-weight:600;letter-spacing:.04em">ACCEPTED PAYMENT METHODS</div><div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px"><span style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:.75rem">📱 UPI / GPay</span><span style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:.75rem">💳 Debit / Credit Card</span><span style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:.75rem">🏦 Net Banking</span><span style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:.75rem">👛 Wallets</span></div><div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:var(--text2)">🔒 Powered by <strong style="color:var(--text)">Razorpay</strong> — 100% secure</div></div>`:''}
    <div style="background:rgba(255,60,110,.05);border:1px solid rgba(255,60,110,.15);border-radius:8px;padding:12px;margin-bottom:18px;font-size:.8rem;color:var(--text2)">✅ Digital QR pass generated instantly.<br>📧 Confirmation sent to ${currentUser?.email||'your email'}</div>
    <button class="btn btn-primary btn-full btn-lg" onclick="confirmBooking('${e.id}')">${e.price===0?'🎟️ Register Free →':'💳 Pay ₹'+e.price+' via Razorpay →'}</button>`;
  openModal('booking-overlay');
}

// ════════════════════════════════════════
// RAZORPAY
// ════════════════════════════════════════
const RAZORPAY_KEY_ID = 'rzp_test_SHUrifAT4lj1ob'; // 🔴 Replace with your key

function confirmBooking(eventId) {
  const e=cachedEvents.find(ev=>ev.id===eventId);
  if(!e) return;
  const typeEl=document.getElementById('bk-type');
  const ticketType=typeEl?typeEl.value:'regular';
  let price=e.price;
  if(ticketType==='vip')   price=e.price*3;
  if(ticketType==='group') price=e.price>0?Math.round(e.price*4*0.8):0;

  if(price===0){ issueTicket(eventId,e,ticketType,0,'Free',null); return; }

  if(typeof Razorpay==='undefined'){ toast('Payment gateway not loaded.','error'); return; }

  const rzp=new Razorpay({
    key:RAZORPAY_KEY_ID, amount:price*100, currency:'INR',
    name:'NEXUS Events', description:`${e.name} — ${ticketType}`,
    prefill:{ name:currentUser?currentUser.fname+' '+currentUser.lname:'', email:currentUser?.email||'', contact:currentUser?.mobile||'' },
    notes:{eventId,userId:currentUser?.id||'',ticketType},
    theme:{color:'#FF3C6E'},
    handler:function(resp){ issueTicket(eventId,e,ticketType,price,'Razorpay',resp.razorpay_payment_id); },
    modal:{ ondismiss:function(){ toast('Payment cancelled.','info'); } }
  });
  rzp.on('payment.failed',function(r){ toast('Payment failed: '+(r.error?.description||'Unknown'),'error'); });
  closeModal('booking-overlay');
  rzp.open();
}

async function issueTicket(eventId,e,ticketType,price,payMethod,razorpayId) {
  const tid='T'+Date.now();
  const ticket={ id:tid, eventId, userId:currentUser.id, eventName:e.name, date:e.date, venue:e.venue, ticketType, price, status:'upcoming', payMethod, razorpayId:razorpayId||null, bookedOn:new Date().toLocaleDateString('en-IN'), eventIcon:e.icon, createdAt:firebase.firestore.FieldValue.serverTimestamp() };
  try {
    await COL.tickets.doc(tid).set(ticket);
    await COL.events.doc(eventId).update({ booked:firebase.firestore.FieldValue.increment(1) });
    await addNotif('Booking Confirmed! 🎉',`Your ticket for "${e.name}" is ready. Show QR at entry.`,'✅','ni-green');
    cachedTickets.push({...ticket, createdAt:new Date()});
    const ei=cachedEvents.findIndex(ev=>ev.id===eventId);
    if(ei!==-1) cachedEvents[ei].booked=(cachedEvents[ei].booked||0)+1;
    toast('🎉 Payment successful! QR pass generated.','success');
    setTimeout(()=>showQR(tid),600);
  } catch(err){ console.error(err); toast('Booking failed. Try again.','error'); }
}

// ════════════════════════════════════════
// QR PASS
// ════════════════════════════════════════
function showQR(ticketId) {
  const t=cachedTickets.find(tk=>tk.id===ticketId);
  if(!t) return;
  document.getElementById('qr-modal-content').innerHTML=`
    <div style="margin-bottom:20px"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:.06em;margin-bottom:4px">${t.eventName}</div><div style="color:var(--text2);font-size:.85rem">${t.date} · ${t.venue}</div></div>
    <div style="background:#fff;border-radius:14px;padding:20px;display:inline-block;margin-bottom:20px;box-shadow:0 0 32px rgba(255,60,110,.2)">${generateQRSVG(`NEXUS-${t.id}-${t.userId}-${t.eventId}`)}</div>
    <div style="margin-bottom:16px"><div style="font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--accent3);letter-spacing:.1em;margin-bottom:6px">TICKET ID</div><div style="font-family:'JetBrains Mono',monospace;font-size:.85rem;color:var(--text2)">${t.id}</div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;text-align:left">
      <div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">TYPE</div><div style="font-weight:600;font-size:.85rem;text-transform:capitalize">${t.ticketType}</div></div>
      <div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">STATUS</div><div style="font-weight:600;font-size:.85rem;color:${t.status==='upcoming'?'#a78bfa':'var(--green)'}">${t.status.toUpperCase()}</div></div>
      <div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">PAID</div><div style="font-weight:600;font-size:.85rem;color:var(--gold)">${t.price===0?'FREE':'₹'+t.price}</div></div>
      <div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">BOOKED ON</div><div style="font-weight:600;font-size:.85rem">${t.bookedOn}</div></div>
    </div>
    <div style="display:flex;gap:10px"><button class="btn btn-primary" style="flex:1;justify-content:center" onclick="toast('Downloaded! 📥','success')">📥 Download Pass</button><button class="btn btn-ghost" style="flex:1;justify-content:center" onclick="toast('Shared! 📤','info')">📤 Share</button></div>`;
  openModal('qr-overlay');
}

function generateQRSVG(data) {
  const size=180,cells=21,cell=Math.floor(size/cells);
  let svg=`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="white"/>`;
  let seed=0;for(let i=0;i<data.length;i++)seed=(seed*31+data.charCodeAt(i))&0x7fffffff;
  function rand(){seed=(seed*1664525+1013904223)&0x7fffffff;return seed/0x7fffffff;}
  function corner(x,y){svg+=`<rect x="${x}" y="${y}" width="${cell*7}" height="${cell*7}" fill="black"/><rect x="${x+cell}" y="${y+cell}" width="${cell*5}" height="${cell*5}" fill="white"/><rect x="${x+cell*2}" y="${y+cell*2}" width="${cell*3}" height="${cell*3}" fill="black"/>`;}
  corner(0,0);corner((cells-7)*cell,0);corner(0,(cells-7)*cell);
  for(let r=0;r<cells;r++)for(let c=0;c<cells;c++){const ic=(r<8&&c<8)||(r<8&&c>cells-9)||(r>cells-9&&c<8);if(!ic&&rand()>0.5)svg+=`<rect x="${c*cell}" y="${r*cell}" width="${cell}" height="${cell}" fill="black"/>`;}
  return svg+'</svg>';
}

async function cancelTicket(ticketId) {
  if(!confirm('Cancel this ticket?')) return;
  try {
    await COL.tickets.doc(ticketId).update({status:'cancelled'});
    const i=cachedTickets.findIndex(t=>t.id===ticketId);
    if(i!==-1) cachedTickets[i].status='cancelled';
    toast('Ticket cancelled. Refund in 3-5 days.','info'); dashTab('my-tickets');
  } catch(e){toast('Cancel failed: '+e.message,'error');}
}
function downloadCert(){ toast('Certificate downloaded! 📜','success'); }

// ════════════════════════════════════════
// EVENT DETAIL
// ════════════════════════════════════════
function viewEvent(eventId) {
  const e=cachedEvents.find(ev=>ev.id===eventId);
  if(!e) return;
  const thumb=document.getElementById('edh-thumb');
  thumb.innerHTML=`<span style="font-size:5rem">${e.icon}</span><span class="e-badge ${e.status==='live'?'badge-live':e.status==='completed'?'badge-completed':'badge-upcoming'}" style="position:absolute;top:20px;right:24px;font-size:.9rem">${e.status==='live'?'● LIVE NOW':e.status==='completed'?'COMPLETED':'UPCOMING'}</span>`;
  thumb.className='event-detail-header '+e.bg;
  const booked=cachedTickets.find(t=>t.eventId===e.id&&t.userId===currentUser.id);
  const pct=Math.round(e.booked/e.seats*100);
  document.getElementById('edh-body').innerHTML=`
    <div>
      <div class="info-section">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:.04em;margin-bottom:6px">${e.name}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px"><span class="tag">📁 ${e.category}</span><span class="tag">👤 ${e.org}</span>${e.prize?`<span class="tag">🏆 ${e.prize}</span>`:''}</div>
        <p style="color:var(--text2);line-height:1.7;font-size:.9rem">${e.desc||'No description.'}</p>
      </div>
      <div class="info-section">
        <div class="is-title">📋 Event Details</div>
        <div class="info-row"><div class="info-icon">📅</div><div class="info-val"><strong>Date & Time</strong>${e.date} at ${e.time}</div></div>
        <div class="info-row"><div class="info-icon">📍</div><div class="info-val"><strong>Venue</strong>${e.venue}</div></div>
        <div class="info-row"><div class="info-icon">👤</div><div class="info-val"><strong>Organizer</strong>${e.org}</div></div>
        <div class="info-row"><div class="info-icon">🪑</div><div class="info-val"><strong>Availability</strong>${e.seats-e.booked} of ${e.seats} seats left</div></div>
        <div style="margin-top:12px"><div style="display:flex;justify-content:space-between;font-size:.75rem;color:var(--text2);margin-bottom:6px"><span>Booking Progress</span><span>${pct}%</span></div><div style="background:var(--bg);border-radius:6px;height:8px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${pct>80?'var(--accent)':'var(--green)'};border-radius:6px"></div></div></div>
      </div>
    </div>
    <div><div class="booking-box">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:.08em;margin-bottom:4px">BOOK YOUR PASS</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:2.8rem;letter-spacing:.04em;color:var(--gold);line-height:1;margin-bottom:4px">${e.price===0?'FREE':'₹'+e.price}</div>
      <div style="color:var(--text2);font-size:.8rem;margin-bottom:20px">per ticket</div>
      ${booked?`<div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);border-radius:8px;padding:14px;margin-bottom:14px;text-align:center"><div style="color:var(--green);font-weight:700;margin-bottom:4px">✅ Already Booked!</div><div style="font-size:.8rem;color:var(--text2)">Ticket ID: ${booked.id}</div></div><button class="btn btn-ghost btn-full" onclick="showQR('${booked.id}')">View QR Pass →</button>`:e.status==='completed'?`<button class="btn btn-ghost btn-full" disabled>Event Completed</button>`:e.seats-e.booked===0?`<button class="btn btn-ghost btn-full" disabled>🔴 Sold Out</button>`:`<button class="btn btn-primary btn-full btn-lg" onclick="openBooking('${e.id}')">Book Now →</button>`}
    </div></div>`;
  showPage('event-detail');
}

// ════════════════════════════════════════
// ADMIN
// ════════════════════════════════════════
function adminTab(btn,tab) {
  document.querySelectorAll('.admin-menu-item').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const m={overview:renderAdminOverview,'manage-events':renderAdminEvents,students:renderAdminStudents,scan:renderAdminScan,announcements:renderAdminAnn,revenue:renderAdminRevenue};
  if(m[tab]) m[tab]();
}

function renderAdminOverview() {
  const rev=cachedTickets.reduce((a,t)=>a+t.price,0);
  const bc=['linear-gradient(90deg,var(--accent),#ff6b6b)','linear-gradient(90deg,var(--accent2),#9f7aea)','linear-gradient(90deg,var(--accent3),#00b4d8)','linear-gradient(90deg,var(--gold),#f59e0b)','linear-gradient(90deg,var(--green),#16a34a)'];
  document.getElementById('admin-content').innerHTML=`
    <div class="admin-header"><div class="admin-title">OVERVIEW DASHBOARD</div><div style="display:flex;align-items:center;gap:6px;font-size:.8rem;color:var(--text2)"><div style="width:7px;height:7px;border-radius:50%;background:var(--accent);animation:pulse 1.5s ease infinite"></div>Live</div></div>
    <div class="metrics-grid" style="margin-bottom:28px">
      <div class="metric-box"><div class="metric-val" style="color:var(--accent)">₹${rev.toLocaleString()}</div><div class="metric-lbl">Total Revenue</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--accent3)">${cachedTickets.length}</div><div class="metric-lbl">Tickets Sold</div></div>
      <div class="metric-box"><div class="metric-val" style="color:#a78bfa">${cachedUsers.length}</div><div class="metric-lbl">Registered</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--gold)">${cachedEvents.filter(e=>e.status==='upcoming'||e.status==='live').length}</div><div class="metric-lbl">Active Events</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div class="dash-card"><div class="dc-title">📈 Event Popularity</div><div class="bar-list">${[...cachedEvents].sort((a,b)=>(b.booked/b.seats)-(a.booked/a.seats)).slice(0,5).map((e,i)=>{const p=Math.min(100,Math.round(e.booked/e.seats*100));return`<div class="bar-row"><span class="bar-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.name.split(' ').slice(0,2).join(' ')}</span><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${bc[i]}"></div></div><span class="bar-val">${p}%</span></div>`;}).join('')}</div></div>
      <div class="dash-card"><div class="dc-title">📋 Recent Tickets</div>${cachedTickets.slice(-5).reverse().map(t=>`<div class="my-ticket-item"><div style="font-size:1.4rem">🎫</div><div class="ticket-info"><div class="ti-name">${t.eventName}</div><div class="ti-date">${t.bookedOn}</div></div><div style="font-size:.8rem;color:var(--gold)">${t.price===0?'FREE':'₹'+t.price}</div></div>`).join('')||'<div class="empty-state"><div class="empty-msg">No tickets yet</div></div>'}</div>
    </div>
    <div class="dash-card"><div class="dc-title">⚡ Quick Actions</div><div style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn btn-primary" onclick="openModal('create-event-overlay')">➕ Create Event</button><button class="btn btn-purple" onclick="openModal('ann-overlay')">📢 Send Announcement</button><button class="btn btn-ghost" onclick="exportData()">📊 Export Data</button></div></div>`;
}

function renderAdminEvents() {
  document.getElementById('admin-content').innerHTML=`
    <div class="admin-header"><div class="admin-title">MANAGE EVENTS</div><button class="btn btn-primary" onclick="openModal('create-event-overlay')">➕ Create Event</button></div>
    <div style="display:flex;flex-direction:column;gap:14px">
      ${cachedEvents.map(e=>`<div class="dash-card" style="padding:18px"><div style="display:flex;align-items:center;gap:14px"><div style="font-size:2rem">${e.icon}</div><div style="flex:1"><div style="font-weight:700;margin-bottom:3px">${e.name}</div><div style="font-size:.78rem;color:var(--text2)">${e.category} · ${e.date} · ${e.venue}</div><div style="display:flex;gap:8px;margin-top:8px"><span class="badge ${e.status==='live'?'badge-accent':e.status==='completed'?'':'badge-purple'}">${e.status.toUpperCase()}</span><span class="badge" style="background:rgba(255,215,0,.1);color:var(--gold)">${e.booked}/${e.seats}</span><span class="badge" style="background:rgba(34,197,94,.1);color:var(--green)">${e.price===0?'FREE':'₹'+e.price}</span></div></div><div style="display:flex;gap:8px;flex-shrink:0"><button class="btn btn-ghost btn-sm" onclick="editEvent('${e.id}')">✏️ Edit</button><button class="btn btn-sm" style="background:rgba(34,197,94,.1);color:var(--green);border:1px solid rgba(34,197,94,.2)" onclick="toggleEventStatus('${e.id}')">🔄 Status</button><button class="btn btn-sm" style="background:rgba(255,60,110,.1);color:var(--accent);border:1px solid rgba(255,60,110,.2)" onclick="deleteEvent('${e.id}')">🗑️</button></div></div></div>`).join('')}
    </div>`;
}

function renderAdminStudents() {
  document.getElementById('admin-content').innerHTML=`
    <div class="admin-header"><div class="admin-title">STUDENTS (${cachedUsers.length})</div><input class="form-input" style="width:220px" placeholder="🔍 Search..." oninput="filterStudents(this.value)"></div>
    <div style="display:flex;flex-direction:column;gap:12px" id="students-list">${cachedUsers.map(u=>`<div class="dash-card" style="padding:16px"><div style="display:flex;align-items:center;gap:12px"><div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">${u.fname[0]}</div><div style="flex:1"><div style="font-weight:700">${u.fname} ${u.lname} <span class="badge ${u.role==='admin'?'badge-accent':'badge-purple'}">${u.role?.toUpperCase()}</span></div><div style="font-size:.75rem;color:var(--text2)">${u.cid} · ${u.email} · ${u.dept||'—'}</div></div><div style="text-align:right;flex-shrink:0"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:var(--accent)">${cachedTickets.filter(t=>t.userId===u.id).length}</div><div style="font-size:.68rem;color:var(--text2)">events</div></div></div></div>`).join('')}</div>`;
}

function filterStudents(q) {
  const f=cachedUsers.filter(u=>(u.fname+' '+u.lname+u.cid+u.email).toLowerCase().includes(q.toLowerCase()));
  document.getElementById('students-list').innerHTML=f.map(u=>`<div class="dash-card" style="padding:16px"><div style="display:flex;align-items:center;gap:12px"><div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:1.2rem">${u.fname[0]}</div><div style="flex:1"><div style="font-weight:700">${u.fname} ${u.lname}</div><div style="font-size:.75rem;color:var(--text2)">${u.cid} · ${u.email}</div></div><div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:var(--accent)">${cachedTickets.filter(t=>t.userId===u.id).length}</div></div></div>`).join('');
}

function renderAdminScan() {
  document.getElementById('admin-content').innerHTML=`
    <div class="admin-header"><div class="admin-title">QR SCANNER</div></div>
    <div style="max-width:480px">
      <div style="background:var(--surface);border:2px dashed var(--border2);border-radius:var(--r);padding:40px;text-align:center;margin-bottom:20px"><div style="font-size:4rem;margin-bottom:12px">📷</div><div style="font-weight:600;margin-bottom:8px">QR Code Scanner</div><div style="color:var(--text2);font-size:.85rem;margin-bottom:20px">Scan student passes for instant verification</div><button class="btn btn-primary btn-lg" onclick="simulateScan()">🔍 Simulate Scan</button></div>
      <div class="dash-card"><div class="dc-title">🔍 Manual Ticket Lookup</div><div style="display:flex;gap:10px;margin-bottom:16px"><input class="form-input" id="scan-input" placeholder="Enter Ticket ID" style="flex:1"><button class="btn btn-primary" onclick="manualScan()">Verify</button></div><div id="scan-result"></div></div>
    </div>`;
}

function simulateScan() { if(!cachedTickets.length){toast('No tickets to scan.','info');return;} verifyScanResult(cachedTickets[cachedTickets.length-1].id); }
function manualScan()   { const id=document.getElementById('scan-input')?.value.trim(); if(!id){toast('Enter a ticket ID','error');return;} verifyScanResult(id); }

async function verifyScanResult(ticketId) {
  const idx=cachedTickets.findIndex(t=>t.id===ticketId);
  const result=document.getElementById('scan-result');
  if(idx===-1){ if(result) result.innerHTML=`<div style="background:rgba(255,60,110,.1);border:1px solid rgba(255,60,110,.3);border-radius:10px;padding:16px;text-align:center"><div style="color:var(--accent);font-size:2rem;margin-bottom:8px">❌</div><div style="font-weight:700;color:var(--accent)">INVALID TICKET</div></div>`; toast('Invalid!','error'); return; }
  const t=cachedTickets[idx];
  if(t.status==='used'){ if(result) result.innerHTML=`<div style="background:rgba(255,215,0,.1);border:1px solid rgba(255,215,0,.3);border-radius:10px;padding:16px;text-align:center"><div style="font-size:2rem;margin-bottom:8px">⚠️</div><div style="font-weight:700;color:var(--gold)">ALREADY SCANNED</div></div>`; return; }
  try {
    await COL.tickets.doc(ticketId).update({status:'used'});
    cachedTickets[idx].status='used';
    const user=cachedUsers.find(u=>u.id===t.userId);
    if(result) result.innerHTML=`<div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:10px;padding:16px;text-align:center"><div style="color:var(--green);font-size:2.5rem;margin-bottom:8px">✅</div><div style="font-weight:700;color:var(--green);font-size:1.1rem;margin-bottom:12px">ENTRY GRANTED</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:left"><div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-size:.65rem;color:var(--text2)">NAME</div><div style="font-weight:600;font-size:.82rem">${user?.fname||'Unknown'} ${user?.lname||''}</div></div><div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-size:.65rem;color:var(--text2)">EVENT</div><div style="font-weight:600;font-size:.82rem">${t.eventName}</div></div></div></div>`;
    toast('✅ Entry granted!','success');
  } catch(e){toast('Scan update failed: '+e.message,'error');}
}

function renderAdminAnn() {
  document.getElementById('admin-content').innerHTML=`
    <div class="admin-header"><div class="admin-title">ANNOUNCEMENTS</div><button class="btn btn-primary" onclick="openModal('ann-overlay')">📢 New</button></div>
    <div style="display:flex;flex-direction:column;gap:12px">${cachedNotifs.filter(n=>n.global).map(n=>`<div class="notif-item"><div class="notif-icon-wrap ${n.type}">${n.icon}</div><div class="notif-body-text"><div class="notif-title-text">${n.title}</div><div class="notif-body-msg">${n.msg}</div></div><div style="font-size:.7rem;color:var(--text2)">${n.time||''}</div></div>`).join('')||'<div class="empty-state"><div class="empty-msg">No announcements yet</div></div>'}</div>`;
}

function renderAdminRevenue() {
  const total=cachedTickets.reduce((a,t)=>a+t.price,0);
  document.getElementById('admin-content').innerHTML=`
    <div class="admin-header"><div class="admin-title">REVENUE</div></div>
    <div class="metrics-grid" style="margin-bottom:24px">
      <div class="metric-box"><div class="metric-val" style="color:var(--gold)">₹${total.toLocaleString()}</div><div class="metric-lbl">Total Revenue</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--green)">${cachedTickets.length}</div><div class="metric-lbl">Transactions</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--accent)">${cachedTickets.filter(t=>t.price===0).length}</div><div class="metric-lbl">Free Registrations</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--accent3)">₹${cachedTickets.length?Math.round(total/cachedTickets.length):0}</div><div class="metric-lbl">Avg Ticket Price</div></div>
    </div>
    <div class="dash-card"><div class="dc-title">💰 Revenue by Event</div>${cachedEvents.map(e=>{const ev=cachedTickets.filter(t=>t.eventId===e.id);const r=ev.reduce((a,t)=>a+t.price,0);return`<div class="my-ticket-item"><div style="font-size:1.5rem">${e.icon}</div><div class="ticket-info"><div class="ti-name">${e.name}</div><div class="ti-date">${ev.length} tickets sold</div></div><div style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:var(--gold)">₹${r}</div></div>`;}).join('')}</div>`;
}

function editEvent(eventId) {
  const e=cachedEvents.find(ev=>ev.id===eventId); if(!e) return;
  ['name','cat','status','date','time','venue','price','seats','desc','org'].forEach(f=>{
    const el=document.getElementById('ce-'+f);
    if(el) el.value=e[f==='cat'?'category':f]||'';
  });
  openModal('create-event-overlay');
  const btn=document.querySelector('#create-event-overlay .btn-primary');
  btn.textContent='Update Event →'; btn.onclick=()=>updateEvent(eventId);
}

async function updateEvent(eventId) {
  const upd={name:v('ce-name'),category:v('ce-cat'),status:v('ce-status'),date:v('ce-date'),time:v('ce-time'),venue:v('ce-venue'),price:parseInt(v('ce-price')||0),seats:parseInt(v('ce-seats')||100),desc:v('ce-desc'),org:v('ce-org')};
  try {
    await COL.events.doc(eventId).update(upd);
    const i=cachedEvents.findIndex(e=>e.id===eventId);
    if(i!==-1) cachedEvents[i]={...cachedEvents[i],...upd};
    closeModal('create-event-overlay'); toast('Event updated!','success'); renderAdminEvents();
  } catch(e){toast('Update failed: '+e.message,'error');}
}

async function toggleEventStatus(eventId) {
  const i=cachedEvents.findIndex(e=>e.id===eventId); if(i===-1) return;
  const s=['upcoming','live','completed'],next=s[(s.indexOf(cachedEvents[i].status)+1)%s.length];
  try { await COL.events.doc(eventId).update({status:next}); cachedEvents[i].status=next; toast(`Status → ${next}`,'info'); renderAdminEvents(); }
  catch(e){toast('Update failed: '+e.message,'error');}
}

async function deleteEvent(eventId) {
  if(!confirm('Delete this event?')) return;
  try { await COL.events.doc(eventId).delete(); cachedEvents=cachedEvents.filter(e=>e.id!==eventId); toast('Event deleted','info'); renderAdminEvents(); }
  catch(e){toast('Delete failed: '+e.message,'error');}
}

async function createEvent() {
  const name=v('ce-name'); if(!name){toast('Event name required','error');return;}
  const icons={Cultural:'🎭',Technical:'💻',Sports:'⚽',Workshop:'🛠️',Seminar:'🎙️',Fest:'🎪','Fresher Party':'🎉','Inter-College':'🌐'};
  const bgs=['e-bg-1','e-bg-2','e-bg-3','e-bg-4','e-bg-5','e-bg-6','e-bg-7','e-bg-8'];
  const cat=v('ce-cat'), newId='ev'+Date.now();
  const ev={id:newId,name,category:cat,status:v('ce-status')||'upcoming',date:v('ce-date')||new Date().toISOString().split('T')[0],time:v('ce-time')||'10:00 AM',venue:v('ce-venue')||'TBA',price:parseInt(v('ce-price')||0),seats:parseInt(v('ce-seats')||100),booked:0,org:v('ce-org')||'College',desc:v('ce-desc')||'',icon:icons[cat]||'🎯',bg:bgs[cachedEvents.length%8],createdAt:firebase.firestore.FieldValue.serverTimestamp()};
  try {
    await COL.events.doc(newId).set(ev);
    cachedEvents.push({...ev,createdAt:new Date()});
    await addNotif('New Event Added!',`"${name}" has been published.`,'🎪','ni-purple');
    closeModal('create-event-overlay'); toast('Event created! 🎉','success'); renderAdminEvents();
    const btn=document.querySelector('#create-event-overlay .btn-primary');
    btn.textContent='Create Event →'; btn.onclick=createEvent;
  } catch(e){toast('Create failed: '+e.message,'error');}
}

async function sendAnnouncement() {
  const title=v('ann-title'),msg=v('ann-msg');
  if(!title||!msg){toast('Fill all fields','error');return;}
  const tm={info:'ni-cyan',success:'ni-green',warning:'ni-gold',event:'ni-purple'};
  const im={info:'ℹ️',success:'✅',warning:'⚠️',event:'🎪'};
  const type=document.getElementById('ann-type')?.value||'info';
  try {
    const ref=await COL.notifs.add({title,msg,icon:im[type],type:tm[type],time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),global:true,read:false,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    cachedNotifs.push({id:ref.id,title,msg,icon:im[type],type:tm[type],global:true});
    closeModal('ann-overlay'); toast('Announcement sent!','success'); renderAdminAnn();
    document.getElementById('ann-title').value=''; document.getElementById('ann-msg').value='';
  } catch(e){toast('Send failed: '+e.message,'error');}
}

function exportData() {
  const data={events:cachedEvents,tickets:cachedTickets,users:cachedUsers.map(u=>({...u,pass:'[HIDDEN]'}))};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url; a.download='nexus-data.json'; a.click();
  toast('Data exported!','success');
}

// ════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════
async function addNotif(title,msg,icon,type) {
  try {
    const ref=await COL.notifs.add({userId:currentUser?.id||null,title,msg,icon,type,time:'Just now',read:false,global:false,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    cachedNotifs.push({id:ref.id,title,msg,icon,type,read:false,global:false});
    const dot=document.getElementById('notif-dot'); if(dot) dot.style.display='block';
  } catch(e){console.error('Notif error:',e);}
}

function renderNotifications() {
  const mine=cachedNotifs.filter(n=>n.global||n.userId===currentUser?.id);
  const list=document.getElementById('notif-list'); if(!list) return;
  list.innerHTML=mine.slice().reverse().map(n=>`<div class="notif-item ${n.read?'':'unread'}" onclick="markRead('${n.id}')"><div class="notif-icon-wrap ${n.type}">${n.icon}</div><div class="notif-body-text"><div class="notif-title-text">${n.title}</div><div class="notif-body-msg">${n.msg}</div></div><div class="notif-time-text">${n.time||''}</div></div>`).join('')||'<div class="empty-state"><div class="empty-icon">🔔</div><div class="empty-msg">No notifications</div></div>';
}

async function markRead(id) {
  try { await COL.notifs.doc(id).update({read:true}); const i=cachedNotifs.findIndex(n=>n.id===id); if(i!==-1) cachedNotifs[i].read=true; updateUnreadDot(); renderNotifications(); } catch(e){}
}

async function markAllRead() {
  const mine=cachedNotifs.filter(n=>n.global||n.userId===currentUser?.id);
  const batch=db.batch();
  mine.forEach(n=>{batch.update(COL.notifs.doc(n.id),{read:true});n.read=true;});
  await batch.commit(); updateUnreadDot(); renderNotifications(); toast('All read','info');
}

function updateUnreadDot() {
  const mine=cachedNotifs.filter(n=>n.global||n.userId===currentUser?.id);
  const dot=document.getElementById('notif-dot');
  if(dot) dot.style.display=mine.some(n=>!n.read)?'block':'none';
}

// ════════════════════════════════════════
// COUNTDOWN
// ════════════════════════════════════════
function startCountdown() {
  const target=new Date('2025-05-15T10:00:00');
  function tick(){const diff=target-new Date();if(diff<=0)return;const d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=String(val).padStart(2,'0');};set('cd-d',d);set('cd-h',h);set('cd-m',m);set('cd-s',s);}
  tick(); setInterval(tick,1000);
}

// ════════════════════════════════════════
// FEEDBACK
// ════════════════════════════════════════
let fbRating=0;
function openFeedback(){ openModal('feedback-overlay'); }
function setRating(r){ fbRating=r; document.querySelectorAll('#fb-stars span').forEach((s,i)=>s.style.opacity=i<r?'1':'0.3'); }
function submitFeedback(){ const subject=v('fb-subject'),msg=v('fb-message'); if(!subject||!msg){toast('Please fill all fields','error');return;} closeModal('feedback-overlay'); toast('Thank you! ⭐','success'); document.getElementById('fb-subject').value=''; document.getElementById('fb-message').value=''; }

// ════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════
function v(id){ return document.getElementById(id)?.value?.trim()||''; }
function showForgotPass(){ toast('Password reset link sent to your email!','info'); }
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
function updateNavAvatar(){ const av=document.getElementById('nav-avatar'); if(av&&currentUser) av.textContent=currentUser.fname[0]; }
function toast(msg,type='info'){
  const c=document.getElementById('toast'),icons={success:'✅',error:'❌',info:'ℹ️'};
  const item=document.createElement('div'); item.className=`toast-item ${type}`;
  item.innerHTML=`<span>${icons[type]}</span><span>${msg}</span>`; c.appendChild(item);
  setTimeout(()=>{item.style.opacity='0';item.style.transform='translateX(20px)';item.style.transition='all .3s';setTimeout(()=>item.remove(),300);},3000);
}

document.querySelectorAll('.overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.overlay.open').forEach(o=>o.classList.remove('open'));});
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
seedFirestoreIfEmpty();
populateCatFilter();

