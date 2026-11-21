/* =========================================================
   Simple ERP — data stored in Supabase (see config.js)
   ========================================================= */
const KEY = 'simple-erp-v1';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Icons ---------- */
const ICONS = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  invoices: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/>',
  purchases: '<path d="M3 3h2l2.4 12h11.2L21 7H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
  products: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  customers: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M16 4a4 4 0 010 8M22 21c0-3-2-5-4-5.5"/>',
  suppliers: '<path d="M1 6h13v11H1zM14 10h4l4 4v3h-8z"/><circle cx="5" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  expenses: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  employees: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 18c1-2.5 3-3.5 5-3.5s4 1 5 3.5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  print: '<path d="M6 9V2h12v7"/><rect x="2" y="9" width="20" height="9" rx="2"/><path d="M6 14h12v8H6z"/>',
  trend: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
  wallet: '<path d="M20 7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16V7"/><circle cx="16" cy="14" r="1.5"/>',
  alert: '<path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  download: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
};
const ic = (n, s = 18) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;

/* ---------- Helpers ---------- */
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 10);
const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const today = () => iso(new Date());
const addDays = (s, n) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return iso(d); };
const fmtDate = (s) => s ? new Date(s + 'T00:00:00').toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
const money = (n) => `${db.settings.currency} ${num(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const moneyShort = (n) => {
  const a = Math.abs(n);
  const s = a >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : a >= 1e4 ? (n / 1e3).toFixed(1) + 'K' : num(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
  return `${db.settings.currency} ${s}`;
};
const initials = (name) => String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
const TONES = ['tone-indigo', 'tone-green', 'tone-amber', 'tone-blue', 'tone-red'];
const toneFor = (s) => TONES[[...String(s)].reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length];

/* ---------- Data ---------- */
function seed() {
  let r = 7;
  const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const t = today();

  const customers = [
    ['Gulf Trading LLC', 'info@gulftrading.com', '+971 50 123 4567', 'Dubai'],
    ['Al Noor Supermarket', 'orders@alnoor.com', '+971 55 222 3344', 'Sharjah'],
    ['Blue Sky Hotels', 'purchase@bluesky.com', '+971 52 987 6543', 'Abu Dhabi'],
    ['Crescent Catering', 'hello@crescent.co', '+971 56 765 4321', 'Ajman'],
    ['Metro Office Supplies', 'sales@metro-os.com', '+971 50 555 1212', 'Dubai'],
    ['Palm Café', 'palmcafe@mail.com', '+971 54 101 2020', 'Al Ain'],
  ].map(([name, email, phone, city]) => ({ id: uid(), name, email, phone, city, address: '' }));

  const suppliers = [
    ['Emirates Wholesale', 'Rashid K.', '+971 4 333 1000', 'Dubai'],
    ['Prime Packaging Co.', 'Sara M.', '+971 6 555 2000', 'Sharjah'],
    ['Fresh Farms Distribution', 'Omar A.', '+971 2 444 3000', 'Abu Dhabi'],
    ['TechSource Electronics', 'Lina H.', '+971 4 222 4000', 'Dubai'],
  ].map(([name, contact, phone, city]) => ({ id: uid(), name, contact, phone, city, email: '' }));

  const products = [
    ['P-1001', 'Basmati Rice 5kg', 'Groceries', 28, 39, 140, 30],
    ['P-1002', 'Sunflower Oil 1.8L', 'Groceries', 14, 21, 18, 25],
    ['P-1003', 'Paper Cups (100 pcs)', 'Packaging', 6, 11, 320, 50],
    ['P-1004', 'Takeaway Boxes (50 pcs)', 'Packaging', 18, 29, 64, 40],
    ['P-1005', 'Arabic Coffee 500g', 'Beverages', 22, 35, 9, 20],
    ['P-1006', 'Mineral Water 24x500ml', 'Beverages', 9, 15, 210, 60],
    ['P-1007', 'Thermal Printer Roll', 'Office', 2.5, 5, 480, 100],
    ['P-1008', 'POS Barcode Scanner', 'Electronics', 120, 189, 6, 5],
    ['P-1009', 'Kitchen Gloves (Box)', 'Supplies', 11, 18, 85, 30],
    ['P-1010', 'Dates Premium 1kg', 'Groceries', 24, 38, 12, 15],
  ].map(([sku, name, category, cost, price, stock, reorder]) => ({ id: uid(), sku, name, category, cost, price, stock, reorder, unit: 'pcs' }));

  const mkItems = (n, priceKey) => {
    const items = [];
    const used = new Set();
    for (let i = 0; i < n; i++) {
      let p = pick(products);
      if (used.has(p.id)) continue;
      used.add(p.id);
      const big = priceKey === 'cost' ? 60 : 40;
      items.push({ productId: p.id, qty: (p.price > 100 ? 1 : 10) + Math.floor(rnd() * (p.price > 100 ? 4 : big)), price: p[priceKey] });
    }
    return items;
  };

  const invoices = [];
  for (let i = 0; i < 42; i++) {
    const daysBack = Math.floor((41 - i) * 4.3 + rnd() * 3);
    const date = addDays(t, -daysBack);
    const due = addDays(date, 15);
    const paid = daysBack > 30 ? rnd() > 0.1 : rnd() > 0.55;
    invoices.push({
      id: uid(), number: `INV-${1001 + i}`, partyId: pick(customers).id, date, due,
      status: paid ? 'Paid' : 'Unpaid', tax: 5, items: mkItems(2 + Math.floor(rnd() * 3), 'price'), notes: '',
    });
  }

  const purchases = [];
  for (let i = 0; i < 8; i++) {
    const date = addDays(t, -Math.floor((7 - i) * 22 + rnd() * 5));
    purchases.push({
      id: uid(), number: `PO-${501 + i}`, partyId: pick(suppliers).id, date, due: addDays(date, 30),
      status: i >= 6 ? 'Ordered' : 'Received', tax: 5, items: mkItems(1 + Math.floor(rnd() * 3), 'cost'), notes: '',
    });
  }

  const expCats = [['Rent', 'Warehouse rent', 3500], ['Utilities', 'Electricity & water', 1200], ['Salaries', 'Monthly payroll', 7400], ['Transport', 'Delivery fuel', 900], ['Marketing', 'Social media ads', 1500]];
  const expenses = [];
  for (let m = 5; m >= 0; m--) {
    expCats.forEach(([category, description, amount], j) => {
      if (j > 2 && rnd() > 0.6) return;
      expenses.push({ id: uid(), date: addDays(t, -(m * 30 + j * 2 + 1)), category, description, amount: Math.round(amount * (0.85 + rnd() * 0.3)), method: pick(['Bank Transfer', 'Cash', 'Card']) });
    });
  }

  const employees = [
    ['Ahmed Hassan', 'General Manager', 'Management', 9500, 'Active'],
    ['Priya Nair', 'Accountant', 'Finance', 5200, 'Active'],
    ['John Mathew', 'Sales Executive', 'Sales', 4200, 'Active'],
    ['Fatima Ali', 'Store Keeper', 'Warehouse', 3200, 'Active'],
    ['Ravi Kumar', 'Delivery Driver', 'Logistics', 2800, 'On Leave'],
    ['Maria Santos', 'Cashier', 'Sales', 3000, 'Active'],
  ].map(([name, role, department, salary, status], i) => ({
    id: uid(), code: `EMP-${String(i + 1).padStart(3, '0')}`, name, role, department, salary, status,
    phone: `+971 5${i} 000 ${1000 + i * 111}`, joined: addDays(t, -(400 + i * 97)),
  }));

  return {
    settings: { company: 'My Company', address: 'Business Bay, Dubai, UAE', phone: '+971 4 000 0000', email: 'accounts@mycompany.com', trn: '', currency: 'AED', tax: 5 },
    customers, suppliers, products, invoices, purchases, expenses, employees,
  };
}

/* ---------- Supabase sync ----------
   The app works on the in-memory `db`. save() compares it with the last
   synced snapshot and sends only changed / deleted rows to Supabase. */
const sb = supabase.createClient(window.ERP_CONFIG.url, window.ERP_CONFIG.key);
const TABLES = ['customers', 'suppliers', 'products', 'employees', 'expenses', 'invoices', 'purchases']; // parents first
const DOC_COLS = ['id', 'number', 'party_id', 'date', 'due', 'status', 'tax', 'items', 'notes'];
const COLUMNS = {
  settings: ['company', 'address', 'phone', 'email', 'trn', 'currency', 'tax'],
  customers: ['id', 'name', 'email', 'phone', 'city', 'trn', 'address'],
  suppliers: ['id', 'name', 'contact', 'phone', 'email', 'city', 'address'],
  products: ['id', 'sku', 'name', 'category', 'cost', 'price', 'stock', 'reorder', 'unit'],
  employees: ['id', 'code', 'name', 'role', 'department', 'phone', 'salary', 'joined', 'status'],
  expenses: ['id', 'date', 'category', 'description', 'amount', 'method'],
  invoices: DOC_COLS,
  purchases: DOC_COLS,
};
const DATE_COLS = ['date', 'due', 'joined'];
const NUM_COLS = ['cost', 'price', 'stock', 'reorder', 'salary', 'amount', 'tax'];

const emptyDb = () => ({
  settings: { company: 'My Company', address: '', phone: '', email: '', trn: '', currency: 'AED', tax: 5 },
  customers: [], suppliers: [], products: [], invoices: [], purchases: [], expenses: [], employees: [],
});

function toRow(table, rec) {
  const row = {};
  for (const col of COLUMNS[table]) {
    let v = rec[col === 'party_id' ? 'partyId' : col];
    if (DATE_COLS.includes(col)) v = v || null;
    else if (NUM_COLS.includes(col)) v = num(v);
    else if (col === 'items') v = (v || []).map((it) => ({ productId: it.productId, qty: num(it.qty), price: num(it.price) }));
    else if (v === undefined || v === '') v = col === 'party_id' ? null : (v ?? '');
    row[col] = v;
  }
  return row;
}
function fromRow(row) {
  const rec = {};
  for (const [k, v] of Object.entries(row)) {
    if (k === 'created_at' || k === 'updated_at') continue;
    rec[k === 'party_id' ? 'partyId' : k] = v === null ? '' : v;
  }
  return rec;
}

let db = emptyDb();
let snap = null;          // last state known to be in the database
let saveChain = Promise.resolve();
let pendingSaves = 0;

function takeSnapshot() {
  snap = { settings: JSON.stringify(toRow('settings', db.settings)) };
  TABLES.forEach((t) => { snap[t] = new Map(db[t].map((r) => [r.id, JSON.stringify(toRow(t, r))])); });
}

async function loadAll() {
  const fresh = emptyDb();
  const s = await sb.from('settings').select('*').eq('id', 1).maybeSingle();
  if (s.error) throw s.error;
  if (s.data) { const r = fromRow(s.data); delete r.id; Object.assign(fresh.settings, r); }
  const results = await Promise.all(TABLES.map((t) => sb.from(t).select('*').order('created_at').limit(10000)));
  results.forEach((res, i) => { if (res.error) throw res.error; fresh[TABLES[i]] = res.data.map(fromRow); });
  db = fresh;
  takeSnapshot();
}

async function pushChanges() {
  if (!snap) return;
  // 1. deletes (children first)
  for (const t of [...TABLES].reverse()) {
    const ids = new Set(db[t].map((r) => r.id));
    const gone = [...snap[t].keys()].filter((id) => !ids.has(id));
    for (let i = 0; i < gone.length; i += 200) {
      const part = gone.slice(i, i + 200);
      const { error } = await sb.from(t).delete().in('id', part);
      if (error) throw error;
      part.forEach((id) => snap[t].delete(id));
    }
  }
  // 2. settings
  const s = JSON.stringify(toRow('settings', db.settings));
  if (s !== snap.settings) {
    const { error } = await sb.from('settings').upsert({ id: 1, ...JSON.parse(s), updated_at: new Date().toISOString() });
    if (error) throw error;
    snap.settings = s;
  }
  // 3. inserts / updates (parents first)
  for (const t of TABLES) {
    const changed = [];
    for (const r of db[t]) {
      const j = JSON.stringify(toRow(t, r));
      if (snap[t].get(r.id) !== j) changed.push(j);
    }
    for (let i = 0; i < changed.length; i += 500) {
      const part = changed.slice(i, i + 500);
      const { error } = await sb.from(t).upsert(part.map((j) => JSON.parse(j)));
      if (error) throw error;
      part.forEach((j) => snap[t].set(JSON.parse(j).id, j));
    }
  }
}

function setSync(state) {
  const el = $('#sync');
  if (!el) return;
  const map = {
    saving: ['b-amber', 'Saving…'],
    saved: ['b-green', 'All changes saved'],
    error: ['b-red', 'Not saved · Retry'],
  };
  el.className = `badge sync ${map[state][0]}`;
  el.textContent = map[state][1];
  el.dataset.state = state;
}

function save() {
  pendingSaves++;
  setSync('saving');
  saveChain = saveChain
    .then(pushChanges)
    .then(() => { if (--pendingSaves === 0) setSync('saved'); })
    .catch((err) => {
      pendingSaves = Math.max(0, pendingSaves - 1);
      console.error(err);
      setSync('error');
      toast(`Database save failed: ${err.message || err}`, true);
    });
  return saveChain;
}
window.addEventListener('beforeunload', (e) => { if (pendingSaves > 0 || $('#sync')?.dataset.state === 'error') { e.preventDefault(); e.returnValue = ''; } });

const find = (type, id) => db[type].find((x) => x.id === id);
const partyName = (type, id) => (find(type === 'invoices' ? 'customers' : 'suppliers', id) || {}).name || '— deleted —';
const docTotals = (doc) => {
  const sub = doc.items.reduce((a, it) => a + num(it.qty) * num(it.price), 0);
  const tax = sub * num(doc.tax) / 100;
  return { sub, tax, total: sub + tax };
};
const invStatus = (inv) => inv.status === 'Paid' ? 'Paid' : (inv.due && inv.due < today() ? 'Overdue' : 'Unpaid');
const statusBadge = (s) => {
  const map = { Paid: 'b-green', Unpaid: 'b-amber', Overdue: 'b-red', Received: 'b-green', Ordered: 'b-blue', Cancelled: 'b-gray', Active: 'b-green', 'On Leave': 'b-amber', Inactive: 'b-gray', 'In stock': 'b-green', 'Low stock': 'b-amber', 'Out of stock': 'b-red' };
  return `<span class="badge ${map[s] || 'b-gray'}">${esc(s)}</span>`;
};
const stockStatus = (p) => num(p.stock) <= 0 ? 'Out of stock' : num(p.stock) <= num(p.reorder) ? 'Low stock' : 'In stock';
function nextNumber(type) {
  const prefix = type === 'invoices' ? 'INV-' : 'PO-';
  const base = type === 'invoices' ? 1000 : 500;
  const max = db[type].reduce((m, d) => Math.max(m, parseInt(String(d.number).replace(/\D/g, '')) || 0), base);
  return prefix + (max + 1);
}
// Invoices reduce stock; received purchase orders add stock.
function applyStock(type, doc, dir) {
  const factor = type === 'invoices' ? -1 : (doc.status === 'Received' ? 1 : 0);
  if (!factor) return;
  doc.items.forEach((it) => { const p = find('products', it.productId); if (p) p.stock = num(p.stock) + factor * num(it.qty) * dir; });
}

/* ---------- Toast / Modal ---------- */
function toast(msg, err) {
  const el = document.createElement('div');
  el.className = 'toast' + (err ? ' err' : '');
  el.innerHTML = (err ? ic('alert', 16) : ic('check', 16)) + esc(msg);
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

let modalSave = null;
function openModal({ title, body, size = '', saveLabel = 'Save', onSave = null, footer = null }) {
  const m = $('#modal');
  m.className = 'modal ' + size;
  m.innerHTML = `
    <div class="modal-head"><h2>${esc(title)}</h2><button class="icon-btn" data-close aria-label="Close">${ic('x')}</button></div>
    <div class="modal-body">${body}</div>
    <div class="modal-foot">${footer ?? `<button class="btn" data-close>Cancel</button>${onSave ? `<button class="btn primary" data-save>${esc(saveLabel)}</button>` : ''}`}</div>`;
  modalSave = onSave;
  $('#modalWrap').classList.add('open');
  const first = m.querySelector('.modal-body input, .modal-body select');
  if (first) setTimeout(() => first.focus(), 30);
}
function closeModal() { $('#modalWrap').classList.remove('open'); modalSave = null; document.body.classList.remove('printing'); }
function confirmBox(title, text, onYes, label = 'Delete') {
  openModal({
    title, body: `<p style="margin:0;color:var(--muted);line-height:1.6">${text}</p>`,
    footer: `<button class="btn" data-close>Cancel</button><button class="btn primary" style="background:var(--red);border-color:var(--red)" data-yes>${esc(label)}</button>`,
  });
  $('#modal [data-yes]').onclick = () => { onYes(); closeModal(); };
}

$('#modalWrap').addEventListener('click', (e) => {
  if (e.target.id === 'modalWrap' || e.target.closest('[data-close]')) closeModal();
  else if (e.target.closest('[data-save]') && modalSave) { if (modalSave() !== false) closeModal(); }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && $('#modalWrap').classList.contains('open')) closeModal();
});

/* ---------- Generic form ---------- */
function fieldHtml(f, val) {
  const req = f.req ? ' <span class="req">*</span>' : '';
  const v = val ?? f.default ?? '';
  let input;
  if (f.type === 'select') {
    const opts = typeof f.options === 'function' ? f.options() : f.options;
    input = `<select name="${f.k}">${opts.map((o) => `<option ${String(o) === String(v) ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  } else if (f.type === 'textarea') {
    input = `<textarea name="${f.k}">${esc(v)}</textarea>`;
  } else {
    input = `<input name="${f.k}" type="${f.type || 'text'}" value="${esc(v)}" ${f.type === 'number' ? 'step="any" min="0"' : ''} placeholder="${esc(f.ph || '')}" />`;
  }
  return `<div class="field ${f.full ? 'full' : ''}"><label>${esc(f.l)}${req}</label>${input}</div>`;
}
function readForm(fields) {
  const out = {}; let ok = true;
  fields.forEach((f) => {
    const el = $(`#modal [name="${f.k}"]`);
    const wrap = el.closest('.field');
    let v = el.value.trim();
    if (f.req && !v) { wrap.classList.add('invalid'); ok = false; } else wrap.classList.remove('invalid');
    out[f.k] = f.type === 'number' ? num(v) : v;
  });
  if (!ok) toast('Please fill the required fields', true);
  return ok ? out : null;
}

/* ---------- Entity configs ---------- */
const personCell = (name, sub) => `<div class="person"><div class="initials ${toneFor(name)}">${esc(initials(name))}</div><div><div class="cell-main">${esc(name)}</div>${sub ? `<div class="cell-sub">${esc(sub)}</div>` : ''}</div></div>`;
const customerBilled = (id) => db.invoices.filter((i) => i.partyId === id).reduce((a, i) => a + docTotals(i).total, 0);

const CFG = {
  customers: {
    title: 'Customers', one: 'Customer', icon: 'customers',
    fields: [
      { k: 'name', l: 'Customer name', req: true, full: true },
      { k: 'email', l: 'Email', type: 'email' },
      { k: 'phone', l: 'Phone' },
      { k: 'city', l: 'City' },
      { k: 'trn', l: 'Tax / TRN No.' },
      { k: 'address', l: 'Address', type: 'textarea', full: true },
    ],
    cols: [
      { l: 'Customer', v: (r) => personCell(r.name, r.email) },
      { l: 'Phone', v: (r) => esc(r.phone || '—') },
      { l: 'City', v: (r) => esc(r.city || '—') },
      { l: 'Invoices', cls: 'num', v: (r) => db.invoices.filter((i) => i.partyId === r.id).length },
      { l: 'Total billed', cls: 'num', v: (r) => `<b>${money(customerBilled(r.id))}</b>` },
    ],
  },
  suppliers: {
    title: 'Suppliers', one: 'Supplier', icon: 'suppliers',
    fields: [
      { k: 'name', l: 'Supplier name', req: true, full: true },
      { k: 'contact', l: 'Contact person' },
      { k: 'phone', l: 'Phone' },
      { k: 'email', l: 'Email', type: 'email' },
      { k: 'city', l: 'City' },
      { k: 'address', l: 'Address', type: 'textarea', full: true },
    ],
    cols: [
      { l: 'Supplier', v: (r) => personCell(r.name, r.email) },
      { l: 'Contact', v: (r) => esc(r.contact || '—') },
      { l: 'Phone', v: (r) => esc(r.phone || '—') },
      { l: 'City', v: (r) => esc(r.city || '—') },
      { l: 'Purchases', cls: 'num', v: (r) => `<b>${money(db.purchases.filter((p) => p.partyId === r.id).reduce((a, p) => a + docTotals(p).total, 0))}</b>` },
    ],
  },
  products: {
    title: 'Products & Inventory', one: 'Product', icon: 'products',
    filters: ['All', 'In stock', 'Low stock', 'Out of stock'],
    filterFn: (r, f) => f === 'All' || stockStatus(r) === f,
    fields: [
      { k: 'name', l: 'Product name', req: true, full: true },
      { k: 'sku', l: 'SKU / Code', req: true },
      { k: 'category', l: 'Category', ph: 'e.g. Groceries' },
      { k: 'cost', l: 'Cost price', type: 'number', req: true },
      { k: 'price', l: 'Selling price', type: 'number', req: true },
      { k: 'stock', l: 'Stock on hand', type: 'number', default: 0 },
      { k: 'reorder', l: 'Reorder level', type: 'number', default: 10 },
      { k: 'unit', l: 'Unit', type: 'select', options: ['pcs', 'box', 'kg', 'ltr', 'pack', 'set'] },
    ],
    cols: [
      { l: 'Product', v: (r) => `<div class="cell-main">${esc(r.name)}</div><div class="cell-sub mono">${esc(r.sku)}</div>` },
      { l: 'Category', v: (r) => esc(r.category || '—') },
      { l: 'Cost', cls: 'num', v: (r) => money(r.cost) },
      { l: 'Price', cls: 'num', v: (r) => `<b>${money(r.price)}</b>` },
      { l: 'Stock', cls: 'num', v: (r) => `<b>${num(r.stock).toLocaleString()}</b> <span class="cell-sub">${esc(r.unit || '')}</span>` },
      { l: 'Status', v: (r) => statusBadge(stockStatus(r)) },
    ],
  },
  expenses: {
    title: 'Expenses', one: 'Expense', icon: 'expenses', sort: (a, b) => b.date.localeCompare(a.date),
    fields: [
      { k: 'date', l: 'Date', type: 'date', req: true, default: today() },
      { k: 'category', l: 'Category', type: 'select', options: ['Rent', 'Utilities', 'Salaries', 'Transport', 'Marketing', 'Maintenance', 'Office', 'Other'] },
      { k: 'description', l: 'Description', req: true, full: true },
      { k: 'amount', l: 'Amount', type: 'number', req: true },
      { k: 'method', l: 'Paid via', type: 'select', options: ['Bank Transfer', 'Cash', 'Card', 'Cheque'] },
    ],
    cols: [
      { l: 'Date', v: (r) => fmtDate(r.date) },
      { l: 'Description', v: (r) => `<div class="cell-main">${esc(r.description)}</div>` },
      { l: 'Category', v: (r) => `<span class="badge b-gray">${esc(r.category)}</span>` },
      { l: 'Paid via', v: (r) => esc(r.method) },
      { l: 'Amount', cls: 'num', v: (r) => `<b>${money(r.amount)}</b>` },
    ],
  },
  employees: {
    title: 'Employees', one: 'Employee', icon: 'employees',
    filters: ['All', 'Active', 'On Leave', 'Inactive'],
    filterFn: (r, f) => f === 'All' || r.status === f,
    fields: [
      { k: 'name', l: 'Full name', req: true, full: true },
      { k: 'code', l: 'Employee ID', req: true },
      { k: 'role', l: 'Job title', req: true },
      { k: 'department', l: 'Department', type: 'select', options: ['Management', 'Finance', 'Sales', 'Warehouse', 'Logistics', 'HR', 'Operations'] },
      { k: 'phone', l: 'Phone' },
      { k: 'salary', l: 'Monthly salary', type: 'number' },
      { k: 'joined', l: 'Joining date', type: 'date', default: today() },
      { k: 'status', l: 'Status', type: 'select', options: ['Active', 'On Leave', 'Inactive'] },
    ],
    cols: [
      { l: 'Employee', v: (r) => personCell(r.name, r.role) },
      { l: 'ID', v: (r) => `<span class="mono">${esc(r.code)}</span>` },
      { l: 'Department', v: (r) => esc(r.department) },
      { l: 'Phone', v: (r) => esc(r.phone || '—') },
      { l: 'Joined', v: (r) => fmtDate(r.joined) },
      { l: 'Salary', cls: 'num', v: (r) => money(r.salary) },
      { l: 'Status', v: (r) => statusBadge(r.status) },
    ],
  },
  invoices: {
    title: 'Sales Invoices', one: 'Invoice', icon: 'invoices', doc: true, view: true,
    sort: (a, b) => b.date.localeCompare(a.date) || b.number.localeCompare(a.number),
    filters: ['All', 'Paid', 'Unpaid', 'Overdue'],
    filterFn: (r, f) => f === 'All' || invStatus(r) === f,
    searchText: (r) => `${r.number} ${partyName('invoices', r.partyId)}`,
    cols: [
      { l: 'Invoice', v: (r) => `<span class="cell-main">${esc(r.number)}</span>` },
      { l: 'Customer', v: (r) => esc(partyName('invoices', r.partyId)) },
      { l: 'Date', v: (r) => fmtDate(r.date) },
      { l: 'Due', v: (r) => fmtDate(r.due) },
      { l: 'Amount', cls: 'num', v: (r) => `<b>${money(docTotals(r).total)}</b>` },
      { l: 'Status', v: (r) => statusBadge(invStatus(r)) },
    ],
  },
  purchases: {
    title: 'Purchase Orders', one: 'Purchase Order', icon: 'purchases', doc: true, view: true,
    sort: (a, b) => b.date.localeCompare(a.date) || b.number.localeCompare(a.number),
    filters: ['All', 'Ordered', 'Received', 'Cancelled'],
    filterFn: (r, f) => f === 'All' || r.status === f,
    searchText: (r) => `${r.number} ${partyName('purchases', r.partyId)}`,
    cols: [
      { l: 'PO No.', v: (r) => `<span class="cell-main">${esc(r.number)}</span>` },
      { l: 'Supplier', v: (r) => esc(partyName('purchases', r.partyId)) },
      { l: 'Date', v: (r) => fmtDate(r.date) },
      { l: 'Items', cls: 'num', v: (r) => r.items.length },
      { l: 'Amount', cls: 'num', v: (r) => `<b>${money(docTotals(r).total)}</b>` },
      { l: 'Status', v: (r) => statusBadge(r.status) },
    ],
  },
};

/* ---------- Navigation ---------- */
const NAV = [
  { group: 'Overview', items: [['dashboard', 'Dashboard']] },
  { group: 'Sales', items: [['invoices', 'Invoices'], ['customers', 'Customers']] },
  { group: 'Purchasing', items: [['purchases', 'Purchase Orders'], ['suppliers', 'Suppliers']] },
  { group: 'Operations', items: [['products', 'Inventory'], ['expenses', 'Expenses'], ['employees', 'Employees']] },
  { group: 'System', items: [['settings', 'Settings']] },
];
const state = { search: {}, filter: {} };

function renderNav(route) {
  $('#nav').innerHTML = NAV.map((g) => `<div class="nav-label">${g.group}</div>` + g.items.map(([k, l]) => {
    const count = Array.isArray(db[k]) ? `<span class="count">${db[k].length}</span>` : '';
    return `<a href="#/${k}" class="${route === k ? 'active' : ''}">${ic(k)}<span>${l}</span>${count}</a>`;
  }).join('')).join('');
}
function renderBrand() {
  $('#brandName').textContent = db.settings.company || 'My Company';
  $('#brandLogo').textContent = initials(db.settings.company || 'E').slice(0, 1) || 'E';
  $('#userAvatar').textContent = initials(db.settings.company || 'A').slice(0, 2);
  document.title = `${db.settings.company} · ERP`;
}

function route() {
  const r = (location.hash.replace('#/', '') || 'dashboard').split('?')[0];
  const key = r === 'dashboard' || r === 'settings' || CFG[r] ? r : 'dashboard';
  renderNav(key);
  renderBrand();
  closeSidebar();
  if (key === 'dashboard') return renderDashboard();
  if (key === 'settings') return renderSettings();
  renderList(key);
}

function setHeader(title, sub) { $('#pageTitle').textContent = title; $('#pageSub').textContent = sub || ''; }

/* ---------- Dashboard ---------- */
function renderDashboard() {
  setHeader('Dashboard', `Welcome back — here's how ${db.settings.company} is doing`);
  const t = today();
  const monthKey = t.slice(0, 7);
  const sales = db.invoices.reduce((a, i) => a + docTotals(i).total, 0);
  const salesMonth = db.invoices.filter((i) => i.date.startsWith(monthKey)).reduce((a, i) => a + docTotals(i).total, 0);
  const receivable = db.invoices.filter((i) => i.status !== 'Paid').reduce((a, i) => a + docTotals(i).total, 0);
  const overdue = db.invoices.filter((i) => invStatus(i) === 'Overdue');
  const purchaseCost = db.purchases.filter((p) => p.status === 'Received').reduce((a, p) => a + docTotals(p).total, 0);
  const expenseTotal = db.expenses.reduce((a, e) => a + num(e.amount), 0);
  const low = db.products.filter((p) => stockStatus(p) !== 'In stock');
  const stockValue = db.products.reduce((a, p) => a + num(p.stock) * num(p.cost), 0);

  // last 6 months
  const months = [];
  const d = new Date(t + 'T00:00:00'); d.setDate(1);
  for (let i = 5; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
    const k = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`;
    const s = db.invoices.filter((x) => x.date.startsWith(k)).reduce((a, x) => a + docTotals(x).total, 0);
    const e = db.expenses.filter((x) => x.date.startsWith(k)).reduce((a, x) => a + num(x.amount), 0)
      + db.purchases.filter((x) => x.status === 'Received' && x.date.startsWith(k)).reduce((a, x) => a + docTotals(x).total, 0);
    months.push({ label: m.toLocaleDateString(undefined, { month: 'short' }), s, e });
  }
  const maxV = Math.max(1, ...months.flatMap((m) => [m.s, m.e]));

  const recent = [...db.invoices].sort(CFG.invoices.sort).slice(0, 6);

  // top products by sold value
  const sold = {};
  db.invoices.forEach((i) => i.items.forEach((it) => { sold[it.productId] = (sold[it.productId] || 0) + num(it.qty) * num(it.price); }));
  const top = Object.entries(sold).map(([id, v]) => ({ p: find('products', id), v })).filter((x) => x.p).sort((a, b) => b.v - a.v).slice(0, 5);
  const topMax = Math.max(1, ...top.map((x) => x.v));

  const kpi = (label, value, note, icon, tone) => `
    <div class="card kpi"><div class="kpi-top"><span class="kpi-label">${label}</span><span class="kpi-icon ${tone}">${ic(icon)}</span></div>
    <div class="kpi-value">${value}</div><div class="kpi-note">${note}</div></div>`;

  const isEmpty = TABLES.every((t) => !db[t].length);
  $('#content').innerHTML = `
    ${isEmpty ? `<div class="card welcome">
      <div><h3>Your database is ready 🎉</h3><p>Start by adding your products and customers, or load sample data to explore.</p></div>
      <div class="right"><button class="btn" id="welcomeDemo">Load sample data</button><a class="btn primary" href="#/products">${ic('plus', 16)} Add first product</a></div>
    </div>` : ''}
    <div class="kpis">
      ${kpi('Total Sales', moneyShort(sales), `${moneyShort(salesMonth)} this month`, 'trend', 'tone-indigo')}
      ${kpi('Receivables', moneyShort(receivable), `${overdue.length} overdue invoice${overdue.length === 1 ? '' : 's'}`, 'clock', 'tone-amber')}
      ${kpi('Expenses & Purchases', moneyShort(expenseTotal + purchaseCost), `Net: ${moneyShort(sales - expenseTotal - purchaseCost)}`, 'wallet', 'tone-green')}
      ${kpi('Stock Alerts', low.length, `Stock value ${moneyShort(stockValue)}`, 'alert', low.length ? 'tone-red' : 'tone-green')}
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-head"><div><h3>Sales vs Expenses</h3><div class="sub">Last 6 months</div></div>
          <div class="right legend"><span><i style="background:var(--primary)"></i>Sales</span><span><i style="background:#c7d2fe"></i>Expenses</span></div></div>
        <div class="card-body">
          <div class="chart">${months.map((m) => `
            <div class="chart-col">
              <div class="chart-bars">
                <div class="bar s" style="height:${(m.s / maxV) * 100}%" title="Sales ${money(m.s)}"></div>
                <div class="bar e" style="height:${(m.e / maxV) * 100}%" title="Expenses ${money(m.e)}"></div>
              </div>
              <div class="chart-x">${m.label}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><div><h3>Low Stock</h3><div class="sub">At or below reorder level</div></div><div class="right"><a class="btn sm" href="#/products">View all</a></div></div>
        <div class="card-body" style="padding-top:6px;padding-bottom:6px">
          ${low.length ? low.slice(0, 6).map((p) => `
            <div class="list-row">
              <div class="grow"><div class="cell-main">${esc(p.name)}</div><div class="cell-sub">Reorder at ${p.reorder} · ${esc(p.sku)}</div></div>
              <div style="text-align:right"><b>${num(p.stock)}</b> <span class="cell-sub">${esc(p.unit || '')}</span><div style="margin-top:4px">${statusBadge(stockStatus(p))}</div></div>
            </div>`).join('') : `<div class="empty"><b>All stocked up</b>No products need reordering.</div>`}
        </div>
      </div>
    </div>

    <div class="grid-2b">
      <div class="card">
        <div class="card-head"><div><h3>Recent Invoices</h3></div><div class="right"><a class="btn sm" href="#/invoices">View all</a></div></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Invoice</th><th>Customer</th><th class="num">Amount</th><th>Status</th></tr></thead>
          <tbody>${recent.map((i) => `<tr style="cursor:pointer" data-view-inv="${i.id}">
            <td><div class="cell-main">${esc(i.number)}</div><div class="cell-sub">${fmtDate(i.date)}</div></td>
            <td>${esc(partyName('invoices', i.partyId))}</td>
            <td class="num"><b>${money(docTotals(i).total)}</b></td><td>${statusBadge(invStatus(i))}</td></tr>`).join('')}
          </tbody></table></div>
      </div>
      <div class="card">
        <div class="card-head"><div><h3>Top Selling Products</h3><div class="sub">By sales value</div></div></div>
        <div class="card-body" style="padding-top:6px">
          ${top.length ? top.map((x, i) => `
            <div class="list-row">
              <div class="initials ${TONES[i % TONES.length]}" style="border-radius:10px">${i + 1}</div>
              <div class="grow"><div style="display:flex;justify-content:space-between;gap:10px"><span class="cell-main">${esc(x.p.name)}</span><b>${moneyShort(x.v)}</b></div>
              <div class="progress"><div style="width:${(x.v / topMax) * 100}%;background:var(--primary)"></div></div></div>
            </div>`).join('') : '<div class="empty">No sales yet.</div>'}
        </div>
      </div>
    </div>`;

  $$('[data-view-inv]').forEach((tr) => tr.onclick = () => viewDoc('invoices', tr.dataset.viewInv));
  const wd = $('#welcomeDemo');
  if (wd) wd.onclick = () => { const d = seed(); d.settings = db.settings; replaceAll(d); toast('Sample data loaded'); };
}

/* ---------- Generic list ---------- */
function renderList(type) {
  const cfg = CFG[type];
  setHeader(cfg.title, `${db[type].length} record${db[type].length === 1 ? '' : 's'}`);
  const f = state.filter[type] || 'All';
  $('#content').innerHTML = `
    <div class="toolbar">
      <label class="search">${ic('search', 16)}<input id="q" placeholder="Search ${cfg.title.toLowerCase()}…" value="${esc(state.search[type] || '')}" /></label>
      ${cfg.filters ? `<div class="chips">${cfg.filters.map((x) => `<button class="chip ${x === f ? 'active' : ''}" data-filter="${x}">${x}</button>`).join('')}</div>` : ''}
      <div class="spacer"></div>
      <button class="btn primary" id="addBtn">${ic('plus', 16)} New ${cfg.one}</button>
    </div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr>${cfg.cols.map((c) => `<th class="${c.cls || ''}">${c.l}</th>`).join('')}<th></th></tr></thead>
      <tbody id="tbody"></tbody>
    </table></div></div>`;

  const fill = () => {
    const q = (state.search[type] || '').toLowerCase();
    const fl = state.filter[type] || 'All';
    let rows = db[type].filter((r) => (cfg.searchText ? cfg.searchText(r) : Object.values(r).join(' ')).toLowerCase().includes(q));
    if (cfg.filterFn) rows = rows.filter((r) => cfg.filterFn(r, fl));
    if (cfg.sort) rows = [...rows].sort(cfg.sort);
    $('#tbody').innerHTML = rows.length ? rows.map((r) => `<tr>
      ${cfg.cols.map((c) => `<td class="${c.cls || ''}">${c.v(r)}</td>`).join('')}
      <td class="actions">
        ${cfg.view ? `<button class="icon-btn" title="View" data-act="view" data-id="${r.id}">${ic('eye', 17)}</button>` : ''}
        <button class="icon-btn" title="Edit" data-act="edit" data-id="${r.id}">${ic('edit', 17)}</button>
        <button class="icon-btn del" title="Delete" data-act="del" data-id="${r.id}">${ic('trash', 17)}</button>
      </td></tr>`).join('')
      : `<tr><td colspan="${cfg.cols.length + 1}"><div class="empty"><b>No ${cfg.title.toLowerCase()} found</b>${q || fl !== 'All' ? 'Try a different search or filter.' : `Click “New ${cfg.one}” to add your first one.`}</div></td></tr>`;
  };
  fill();

  $('#q').oninput = (e) => { state.search[type] = e.target.value; fill(); };
  $$('[data-filter]').forEach((b) => b.onclick = () => { state.filter[type] = b.dataset.filter; renderList(type); });
  $('#addBtn').onclick = () => cfg.doc ? docForm(type) : entityForm(type);
  $('#tbody').onclick = (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const id = b.dataset.id;
    if (b.dataset.act === 'edit') cfg.doc ? docForm(type, id) : entityForm(type, id);
    if (b.dataset.act === 'view') viewDoc(type, id);
    if (b.dataset.act === 'del') deleteRecord(type, id);
  };
}

function entityForm(type, id) {
  const cfg = CFG[type];
  const rec = id ? find(type, id) : null;
  openModal({
    title: `${rec ? 'Edit' : 'New'} ${cfg.one}`,
    body: `<div class="form-grid">${cfg.fields.map((f) => fieldHtml(f, rec ? rec[f.k] : undefined)).join('')}</div>`,
    saveLabel: rec ? 'Save changes' : `Add ${cfg.one}`,
    onSave: () => {
      const data = readForm(cfg.fields);
      if (!data) return false;
      if (rec) Object.assign(rec, data); else db[type].push({ id: uid(), ...data });
      save(); route();
      toast(`${cfg.one} ${rec ? 'updated' : 'added'}`);
    },
  });
}

function deleteRecord(type, id) {
  const cfg = CFG[type];
  const rec = find(type, id);
  const label = rec.number || rec.name || rec.description || cfg.one;
  let warn = '';
  if (type === 'customers' && db.invoices.some((i) => i.partyId === id)) warn = '<br><br>This customer has invoices — they will show as “deleted”.';
  if (type === 'suppliers' && db.purchases.some((i) => i.partyId === id)) warn = '<br><br>This supplier has purchase orders — they will show as “deleted”.';
  if (type === 'invoices') warn = '<br><br>Stock for the items on this invoice will be returned to inventory.';
  if (type === 'purchases' && rec.status === 'Received') warn = '<br><br>Stock received on this order will be removed from inventory.';
  confirmBox(`Delete ${cfg.one.toLowerCase()}?`, `<b>${esc(label)}</b> will be permanently removed.${warn}`, () => {
    if (cfg.doc) applyStock(type, rec, -1);
    db[type] = db[type].filter((x) => x.id !== id);
    save(); route(); toast(`${cfg.one} deleted`);
  });
}

/* ---------- Invoice / PO form ---------- */
function docForm(type, id) {
  const isInv = type === 'invoices';
  const existing = id ? find(type, id) : null;
  const parties = isInv ? db.customers : db.suppliers;
  if (!parties.length) return toast(`Add a ${isInv ? 'customer' : 'supplier'} first`, true);
  if (!db.products.length) return toast('Add a product first', true);

  const doc = existing ? JSON.parse(JSON.stringify(existing)) : {
    number: nextNumber(type), partyId: '', date: today(), due: addDays(today(), isInv ? 15 : 30),
    status: isInv ? 'Unpaid' : 'Ordered', tax: db.settings.tax, items: [{ productId: '', qty: 1, price: 0 }], notes: '',
  };
  const statuses = isInv ? ['Unpaid', 'Paid'] : ['Ordered', 'Received', 'Cancelled'];

  openModal({
    title: `${existing ? 'Edit' : 'New'} ${CFG[type].one}`, size: 'lg',
    saveLabel: existing ? 'Save changes' : `Create ${isInv ? 'invoice' : 'order'}`,
    body: `
      <div class="form-grid" style="grid-template-columns:repeat(4,minmax(0,1fr))">
        <div class="field" style="grid-column:span 2"><label>${isInv ? 'Customer' : 'Supplier'} <span class="req">*</span></label>
          <select name="partyId"><option value="">Select ${isInv ? 'customer' : 'supplier'}…</option>${parties.map((p) => `<option value="${p.id}" ${p.id === doc.partyId ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select></div>
        <div class="field"><label>${isInv ? 'Invoice' : 'PO'} No.</label><input name="number" value="${esc(doc.number)}" /></div>
        <div class="field"><label>Status</label><select name="status">${statuses.map((s) => `<option ${s === doc.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
        <div class="field"><label>Date</label><input type="date" name="date" value="${doc.date}" /></div>
        <div class="field"><label>${isInv ? 'Due date' : 'Expected by'}</label><input type="date" name="due" value="${doc.due}" /></div>
      </div>
      <div class="items">
        <table>
          <thead><tr><th style="width:44%">Item</th><th class="num" style="width:14%">Qty</th><th class="num" style="width:18%">${isInv ? 'Price' : 'Cost'}</th><th class="num">Total</th><th></th></tr></thead>
          <tbody id="itemRows"></tbody>
        </table>
        <div class="items-foot">
          <div style="display:flex;flex-direction:column;gap:10px;flex:1;max-width:380px">
            <button class="btn sm" id="addItem" style="align-self:flex-start">${ic('plus', 15)} Add line</button>
            <div class="field"><label>Notes</label><textarea name="notes" placeholder="Payment terms, delivery notes…">${esc(doc.notes)}</textarea></div>
          </div>
          <div class="totals" id="totals"></div>
        </div>
      </div>
      ${!isInv ? '<p class="cell-sub" style="margin:12px 2px 0">Stock is added to inventory when the order status is set to <b>Received</b>.</p>' : '<p class="cell-sub" style="margin:12px 2px 0">Items on this invoice are deducted from inventory.</p>'}`,
    onSave: () => {
      doc.partyId = $('#modal [name=partyId]').value;
      doc.number = $('#modal [name=number]').value.trim() || nextNumber(type);
      doc.status = $('#modal [name=status]').value;
      doc.date = $('#modal [name=date]').value || today();
      doc.due = $('#modal [name=due]').value;
      doc.notes = $('#modal [name=notes]').value;
      doc.items = doc.items.filter((it) => it.productId && num(it.qty) > 0).map((it) => ({ ...it, qty: num(it.qty), price: num(it.price) }));
      if (!doc.partyId) { $('#modal [name=partyId]').closest('.field').classList.add('invalid'); toast(`Select a ${isInv ? 'customer' : 'supplier'}`, true); return false; }
      if (!doc.items.length) { toast('Add at least one item', true); if (!doc.items.length) doc.items.push({ productId: '', qty: 1, price: 0 }); renderRows(); return false; }
      if (db[type].some((d) => d.number === doc.number && d.id !== doc.id)) { toast(`Number ${doc.number} already exists`, true); return false; }

      if (existing) { applyStock(type, existing, -1); Object.assign(existing, doc); applyStock(type, existing, 1); }
      else { doc.id = uid(); db[type].push(doc); applyStock(type, doc, 1); }
      save(); route();
      toast(`${CFG[type].one} ${existing ? 'updated' : 'created'}`);
    },
  });

  const productOpts = (sel) => `<option value="">Select product…</option>` + db.products.map((p) =>
    `<option value="${p.id}" ${p.id === sel ? 'selected' : ''}>${esc(p.name)} · ${esc(p.sku)}${isInv ? ` (${num(p.stock)} in stock)` : ''}</option>`).join('');

  function renderTotals() {
    const t = docTotals(doc);
    $('#totals').innerHTML = `
      <div class="row"><span>Subtotal</span><span>${money(t.sub)}</span></div>
      <div class="row" style="align-items:center"><span>Tax <input class="input tax-input" id="taxIn" type="number" min="0" step="any" value="${doc.tax}" /> %</span><span>${money(t.tax)}</span></div>
      <div class="row grand"><span>Total</span><span>${money(t.total)}</span></div>`;
    $('#taxIn').oninput = (e) => { doc.tax = num(e.target.value); const tt = docTotals(doc); const rows = $$('#totals .row span:last-child'); rows[0].textContent = money(tt.sub); rows[1].textContent = money(tt.tax); rows[2].textContent = money(tt.total); };
  }
  function renderRows() {
    $('#itemRows').innerHTML = doc.items.map((it, i) => `<tr data-i="${i}">
      <td><select class="input" data-k="productId">${productOpts(it.productId)}</select></td>
      <td><input class="input" style="text-align:right" type="number" min="0" step="any" data-k="qty" value="${it.qty}" /></td>
      <td><input class="input" style="text-align:right" type="number" min="0" step="any" data-k="price" value="${it.price}" /></td>
      <td class="num" data-line><b>${money(num(it.qty) * num(it.price))}</b></td>
      <td class="actions"><button class="icon-btn del" data-rm title="Remove">${ic('trash', 16)}</button></td></tr>`).join('');
    renderTotals();
  }
  renderRows();

  const rowsEl = $('#itemRows');
  rowsEl.addEventListener('input', (e) => {
    const tr = e.target.closest('tr'); const i = +tr.dataset.i; const k = e.target.dataset.k;
    if (!k) return;
    doc.items[i][k] = e.target.value;
    if (k === 'productId') {
      const p = find('products', e.target.value);
      doc.items[i].price = p ? (isInv ? p.price : p.cost) : 0;
      $('[data-k=price]', tr).value = doc.items[i].price;
    }
    $('[data-line]', tr).innerHTML = `<b>${money(num(doc.items[i].qty) * num(doc.items[i].price))}</b>`;
    renderTotals();
  });
  rowsEl.addEventListener('click', (e) => {
    if (!e.target.closest('[data-rm]')) return;
    const i = +e.target.closest('tr').dataset.i;
    doc.items.splice(i, 1);
    if (!doc.items.length) doc.items.push({ productId: '', qty: 1, price: 0 });
    renderRows();
  });
  $('#addItem').onclick = () => { doc.items.push({ productId: '', qty: 1, price: 0 }); renderRows(); };
}

/* ---------- Invoice / PO view & print ---------- */
function viewDoc(type, id) {
  const isInv = type === 'invoices';
  const doc = find(type, id);
  const party = find(isInv ? 'customers' : 'suppliers', doc.partyId) || { name: '— deleted —' };
  const t = docTotals(doc);
  const s = db.settings;
  const status = isInv ? invStatus(doc) : doc.status;
  const markBtn = isInv && doc.status !== 'Paid' ? `<button class="btn" data-mark>${ic('check', 16)} Mark as paid</button>`
    : !isInv && doc.status === 'Ordered' ? `<button class="btn" data-mark>${ic('check', 16)} Mark as received</button>` : '';

  openModal({
    title: `${isInv ? 'Invoice' : 'Purchase Order'} ${doc.number}`, size: 'lg',
    body: `<div class="doc" style="margin:-20px -22px">
      <div class="doc-head">
        <div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px"><div class="brand-logo">${esc(initials(s.company).slice(0, 1))}</div><b style="font-size:17px">${esc(s.company)}</b></div>
          <div class="doc-meta">${esc(s.address)}<br>${esc(s.phone)} · ${esc(s.email)}${s.trn ? `<br>TRN: ${esc(s.trn)}` : ''}</div>
        </div>
        <div style="text-align:right">
          <div class="doc-title">${isInv ? 'TAX INVOICE' : 'PURCHASE ORDER'}</div>
          <div class="doc-meta"><b>${esc(doc.number)}</b><br>Date: ${fmtDate(doc.date)}<br>${isInv ? 'Due' : 'Expected'}: ${fmtDate(doc.due)}</div>
          <div style="margin-top:8px">${statusBadge(status)}</div>
        </div>
      </div>
      <div class="doc-parties">
        <div><h4>${isInv ? 'Bill to' : 'Supplier'}</h4><b>${esc(party.name)}</b><div class="doc-meta">${[party.address, party.city, party.phone, party.email].filter(Boolean).map(esc).join('<br>')}</div></div>
      </div>
      <table>
        <thead><tr><th>#</th><th>Item</th><th class="num">Qty</th><th class="num">${isInv ? 'Price' : 'Cost'}</th><th class="num">Amount</th></tr></thead>
        <tbody>${doc.items.map((it, i) => { const p = find('products', it.productId) || { name: '— deleted product —', sku: '' }; return `<tr>
          <td>${i + 1}</td><td><div class="cell-main">${esc(p.name)}</div><div class="cell-sub mono">${esc(p.sku)}</div></td>
          <td class="num">${num(it.qty)}</td><td class="num">${money(it.price)}</td><td class="num"><b>${money(num(it.qty) * num(it.price))}</b></td></tr>`; }).join('')}</tbody>
      </table>
      <div class="totals">
        <div class="row"><span>Subtotal</span><span>${money(t.sub)}</span></div>
        <div class="row"><span>Tax (${num(doc.tax)}%)</span><span>${money(t.tax)}</span></div>
        <div class="row grand"><span>Total</span><span>${money(t.total)}</span></div>
      </div>
      ${doc.notes ? `<div class="doc-note"><b>Notes:</b> ${esc(doc.notes)}</div>` : ''}
      <div class="doc-note" style="text-align:center">Thank you for your business.</div>
    </div>`,
    footer: `${markBtn}<button class="btn" data-edit>${ic('edit', 16)} Edit</button><button class="btn primary" data-print>${ic('print', 16)} Print / PDF</button>`,
  });
  $('#modal [data-print]').onclick = () => { document.body.classList.add('printing'); window.print(); document.body.classList.remove('printing'); };
  $('#modal [data-edit]').onclick = () => docForm(type, id);
  const mk = $('#modal [data-mark]');
  if (mk) mk.onclick = () => {
    if (isInv) doc.status = 'Paid';
    else { doc.status = 'Received'; applyStock(type, doc, 1); }
    save(); route(); viewDoc(type, id);
    toast(isInv ? 'Invoice marked as paid' : 'Stock received into inventory');
  };
}

/* ---------- Settings ---------- */
function renderSettings() {
  setHeader('Settings', 'Company profile & data');
  const s = db.settings;
  const fields = [
    { k: 'company', l: 'Company name', req: true, full: true },
    { k: 'address', l: 'Address', full: true },
    { k: 'phone', l: 'Phone' },
    { k: 'email', l: 'Email', type: 'email' },
    { k: 'trn', l: 'Tax / TRN No.' },
    { k: 'currency', l: 'Currency', type: 'select', options: ['AED', 'SAR', 'QAR', 'KWD', 'OMR', 'BHD', 'INR', 'USD', 'EUR', 'GBP'] },
    { k: 'tax', l: 'Default tax / VAT %', type: 'number' },
  ];
  $('#content').innerHTML = `
    <div class="settings-grid">
      <div class="card">
        <div class="card-head"><div><h3>Company profile</h3><div class="sub">Shown on invoices and purchase orders</div></div></div>
        <div class="card-body" id="settingsForm"><div class="form-grid">${fields.map((f) => fieldHtml(f, s[f.k])).join('')}</div>
          <div style="display:flex;justify-content:flex-end;margin-top:18px"><button class="btn primary" id="saveSettings">Save settings</button></div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card">
        <div class="card-head"><div><h3>Team access</h3><div class="sub">People who can sign in and use this ERP</div></div></div>
        <div class="card-body" id="teamBody" style="padding-top:4px"><div class="cell-sub" style="padding:12px 0">Loading team…</div></div>
      </div>
      <div class="card danger-zone">
        <div class="card-head"><div><h3>Data</h3><div class="sub">Stored in your Supabase database</div></div></div>
        <div class="card-body" style="padding-top:4px;padding-bottom:4px">
          ${localBackup() ? `<div class="list-row"><div class="grow"><div class="cell-main">Move browser data to database</div><div class="cell-sub">Upload records saved in this browser before the database was connected</div></div><button class="btn sm" id="migrateBtn">Upload</button></div>` : ''}
          <div class="list-row"><div class="grow"><div class="cell-main">Export backup</div><div class="cell-sub">Download all data as a JSON file</div></div><button class="btn sm" id="exportBtn">${ic('download', 15)} Export</button></div>
          <div class="list-row"><div class="grow"><div class="cell-main">Import backup</div><div class="cell-sub">Restore from an exported JSON file</div></div><label class="btn sm" style="cursor:pointer">Import<input type="file" id="importIn" accept=".json" hidden /></label></div>
          <div class="list-row"><div class="grow"><div class="cell-main">Load demo data</div><div class="cell-sub">Replace everything with sample records</div></div><button class="btn sm" id="demoBtn">Reset</button></div>
          <div class="list-row"><div class="grow"><div class="cell-main">Start fresh</div><div class="cell-sub">Delete all records and keep company profile</div></div><button class="btn sm danger" id="clearBtn">Clear all</button></div>
        </div>
      </div>
      </div>
    </div>`;

  renderTeam();
  const form = $('#settingsForm');
  $('#saveSettings').onclick = () => {
    const out = {};
    let ok = true;
    fields.forEach((f) => { const el = $(`[name="${f.k}"]`, form); out[f.k] = f.type === 'number' ? num(el.value) : el.value.trim(); if (f.req && !out[f.k]) { ok = false; el.closest('.field').classList.add('invalid'); } });
    if (!ok) return toast('Company name is required', true);
    Object.assign(db.settings, out); save(); renderBrand(); toast('Settings saved');
  };
  $('#exportBtn').onclick = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `erp-backup-${today()}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $('#importIn').onchange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    file.text().then((txt) => {
      try { const d = JSON.parse(txt); if (!d.settings || !Array.isArray(d.products)) throw 0; replaceAll(d); toast('Backup restored'); }
      catch (err) { toast('Invalid backup file', true); }
    });
  };
  const mig = $('#migrateBtn');
  if (mig) mig.onclick = () => confirmBox('Upload browser data?', 'Records saved in this browser will <b>replace</b> what is currently in the database.', async () => {
    replaceAll(localBackup());
    await saveChain;
    if ($('#sync').dataset.state === 'saved') { try { localStorage.removeItem(KEY); } catch (e) {} toast('Browser data moved to the database'); route(); }
  }, 'Upload');
  $('#demoBtn').onclick = () => confirmBox('Load demo data?', 'All current records will be replaced with sample data.', () => { const d = seed(); d.settings = db.settings; replaceAll(d); toast('Demo data loaded'); }, 'Load demo');
  $('#clearBtn').onclick = () => confirmBox('Clear all records?', 'Customers, suppliers, products, invoices, purchases, expenses and employees will be deleted. Export a backup first if you need it.', () => {
    ['customers', 'suppliers', 'products', 'invoices', 'purchases', 'expenses', 'employees'].forEach((k) => db[k] = []);
    save(); route(); toast('All records cleared');
  }, 'Clear all');
}

function replaceAll(d) {
  const base = emptyDb();
  db = { ...base, ...d, settings: { ...base.settings, ...(d.settings || {}) } };
  TABLES.forEach((t) => { if (!Array.isArray(db[t])) db[t] = []; });
  save(); route();
}
function localBackup() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); return d && d.settings ? d : null; } catch (e) { return null; }
}

async function renderTeam() {
  const el = $('#teamBody');
  if (!el) return;
  const [res, adm] = await Promise.all([sb.from('members').select('*').order('created_at'), sb.rpc('is_admin')]);
  if (!$('#teamBody')) return;
  if (res.error) { el.innerHTML = `<div class="cell-sub" style="padding:12px 0">${esc(res.error.message)}</div>`; return; }
  const admin = adm.data === true;
  el.innerHTML = res.data.map((m) => `
    <div class="list-row">
      <div class="initials ${toneFor(m.email)}">${esc(m.email.slice(0, 2).toUpperCase())}</div>
      <div class="grow"><div class="cell-main">${esc(m.email)}${m.user_id === currentUser.id ? ' <span class="cell-sub">(you)</span>' : ''}</div>
        <div class="cell-sub">${m.role === 'admin' ? 'Admin' : 'Staff'}</div></div>
      ${admin && m.user_id !== currentUser.id ? `<button class="icon-btn del" title="Remove access" data-rm-member="${m.user_id}">${ic('trash', 16)}</button>` : ''}
    </div>`).join('') + (admin ? `
    <div style="display:flex;gap:8px;margin-top:12px">
      <input class="input" id="memberEmail" type="email" placeholder="teammate@company.com" />
      <select class="input" id="memberRole" style="width:110px"><option value="staff">Staff</option><option value="admin">Admin</option></select>
      <button class="btn primary" id="addMember">Add</button>
    </div>
    <div class="cell-sub" style="margin-top:8px">Your teammate creates an account on the sign-in page first, then you add their email here.</div>`
    : '<div class="cell-sub" style="margin-top:10px">Only admins can add or remove team members.</div>');

  const add = $('#addMember');
  if (add) add.onclick = async () => {
    const email = $('#memberEmail').value.trim();
    if (!email) return toast('Enter an email', true);
    const { error } = await sb.rpc('add_member', { member_email: email, member_role: $('#memberRole').value });
    if (error) return toast(error.message, true);
    toast(`${email} now has access`); renderTeam();
  };
  $$('[data-rm-member]', el).forEach((b) => b.onclick = () => confirmBox('Remove access?', 'This person will no longer be able to open the ERP.', async () => {
    const { error } = await sb.rpc('remove_member', { member_id: b.dataset.rmMember });
    if (error) return toast(error.message, true);
    toast('Access removed'); renderTeam();
  }, 'Remove'));
}

/* ---------- Mobile sidebar ---------- */
function closeSidebar() { $('#sidebar').classList.remove('open'); $('#navBackdrop').classList.remove('open'); }
$('#menuBtn').innerHTML = ic('menu', 20);
$('#menuBtn').onclick = () => { $('#sidebar').classList.add('open'); $('#navBackdrop').classList.add('open'); };
$('#navBackdrop').onclick = closeSidebar;

/* ---------- Auth & boot ---------- */
let currentUser = null;
let ready = false;
let authMode = 'signin';

function showScreen(name) {
  $('.app').hidden = name !== 'app';
  $('#auth').hidden = name !== 'auth';
  $('#loading').hidden = name !== 'loading';
}
function showLoading(msg, isError) {
  showScreen('loading');
  $('#loadingMsg').textContent = msg;
  $('#loadingMsg').style.color = isError ? 'var(--red)' : '';
  $('#loadingActions').hidden = !isError;
}
function showAuth(mode = 'signin', msg = '', isError = false) {
  ready = false;
  authMode = mode;
  showScreen('auth');
  const signup = mode === 'signup';
  $('#authTitle').textContent = signup ? 'Create your account' : 'Sign in to your ERP';
  $('#authSub').textContent = signup ? 'The first account created becomes the admin.' : 'Use your work email and password.';
  $('#authSubmit').textContent = signup ? 'Create account' : 'Sign in';
  $('#authForm [name=password]').autocomplete = signup ? 'new-password' : 'current-password';
  $('#authSwitch').innerHTML = signup
    ? 'Already have an account? <a href="#" data-mode="signin">Sign in</a>'
    : 'New here? <a href="#" data-mode="signup">Create an account</a>';
  const m = $('#authMsg');
  m.textContent = msg;
  m.className = 'auth-msg' + (msg ? (isError ? ' err' : ' ok') : '');
}
$('#authSwitch').addEventListener('click', (e) => {
  const a = e.target.closest('[data-mode]');
  if (a) { e.preventDefault(); showAuth(a.dataset.mode); }
});
$('#authForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const password = e.target.password.value;
  const btn = $('#authSubmit');
  btn.disabled = true; btn.textContent = 'Please wait…';
  try {
    if (authMode === 'signup') {
      const { data, error } = await sb.auth.signUp({ email, password });
      if (error) throw error;
      if (!data.session) return showAuth('signin', 'Account created. Check your email to confirm it, then sign in.');
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
    await boot();
  } catch (err) {
    showAuth(authMode, err.message || String(err), true);
  } finally {
    btn.disabled = false;
    if (!$('#auth').hidden) btn.textContent = authMode === 'signup' ? 'Create account' : 'Sign in';
  }
});

async function signOut() {
  if (pendingSaves > 0) await saveChain;
  await sb.auth.signOut();
  db = emptyDb(); snap = null; currentUser = null;
  showAuth('signin', 'You have been signed out.');
}
$('#signOutBtn').onclick = signOut;
$('#loadingSignOut').onclick = signOut;
$('#loadingRetry').onclick = () => boot();
$('#sync').onclick = () => { if ($('#sync').dataset.state === 'error') save(); };

async function boot() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return showAuth('signin');
  currentUser = session.user;
  showLoading('Loading your data…');
  const mem = await sb.rpc('is_member');
  if (mem.error) return showLoading(`Could not reach the database: ${mem.error.message}`, true);
  if (mem.data !== true) return showLoading(`${currentUser.email} is signed in but does not have access yet. Ask your admin to add this email in Settings → Team access.`, true);
  try { await loadAll(); } catch (err) { return showLoading(`Could not load data: ${err.message || err}`, true); }
  ready = true;
  $('#userAvatar').title = currentUser.email;
  setSync('saved');
  showScreen('app');
  route();
}

$('#today').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
window.addEventListener('hashchange', () => { closeModal(); if (ready) route(); });
boot();
