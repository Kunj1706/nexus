/* ═══════════════════════════════════════
   NEXUS – College Event App  |  Firebase Edition
   app.js  (Updated — v2.0)
═══════════════════════════════════════

   🔴 SETUP (one-time, 5 minutes):
   1. Go to https://console.firebase.google.com
   2. Click "Add Project" → name it "nexus-events" → Create
   3. Click the </> Web icon → Register app → Copy the firebaseConfig object
   4. Paste it below replacing the placeholder values
   5. Authentication → Sign-in method → Enable "Email/Password"
   6. Firestore Database → Create database → "Start in test mode" → Done

   🔴 ADMIN SETUP:
   - Default admin: username = "nexusadmin", password = "Admin@2025"
   - Change these in ADMIN_CONFIG below
   - You can add more admins from Admin Panel → Add Admin

   🔴 EMAILJS SETUP:
   - Sign up at emailjs.com (free — 200 emails/month)
   - Create a Gmail service → copy Service ID
   - Create 2 templates (welcome & booking) → copy Template IDs
   - Paste all below in EMAILJS_CONFIG
*/

// ════════════════════════════════════════
// 🔴 PASTE YOUR FIREBASE CONFIG HERE
// ════════════════════════════════════════
const firebaseConfig = {
  apiKey:            "AIzaSyDXea8Fq7QOD5LlVEkKY4jF4fYr6RbKCSI",
  authDomain:        "nexus-events-61635.firebaseapp.com",
  projectId:         "nexus-events-61635",
  storageBucket:     "nexus-events-61635.firebasestorage.app",
  messagingSenderId: "948665337108",
  appId:             "1:948665337108:web:cb8a706b6c1c8bb89eae01",
  measurementId:     "G-TR7PZCQ8GH"
};

// ════════════════════════════════════════
// 🔴 ADMIN CREDENTIALS
// (Change these before going live!)
// ════════════════════════════════════════
const ADMIN_CONFIG = {
  // Primary admin — stored in Firestore on first run
  // username: used at admin login screen
  // email:    Firebase auth email (fake, used internally)
  primaryAdmin: {
    username: 'nexusadmin',
    password: 'Admin@2025',
    email:    'nexusadmin@nexus-internal.edu',
    name:     'NEXUS Admin'
  }
};

// ════════════════════════════════════════
// 📧 EMAILJS CONFIGURATION
// ════════════════════════════════════════
const EMAILJS_CONFIG = {
  publicKey: '9jqqJW43ulpMvR3qx',        // 🔴 Your EmailJS Public Key
  serviceId: 'service_8om8jlh',           // 🔴 Your EmailJS Service ID
  templates: {
    welcome: 'template_ktiobuj',          // 🔴 Welcome email template ID
    booking: 'template_lth938h'           // 🔴 Booking confirmation template ID
  }
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

// ════════════════════════════════════════
// 💳 RAZORPAY
// ════════════════════════════════════════
const RAZORPAY_KEY_ID = 'rzp_test_SHfnFTcmTmC8sG'; // 🔴 Replace with your key

// ════════════════════════════════════════
// FIREBASE INIT
// ════════════════════════════════════════
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

const COL = {
  events:  db.collection('events'),
  users:   db.collection('users'),
  tickets: db.collection('tickets'),
  notifs:  db.collection('notifications'),
  admins:  db.collection('admins'),
};

// ════════════════════════════════════════
// SEED DATA
// ════════════════════════════════════════
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
    if (!snap.empty) {
      // Events already exist — ensure primary admin doc exists
      await ensurePrimaryAdmin();
      return;
    }
    const batch = db.batch();
    EVENTS_SEED.forEach(e => batch.set(COL.events.doc(e.id), e));
    batch.set(COL.notifs.doc('n-welcome'), {
      id:'n-welcome', title:'Welcome to NEXUS!',
      msg:'Explore events and book your passes.',
      icon:'🎉', type:'ni-cyan', time:'Just now', global:true, read:false
    });
    await batch.commit();
    await ensurePrimaryAdmin();
    console.log('Firestore seeded ✓');
  } catch(e) { console.warn('Seed skipped (check config):', e.message); }
}

// Create the primary admin Firebase auth account + Firestore doc on first run
async function ensurePrimaryAdmin() {
  try {
    const adminDoc = await COL.admins.doc('primary').get();
    if (adminDoc.exists) return; // already exists

    // Create Firebase auth user for admin
    const cred = await auth.createUserWithEmailAndPassword(
      ADMIN_CONFIG.primaryAdmin.email,
      ADMIN_CONFIG.primaryAdmin.password
    );

    // Save admin info to Firestore
    await COL.admins.doc('primary').set({
      uid:      cred.user.uid,
      username: ADMIN_CONFIG.primaryAdmin.username,
      email:    ADMIN_CONFIG.primaryAdmin.email,
      name:     ADMIN_CONFIG.primaryAdmin.name,
      role:     'admin',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Also save to users collection so admin can be queried
    await COL.users.doc(cred.user.uid).set({
      fname:  'NEXUS',
      lname:  'Admin',
      email:  ADMIN_CONFIG.primaryAdmin.email,
      username: ADMIN_CONFIG.primaryAdmin.username,
      role:   'admin',
      dept:   'Administration',
      cid:    'ADMIN-001',
      mobile: '',
      year:   '—',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Sign out admin after creation so student auth state is clear
    await auth.signOut();
    console.log('Primary admin created ✓');
  } catch(e) {
    if (e.code === 'auth/email-already-in-use') {
      // Admin already registered in auth, just make sure Firestore doc exists
      console.log('Admin auth already exists');
    } else {
      console.warn('Admin setup issue:', e.message);
    }
  }
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

      // Hide all auth screens, show app
      document.getElementById('screen-auth').classList.remove('active');
      document.getElementById('screen-admin-auth').classList.remove('active');
      document.getElementById('screen-app').classList.add('active');

      // Show/hide admin nav button
      const adminBtn = document.getElementById('nl-admin');
      if (adminBtn) adminBtn.style.display = currentUser.role === 'admin' ? '' : 'none';

      updateNavAvatar();
      updateNavUserInfo();

      // Admin goes to admin page, students go home
      if (currentUser.role === 'admin') {
        showPage('admin');
        // Update admin sidebar user info
        const sidebarUser = document.getElementById('admin-sidebar-user');
        if (sidebarUser) sidebarUser.textContent = `@${currentUser.username || 'admin'}`;
      } else {
        showPage('home');
      }
      renderAll();
    }
  } else {
    currentAuthUser = null;
    currentUser = null;
    document.getElementById('screen-app').classList.remove('active');
    document.getElementById('screen-admin-auth').classList.remove('active');
    document.getElementById('screen-auth').classList.add('active');
  }
});

// ════════════════════════════════════════
// AUTH SCREEN HELPERS
// ════════════════════════════════════════
function authTab(tab) {
  document.getElementById('auth-login').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('auth-register').style.display = tab === 'register' ? 'block' : 'none';
  const lb = document.getElementById('auth-tab-login');
  const rb = document.getElementById('auth-tab-register');
  lb.className = 'btn btn-sm ' + (tab === 'login'    ? 'btn-primary' : 'btn-ghost');
  rb.className = 'btn btn-sm ' + (tab === 'register' ? 'btn-primary' : 'btn-ghost');
  [lb, rb].forEach(b => { b.style.flex='1'; b.style.justifyContent='center'; });
}

function showAdminLogin() {
  document.getElementById('screen-auth').classList.remove('active');
  document.getElementById('screen-admin-auth').classList.add('active');
}

function hideAdminLogin() {
  document.getElementById('screen-admin-auth').classList.remove('active');
  document.getElementById('screen-auth').classList.add('active');
}

// Auto-fill username and password from name + roll number
function autoFillUsername() {
  const fname = document.getElementById('reg-fname')?.value.trim().toLowerCase().replace(/\s+/g, '');
  const roll  = document.getElementById('reg-roll')?.value.trim();
  const usernameEl = document.getElementById('reg-username');
  const passEl     = document.getElementById('reg-pass');

  if (fname && roll) {
    usernameEl.value = fname + roll;
    passEl.value     = roll;
  } else if (fname) {
    usernameEl.value = fname;
    passEl.value = '';
  } else {
    usernameEl.value = '';
    passEl.value = '';
  }
}

// ════════════════════════════════════════
// STUDENT LOGIN
// ════════════════════════════════════════
async function doLogin() {
  const usernameInput = document.getElementById('login-id').value.trim();
  const pass          = document.getElementById('login-pass').value;
  const err           = document.getElementById('login-err');

  if (!usernameInput || !pass) {
    err.style.display = 'block';
    err.textContent = 'Please fill in all fields';
    return;
  }

  // Validate: username must be name + 6-digit number
  const usernamePattern = /^[a-zA-Z]+\d{6}$/;
  if (!usernamePattern.test(usernameInput)) {
    err.style.display = 'block';
    err.textContent = 'Username must be your first name followed by 6-digit roll number (e.g. arjun123456)';
    return;
  }

  // Validate: password must be exactly 6 digits
  const passPattern = /^\d{6}$/;
  if (!passPattern.test(pass)) {
    err.style.display = 'block';
    err.textContent = 'Password must be your 6-digit roll number';
    return;
  }

  try {
    err.style.display = 'none';
    // Look up email by username
    const snap = await COL.users.where('username', '==', usernameInput).limit(1).get();
    if (snap.empty) {
      err.style.display = 'block';
      err.textContent = 'No account found with this username';
      return;
    }
    const userData = snap.docs[0].data();
    await auth.signInWithEmailAndPassword(userData.email, pass);
    toast('Welcome back! 👋', 'success');
  } catch(e) {
    err.style.display = 'block';
    err.textContent = e.code === 'auth/wrong-password'  ? 'Incorrect password (use your 6-digit roll number).' :
                      e.code === 'auth/user-not-found'  ? 'No account found.' :
                      e.code === 'auth/too-many-requests'? 'Too many attempts. Try again later.' : e.message;
  }
}

// ════════════════════════════════════════
// ADMIN LOGIN (separate screen)
// ════════════════════════════════════════
async function doAdminLogin() {
  const username = document.getElementById('admin-login-id').value.trim();
  const pass     = document.getElementById('admin-login-pass').value;
  const err      = document.getElementById('admin-login-err');

  if (!username || !pass) {
    err.style.display = 'block';
    err.textContent = 'Please fill in all fields';
    return;
  }

  try {
    err.style.display = 'none';

    // Look up admin by username in admins collection
    const adminSnap = await COL.admins.where('username', '==', username).limit(1).get();
    if (adminSnap.empty) {
      err.style.display = 'block';
      err.textContent = 'Invalid admin credentials';
      return;
    }

    const adminData = adminSnap.docs[0].data();
    await auth.signInWithEmailAndPassword(adminData.email, pass);
    toast('Welcome, Admin! 🛡️', 'success');
  } catch(e) {
    err.style.display = 'block';
    err.textContent = e.code === 'auth/wrong-password'  ? 'Incorrect password.' :
                      e.code === 'auth/user-not-found'  ? 'Admin not found.' :
                      e.code === 'auth/too-many-requests'? 'Too many attempts. Try again later.' : 'Invalid credentials.';
  }
}

// ════════════════════════════════════════
// STUDENT REGISTER
// ════════════════════════════════════════
async function doRegister() {
  const fname  = v('reg-fname');
  const lname  = v('reg-lname');
  const roll   = v('reg-roll');
  const cid    = v('reg-cid');
  const mobile = v('reg-mobile');
  const email  = v('reg-email');
  const dept   = v('reg-dept');
  const year   = v('reg-year');
  const err    = document.getElementById('reg-err');

  if (!fname || !lname || !roll || !cid || !mobile || !email || !dept || !year) {
    err.style.display = 'block';
    err.textContent = 'Please fill all fields';
    return;
  }

  // Validate roll number — must be exactly 6 digits
  if (!/^\d{6}$/.test(roll)) {
    err.style.display = 'block';
    err.textContent = 'Roll number must be exactly 6 digits (e.g. 123456)';
    return;
  }

  // Auto-build username and password from the rules
  const username = fname.toLowerCase().replace(/\s+/g, '') + roll;
  const password = roll; // password = roll number

  // Check if username already taken
  const uSnap = await COL.users.where('username', '==', username).limit(1).get();
  if (!uSnap.empty) {
    err.style.display = 'block';
    err.textContent = 'This username (roll number) is already registered';
    return;
  }

  // Check if College ID already registered
  const cidSnap = await COL.users.where('cid', '==', cid).limit(1).get();
  if (!cidSnap.empty) {
    err.style.display = 'block';
    err.textContent = 'College ID already registered';
    return;
  }

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await COL.users.doc(cred.user.uid).set({
      fname, lname, username, roll,
      cid, mobile, email, dept, year,
      role: 'student',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await COL.notifs.add({
      userId: cred.user.uid,
      title: `Welcome ${fname}!`,
      msg: 'Your NEXUS account is ready. Explore events! 🎉',
      icon: '🎉', type: 'ni-cyan', time: 'Just now', read: false, global: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Send welcome email
    sendWelcomeEmail(fname, email, username, dept);

    err.style.display = 'none';
    toast(`Account created! 🎉 Your username: ${username}`, 'success');
  } catch(e) {
    err.style.display = 'block';
    err.textContent = e.code === 'auth/email-already-in-use' ? 'Email already registered.' : e.message;
  }
}

// ════════════════════════════════════════
// LOGOUT
// ════════════════════════════════════════
async function doLogout() {
  await auth.signOut();
  currentUser = null; currentAuthUser = null;
  cachedEvents = []; cachedTickets = []; cachedUsers = []; cachedNotifs = [];
  document.getElementById('admin-login-id').value = '';
  document.getElementById('admin-login-pass').value = '';
  toast('Logged out successfully', 'info');
}

// ════════════════════════════════════════
// CREATE ADDITIONAL ADMIN (from admin panel)
// ════════════════════════════════════════
async function createAdminAccount() {
  const name     = v('new-admin-name');
  const username = v('new-admin-username');
  const email    = v('new-admin-email');
  const pass     = v('new-admin-pass');
  const err      = document.getElementById('new-admin-err');

  if (!name || !username || !email || !pass) {
    err.style.display = 'block'; err.textContent = 'Fill all fields'; return;
  }
  if (pass.length < 6) {
    err.style.display = 'block'; err.textContent = 'Password must be at least 6 characters'; return;
  }

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await COL.admins.add({
      uid: cred.user.uid, username, email, name, role: 'admin',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await COL.users.doc(cred.user.uid).set({
      fname: name, lname: '', username, email, role: 'admin',
      dept: 'Administration', cid: 'ADMIN-' + Date.now(), mobile: '', year: '—',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    // Sign back in as the current admin
    await auth.signInWithEmailAndPassword(
      currentUser.email,
      prompt('Re-enter your admin password to continue:') || ''
    );
    closeModal('add-admin-overlay');
    toast('New admin created: @' + username, 'success');
  } catch(e) {
    err.style.display = 'block';
    err.textContent = e.code === 'auth/email-already-in-use' ? 'Email already in use' : e.message;
  }
}

// ════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════
const pages = ['home','events','tickets','dashboard','admin','notifications','event-detail'];

function showPage(page) {
  pages.forEach(p => { const el = document.getElementById('page-' + p); if(el) el.style.display = p === page ? 'block' : 'none'; });
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const nl = document.getElementById('nl-' + page); if(nl) nl.classList.add('active');
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
  const bm = {home:0, events:1, tickets:2, dashboard:3, notifications:4};
  if(bm[page] !== undefined) document.querySelectorAll('.bnav-item')[bm[page]]?.classList.add('active');
  if(page === 'home')          renderHome();
  if(page === 'events')        renderEventsPage();
  if(page === 'tickets')       renderTicketsPage();
  if(page === 'dashboard')     renderDashboard();
  if(page === 'admin') {
    if(currentUser?.role !== 'admin') { toast('Admin access only!', 'error'); showPage('home'); return; }
    renderAdminOverview();
  }
  if(page === 'notifications') renderNotifications();
  window.scrollTo({top:0, behavior:'smooth'});
}

// ════════════════════════════════════════
// RENDER
// ════════════════════════════════════════
function renderAll() { renderHome(); populateCatFilter(); startCountdown(); }

function renderHome() {
  const sel = id => document.getElementById(id);
  if(sel('hs-events'))   sel('hs-events').textContent   = cachedEvents.length;
  if(sel('hs-students')) sel('hs-students').textContent = cachedUsers.filter(u => u.role !== 'admin').length + '+';
  if(sel('hs-tickets'))  sel('hs-tickets').textContent  = cachedTickets.length;
  const cg = sel('home-cat-grid');
  if(cg) cg.innerHTML = CATEGORIES.map(c => `<div class="cat-card" onclick="filterByCat('${c.name}')" style="border-top:2px solid ${c.color.replace(/\.[0-9]+\)/, ')')}"><span class="cat-icon">${c.icon}</span><div class="cat-name">${c.name}</div><div class="cat-count">${cachedEvents.filter(e => e.category === c.name).length} events</div></div>`).join('');
  const hg = sel('home-events-grid');
  if(hg) hg.innerHTML = cachedEvents.filter(e => e.status !== 'completed').slice(0, 3).map(e => eventCard(e)).join('');
  renderLeaderboard();
  renderPopularBars();
}

function eventCard(e) {
  const pct   = Math.round(e.booked / e.seats * 100);
  const badge = e.status === 'live' ? '<span class="e-badge badge-live">● LIVE</span>' :
                e.price === 0       ? '<span class="e-badge badge-free">FREE</span>' :
                e.status === 'completed' ? '<span class="e-badge badge-completed">COMPLETED</span>' :
                '<span class="e-badge badge-upcoming">UPCOMING</span>';
  return `<div class="event-card" onclick="viewEvent('${e.id}')">
    <div class="event-thumb ${e.bg}"><div class="event-thumb-glow">${e.icon}</div><span style="position:relative;z-index:1">${e.icon}</span>${badge}<div class="e-seats">🪑 ${e.seats - e.booked} left</div></div>
    <div class="event-body">
      <div class="e-cat">${e.category}</div><div class="e-title">${e.name}</div>
      <div class="e-meta"><div class="e-meta-row">📅 ${e.date} · ${e.time}</div><div class="e-meta-row">📍 ${e.venue}</div>${e.prize ? `<div class="e-meta-row">🏆 ${e.prize}</div>` : ''}</div>
      <div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text2);margin-bottom:4px"><span>Booked</span><span>${pct}%</span></div><div style="background:var(--bg2);border-radius:4px;height:4px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${pct > 80 ? 'var(--accent)' : pct > 50 ? 'var(--accent2)' : 'var(--green)'};border-radius:4px"></div></div></div>
      <div class="e-footer"><div class="e-price">${e.price === 0 ? 'FREE' : '₹' + e.price}<span>per ticket</span></div><button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openBooking('${e.id}')">${e.status === 'completed' ? 'View Details' : 'Book Now →'}</button></div>
    </div></div>`;
}

function renderEventsPage() { filterEvents(); }

function populateCatFilter() {
  const sel = document.getElementById('event-cat-filter');
  if(!sel) return;
  sel.innerHTML = '<option value="">All Categories</option>' + CATEGORIES.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
}

function filterEvents() {
  const search = (document.getElementById('event-search')?.value || '').toLowerCase();
  const cat    = document.getElementById('event-cat-filter')?.value || '';
  let ev = [...cachedEvents];
  if(search) ev = ev.filter(e => e.name.toLowerCase().includes(search) || e.category.toLowerCase().includes(search) || e.venue.toLowerCase().includes(search));
  if(cat)    ev = ev.filter(e => e.category === cat);
  if(currentEventFilter === 'upcoming')  ev = ev.filter(e => e.status === 'upcoming');
  if(currentEventFilter === 'live')      ev = ev.filter(e => e.status === 'live');
  if(currentEventFilter === 'free')      ev = ev.filter(e => e.price === 0);
  if(currentEventFilter === 'completed') ev = ev.filter(e => e.status === 'completed');
  const grid = document.getElementById('all-events-grid');
  if(!grid) return;
  grid.innerHTML = ev.length ? ev.map(e => eventCard(e)).join('') : '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><div class="empty-msg">No events found.</div></div>';
}

function setEventFilter(btn, filter) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active'); currentEventFilter = filter; filterEvents();
}
function filterByCat(cat) { showPage('events'); setTimeout(() => { const s = document.getElementById('event-cat-filter'); if(s) { s.value = cat; filterEvents(); } }, 50); }

function renderTicketsPage() {
  const tg = document.getElementById('tickets-grid');
  if(!tg) return;
  tg.innerHTML = `
    <div class="ticket-card t-regular">
      <div class="t-type" style="color:var(--accent)">🎫 Regular Pass</div>
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
  const u = currentUser;
  document.getElementById('dash-av').textContent  = u.fname[0];
  document.getElementById('dash-name').textContent = u.fname + ' ' + u.lname;
  document.getElementById('dash-id').textContent   = 'Roll: ' + (u.roll || u.cid || '—');
  const usernameEl = document.getElementById('dash-username');
  if(usernameEl) usernameEl.textContent = '@' + (u.username || '—');
  const mt = cachedTickets.filter(t => t.userId === u.id);
  const ts = mt.reduce((a, t) => a + t.price, 0);
  document.getElementById('dash-events-count').textContent = mt.length;
  document.getElementById('dash-certs-count').textContent  = mt.filter(t => t.status === 'used').length;
  document.getElementById('dash-spend').textContent        = '₹' + ts;
  const badges = [];
  if(mt.length >= 1) badges.push('<span class="p-badge pb-gold">🏆 Event Member</span>');
  if(mt.length >= 5) badges.push('<span class="p-badge pb-purple">⚡ Active</span>');
  badges.push(`<span class="p-badge pb-cyan">${u.year || 'Student'}</span>`);
  document.getElementById('dash-badges').innerHTML = badges.join('');
  dashTab('my-tickets');
}

function dashTab(tab) {
  document.querySelectorAll('.s-menu-item').forEach(m => m.classList.remove('active'));
  event?.target?.classList?.add('active');
  const area = document.getElementById('dash-content-area');
  const u = currentUser, mt = cachedTickets.filter(t => t.userId === u.id);

  if(tab === 'my-tickets') {
    area.innerHTML = `<div class="dash-card"><div class="dc-title">🎫 My Tickets <span class="badge badge-accent">${mt.length}</span></div>${mt.length === 0 ? `<div class="empty-state"><div class="empty-icon">🎟️</div><div class="empty-msg">No tickets yet!</div><button class="btn btn-primary" style="margin-top:16px" onclick="showPage('events')">Explore Events →</button></div>` : mt.map(t => `<div class="my-ticket-item"><div class="ticket-qr" onclick="showQR('${t.id}')">▦</div><div class="ticket-info"><div class="ti-name">${t.eventName}${t.isExtraPass ? ` <span style="font-size:.62rem;background:rgba(232,98,26,.12);color:var(--accent);border:1px solid rgba(232,98,26,.25);border-radius:4px;padding:1px 6px;vertical-align:middle">+${t.surchargeApplied||35}% GUEST</span>` : ''}</div><div class="ti-date">${t.date} · ${t.isExtraPass ? 'Extra Pass' : t.ticketType} · ₹${t.price}${t.isExtraPass ? ` <span style="color:var(--text3);font-size:.68rem">(incl. surcharge)</span>` : ''}</div></div><div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end"><span class="ts-badge ${t.status === 'upcoming' ? 'ts-upcoming' : t.status === 'used' ? 'ts-used' : 'ts-valid'}">${t.status.toUpperCase()}</span><button class="btn btn-ghost btn-sm" onclick="showQR('${t.id}')">View QR</button>${t.status !== 'used' ? `<button class="btn btn-sm" style="background:rgba(232,98,26,.08);color:var(--accent);border:1px solid rgba(232,98,26,.2)" onclick="cancelTicket('${t.id}')">Cancel</button>` : ''}</div></div>`).join('')}</div>`;
  } else if(tab === 'achievements') {
    area.innerHTML = `<div class="dash-card"><div class="dc-title">🏆 Achievements</div>${mt.length === 0 ? `<div class="empty-state"><div class="empty-icon">🏅</div><div class="empty-msg">Attend events to unlock achievements!</div></div>` : ''}${mt.length >= 1 ? `<div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)"><span style="font-size:2rem">🥇</span><div><div style="font-weight:600">First Event Booked!</div><div style="font-size:.78rem;color:var(--text2)">${mt[0]?.eventName}</div></div></div>` : ''}${mt.length >= 3 ? `<div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)"><span style="font-size:2rem">🔥</span><div><div style="font-weight:600">Event Enthusiast</div><div style="font-size:.78rem;color:var(--text2)">Booked 3+ events</div></div></div>` : ''}${mt.length >= 5 ? `<div style="display:flex;align-items:center;gap:14px;padding:14px 0"><span style="font-size:2rem">⭐</span><div><div style="font-weight:600">Campus Star</div></div></div>` : ''}</div>`;
  } else if(tab === 'certificates') {
    const done = mt.filter(t => t.status === 'used');
    area.innerHTML = `<div class="dash-card"><div class="dc-title">📜 Certificates</div>${done.length === 0 ? `<div class="empty-state"><div class="empty-icon">📜</div><div class="empty-msg">Complete events to earn certificates!</div></div>` : done.map(t => `<div class="my-ticket-item"><div style="font-size:2rem">🏅</div><div class="ticket-info"><div class="ti-name">${t.eventName}</div><div class="ti-date">Participation Certificate · ${t.date}</div></div><button class="btn btn-success btn-sm" onclick="downloadCert('${t.id}')">Download</button></div>`).join('')}</div>`;
  } else if(tab === 'edit-profile') {
    area.innerHTML = `<div class="dash-card"><div class="dc-title">✏️ Edit Profile</div>
      <div style="background:rgba(0,229,255,.06);border:1px solid rgba(0,229,255,.15);border-radius:8px;padding:12px;margin-bottom:16px;font-size:.8rem;color:var(--text2)">
        Your username <strong style="color:var(--accent3);font-family:'JetBrains Mono',monospace">@${u.username || '—'}</strong> and roll number cannot be changed. Contact admin for changes.
      </div>
      <div class="form-row"><div class="form-group"><label class="form-label">First Name</label><input class="form-input" id="ep-fname" value="${u.fname}" type="text"></div><div class="form-group"><label class="form-label">Last Name</label><input class="form-input" id="ep-lname" value="${u.lname}" type="text"></div></div>
      <div class="form-group"><label class="form-label">Mobile</label><input class="form-input" id="ep-mobile" value="${u.mobile}" type="tel"></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" value="${u.email}" type="email" disabled style="opacity:.5"></div>
      <div class="form-group"><label class="form-label">Department</label><input class="form-input" id="ep-dept" value="${u.dept}" type="text"></div>
      <button class="btn btn-primary" onclick="saveProfile()">Save Changes ✓</button></div>`;
  } else if(tab === 'payment-history') {
    area.innerHTML = `<div class="dash-card"><div class="dc-title">💰 Payment History</div>${mt.length === 0 ? `<div class="empty-state"><div class="empty-icon">💳</div><div class="empty-msg">No transactions yet.</div></div>` : mt.map(t => `<div class="my-ticket-item"><div style="width:42px;height:42px;border-radius:8px;background:${t.price === 0 ? 'rgba(34,197,94,.15)' : 'rgba(124,58,237,.15)'};display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">${t.price === 0 ? '🆓' : '💳'}</div><div class="ticket-info"><div class="ti-name">${t.eventName}</div><div class="ti-date">${t.bookedOn} · ${t.ticketType} · via ${t.payMethod || 'N/A'}</div>${t.razorpayId ? `<div style="font-size:.7rem;color:var(--text2);font-family:monospace">ID: ${t.razorpayId}</div>` : ''}</div><div style="font-family:'Playfair Display',serif;font-size:1.2rem;color:${t.price === 0 ? 'var(--green)' : 'var(--gold)'}">${t.price === 0 ? 'FREE' : '₹' + t.price}</div></div>`).join('')}</div>`;
  }
}

async function saveProfile() {
  const fname  = document.getElementById('ep-fname')?.value.trim();
  const lname  = document.getElementById('ep-lname')?.value.trim();
  const mobile = document.getElementById('ep-mobile')?.value.trim();
  const dept   = document.getElementById('ep-dept')?.value.trim();
  if(!fname || !lname) { toast('Name cannot be empty', 'error'); return; }
  try {
    await COL.users.doc(currentUser.id).update({fname, lname, mobile, dept});
    currentUser = {...currentUser, fname, lname, mobile, dept};
    const i = cachedUsers.findIndex(u => u.id === currentUser.id);
    if(i !== -1) cachedUsers[i] = {...cachedUsers[i], fname, lname, mobile, dept};
    renderDashboard();
    toast('Profile updated! ✓', 'success');
  } catch(e) { toast('Update failed: ' + e.message, 'error'); }
}

function renderLeaderboard() {
  const students = cachedUsers.filter(u => u.role !== 'admin');
  const ranked = students.map(u => ({
    name: u.fname + ' ' + u.lname,
    dept: u.dept || 'Student',
    count: cachedTickets.filter(t => t.userId === u.id).length
  })).sort((a, b) => b.count - a.count).slice(0, 5);
  const colors = ['#ffd700','#b0b0c0','#cd7f32','#E8621A','#C9911A'];
  const cls = ['gold','silver','bronze','',''];
  const emojis = ['👑','🥈','🥉','4️⃣','5️⃣'];
  const el = document.getElementById('leaderboard-list');
  if(!el) return;
  el.innerHTML = ranked.map((r, i) => `<div class="lb-row"><div class="lb-rank ${cls[i]}">${emojis[i]}</div><div class="lb-av" style="background:linear-gradient(135deg,${colors[i]}55,${colors[i]}22)">${r.name[0]}</div><div class="lb-info"><div class="lb-name">${r.name}</div><div class="lb-pts">${r.dept}</div></div><div class="lb-score">${r.count} <span style="font-size:.7rem">events</span></div></div>`).join('') || '<div class="empty-state"><div class="empty-msg">Be the first to book!</div></div>';
}

function renderPopularBars() {
  const sorted = [...cachedEvents].sort((a, b) => (b.booked / b.seats) - (a.booked / a.seats)).slice(0, 5);
  const colors = ['linear-gradient(90deg,var(--accent),#ff6b6b)','linear-gradient(90deg,var(--accent2),var(--accent3))','linear-gradient(90deg,var(--accent3),var(--gold))','linear-gradient(90deg,var(--gold),#f59e0b)','linear-gradient(90deg,var(--green),#16a34a)'];
  const el = document.getElementById('popular-events-bars');
  if(!el) return;
  el.innerHTML = sorted.map((e, i) => {
    const p = Math.min(100, Math.round(e.booked / e.seats * 100));
    return `<div class="bar-row"><span class="bar-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.name.split(' ').slice(0, 2).join(' ')}</span><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${colors[i]}"></div></div><span class="bar-val">${p}%</span></div>`;
  }).join('');
}

// ════════════════════════════════════════
// BOOKING
// ════════════════════════════════════════
// ─────────────────────────────────────────────────────────────
// BOOKING RULES
//  • 1 base ticket per login per event  (at normal price)
//  • Extra passes for friends/family    → +35% surcharge per pass
//  • Max extra passes per booking       → 5
// ─────────────────────────────────────────────────────────────
const EXTRA_PASS_SURCHARGE = 0.35; // 35% extra on base price

function calcExtraPrice(basePrice, qty) {
  if (basePrice === 0) return 0;
  return Math.round(basePrice * (1 + EXTRA_PASS_SURCHARGE) * qty);
}

function updateExtraTotal(eventId) {
  const e   = cachedEvents.find(ev => ev.id === eventId);
  const qty = parseInt(document.getElementById('extra-qty')?.value || 1);
  const total = calcExtraPrice(e.price, qty);
  const el  = document.getElementById('extra-total-display');
  if (el) el.textContent = e.price === 0 ? 'FREE' : '₹' + total;
  const btn = document.getElementById('extra-pay-btn');
  if (btn) btn.textContent = e.price === 0 ? '🎟️ Get Extra Passes →' : `💳 Pay ₹${total} via Razorpay →`;
}

function openBooking(eventId) {
  const e = cachedEvents.find(ev => ev.id === eventId);
  if(!e) { toast('Event not found', 'error'); return; }
  if(e.status === 'completed') { viewEvent(eventId); return; }

  // Check if user already has a base ticket for this event
  const myTickets = cachedTickets.filter(t => t.eventId === eventId && t.userId === currentUser.id);
  const baseTicket = myTickets.find(t => !t.isExtraPass);
  const extraCount = myTickets.filter(t => t.isExtraPass).length;

  const content = document.getElementById('booking-modal-content');

  // ── Case 1: No ticket yet → show normal booking ───────────
  if (!baseTicket) {
    content.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
        <div style="font-size:2.5rem">${e.icon}</div>
        <div>
          <div style="font-family:'Playfair Display',serif;font-size:1.5rem">${e.name}</div>
          <div style="color:var(--text2);font-size:.82rem">${e.date} · ${e.venue}</div>
        </div>
      </div>

      <div style="background:var(--surface2);border-radius:10px;padding:16px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--text2);font-size:.85rem">Date & Time</span><span style="font-size:.85rem">${e.date} at ${e.time}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--text2);font-size:.85rem">Venue</span><span style="font-size:.85rem;text-align:right;max-width:180px">${e.venue}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--text2);font-size:.85rem">Seats Available</span><span style="font-size:.85rem">${e.seats - e.booked}</span></div>
        <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid var(--border)"><span style="font-weight:700">Base Price</span><span style="font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--gold)">${e.price === 0 ? 'FREE' : '₹' + e.price}</span></div>
      </div>

      <div class="form-group">
        <label class="form-label">Ticket Type</label>
        <select class="form-input" id="bk-type">
          <option value="regular">Regular (₹${e.price})</option>
          ${e.price > 0 ? `<option value="vip">VIP (₹${e.price * 3})</option>` : ''}
          <option value="group">Group of 4 (₹${e.price > 0 ? Math.round(e.price * 4 * 0.8) : 0})</option>
        </select>
      </div>

      <div style="background:rgba(232,98,26,.06);border:1px solid rgba(232,98,26,.18);border-radius:8px;padding:11px 13px;margin-bottom:16px;font-size:.78rem;color:var(--text2)">
        🎫 <strong style="color:var(--accent)">1 pass per account</strong> at base price.<br>
        Need passes for friends? You can buy extra after booking — at a small surcharge.
      </div>

      ${e.price > 0 ? `<div style="background:var(--surface2);border-radius:12px;padding:14px;margin-bottom:18px"><div style="font-size:.75rem;color:var(--text2);margin-bottom:10px;font-weight:600;letter-spacing:.04em">ACCEPTED PAYMENT METHODS</div><div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px"><span style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:.75rem">📱 UPI / GPay</span><span style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:.75rem">💳 Debit / Credit Card</span><span style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:.75rem">🏦 Net Banking</span><span style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:.75rem">👛 Wallets</span></div><div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:var(--text2)">🔒 Powered by <strong style="color:var(--text)">Razorpay</strong> — 100% secure</div></div>` : ''}

      <div style="background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.15);border-radius:8px;padding:12px;margin-bottom:18px;font-size:.8rem;color:var(--text2)">
        ✅ Digital QR pass generated instantly.<br>📧 Confirmation sent to ${currentUser?.email || 'your email'}
      </div>

      <button class="btn btn-primary btn-full btn-lg" onclick="confirmBooking('${e.id}', false)">
        ${e.price === 0 ? '🎟️ Register Free →' : '💳 Pay ₹' + e.price + ' via Razorpay →'}
      </button>`;

    openModal('booking-overlay');
    return;
  }

  // ── Case 2: Already has base ticket → show Extra Pass UI ──
  const maxExtra   = 5;
  const remaining  = maxExtra - extraCount;

  if (remaining <= 0) {
    toast('You have reached the maximum limit of 5 extra passes for this event.', 'error');
    showQR(baseTicket.id);
    return;
  }

  const surchargeLabel = Math.round(EXTRA_PASS_SURCHARGE * 100);
  const pricePerExtra  = e.price === 0 ? 0 : Math.round(e.price * (1 + EXTRA_PASS_SURCHARGE));

  content.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <div style="font-size:2.5rem">${e.icon}</div>
      <div>
        <div style="font-family:'Playfair Display',serif;font-size:1.4rem">${e.name}</div>
        <div style="color:var(--text2);font-size:.82rem">${e.date} · ${e.venue}</div>
      </div>
    </div>

    <!-- Already booked notice -->
    <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);border-radius:10px;padding:13px 15px;margin-bottom:18px;display:flex;align-items:center;gap:10px">
      <div style="font-size:1.5rem">✅</div>
      <div>
        <div style="font-weight:700;font-size:.88rem;color:var(--dark)">You're already booked!</div>
        <div style="font-size:.76rem;color:var(--text2);margin-top:2px">Your base pass is confirmed. Buy extra passes for friends &amp; family below.</div>
      </div>
      <button onclick="showQR('${baseTicket.id}');closeModal('booking-overlay')" style="margin-left:auto;padding:6px 12px;border-radius:7px;border:1px solid var(--border);background:var(--bg);font-size:.72rem;cursor:pointer;white-space:nowrap;font-family:'Outfit',sans-serif">View My QR →</button>
    </div>

    <!-- Surcharge Info Banner -->
    <div style="background:rgba(232,98,26,.07);border:1px solid rgba(232,98,26,.2);border-radius:10px;padding:14px;margin-bottom:18px">
      <div style="font-size:.72rem;font-weight:700;letter-spacing:.06em;color:var(--accent);text-transform:uppercase;margin-bottom:8px">👥 Extra Pass Pricing</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--bg);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:.68rem;color:var(--text2);margin-bottom:3px">YOUR PASS (Base Price)</div>
          <div style="font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:var(--dark)">${e.price === 0 ? 'FREE' : '₹' + e.price}</div>
          <div style="font-size:.65rem;color:var(--green);margin-top:2px">✓ Already paid</div>
        </div>
        <div style="background:rgba(232,98,26,.06);border:1px solid rgba(232,98,26,.15);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:.68rem;color:var(--text2);margin-bottom:3px">EXTRA PASS (+${surchargeLabel}% surcharge)</div>
          <div style="font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:var(--accent)">${e.price === 0 ? 'FREE' : '₹' + pricePerExtra}</div>
          <div style="font-size:.65rem;color:var(--text2);margin-top:2px">per pass</div>
        </div>
      </div>
    </div>

    <!-- Qty Selector -->
    <div style="margin-bottom:18px">
      <label class="form-label">How many extra passes?</label>
      <div style="display:flex;align-items:center;gap:0;border:1.5px solid var(--border2);border-radius:9px;overflow:hidden;background:var(--bg)">
        <button onclick="
          const q=document.getElementById('extra-qty');
          if(parseInt(q.value)>1){q.value=parseInt(q.value)-1;updateExtraTotal('${e.id}');}
        " style="width:44px;height:44px;border:none;background:var(--surface2);font-size:1.2rem;cursor:pointer;font-family:'Outfit',sans-serif;color:var(--text)">−</button>
        <input type="number" id="extra-qty" value="1" min="1" max="${remaining}"
          style="flex:1;border:none;outline:none;text-align:center;font-size:1.1rem;font-weight:700;background:transparent;color:var(--dark);font-family:'Playfair Display',serif;height:44px"
          oninput="this.value=Math.min(${remaining},Math.max(1,parseInt(this.value)||1));updateExtraTotal('${e.id}')">
        <button onclick="
          const q=document.getElementById('extra-qty');
          if(parseInt(q.value)<${remaining}){q.value=parseInt(q.value)+1;updateExtraTotal('${e.id}');}
        " style="width:44px;height:44px;border:none;background:var(--surface2);font-size:1.2rem;cursor:pointer;font-family:'Outfit',sans-serif;color:var(--text)">+</button>
      </div>
      <div style="font-size:.72rem;color:var(--text2);margin-top:5px">You can add up to <strong>${remaining}</strong> more extra pass${remaining > 1 ? 'es' : ''} for this event. (${extraCount > 0 ? extraCount + ' already purchased' : 'none purchased yet'})</div>
    </div>

    <!-- Total -->
    <div style="display:flex;justify-content:space-between;align-items:center;background:var(--surface2);border-radius:10px;padding:14px 16px;margin-bottom:18px;border:1px solid var(--border)">
      <div>
        <div style="font-size:.72rem;color:var(--text2);margin-bottom:2px">TOTAL TO PAY</div>
        <div style="font-size:.75rem;color:var(--text2)">Includes ${surchargeLabel}% guest surcharge</div>
      </div>
      <div id="extra-total-display" style="font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:var(--accent)">
        ${e.price === 0 ? 'FREE' : '₹' + pricePerExtra}
      </div>
    </div>

    ${e.price > 0 ? `<div style="background:var(--surface2);border-radius:10px;padding:12px;margin-bottom:14px;display:flex;gap:7px;flex-wrap:wrap"><span style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:4px 9px;font-size:.72rem">📱 UPI</span><span style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:4px 9px;font-size:.72rem">💳 Card</span><span style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:4px 9px;font-size:.72rem">🏦 Net Banking</span><div style="flex:1"></div><span style="font-size:.7rem;color:var(--text2)">🔒 Razorpay</span></div>` : ''}

    <button id="extra-pay-btn" class="btn btn-primary btn-full btn-lg" onclick="confirmBooking('${e.id}', true)">
      ${e.price === 0 ? '🎟️ Get Extra Passes →' : '💳 Pay ₹' + pricePerExtra + ' via Razorpay →'}
    </button>`;

  openModal('booking-overlay');
  openModal('booking-overlay');
}

function confirmBooking(eventId, isExtraPass = false) {
  const e = cachedEvents.find(ev => ev.id === eventId);
  if(!e) return;

  if (!isExtraPass) {
    // ── Normal base ticket booking ──
    const typeEl     = document.getElementById('bk-type');
    const ticketType = typeEl ? typeEl.value : 'regular';
    let price = e.price;
    if(ticketType === 'vip')   price = e.price * 3;
    if(ticketType === 'group') price = e.price > 0 ? Math.round(e.price * 4 * 0.8) : 0;

    if(price === 0) { issueTicket(eventId, e, ticketType, 0, 'Free', null, false, 1); return; }
    if(typeof Razorpay === 'undefined') { toast('Payment gateway not loaded.', 'error'); return; }

    const rzp = new Razorpay({
      key: RAZORPAY_KEY_ID, amount: price * 100, currency: 'INR',
      name: 'NEXUS Events', description: `${e.name} — ${ticketType}`,
      prefill: { name: currentUser ? currentUser.fname + ' ' + currentUser.lname : '', email: currentUser?.email || '', contact: currentUser?.mobile || '' },
      notes: { eventId, userId: currentUser?.id || '', ticketType },
      theme: { color: '#E8621A' },
      handler: function(resp) { issueTicket(eventId, e, ticketType, price, 'Razorpay', resp.razorpay_payment_id, false, 1); },
      modal: { ondismiss: function() { toast('Payment cancelled.', 'info'); } }
    });
    rzp.on('payment.failed', function(r) { toast('Payment failed: ' + (r.error?.description || 'Unknown'), 'error'); });
    closeModal('booking-overlay');
    rzp.open();

  } else {
    // ── Extra pass booking ──
    const qty   = parseInt(document.getElementById('extra-qty')?.value || 1);
    const total = calcExtraPrice(e.price, qty);

    if(total === 0) { issueTicket(eventId, e, 'extra-pass', 0, 'Free', null, true, qty); return; }
    if(typeof Razorpay === 'undefined') { toast('Payment gateway not loaded.', 'error'); return; }

    const rzp = new Razorpay({
      key: RAZORPAY_KEY_ID, amount: total * 100, currency: 'INR',
      name: 'NEXUS Events', description: `${e.name} — ${qty} Extra Pass${qty > 1 ? 'es' : ''} (+${Math.round(EXTRA_PASS_SURCHARGE*100)}% surcharge)`,
      prefill: { name: currentUser ? currentUser.fname + ' ' + currentUser.lname : '', email: currentUser?.email || '', contact: currentUser?.mobile || '' },
      notes: { eventId, userId: currentUser?.id || '', ticketType: 'extra-pass', extraQty: qty },
      theme: { color: '#E8621A' },
      handler: function(resp) { issueTicket(eventId, e, 'extra-pass', total, 'Razorpay', resp.razorpay_payment_id, true, qty); },
      modal: { ondismiss: function() { toast('Payment cancelled.', 'info'); } }
    });
    rzp.on('payment.failed', function(r) { toast('Payment failed: ' + (r.error?.description || 'Unknown'), 'error'); });
    closeModal('booking-overlay');
    rzp.open();
  }
}

async function issueTicket(eventId, e, ticketType, price, payMethod, razorpayId, isExtraPass = false, qty = 1) {
  try {
    const batch = [];

    for (let i = 0; i < qty; i++) {
      const tid = 'T' + Date.now() + '_' + i;
      const ticket = {
        id: tid, eventId, userId: currentUser.id,
        eventName: e.name, date: e.date, venue: e.venue,
        ticketType: isExtraPass ? 'extra-pass' : ticketType,
        price: isExtraPass ? Math.round(price / qty) : price,
        status: 'upcoming',
        isExtraPass,
        extraPassNumber: isExtraPass ? i + 1 : null,
        surchargeApplied: isExtraPass ? Math.round(EXTRA_PASS_SURCHARGE * 100) : 0,
        payMethod, razorpayId: razorpayId || null,
        bookedOn: new Date().toLocaleDateString('en-IN'),
        eventIcon: e.icon,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      await COL.tickets.doc(tid).set(ticket);
      cachedTickets.push({...ticket, createdAt: new Date()});
      batch.push(ticket);
    }

    // Increment booked count by qty
    await COL.events.doc(eventId).update({ booked: firebase.firestore.FieldValue.increment(qty) });
    const ei = cachedEvents.findIndex(ev => ev.id === eventId);
    if(ei !== -1) cachedEvents[ei].booked = (cachedEvents[ei].booked || 0) + qty;

    if (isExtraPass) {
      await addNotif('Extra Passes Booked! 👥', `${qty} extra pass${qty>1?'es':''} for "${e.name}" booked. Share QR codes with your friends!`, '👥', 'ni-orange');
      toast(`🎉 ${qty} extra pass${qty>1?'es':''} booked successfully!`, 'success');
    } else {
      await addNotif('Booking Confirmed! 🎉', `Your ticket for "${e.name}" is ready. Show QR at entry.`, '✅', 'ni-green');
      sendBookingEmail(currentUser.fname, currentUser.email, e.name, e.date, e.time, e.venue, ticketType, price, batch[0].id);
      toast('🎉 Ticket booked! QR pass generated.', 'success');
    }

    closeModal('booking-overlay');
    setTimeout(() => showQR(batch[0].id), 600);
  } catch(err) { console.error(err); toast('Booking failed. Try again.', 'error'); }
}

// ════════════════════════════════════════
// QR PASS
// ════════════════════════════════════════
function showQR(ticketId) {
  const t = cachedTickets.find(tk => tk.id === ticketId);
  if(!t) return;
  document.getElementById('qr-modal-content').innerHTML = `
    <div style="margin-bottom:20px"><div style="font-family:'Playfair Display',serif;font-size:1.8rem;letter-spacing:.06em;margin-bottom:4px">${t.eventName}</div><div style="color:var(--text2);font-size:.85rem">${t.date} · ${t.venue}</div></div>
    <div style="background:#fff;border-radius:14px;padding:20px;display:inline-block;margin-bottom:20px;box-shadow:0 0 32px rgba(255,60,110,.2)">${generateQRSVG(`NEXUS-${t.id}-${t.userId}-${t.eventId}`)}</div>
    <div style="margin-bottom:16px"><div style="font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--accent3);letter-spacing:.1em;margin-bottom:6px">TICKET ID</div><div style="font-family:'JetBrains Mono',monospace;font-size:.85rem;color:var(--text2)">${t.id}</div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;text-align:left">
      <div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">TYPE</div><div style="font-weight:600;font-size:.85rem;text-transform:capitalize">${t.ticketType}</div></div>
      <div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">STATUS</div><div style="font-weight:600;font-size:.85rem;color:${t.status === 'upcoming' ? '#a78bfa' : 'var(--green)'}"> ${t.status.toUpperCase()}</div></div>
      <div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">PAID</div><div style="font-weight:600;font-size:.85rem;color:var(--gold)">${t.price === 0 ? 'FREE' : '₹' + t.price}</div></div>
      <div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">BOOKED ON</div><div style="font-weight:600;font-size:.85rem">${t.bookedOn}</div></div>
    </div>
    <div style="display:flex;gap:10px"><button class="btn btn-primary" style="flex:1;justify-content:center" onclick="downloadTicket('${t.id}')">📥 Download Pass</button><button class="btn btn-ghost" style="flex:1;justify-content:center" onclick="shareTicket('${t.id}')">📤 Share</button></div>`;
  openModal('qr-overlay');
}

function generateQRSVG(data) {
  const size = 180, cells = 21, cell = Math.floor(size / cells);
  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="white"/>`;
  let seed = 0;
  for(let i = 0; i < data.length; i++) seed = (seed * 31 + data.charCodeAt(i)) & 0x7fffffff;
  function rand() { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed / 0x7fffffff; }
  function corner(x, y) { svg += `<rect x="${x}" y="${y}" width="${cell*7}" height="${cell*7}" fill="black"/><rect x="${x+cell}" y="${y+cell}" width="${cell*5}" height="${cell*5}" fill="white"/><rect x="${x+cell*2}" y="${y+cell*2}" width="${cell*3}" height="${cell*3}" fill="black"/>`; }
  corner(0, 0); corner((cells - 7) * cell, 0); corner(0, (cells - 7) * cell);
  for(let r = 0; r < cells; r++) for(let c = 0; c < cells; c++) {
    const ic = (r < 8 && c < 8) || (r < 8 && c > cells - 9) || (r > cells - 9 && c < 8);
    if(!ic && rand() > 0.5) svg += `<rect x="${c*cell}" y="${r*cell}" width="${cell}" height="${cell}" fill="black"/>`;
  }
  return svg + '</svg>';
}

async function cancelTicket(ticketId) {
  if(!confirm('Cancel this ticket? Refund will take 3–5 business days.')) return;
  try {
    await COL.tickets.doc(ticketId).update({status: 'cancelled'});
    const i = cachedTickets.findIndex(t => t.id === ticketId);
    if(i !== -1) cachedTickets[i].status = 'cancelled';
    toast('Ticket cancelled. Refund in 3–5 days.', 'info');
    dashTab('my-tickets');
  } catch(e) { toast('Cancel failed: ' + e.message, 'error'); }
}
function downloadCert(ticketId) { downloadTicket(ticketId, true); }

// ════════════════════════════════════════
// 📥 REAL TICKET DOWNLOAD — Canvas-based
// ════════════════════════════════════════
function downloadTicket(ticketId, asCertificate = false) {
  const t = cachedTickets.find(tk => tk.id === ticketId);
  if (!t) { toast('Ticket not found', 'error'); return; }

  const u = cachedUsers.find(u => u.id === t.userId) || currentUser;

  // Canvas dimensions
  const W = 900, H = 380;
  const canvas = document.createElement('canvas');
  canvas.width  = W * 2; // 2x for retina sharpness
  canvas.height = H * 2;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2); // retina

  // ── Background gradient ──────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  if (asCertificate) {
    bg.addColorStop(0, '#1C1208');
    bg.addColorStop(1, '#3D2B12');
  } else {
    bg.addColorStop(0, '#1C1208');
    bg.addColorStop(1, '#2A1C0A');
  }
  ctx.fillStyle = bg;
  roundRect(ctx, 0, 0, W, H, 20);
  ctx.fill();

  // ── Accent stripe on left ────────────
  const stripe = ctx.createLinearGradient(0, 0, 0, H);
  stripe.addColorStop(0, asCertificate ? '#ffd700' : '#E8621A');
  stripe.addColorStop(1, asCertificate ? '#C9911A' : '#F07A35');
  ctx.fillStyle = stripe;
  roundRect(ctx, 0, 0, 8, H, [20, 0, 0, 20]);
  ctx.fill();

  // ── Perforated divider line ──────────
  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(620, 20); ctx.lineTo(620, H - 20);
  ctx.stroke();
  ctx.restore();

  // Notch circles on divider
  ctx.fillStyle = '#F5F0E8';
  circle(ctx, 620, 0,  14);
  circle(ctx, 620, H,  14);

  // ── Left section: Event Info ─────────
  const lx = 40; // left content start

  // Event icon / emoji
  ctx.font = '52px serif';
  ctx.fillText(t.eventIcon || '🎫', lx, 80);

  // Event name
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(clipText(ctx, t.eventName, 380), lx, 120);

  // Subtitle line
  ctx.font = '13px sans-serif';
  ctx.fillStyle = asCertificate ? '#ffd700' : '#FF3C6E';
  ctx.fillText(asCertificate ? '🏅 PARTICIPATION CERTIFICATE' : `● ${(t.status || 'UPCOMING').toUpperCase()} PASS`, lx, 145);

  // Divider
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(lx, 158, 540, 1);

  // Info grid
  const info = [
    ['📅 Date',     t.date],
    ['📍 Venue',    clipText(ctx, t.venue || '—', 220)],
    ['🎟️ Type',    capitalize(t.ticketType || 'Regular')],
    ['💳 Amount',  t.price === 0 ? 'FREE' : '₹' + t.price],
  ];
  ctx.font = '11px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  info.forEach(([label, val], i) => {
    const col = i % 2 === 0 ? lx : lx + 270;
    const row = 190 + Math.floor(i / 2) * 52;
    ctx.fillText(label.toUpperCase(), col, row);
    ctx.font = '13.5px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(val, col, row + 18);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
  });

  // Student name
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '11px sans-serif';
  ctx.fillText('STUDENT', lx, 300);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText((u?.fname || '') + ' ' + (u?.lname || ''), lx, 318);
  ctx.fillStyle = asCertificate ? '#C9911A' : '#E8621A';
  ctx.font = '11px monospace';
  ctx.fillText('@' + (u?.username || u?.cid || '—'), lx, 334);

  // NEXUS branding bottom-left
  ctx.font = 'bold 10px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillText('NEXUS · College Event Platform · 2025', lx, H - 16);

  // ── Right section: QR + Ticket ID ───
  const rx = 645;

  // Draw QR on canvas
  drawQROnCanvas(ctx, `NEXUS-${t.id}-${t.userId}-${t.eventId}`, rx, 28, 170, 170);

  // Ticket ID under QR
  ctx.font = '9.5px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.textAlign = 'center';
  ctx.fillText('TICKET ID', rx + 85, 216);
  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = asCertificate ? '#ffd700' : '#00e5ff';
  ctx.fillText(t.id, rx + 85, 230);

  // Status badge
  const badgeColor = t.status === 'used' ? '#22c55e' : t.status === 'cancelled' ? '#ef4444' : '#E8621A';
  ctx.fillStyle = badgeColor + '22';
  roundRect(ctx, rx + 30, 242, 110, 24, 6);
  ctx.fill();
  ctx.strokeStyle = badgeColor + '66';
  ctx.lineWidth = 1;
  roundRect(ctx, rx + 30, 242, 110, 24, 6);
  ctx.stroke();
  ctx.fillStyle = badgeColor;
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText((t.status || 'UPCOMING').toUpperCase(), rx + 85, 258);

  // Scan instruction
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Scan QR at entry gate', rx + 85, 290);

  ctx.textAlign = 'left';

  // ── Decorative glow spots ────────────
  radialGlow(ctx, 0, 0, 150, asCertificate ? 'rgba(201,145,26,0.08)' : 'rgba(232,98,26,0.1)');
  radialGlow(ctx, W, H, 180, 'rgba(42,28,10,0.08)');
  radialGlow(ctx, 620, H/2, 80, 'rgba(252,160,74,0.06)');

  // ── Download ─────────────────────────
  const filename = asCertificate
    ? `nexus-certificate-${t.eventName.replace(/\s+/g, '-')}.png`
    : `nexus-ticket-${t.id}.png`;

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast('📥 Ticket downloaded!', 'success');
  }, 'image/png');
}

// Share ticket (uses Web Share API if available, else copies link)
function shareTicket(ticketId) {
  const t = cachedTickets.find(tk => tk.id === ticketId);
  if (!t) return;
  const text = `🎫 My ticket for "${t.eventName}" on ${t.date} at ${t.venue} — Ticket ID: ${t.id}`;
  if (navigator.share) {
    navigator.share({ title: 'NEXUS Ticket', text });
  } else {
    navigator.clipboard.writeText(text);
    toast('Ticket details copied to clipboard! 📋', 'info');
  }
}

// ── Canvas helper functions ──────────────────
function roundRect(ctx, x, y, w, h, r) {
  if (typeof r === 'number') r = [r, r, r, r];
  const [tl, tr, br, bl] = r;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y); ctx.arcTo(x + w, y,       x + w, y + tr,       tr);
  ctx.lineTo(x + w, y + h - br); ctx.arcTo(x + w, y + h, x + w - br, y + h, br);
  ctx.lineTo(x + bl, y + h); ctx.arcTo(x,     y + h, x,       y + h - bl, bl);
  ctx.lineTo(x, y + tl);     ctx.arcTo(x,     y,     x + tl,  y,          tl);
  ctx.closePath();
}

function circle(ctx, cx, cy, r) {
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
}

function radialGlow(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function capitalize(str) { return str ? str[0].toUpperCase() + str.slice(1) : str; }

function clipText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  while (text.length > 0 && ctx.measureText(text + '…').width > maxWidth) text = text.slice(0, -1);
  return text + '…';
}

function drawQROnCanvas(ctx, data, x, y, w, h) {
  // White background
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, x, y, w, h, 10); ctx.fill();

  const cells  = 21;
  const cell   = Math.floor((w - 16) / cells);
  const ox     = x + 8, oy = y + 8;

  // Deterministic seed from data string
  let seed = 0;
  for (let i = 0; i < data.length; i++) seed = (seed * 31 + data.charCodeAt(i)) & 0x7fffffff;
  function rand() { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed / 0x7fffffff; }

  ctx.fillStyle = '#111111';

  // Corner squares
  function corner(cx, cy) {
    ctx.fillRect(cx, cy, cell*7, cell*7);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(cx+cell, cy+cell, cell*5, cell*5);
    ctx.fillStyle = '#111111'; ctx.fillRect(cx+cell*2, cy+cell*2, cell*3, cell*3);
  }
  corner(ox, oy);
  corner(ox + (cells - 7) * cell, oy);
  corner(ox, oy + (cells - 7) * cell);

  // Data dots
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const inCorner = (r < 8 && c < 8) || (r < 8 && c > cells - 9) || (r > cells - 9 && c < 8);
      if (!inCorner && rand() > 0.5) {
        ctx.fillStyle = '#111111';
        ctx.fillRect(ox + c * cell, oy + r * cell, cell - 1, cell - 1);
      }
    }
  }
}

// ════════════════════════════════════════
// EVENT DETAIL
// ════════════════════════════════════════
function viewEvent(eventId) {
  const e = cachedEvents.find(ev => ev.id === eventId);
  if(!e) return;
  const thumb = document.getElementById('edh-thumb');
  thumb.innerHTML = `<span style="font-size:5rem">${e.icon}</span><span class="e-badge ${e.status === 'live' ? 'badge-live' : e.status === 'completed' ? 'badge-completed' : 'badge-upcoming'}" style="position:absolute;top:20px;right:24px;font-size:.9rem">${e.status === 'live' ? '● LIVE NOW' : e.status === 'completed' ? 'COMPLETED' : 'UPCOMING'}</span>`;
  thumb.className = 'event-detail-header ' + e.bg;
  const booked = cachedTickets.find(t => t.eventId === e.id && t.userId === currentUser.id);
  const pct = Math.round(e.booked / e.seats * 100);
  document.getElementById('edh-body').innerHTML = `
    <div>
      <div class="info-section">
        <div style="font-family:'Playfair Display',serif;font-size:2rem;letter-spacing:.04em;margin-bottom:6px">${e.name}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px"><span class="tag">📁 ${e.category}</span><span class="tag">👤 ${e.org}</span>${e.prize ? `<span class="tag">🏆 ${e.prize}</span>` : ''}</div>
        <p style="color:var(--text2);line-height:1.7;font-size:.9rem">${e.desc || 'No description.'}</p>
      </div>
      <div class="info-section">
        <div class="is-title">📋 Event Details</div>
        <div class="info-row"><div class="info-icon">📅</div><div class="info-val"><strong>Date & Time</strong>${e.date} at ${e.time}</div></div>
        <div class="info-row"><div class="info-icon">📍</div><div class="info-val"><strong>Venue</strong>${e.venue}</div></div>
        <div class="info-row"><div class="info-icon">👤</div><div class="info-val"><strong>Organizer</strong>${e.org}</div></div>
        <div class="info-row"><div class="info-icon">🪑</div><div class="info-val"><strong>Availability</strong>${e.seats - e.booked} of ${e.seats} seats left</div></div>
        <div style="margin-top:12px"><div style="display:flex;justify-content:space-between;font-size:.75rem;color:var(--text2);margin-bottom:6px"><span>Booking Progress</span><span>${pct}%</span></div><div style="background:var(--bg);border-radius:6px;height:8px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${pct > 80 ? 'var(--accent)' : 'var(--green)'};border-radius:6px"></div></div></div>
      </div>
    </div>
    <div><div class="booking-box">
      <div style="font-family:'Playfair Display',serif;font-size:1.3rem;letter-spacing:.08em;margin-bottom:4px">BOOK YOUR PASS</div>
      <div style="font-family:'Playfair Display',serif;font-size:2.8rem;letter-spacing:.04em;color:var(--gold);line-height:1;margin-bottom:4px">${e.price === 0 ? 'FREE' : '₹' + e.price}</div>
      <div style="color:var(--text2);font-size:.8rem;margin-bottom:20px">per ticket</div>
      ${booked ? `<div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);border-radius:8px;padding:14px;margin-bottom:14px;text-align:center"><div style="color:var(--green);font-weight:700;margin-bottom:4px">✅ Already Booked!</div><div style="font-size:.8rem;color:var(--text2)">Ticket ID: ${booked.id}</div></div><button class="btn btn-ghost btn-full" style="margin-bottom:8px" onclick="showQR('${booked.id}')">View My QR Pass →</button><button class="btn btn-primary btn-full" onclick="openBooking('${e.id}')">👥 Buy Extra Passes for Friends</button>` : e.status === 'completed' ? `<button class="btn btn-ghost btn-full" disabled>Event Completed</button>` : e.seats - e.booked === 0 ? `<button class="btn btn-ghost btn-full" disabled>🔴 Sold Out</button>` : `<button class="btn btn-primary btn-full btn-lg" onclick="openBooking('${e.id}')">Book Now →</button>`}
    </div></div>`;
  showPage('event-detail');
}

// ════════════════════════════════════════
// ADMIN PANEL
// ════════════════════════════════════════
function adminTab(btn, tab) {
  document.querySelectorAll('.admin-menu-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const m = {
    overview:         renderAdminOverview,
    'manage-events':  renderAdminEvents,
    students:         renderAdminStudents,
    'ticket-analytics': renderAdminTicketAnalytics,
    scan:             renderAdminScan,
    announcements:    renderAdminAnn,
    revenue:          renderAdminRevenue
  };
  if(m[tab]) m[tab]();
}

function renderAdminOverview() {
  const students = cachedUsers.filter(u => u.role !== 'admin');
  const rev      = cachedTickets.reduce((a, t) => a + t.price, 0);
  const bc = ['linear-gradient(90deg,var(--accent),#ff6b6b)','linear-gradient(90deg,var(--accent2),var(--accent3))','linear-gradient(90deg,var(--accent3),var(--gold))','linear-gradient(90deg,var(--gold),#f59e0b)','linear-gradient(90deg,var(--green),#16a34a)'];
  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header"><div class="admin-title">OVERVIEW DASHBOARD</div><div style="display:flex;align-items:center;gap:6px;font-size:.8rem;color:var(--text2)"><div style="width:7px;height:7px;border-radius:50%;background:var(--accent);animation:pulse 1.5s ease infinite"></div>Live Data</div></div>
    <div class="metrics-grid" style="margin-bottom:28px">
      <div class="metric-box"><div class="metric-val" style="color:var(--accent)">₹${rev.toLocaleString()}</div><div class="metric-lbl">Total Revenue</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--accent3)">${cachedTickets.length}</div><div class="metric-lbl">Tickets Sold</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--accent)">${students.length}</div><div class="metric-lbl">Students Registered</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--gold)">${cachedEvents.filter(e => e.status === 'upcoming' || e.status === 'live').length}</div><div class="metric-lbl">Active Events</div></div>
    </div>

    <!-- Seat Analytics -->
    <div class="dash-card" style="margin-bottom:20px">
      <div class="dc-title">🪑 Seat Availability — All Events</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:.82rem">
          <thead><tr style="border-bottom:1px solid var(--border)">
            <th style="text-align:left;padding:8px 12px;color:var(--text2);font-weight:600">Event</th>
            <th style="text-align:center;padding:8px 12px;color:var(--text2);font-weight:600">Total Seats</th>
            <th style="text-align:center;padding:8px 12px;color:var(--text2);font-weight:600">Booked</th>
            <th style="text-align:center;padding:8px 12px;color:var(--text2);font-weight:600">Available</th>
            <th style="text-align:center;padding:8px 12px;color:var(--text2);font-weight:600">Fill %</th>
            <th style="text-align:center;padding:8px 12px;color:var(--text2);font-weight:600">Status</th>
          </tr></thead>
          <tbody>
            ${cachedEvents.map(e => {
              const pct = Math.round(e.booked / e.seats * 100);
              const avail = e.seats - e.booked;
              const statusColor = avail === 0 ? 'var(--accent)' : pct > 80 ? 'var(--gold)' : 'var(--green)';
              const statusLabel = avail === 0 ? '🔴 Sold Out' : pct > 80 ? '🟡 Almost Full' : '🟢 Available';
              return `<tr style="border-bottom:1px solid var(--border2)">
                <td style="padding:10px 12px"><div style="font-weight:600">${e.icon} ${e.name}</div><div style="font-size:.7rem;color:var(--text2)">${e.category}</div></td>
                <td style="text-align:center;padding:10px 12px">${e.seats}</td>
                <td style="text-align:center;padding:10px 12px;color:var(--accent3)">${e.booked}</td>
                <td style="text-align:center;padding:10px 12px;color:${statusColor};font-weight:700">${avail}</td>
                <td style="text-align:center;padding:10px 12px">
                  <div style="display:flex;align-items:center;gap:6px">
                    <div style="flex:1;background:var(--bg2);border-radius:4px;height:6px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${pct > 80 ? 'var(--accent)' : 'var(--green)'};border-radius:4px"></div></div>
                    <span style="font-size:.7rem;color:var(--text2);width:32px">${pct}%</span>
                  </div>
                </td>
                <td style="text-align:center;padding:10px 12px;font-size:.75rem;color:${statusColor}">${statusLabel}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div class="dash-card"><div class="dc-title">📈 Event Popularity</div><div class="bar-list">${[...cachedEvents].sort((a, b) => (b.booked/b.seats) - (a.booked/a.seats)).slice(0, 5).map((e, i) => { const p = Math.min(100, Math.round(e.booked/e.seats*100)); return `<div class="bar-row"><span class="bar-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.name.split(' ').slice(0,2).join(' ')}</span><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${bc[i]}"></div></div><span class="bar-val">${p}%</span></div>`; }).join('')}</div></div>
      <div class="dash-card"><div class="dc-title">📋 Recent Tickets</div>${cachedTickets.slice(-5).reverse().map(t => `<div class="my-ticket-item"><div style="font-size:1.4rem">🎫</div><div class="ticket-info"><div class="ti-name">${t.eventName}</div><div class="ti-date">${t.bookedOn}</div></div><div style="font-size:.8rem;color:var(--gold)">${t.price === 0 ? 'FREE' : '₹' + t.price}</div></div>`).join('') || '<div class="empty-state"><div class="empty-msg">No tickets yet</div></div>'}</div>
    </div>
    <div class="dash-card"><div class="dc-title">⚡ Quick Actions</div><div style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn btn-primary" onclick="openModal('create-event-overlay')">➕ Create Event</button><button class="btn btn-purple" onclick="openModal('ann-overlay')">📢 Send Announcement</button><button class="btn btn-ghost" onclick="openModal('add-admin-overlay')">🛡️ Add Admin</button><button class="btn btn-ghost" onclick="exportData()">📊 Export Data</button></div></div>`;
}

function renderAdminEvents() {
  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header"><div class="admin-title">MANAGE EVENTS</div><button class="btn btn-primary" onclick="resetEventModal();openModal('create-event-overlay')">➕ Create Event</button></div>
    <div style="display:flex;flex-direction:column;gap:14px">
      ${cachedEvents.map(e => `<div class="dash-card" style="padding:18px"><div style="display:flex;align-items:center;gap:14px"><div style="font-size:2rem">${e.icon}</div><div style="flex:1"><div style="font-weight:700;margin-bottom:3px">${e.name}</div><div style="font-size:.78rem;color:var(--text2)">${e.category} · ${e.date} · ${e.venue}</div><div style="display:flex;gap:8px;margin-top:8px"><span class="badge ${e.status === 'live' ? 'badge-accent' : e.status === 'completed' ? '' : 'badge-purple'}">${e.status.toUpperCase()}</span><span class="badge" style="background:rgba(255,215,0,.1);color:var(--gold)">${e.booked}/${e.seats} booked</span><span class="badge" style="background:rgba(0,229,255,.1);color:var(--accent3)">${e.seats - e.booked} left</span><span class="badge" style="background:rgba(34,197,94,.1);color:var(--green)">${e.price === 0 ? 'FREE' : '₹' + e.price}</span></div></div><div style="display:flex;gap:8px;flex-shrink:0"><button class="btn btn-ghost btn-sm" onclick="editEvent('${e.id}')">✏️ Edit</button><button class="btn btn-sm" style="background:rgba(34,197,94,.1);color:var(--green);border:1px solid rgba(34,197,94,.2)" onclick="toggleEventStatus('${e.id}')">🔄 Status</button><button class="btn btn-sm" style="background:rgba(232,98,26,.08);color:var(--accent);border:1px solid rgba(232,98,26,.2)" onclick="deleteEvent('${e.id}')">🗑️ Delete</button></div></div></div>`).join('')}
    </div>`;
}

function renderAdminStudents() {
  const students = cachedUsers.filter(u => u.role !== 'admin');
  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header"><div class="admin-title">STUDENTS (${students.length})</div><input class="form-input" style="width:220px" placeholder="🔍 Search by name / username / ID..." oninput="filterStudents(this.value)"></div>
    <div style="display:flex;flex-direction:column;gap:12px" id="students-list">
      ${students.map(u => renderStudentCard(u)).join('')}
    </div>`;
}

function renderStudentCard(u) {
  const ticketCount = cachedTickets.filter(t => t.userId === u.id).length;
  const spent       = cachedTickets.filter(t => t.userId === u.id).reduce((a, t) => a + t.price, 0);
  return `<div class="dash-card" style="padding:16px">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">${u.fname[0]}</div>
      <div style="flex:1">
        <div style="font-weight:700">${u.fname} ${u.lname}</div>
        <div style="font-size:.72rem;color:var(--accent3);font-family:'JetBrains Mono',monospace">@${u.username || '—'}</div>
        <div style="font-size:.75rem;color:var(--text2)">${u.cid} · ${u.email} · ${u.dept || '—'} · ${u.year || '—'}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--accent)">${ticketCount}</div>
        <div style="font-size:.68rem;color:var(--text2)">events</div>
        <div style="font-size:.75rem;color:var(--gold);margin-top:2px">₹${spent} spent</div>
      </div>
    </div>
  </div>`;
}

function filterStudents(q) {
  const students = cachedUsers.filter(u => u.role !== 'admin');
  const f = students.filter(u => (u.fname + ' ' + u.lname + (u.username || '') + u.cid + u.email).toLowerCase().includes(q.toLowerCase()));
  document.getElementById('students-list').innerHTML = f.map(u => renderStudentCard(u)).join('') ||
    '<div class="empty-state"><div class="empty-msg">No students found</div></div>';
}

// ── Ticket Analytics ──────────────────
function renderAdminTicketAnalytics() {
  const totalSold    = cachedTickets.length;
  const totalRevenue = cachedTickets.reduce((a, t) => a + t.price, 0);
  const freeTickets  = cachedTickets.filter(t => t.price === 0).length;
  const paidTickets  = totalSold - freeTickets;
  const usedTickets  = cachedTickets.filter(t => t.status === 'used').length;
  const cancelledTickets = cachedTickets.filter(t => t.status === 'cancelled').length;
  const activeTickets    = cachedTickets.filter(t => t.status === 'upcoming').length;

  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header"><div class="admin-title">TICKET ANALYTICS</div></div>

    <!-- Summary Metrics -->
    <div class="metrics-grid" style="margin-bottom:24px">
      <div class="metric-box"><div class="metric-val" style="color:var(--accent3)">${totalSold}</div><div class="metric-lbl">Total Tickets Sold</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--green)">${activeTickets}</div><div class="metric-lbl">Active Tickets</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--accent)">${usedTickets}</div><div class="metric-lbl">Tickets Scanned (Used)</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--accent)">${cancelledTickets}</div><div class="metric-lbl">Cancelled</div></div>
    </div>

    <!-- Per-Event Breakdown -->
    <div class="dash-card" style="margin-bottom:20px">
      <div class="dc-title">🎟️ Tickets Sold vs Available — Per Event</div>
      ${cachedEvents.map(e => {
        const sold  = cachedTickets.filter(t => t.eventId === e.id).length;
        const left  = e.seats - e.booked;
        const pct   = Math.round(e.booked / e.seats * 100);
        const rev   = cachedTickets.filter(t => t.eventId === e.id).reduce((a, t) => a + t.price, 0);
        return `<div style="padding:14px 0;border-bottom:1px solid var(--border2)">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <div><span style="font-size:1.2rem;margin-right:8px">${e.icon}</span><strong>${e.name}</strong> <span class="badge" style="background:rgba(124,58,237,.1);color:var(--accent);margin-left:4px">${e.category}</span></div>
            <div style="text-align:right;font-size:.8rem"><span style="color:var(--gold);font-family:'Playfair Display',serif;font-size:1rem">₹${rev}</span></div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:10px;font-size:.78rem;text-align:center">
            <div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-weight:700;color:var(--accent3);font-size:1rem">${sold}</div><div style="color:var(--text2)">Sold</div></div>
            <div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-weight:700;color:var(--green);font-size:1rem">${left}</div><div style="color:var(--text2)">Left</div></div>
            <div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-weight:700;color:var(--accent);font-size:1rem">${e.seats}</div><div style="color:var(--text2)">Total</div></div>
            <div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-weight:700;color:${pct > 80 ? 'var(--accent)' : 'var(--text)'};font-size:1rem">${pct}%</div><div style="color:var(--text2)">Fill Rate</div></div>
          </div>
          <div style="background:var(--bg2);border-radius:4px;height:8px;overflow:hidden">
            <div style="width:${pct}%;height:100%;background:${pct >= 100 ? 'var(--accent)' : pct > 80 ? 'var(--gold)' : 'var(--green)'};border-radius:4px;transition:width .4s"></div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- Ticket Type Breakdown -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="dash-card"><div class="dc-title">🎫 By Ticket Type</div>
        ${['regular','vip','group'].map(type => {
          const count = cachedTickets.filter(t => t.ticketType === type).length;
          return `<div class="my-ticket-item"><div style="font-size:1.5rem">${type === 'vip' ? '⭐' : type === 'group' ? '👥' : '🎫'}</div><div class="ticket-info"><div class="ti-name" style="text-transform:capitalize">${type}</div><div class="ti-date">${count} tickets</div></div><div style="font-family:'Playfair Display',serif;font-size:1.2rem;color:var(--accent3)">${count}</div></div>`;
        }).join('')}
      </div>
      <div class="dash-card"><div class="dc-title">📊 By Status</div>
        ${[['upcoming','🟡','Active'],['used','🟢','Scanned'],['cancelled','🔴','Cancelled']].map(([s, ic, label]) => {
          const count = cachedTickets.filter(t => t.status === s).length;
          return `<div class="my-ticket-item"><div style="font-size:1.5rem">${ic}</div><div class="ticket-info"><div class="ti-name">${label}</div><div class="ti-date">${count} tickets</div></div><div style="font-family:'Playfair Display',serif;font-size:1.2rem;color:var(--accent3)">${count}</div></div>`;
        }).join('')}
      </div>
    </div>`;
}

function renderAdminScan() {
  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header"><div class="admin-title">QR SCANNER</div></div>
    <div style="max-width:480px">
      <div style="background:var(--surface);border:2px dashed var(--border2);border-radius:var(--r);padding:40px;text-align:center;margin-bottom:20px"><div style="font-size:4rem;margin-bottom:12px">📷</div><div style="font-weight:600;margin-bottom:8px">QR Code Scanner</div><div style="color:var(--text2);font-size:.85rem;margin-bottom:20px">Scan student passes for instant verification</div><button class="btn btn-primary btn-lg" onclick="simulateScan()">🔍 Simulate Scan</button></div>
      <div class="dash-card"><div class="dc-title">🔍 Manual Ticket Lookup</div><div style="display:flex;gap:10px;margin-bottom:16px"><input class="form-input" id="scan-input" placeholder="Enter Ticket ID (starts with T)" style="flex:1"><button class="btn btn-primary" onclick="manualScan()">Verify</button></div><div id="scan-result"></div></div>
    </div>`;
}

function simulateScan() {
  const activeTickets = cachedTickets.filter(t => t.status === 'upcoming');
  if(!activeTickets.length) { toast('No active tickets to scan.', 'info'); return; }
  verifyScanResult(activeTickets[activeTickets.length - 1].id);
}
function manualScan() {
  const id = document.getElementById('scan-input')?.value.trim();
  if(!id) { toast('Enter a ticket ID', 'error'); return; }
  verifyScanResult(id);
}

async function verifyScanResult(ticketId) {
  const idx    = cachedTickets.findIndex(t => t.id === ticketId);
  const result = document.getElementById('scan-result');
  if(idx === -1) {
    if(result) result.innerHTML = `<div style="background:rgba(232,98,26,.08);border:1px solid rgba(232,98,26,.25);border-radius:10px;padding:16px;text-align:center"><div style="color:var(--accent);font-size:2rem;margin-bottom:8px">❌</div><div style="font-weight:700;color:var(--accent)">INVALID TICKET</div><div style="color:var(--text2);font-size:.8rem;margin-top:6px">No ticket found with this ID</div></div>`;
    toast('Invalid ticket!', 'error'); return;
  }
  const t = cachedTickets[idx];
  if(t.status === 'used') {
    if(result) result.innerHTML = `<div style="background:rgba(255,215,0,.1);border:1px solid rgba(255,215,0,.3);border-radius:10px;padding:16px;text-align:center"><div style="font-size:2rem;margin-bottom:8px">⚠️</div><div style="font-weight:700;color:var(--gold)">ALREADY SCANNED</div><div style="color:var(--text2);font-size:.8rem;margin-top:6px">This ticket was already used for entry</div></div>`;
    return;
  }
  if(t.status === 'cancelled') {
    if(result) result.innerHTML = `<div style="background:rgba(232,98,26,.08);border:1px solid rgba(232,98,26,.25);border-radius:10px;padding:16px;text-align:center"><div style="color:var(--accent);font-size:2rem;margin-bottom:8px">🚫</div><div style="font-weight:700;color:var(--accent)">CANCELLED TICKET</div></div>`;
    return;
  }
  try {
    await COL.tickets.doc(ticketId).update({status: 'used'});
    cachedTickets[idx].status = 'used';
    const user = cachedUsers.find(u => u.id === t.userId);
    if(result) result.innerHTML = `<div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:10px;padding:16px;text-align:center"><div style="color:var(--green);font-size:2.5rem;margin-bottom:8px">✅</div><div style="font-weight:700;color:var(--green);font-size:1.1rem;margin-bottom:12px">ENTRY GRANTED</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:left"><div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-size:.65rem;color:var(--text2)">NAME</div><div style="font-weight:600;font-size:.82rem">${user?.fname || 'Unknown'} ${user?.lname || ''}</div></div><div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-size:.65rem;color:var(--text2)">USERNAME</div><div style="font-weight:600;font-size:.82rem;font-family:'JetBrains Mono',monospace">@${user?.username || '—'}</div></div><div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-size:.65rem;color:var(--text2)">EVENT</div><div style="font-weight:600;font-size:.82rem">${t.eventName}</div></div><div style="background:var(--surface2);border-radius:6px;padding:8px"><div style="font-size:.65rem;color:var(--text2)">TICKET TYPE</div><div style="font-weight:600;font-size:.82rem;text-transform:capitalize">${t.ticketType}</div></div></div></div>`;
    toast('✅ Entry granted!', 'success');
  } catch(e) { toast('Scan update failed: ' + e.message, 'error'); }
}

function renderAdminAnn() {
  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header"><div class="admin-title">ANNOUNCEMENTS</div><button class="btn btn-primary" onclick="openModal('ann-overlay')">📢 New Announcement</button></div>
    <div style="display:flex;flex-direction:column;gap:12px">${cachedNotifs.filter(n => n.global).map(n => `<div class="notif-item"><div class="notif-icon-wrap ${n.type}">${n.icon}</div><div class="notif-body-text"><div class="notif-title-text">${n.title}</div><div class="notif-body-msg">${n.msg}</div></div><div style="font-size:.7rem;color:var(--text2)">${n.time || ''}</div></div>`).join('') || '<div class="empty-state"><div class="empty-msg">No announcements yet</div></div>'}</div>`;
}

function renderAdminRevenue() {
  const total    = cachedTickets.reduce((a, t) => a + t.price, 0);
  const avgPrice = cachedTickets.length ? Math.round(total / cachedTickets.length) : 0;
  document.getElementById('admin-content').innerHTML = `
    <div class="admin-header"><div class="admin-title">REVENUE ANALYTICS</div><button class="btn btn-ghost" onclick="exportData()">📊 Export</button></div>
    <div class="metrics-grid" style="margin-bottom:24px">
      <div class="metric-box"><div class="metric-val" style="color:var(--gold)">₹${total.toLocaleString()}</div><div class="metric-lbl">Total Revenue</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--green)">${cachedTickets.length}</div><div class="metric-lbl">Transactions</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--accent)">${cachedTickets.filter(t => t.price === 0).length}</div><div class="metric-lbl">Free Registrations</div></div>
      <div class="metric-box"><div class="metric-val" style="color:var(--accent3)">₹${avgPrice}</div><div class="metric-lbl">Avg Ticket Price</div></div>
    </div>
    <div class="dash-card"><div class="dc-title">💰 Revenue by Event</div>
      ${cachedEvents.map(e => {
        const ev  = cachedTickets.filter(t => t.eventId === e.id);
        const rev = ev.reduce((a, t) => a + t.price, 0);
        const pct = total > 0 ? Math.round(rev / total * 100) : 0;
        return `<div class="my-ticket-item"><div style="font-size:1.5rem">${e.icon}</div><div class="ticket-info" style="flex:1"><div class="ti-name">${e.name}</div><div class="ti-date">${ev.length} tickets · ${pct}% of revenue</div><div style="background:var(--bg2);border-radius:3px;height:4px;margin-top:6px;overflow:hidden"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,var(--gold),var(--accent))"></div></div></div><div style="font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--gold);margin-left:12px">₹${rev}</div></div>`;
      }).join('')}
    </div>`;
}

// ── Event CRUD ──────────────────────────
function resetEventModal() {
  const title = document.getElementById('event-modal-title');
  const btn   = document.getElementById('event-modal-submit-btn');
  if(title) title.textContent = 'CREATE NEW EVENT';
  if(btn)   { btn.textContent = 'Create Event →'; btn.onclick = createEvent; }
  ['ce-name','ce-date','ce-time','ce-venue','ce-desc','ce-org'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value = '';
  });
  const priceEl = document.getElementById('ce-price'); if(priceEl) priceEl.value = '0';
  const seatsEl = document.getElementById('ce-seats'); if(seatsEl) seatsEl.value = '100';
}

function editEvent(eventId) {
  const e = cachedEvents.find(ev => ev.id === eventId); if(!e) return;
  ['name','cat','status','date','time','venue','price','seats','desc','org'].forEach(f => {
    const el = document.getElementById('ce-' + f);
    if(el) el.value = e[f === 'cat' ? 'category' : f] || '';
  });
  const title = document.getElementById('event-modal-title');
  const btn   = document.getElementById('event-modal-submit-btn');
  if(title) title.textContent = 'EDIT EVENT';
  if(btn)   { btn.textContent = 'Update Event →'; btn.onclick = () => updateEvent(eventId); }
  openModal('create-event-overlay');
}

async function updateEvent(eventId) {
  const upd = {name:v('ce-name'), category:v('ce-cat'), status:v('ce-status'), date:v('ce-date'), time:v('ce-time'), venue:v('ce-venue'), price:parseInt(v('ce-price') || 0), seats:parseInt(v('ce-seats') || 100), desc:v('ce-desc'), org:v('ce-org')};
  try {
    await COL.events.doc(eventId).update(upd);
    const i = cachedEvents.findIndex(e => e.id === eventId);
    if(i !== -1) cachedEvents[i] = {...cachedEvents[i], ...upd};
    closeModal('create-event-overlay'); toast('Event updated!', 'success'); renderAdminEvents();
  } catch(e) { toast('Update failed: ' + e.message, 'error'); }
}

async function toggleEventStatus(eventId) {
  const i = cachedEvents.findIndex(e => e.id === eventId); if(i === -1) return;
  const s = ['upcoming','live','completed'];
  const next = s[(s.indexOf(cachedEvents[i].status) + 1) % s.length];
  try {
    await COL.events.doc(eventId).update({status: next});
    cachedEvents[i].status = next;
    toast(`Status changed → ${next.toUpperCase()}`, 'info');
    renderAdminEvents();
  } catch(e) { toast('Update failed: ' + e.message, 'error'); }
}

async function deleteEvent(eventId) {
  if(!confirm('Delete this event? All associated tickets will remain but event will be gone.')) return;
  try {
    await COL.events.doc(eventId).delete();
    cachedEvents = cachedEvents.filter(e => e.id !== eventId);
    toast('Event deleted', 'info'); renderAdminEvents();
  } catch(e) { toast('Delete failed: ' + e.message, 'error'); }
}

async function createEvent() {
  const name = v('ce-name'); if(!name) { toast('Event name required', 'error'); return; }
  const icons = {Cultural:'🎭', Technical:'💻', Sports:'⚽', Workshop:'🛠️', Seminar:'🎙️', Fest:'🎪', 'Fresher Party':'🎉', 'Inter-College':'🌐'};
  const bgs   = ['e-bg-1','e-bg-2','e-bg-3','e-bg-4','e-bg-5','e-bg-6','e-bg-7','e-bg-8'];
  const cat   = v('ce-cat'), newId = 'ev' + Date.now();
  const ev    = {
    id: newId, name, category: cat, status: v('ce-status') || 'upcoming',
    date: v('ce-date') || new Date().toISOString().split('T')[0],
    time: v('ce-time') || '10:00 AM', venue: v('ce-venue') || 'TBA',
    price: parseInt(v('ce-price') || 0), seats: parseInt(v('ce-seats') || 100), booked: 0,
    org: v('ce-org') || 'College', desc: v('ce-desc') || '',
    icon: icons[cat] || '🎯', bg: bgs[cachedEvents.length % 8],
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  try {
    await COL.events.doc(newId).set(ev);
    cachedEvents.push({...ev, createdAt: new Date()});
    await addNotif('New Event Added!', `"${name}" has been published.`, '🎪', 'ni-purple');
    closeModal('create-event-overlay');
    toast('Event created! 🎉', 'success');
    renderAdminEvents();
    resetEventModal();
  } catch(e) { toast('Create failed: ' + e.message, 'error'); }
}

async function sendAnnouncement() {
  const title = v('ann-title'), msg = v('ann-msg');
  if(!title || !msg) { toast('Fill all fields', 'error'); return; }
  const tm = {info:'ni-cyan', success:'ni-green', warning:'ni-gold', event:'ni-purple'};
  const im = {info:'ℹ️', success:'✅', warning:'⚠️', event:'🎪'};
  const type = document.getElementById('ann-type')?.value || 'info';
  try {
    const ref = await COL.notifs.add({
      title, msg, icon: im[type], type: tm[type],
      time: new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}),
      global: true, read: false, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    cachedNotifs.push({id: ref.id, title, msg, icon: im[type], type: tm[type], global: true});
    closeModal('ann-overlay');
    toast('Announcement sent to all students!', 'success');
    renderAdminAnn();
    document.getElementById('ann-title').value = '';
    document.getElementById('ann-msg').value   = '';
  } catch(e) { toast('Send failed: ' + e.message, 'error'); }
}

function exportData() {
  const data = {
    exportedAt: new Date().toISOString(),
    events:     cachedEvents,
    tickets:    cachedTickets,
    students:   cachedUsers.filter(u => u.role !== 'admin').map(u => ({...u, roll: u.roll}))
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `nexus-export-${new Date().toISOString().split('T')[0]}.json`; a.click();
  toast('Data exported!', 'success');
}

// ════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════
async function addNotif(title, msg, icon, type) {
  try {
    const ref = await COL.notifs.add({userId: currentUser?.id || null, title, msg, icon, type, time: 'Just now', read: false, global: false, createdAt: firebase.firestore.FieldValue.serverTimestamp()});
    cachedNotifs.push({id: ref.id, title, msg, icon, type, read: false, global: false});
    const dot = document.getElementById('notif-dot'); if(dot) dot.style.display = 'block';
  } catch(e) { console.error('Notif error:', e); }
}

function renderNotifications() {
  const mine = cachedNotifs.filter(n => n.global || n.userId === currentUser?.id);
  const list = document.getElementById('notif-list'); if(!list) return;
  list.innerHTML = mine.slice().reverse().map(n => `<div class="notif-item ${n.read ? '' : 'unread'}" onclick="markRead('${n.id}')"><div class="notif-icon-wrap ${n.type}">${n.icon}</div><div class="notif-body-text"><div class="notif-title-text">${n.title}</div><div class="notif-body-msg">${n.msg}</div></div><div class="notif-time-text">${n.time || ''}</div></div>`).join('') || '<div class="empty-state"><div class="empty-icon">🔔</div><div class="empty-msg">No notifications</div></div>';
}

async function markRead(id) {
  try { await COL.notifs.doc(id).update({read: true}); const i = cachedNotifs.findIndex(n => n.id === id); if(i !== -1) cachedNotifs[i].read = true; updateUnreadDot(); renderNotifications(); } catch(e) {}
}

async function markAllRead() {
  const mine  = cachedNotifs.filter(n => n.global || n.userId === currentUser?.id);
  const batch = db.batch();
  mine.forEach(n => { batch.update(COL.notifs.doc(n.id), {read: true}); n.read = true; });
  await batch.commit(); updateUnreadDot(); renderNotifications(); toast('All read', 'info');
}

function updateUnreadDot() {
  const mine = cachedNotifs.filter(n => n.global || n.userId === currentUser?.id);
  const dot  = document.getElementById('notif-dot');
  if(dot) dot.style.display = mine.some(n => !n.read) ? 'block' : 'none';
}

// ════════════════════════════════════════
// COUNTDOWN — live ticking
// ════════════════════════════════════════
let _countdownTimer = null;

function startCountdown() {
  // Pull the target date from the Utkarsh event in cachedEvents if available
  const festEvent = cachedEvents.find(ev => ev.id === 'ev006');
  const dateStr   = festEvent ? festEvent.date + 'T' + (festEvent.time ? festEvent.time.replace(/\s?(AM|PM)/i,'') : '10:00') + ':00' : '2026-05-15T10:00:00';
  const target    = new Date(dateStr);

  // Clear any existing interval so we never run duplicates
  if (_countdownTimer) { clearInterval(_countdownTimer); _countdownTimer = null; }

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val).padStart(2, '0');
  };

  function tick() {
    const diff = target - new Date();
    if (diff <= 0) {
      // Event has started / passed
      set('cd-d', '00'); set('cd-h', '00'); set('cd-m', '00'); set('cd-s', '00');
      const lbl = document.getElementById('cd-started-label');
      if (lbl) { lbl.style.display = 'block'; }
      clearInterval(_countdownTimer); _countdownTimer = null;
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    set('cd-d', d); set('cd-h', h); set('cd-m', m); set('cd-s', s);
  }

  tick();
  _countdownTimer = setInterval(tick, 1000);
}

// ════════════════════════════════════════
// FEEDBACK
// ════════════════════════════════════════
let fbRating = 0;
function openFeedback() { openModal('feedback-overlay'); }
function setRating(r) { fbRating = r; document.querySelectorAll('#fb-stars span').forEach((s, i) => s.style.opacity = i < r ? '1' : '0.3'); }
function submitFeedback() {
  const subject = v('fb-subject'), msg = v('fb-message');
  if(!subject || !msg) { toast('Please fill all fields', 'error'); return; }
  closeModal('feedback-overlay');
  toast('Thank you for your feedback! ⭐', 'success');
  document.getElementById('fb-subject').value = '';
  document.getElementById('fb-message').value = '';
}

// ════════════════════════════════════════
// 📧 EMAIL FUNCTIONS (EmailJS)
// ════════════════════════════════════════

// Welcome email on registration
function sendWelcomeEmail(userName, userEmail, username, department) {
  emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templates.welcome, {
    user_name:   userName,
    user_email:  userEmail,
    username:    username,
    department:  department
  }).then(
    r  => console.log('✅ Welcome email sent:', r.status),
    e  => console.error('❌ Welcome email failed:', e)
  );
}

// Booking confirmation email
function sendBookingEmail(userName, userEmail, eventName, eventDate, eventTime, eventVenue, ticketType, amount, ticketId) {
  emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templates.booking, {
    user_name:   userName,
    event_name:  eventName,
    event_date:  eventDate,
    event_time:  eventTime,
    event_venue: eventVenue,
    ticket_type: ticketType,
    amount:      amount === 0 ? 'FREE' : '₹' + amount,
    ticket_id:   ticketId
  }).then(
    r  => { console.log('✅ Booking email sent:', r.status); toast('📧 Confirmation email sent!', 'info'); },
    e  => console.error('❌ Booking email failed:', e)
  );
}

// ════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════
function v(id) { return document.getElementById(id)?.value?.trim() || ''; }
function showForgotPass() { toast('📧 Password reset link sent to your registered email!', 'info'); }
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function updateNavAvatar() {
  const av = document.getElementById('nav-avatar');
  if(av && currentUser) av.textContent = currentUser.fname[0];
}

function updateNavUserInfo() {
  const infoEl   = document.getElementById('nav-user-info');
  const nameEl   = document.getElementById('nav-user-name');
  const roleEl   = document.getElementById('nav-user-role');
  if(infoEl && currentUser) {
    infoEl.style.display = 'flex';
    nameEl.textContent   = currentUser.fname + ' ' + (currentUser.lname || '');
    roleEl.textContent   = currentUser.role === 'admin' ? '🛡️ Admin' : '@' + (currentUser.username || '');
  }
}

function toast(msg, type = 'info') {
  const c = document.getElementById('toast');
  const icons = {success:'✅', error:'❌', info:'ℹ️'};
  const item = document.createElement('div');
  item.className = `toast-item ${type}`;
  item.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  c.appendChild(item);
  setTimeout(() => { item.style.opacity = '0'; item.style.transform = 'translateX(20px)'; item.style.transition = 'all .3s'; setTimeout(() => item.remove(), 300); }, 3500);
}

document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', e => { if(e.target === o) o.classList.remove('open'); }));
document.addEventListener('keydown', e => { if(e.key === 'Escape') document.querySelectorAll('.overlay.open').forEach(o => o.classList.remove('open')); });
const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); }), {threshold: .1});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
seedFirestoreIfEmpty();
populateCatFilter();
