// Shared helpers for all Cloud Kitchen sites (Firebase Realtime Database version)
const FB = window.CK_FIREBASE || {};
const CONFIGURED = !!(FB.apiKey && FB.databaseURL && !/PASTE-/.test(FB.apiKey + FB.appId));
// Each site (customer / waiter / admin) keeps its OWN login, even on the same phone and web address
const SITE = window.CK_SITE || 'site';
const app = CONFIGURED ? firebase.initializeApp(FB, 'ck-' + SITE) : null;
const auth = CONFIGURED ? app.auth() : null;
const db = CONFIGURED ? app.database() : null;
const TS = () => firebase.database.ServerValue.TIMESTAMP;

// ---------- Line icons (instead of emoji) ----------
const ICONS = {
  logo: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  table: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  hand: '<path d="M18 11V6a2 2 0 0 0-4 0v1M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
  pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  userPlus: '<circle cx="10" cy="8" r="4"/><path d="M2 21a8 8 0 0 1 13.3-6M19 14v6M22 17h-6"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M1 21a8 8 0 0 1 16 0M16 4.13a4 4 0 0 1 0 7.75M23 21a8 8 0 0 0-5-7.4"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 16v-4M12 16V8M17 16v-7"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM21 14v.01M14 21h.01M17 21h4v-4"/>',
  settings: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
  store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4M2 7h20v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  call: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
};
const ic = (name, size = 18) => `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let CURRENCY = 'Rs.';
const money = n => `${CURRENCY} ${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const timeAgo = t => {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + ' min ago';
  if (s < 86400) return Math.floor(s / 3600) + ' h ago';
  return new Date(t).toLocaleDateString();
};
// "3" → "Table 3", "Takeaway" → "Takeaway"
const place = t => /^\d+$/.test(String(t)) ? 'Table ' + t : String(t);
// Search: every typed word must be the start of a word ("mom" finds "Momo", "tea" doesn't find "Steam")
const matches = (q, ...fields) => {
  const words = fields.join(' ').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  return String(q).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean).every(w => words.some(x => x.startsWith(w)));
};
// Short order code shown to people, e.g. "#K3QZ" (from the random end of the order id)
const orderCode = id => '#' + String(id).slice(-4).toUpperCase().replace(/[^A-Z0-9]/g, 'X');

function friendly(err) {
  const code = (err && err.code) || '';
  const m = (err && err.message) || String(err || 'Something went wrong');
  if (/invalid-credential|wrong-password|user-not-found|invalid-login-credentials|invalid-email/.test(code)) return 'Wrong username or password';
  if (/too-many-requests/.test(code)) return 'Too many tries. Please wait a few minutes and try again.';
  if (/email-already-in-use/.test(code)) return 'That username is already taken';
  if (/weak-password/.test(code)) return 'Password must be at least 6 characters';
  if (/network-request-failed/.test(code) || /Failed to fetch|NetworkError/i.test(m)) return 'No connection. Check the internet and try again.';
  if (/operation-not-supported|web-storage-unsupported/.test(code) || location.protocol === 'file:') return 'This page was opened as a file. Logins only work when the site is opened from a web address (GitHub Pages / Netlify). See README.';
  if (/operation-not-allowed/.test(code)) return 'Email/Password sign-in is turned off. In Firebase → Authentication → Sign-in method, enable "Email/Password" (see README).';
  if (/requires-recent-login/.test(code)) return 'Please log out and log in again, then try once more.';
  if (/PERMISSION_DENIED/i.test(code + m)) return 'Not allowed. (If this is a new setup, check that the database rules from database.rules.json are published.)';
  return m.replace(/^Firebase: /, '');
}

// Arrays of records from a snapshot object {id: {...}}
const listOf = obj => Object.entries(obj || {}).map(([id, v]) => ({ id, ...v }));
const normOrder = o => {
  const items = (Array.isArray(o.items) ? o.items : Object.values(o.items || {})).filter(Boolean)
    .map(l => ({ ...l, price: Number(l.price) || 0, qty: Number(l.qty) || 0 }));
  return {
    ...o,
    table: o.table || '?',
    items,
    itemsTotal: items.reduce((s, l) => s + l.price * l.qty, 0),
    deliveryFee: Number(o.deliveryFee) || 0,
    total: items.reduce((s, l) => s + l.price * l.qty, 0) + (Number(o.deliveryFee) || 0),
    createdAt: Number(o.createdAt) || Date.now(),
    updatedAt: Number(o.updatedAt) || Number(o.createdAt) || Date.now(),
    createdBy: o.createdBy || '',
    createdByName: o.createdByName || '',
    handledBy: o.handledBy || '',
    note: o.note || '',
    status: o.status || 'new',
    source: o.source || 'qr',
    code: orderCode(o.id),
  };
};
const validOrder = o => o && typeof o.table === 'string' && o.items && o.status;
const waStart = n => String(n || '').replace(/[^0-9]/g, '');

const DEFAULT_SETTINGS = { cafeName: 'Cloud Kitchen', currency: 'Rs.', tagline: 'Scan, order, relax.', customerUrl: '' };
async function loadSettings() {
  const s = (await db.ref('settings').once('value')).val() || {};
  const settings = { ...DEFAULT_SETTINGS, ...s };
  CURRENCY = settings.currency || 'Rs.';
  return settings;
}

// ---------- Food photos ----------
// Menu items with a photo have  photo: <version>. The picture itself is in  photos/<itemId>.
// Phones keep downloaded photos, so they're only downloaded again when the admin changes them.
const photoMem = {};
const photoImg = (it, cls = '') => it.photo
  ? `<img class="${cls}" data-photo="${esc(it.id)}" data-v="${Number(it.photo)}" alt="" style="background:#f1e9e1">`
  : it.image ? `<img class="${cls}" src="${esc(it.image)}" alt="" loading="lazy" onerror="this.remove()">` : '';
async function fillPhotos(root = document) {
  for (const img of root.querySelectorAll('img[data-photo]:not([src])')) {
    const id = img.dataset.photo, v = img.dataset.v, key = 'ck_photo_' + id;
    let data = photoMem[id + v];
    if (!data) { try { const c = JSON.parse(localStorage.getItem(key) || 'null'); if (c && String(c.v) === v) data = c.d; } catch {} }
    if (!data) {
      try { data = (await db.ref('photos/' + id).once('value')).val(); } catch {}
      if (data) { try { localStorage.setItem(key, JSON.stringify({ v, d: data })); } catch { /* phone storage full: fine */ } }
    }
    if (data) { photoMem[id + v] = data; img.src = data; } else img.remove();
  }
}
// Turn a picked photo into a small square JPEG (about 20–40 KB)
async function compressPhoto(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Could not read that photo. Please use a JPG or PNG image.')); i.src = url; });
    const S = 360, c = document.createElement('canvas'); c.width = c.height = S;
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, S, S);
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, S, S);
    let q = 0.78, data = c.toDataURL('image/jpeg', q);
    while (data.length > 60000 && q > 0.4) { q -= 0.1; data = c.toDataURL('image/jpeg', q); }
    return data;
  } finally { URL.revokeObjectURL(url); }
}

function toast(msg, cls = '', ms = 3500) {
  let box = $('#toasts');
  if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
  const t = document.createElement('div');
  t.className = 'toast ' + cls; t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

// "ding-ding" alert sound (no sound file needed)
let audioCtx;
function ding() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    [0, 0.22].forEach((delay, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = i ? 1175 : 880;
      const t = audioCtx.currentTime + delay;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + 0.55);
    });
  } catch {}
}
function unlockAudio() { try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume(); } catch {} }

function openModal(html, onMount) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<div class="card modal">${html}</div>`;
  bg.addEventListener('mousedown', e => { if (e.target === bg) bg.remove(); });
  document.body.appendChild(bg);
  const close = () => bg.remove();
  onMount && onMount($('.modal', bg), close);
  return close;
}

function showSetupNeeded(root) {
  root.innerHTML = `<div class="login-wrap"><div class="card login">
    <div class="logo">${ic('settings', 34)}</div><h1>Almost ready</h1>
    <p class="muted">Open <b>config.js</b> in this site's folder and paste your Firebase settings (<b>apiKey</b>, <b>appId</b>, <b>databaseURL</b>). Then upload the site again.</p>
  </div></div>`;
}

// ---------- Staff logins (waiter + admin sites) ----------
const USERNAME_RE = /^[a-z0-9_.-]{3,30}$/;
const cleanUsername = u => String(u || '').trim().toLowerCase();
const newStaffEmail = u => `${cleanUsername(u)}.${Math.random().toString(36).slice(2, 7)}@${window.CK_STAFF_EMAIL_DOMAIN || 'staff.cloudkitchen.app'}`;
const waitForAuth = () => new Promise(res => { const off = auth.onAuthStateChanged(u => { off(); res(u); }); });

// Logged-in staff record (or null)
async function currentStaff(roles) {
  const user = auth.currentUser || await waitForAuth();
  if (!user) return null;
  try {
    const me = (await db.ref('staff/' + user.uid).once('value')).val();
    if (!me || !me.active || !roles.includes(me.role)) return null;
    return { uid: user.uid, ...me };
  } catch { return null; }
}

function renderLogin(root, { title, roles, onSuccess }) {
  root.innerHTML = `
  <div class="login-wrap"><form class="card login" autocomplete="on">
    <div class="logo"><img src="img/icon-192.png" alt="Cloud Kitchen" width="84" height="84"></div>
    <h1>${esc(title)}</h1>
    <p class="muted">Sign in to continue</p>
    <div class="field"><label>Username</label><input type="text" name="username" required autocomplete="username" autocapitalize="none"></div>
    <div class="field"><label>Password</label><input type="password" name="password" required autocomplete="current-password"></div>
    <div class="error"></div>
    <button class="btn block">Sign in</button>
  </form></div>`;
  const f = $('form', root);
  f.onsubmit = async e => {
    e.preventDefault(); unlockAudio();
    const btn = $('button.btn', f), err = $('.error', f);
    btn.disabled = true; err.textContent = '';
    try {
      const u = cleanUsername(f.username.value);
      const rec = USERNAME_RE.test(u) ? (await db.ref('usernames/' + u).once('value')).val() : null;
      if (!rec) throw Object.assign(new Error(), { code: 'auth/invalid-credential' });
      await auth.signInWithEmailAndPassword(rec.email, f.password.value);
      const me = await currentStaff(roles);
      if (!me) {
        await auth.signOut();
        throw new Error(roles.includes('waiter') ? 'This account is disabled or not a staff account' : 'This account is not an admin');
      }
      onSuccess(me);
    } catch (ex) { err.textContent = friendly(ex); btn.disabled = false; }
  };
  f.username.focus();
}
async function logout() { await auth.signOut(); location.reload(); }
