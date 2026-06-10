// TRR Operations Hub — Main App JS v3

// ── STATE ──────────────────────────────────────────────────────────────────────
const state = {
  currentView: 'home',
  currentCategory: null,
  currentForm: null,
  isManager: false,
  dashboardFlags: {},
  formData: {},
};

// ── DOM HELPERS ────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};

// ── CATEGORY META (icons + colours per category) ───────────────────────────────
const CATEGORY_META = {
  cleaning: { icon: 'ti-sparkles',     color: 'green', formIconColor: 'green' },
  safety:   { icon: 'ti-shield-check', color: 'blue',  formIconColor: 'blue'  },
  food:     { icon: 'ti-temperature',  color: 'amber', formIconColor: 'amber' },
};

const FORM_ICONS = {
  'tent-cleaning':        'ti-home',
  'tent-toilet-cleaning': 'ti-droplet',
  'dorm-cleaning':        'ti-building',
  'dorm-toilet-cleaning': 'ti-droplet',
  'smoke-alarm-testing':  'ti-bell',
  'smoke-alarm-cleaning': 'ti-wind',
  'smoke-alarm-battery':  'ti-battery',
  'water-tanks':          'ti-droplets',
  'swim-dam':             'ti-waves',
  'protein-temp-check':   'ti-meat',
};

// ── ROUTING ────────────────────────────────────────────────────────────────────
function showView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const view = $('view-' + viewName);
  if (view) view.classList.add('active');
  state.currentView = viewName;
  window.scrollTo(0, 0);
  updateNavBar(viewName);
}

function updateNavBar(viewName) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });
}

// ── INIT ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildHomeView();
  setupPinModal();
  setupOfflineDetection();
  setupNavBar();
  showView('home');
  updateGreeting();
  resetHeader();
});

function updateGreeting() {
  const greetEl = $('greeting-name');
  if (greetEl) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    greetEl.textContent = greeting + ' 👋';
  }
  const dateEl = $('greeting-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-AU', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  }
}

// ── NAV BAR ────────────────────────────────────────────────────────────────────
function setupNavBar() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      if (view === 'home') {
        resetHeader();
        showView('home');
      }
    });
  });
}

// ── HOME VIEW ──────────────────────────────────────────────────────────────────
function buildHomeView() {
  const grid = $('category-grid');
  if (!grid) return;
  grid.innerHTML = '';

  TRR_CONFIG.categories.forEach(cat => {
    const meta  = CATEGORY_META[cat.id] || { icon: cat.icon, color: cat.color, formIconColor: 'green' };
    const color = meta.color || cat.color || 'green';
    const icon  = meta.icon  || cat.icon;

    const card = el('div', `category-card ${color}`);
    card.innerHTML = `
      <div class="cat-icon ${color}">
        <i class="ti ${icon}" aria-hidden="true"></i>
      </div>
      <div class="cat-info">
        <div class="cat-name">${cat.label}</div>
        <div class="cat-count">${cat.forms.length} form${cat.forms.length !== 1 ? 's' : ''}</div>
      </div>
      <div class="cat-arrow"><i class="ti ti-chevron-right"></i></div>
    `;
    card.addEventListener('click', () => openCategory(cat.id));
    grid.appendChild(card);
  });
}

// ── CATEGORY VIEW ──────────────────────────────────────────────────────────────
function openCategory(catId) {
  const cat  = TRR_CONFIG.categories.find(c => c.id === catId);
  if (!cat) return;
  state.currentCategory = cat;

  const meta  = CATEGORY_META[catId] || { icon: cat.icon, color: cat.color, formIconColor: 'green' };
  const icon  = meta.icon || cat.icon;

  // Set category banner
  const bannerIcon  = $('category-banner-icon');
  const bannerTitle = $('category-banner-title');
  if (bannerIcon)  bannerIcon.innerHTML  = `<i class="ti ${icon}"></i>`;
  if (bannerTitle) bannerTitle.textContent = cat.label;

  // Build form list
  const list = $('form-list');
  if (list) {
    list.innerHTML = '';
    cat.forms.forEach(formId => {
      const form = TRR_CONFIG.forms[formId];
      if (!form) return;

      const formIcon  = FORM_ICONS[formId] || 'ti-clipboard-list';
      const iconColor = meta.formIconColor || 'green';

      const item = el('div', 'form-list-item');
      item.innerHTML = `
        <div class="form-item-icon ${iconColor}">
          <i class="ti ${formIcon}"></i>
        </div>
        <div class="form-item-text">
          <div class="form-item-title">${form.title}</div>
          <div class="form-item-sub">Tap to open</div>
        </div>
        <div class="form-item-arrow"><i class="ti ti-chevron-right"></i></div>
      `;
      item.addEventListener('click', () => openForm(formId));
      list.appendChild(item);
    });
  }

  setHeader(cat.label, () => {
    resetHeader();
    showView('home');
  });

  // Mark nav item active
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === catId);
  });

  showView('category');
}

// ── FORM VIEW ──────────────────────────────────────────────────────────────────
function openForm(formId) {
  const form = TRR_CONFIG.forms[formId];
  if (!form) return;
  state.currentForm = form;
  state.formData    = {};

  const container = $('form-container');
  container.innerHTML = '';

  // Instructions
  if (form.instructions && form.instructions.length) {
    const panel = el('div', 'instructions-panel');
    panel.innerHTML = `
      <div class="instructions-title">
        <i class="ti ti-info-circle"></i>
        ${form.instructionTitle || 'Instructions'}
      </div>
      <ul class="instructions-list">
        ${form.instructions.map(i => `<li>${i}</li>`).join('')}
      </ul>
    `;
    container.appendChild(panel);
  }

  // Fields
  const section = el('div', 'form-section');
  form.fields.forEach(field => {
    section.appendChild(buildField(field, form));
  });
  container.appendChild(section);

  // Submit button
  const submitWrap = el('div', 'form-section');
  const submitBtn  = el('button', 'btn btn-primary', '<i class="ti ti-send"></i> Submit');
  submitBtn.id = 'submit-btn';
  submitBtn.addEventListener('click', () => submitForm(form));
  submitWrap.appendChild(submitBtn);
  container.appendChild(submitWrap);

  setHeader(form.title, () => {
    const cat = TRR_CONFIG.categories.find(c => c.id === form.category);
    if (cat) openCategory(cat.id);
    else { resetHeader(); showView('home'); }
  });
  showView('form');
}

// ── FIELD BUILDER ──────────────────────────────────────────────────────────────
function buildField(field, form) {
  const wrap = el('div', 'form-field');
  wrap.dataset.key = field.key;

  const labelEl = el('label', 'form-label',
    field.label + (field.required ? '<span class="required">*</span>' : '')
  );

  switch (field.type) {

    case 'date': {
      const input = el('input');
      input.className = 'form-input';
      input.type = 'date';
      input.value = new Date().toISOString().split('T')[0];
      if (field.auto) { input.readOnly = true; input.style.opacity = '0.65'; }
      input.dataset.key = field.key;
      state.formData[field.key] = input.value;
      input.addEventListener('change', () => { state.formData[field.key] = input.value; });
      wrap.appendChild(labelEl);
      wrap.appendChild(input);
      break;
    }

    case 'text':
    case 'number': {
      const input = el('input');
      input.className = 'form-input';
      input.type = field.type;
      input.placeholder = field.hint || '';
      input.dataset.key = field.key;
      input.addEventListener('input', () => { state.formData[field.key] = input.value; });
      wrap.appendChild(labelEl);
      wrap.appendChild(input);
      if (field.hint) wrap.appendChild(el('div', 'form-hint', field.hint));
      break;
    }

    case 'textarea': {
      const ta = el('textarea', 'form-textarea');
      ta.placeholder = field.hint || 'Type here...';
      ta.dataset.key = field.key;
      ta.addEventListener('input', () => { state.formData[field.key] = ta.value; });
      wrap.appendChild(labelEl);
      wrap.appendChild(ta);
      break;
    }

    case 'select': {
      const sel = el('select', 'form-select');
      sel.dataset.key = field.key;
      const opts = Array.isArray(field.options)
        ? field.options
        : (TRR_CONFIG[field.options] || []);
      opts.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt; o.textContent = opt;
        sel.appendChild(o);
      });
      sel.addEventListener('change', () => { state.formData[field.key] = sel.value; });
      wrap.appendChild(labelEl);
      wrap.appendChild(sel);
      break;
    }

    case 'checklist': {
      wrap.appendChild(labelEl);
      const items = field.items || [];
      state.formData[field.key] = {};
      items.forEach((item, i) => {
        const row = el('label', 'check-row');
        const cb  = document.createElement('input');
        cb.type = 'checkbox';
        cb.dataset.key = field.key;
        cb.dataset.index = i;
        state.formData[field.key][i] = false;
        cb.addEventListener('change', () => { state.formData[field.key][i] = cb.checked; });
        const span = el('span', 'check-row-label', item);
        row.appendChild(cb);
        row.appendChild(span);
        wrap.appendChild(row);
      });
      break;
    }

    case 'location-checklist': {
      wrap.appendChild(labelEl);
      const locs = Array.isArray(field.locations)
        ? field.locations
        : (TRR_CONFIG[field.locations] || []);
      state.formData[field.key] = {};
      locs.forEach(loc => {
        const row = el('div', 'form-field');
        const lbl = el('label', 'form-label', loc);
        const sel = el('select', 'form-select');
        sel.style.marginTop = '4px';
        state.formData[field.key][loc] = field.options[0];
        field.options.forEach(opt => {
          const o = document.createElement('option');
          o.value = opt; o.textContent = opt;
          sel.appendChild(o);
        });
        sel.addEventListener('change', () => { state.formData[field.key][loc] = sel.value; });
        row.appendChild(lbl);
        row.appendChild(sel);
        wrap.appendChild(row);
      });
      break;
    }

    case 'photo': {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.capture = 'environment';
      fileInput.style.display = 'none';
      fileInput.id = 'file-' + field.key;

      const btn     = el('button', 'photo-upload-btn', `<i class="ti ti-camera"></i> Tap to upload photo`);
      const preview = el('img', 'photo-preview');
      preview.style.display = 'none';

      btn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
          preview.src = e.target.result;
          preview.style.display = 'block';
          btn.innerHTML = `<i class="ti ti-check"></i> Photo added — tap to change`;
          state.formData[field.key] = e.target.result;
        };
        reader.readAsDataURL(file);
      });

      wrap.appendChild(labelEl);
      if (field.hint) wrap.appendChild(el('div', 'form-hint', field.hint));
      wrap.appendChild(fileInput);
      wrap.appendChild(btn);
      wrap.appendChild(preview);
      break;
    }

    default: break;
  }

  return wrap;
}

// ── FORM SUBMISSION ─────────────────────────────────────────────────────────────
function submitForm(form) {
  const required = form.fields.filter(f => f.required);
  for (const f of required) {
    const val = state.formData[f.key];
    if (!val || val === 'Select your name...' || val === 'Select...') {
      alert(`Please complete: ${f.label}`);
      return;
    }
  }

  const btn = $('submit-btn');
  if (btn) {
    btn.innerHTML = '<span class="loading-spinner"></span> Submitting...';
    btn.disabled  = true;
  }

  const payload = {
    formId:    form.id,
    sheetTab:  form.sheetTab,
    timestamp: new Date().toISOString(),
    data:      state.formData,
  };

  const url = TRR_CONFIG.appsScriptUrl;

  if (!url || url === 'YOUR_APPS_SCRIPT_URL_HERE' || !navigator.onLine) {
    saveToOfflineQueue(payload);
    showSuccess(form, true);
    return;
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(r => r.json())
    .then(() => showSuccess(form, false))
    .catch(() => { saveToOfflineQueue(payload); showSuccess(form, true); });
}

// ── SUCCESS VIEW ───────────────────────────────────────────────────────────────
function showSuccess(form, wasOffline) {
  const container = $('form-container');
  container.innerHTML = `
    <div class="success-screen">
      <div class="success-icon"><i class="ti ti-check"></i></div>
      <div class="success-title">Form submitted!</div>
      <div class="success-sub">
        ${form.title} has been recorded${wasOffline ? " and will sync when you're back online" : ""}.
      </div>
      <button class="btn btn-primary" onclick="goHome()">
        <i class="ti ti-home"></i> Back to home
      </button>
      <div class="mt-1"></div>
      <button class="btn btn-secondary" onclick="openForm('${form.id}')">Submit another</button>
    </div>
  `;
}

function goHome() {
  resetHeader();
  showView('home');
}

// ── OFFLINE QUEUE ──────────────────────────────────────────────────────────────
function saveToOfflineQueue(payload) {
  const queue = JSON.parse(localStorage.getItem('trr_offline_queue') || '[]');
  queue.push(payload);
  localStorage.setItem('trr_offline_queue', JSON.stringify(queue));
}

function syncOfflineQueue() {
  const url = TRR_CONFIG.appsScriptUrl;
  if (!url || url === 'YOUR_APPS_SCRIPT_URL_HERE') return;
  const queue = JSON.parse(localStorage.getItem('trr_offline_queue') || '[]');
  if (!queue.length) return;
  const remaining = [];
  queue.forEach(payload => {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => remaining.push(payload));
  });
  localStorage.setItem('trr_offline_queue', JSON.stringify(remaining));
}

// ── PIN MODAL ──────────────────────────────────────────────────────────────────
function setupPinModal() {
  const overlay  = $('pin-overlay');
  const input    = $('pin-input');
  const errorEl  = $('pin-error');
  const submitBtn = $('pin-submit');
  const cancelBtn = $('pin-cancel');

  if (cancelBtn) cancelBtn.addEventListener('click', closePinModal);
  if (submitBtn) submitBtn.addEventListener('click', checkPin);
  if (input)     input.addEventListener('keydown', e => { if (e.key === 'Enter') checkPin(); });
  if (overlay)   overlay.addEventListener('click', e => {
    if (e.target === overlay) closePinModal();
  });

  function checkPin() {
    const entered = input ? input.value.trim() : '';
    if (entered === TRR_CONFIG.managerPin) {
      closePinModal();
      state.isManager = true;
      buildManagerView();
      setHeader('Manager Dashboard', () => {
        state.isManager = false;
        resetHeader();
        showView('home');
      });
      showView('manager');
    } else {
      if (errorEl) errorEl.classList.add('visible');
      if (input)   { input.value = ''; input.focus(); }
    }
  }
}

function openPinModal() {
  const overlay = $('pin-overlay');
  const errorEl = $('pin-error');
  if (overlay) overlay.classList.add('visible');
  if (errorEl) errorEl.classList.remove('visible');
  setTimeout(() => { const i = $('pin-input'); if (i) { i.value = ''; i.focus(); } }, 120);
}

function closePinModal() {
  const overlay = $('pin-overlay');
  if (overlay) overlay.classList.remove('visible');
}

// ── MANAGER DASHBOARD ──────────────────────────────────────────────────────────
function buildManagerView() {
  const container = $('manager-container');
  if (!container) return;
  container.innerHTML = '';

  const groups = [
    { label: 'Tents',                     locations: TRR_CONFIG.tentLocations,        key: 'tent' },
    { label: 'Tent Toilet / Shower Blocks', locations: TRR_CONFIG.tentToiletLocations, key: 'tent-toilet' },
    { label: 'Dorms',                     locations: TRR_CONFIG.dormLocations,        key: 'dorm' },
    { label: 'Dorm Toilet / Shower Blocks', locations: TRR_CONFIG.dormToiletLocations, key: 'dorm-toilet' },
  ];

  const sectionTitle = el('div', 'dashboard-section-title', 'Cleaning Dashboard');
  container.appendChild(sectionTitle);

  const dashSection = el('div', 'dashboard-section');

  groups.forEach(group => {
    // Group header
    const groupHeader = el('div', 'dashboard-group-header');
    const groupTitle  = el('div', 'dashboard-group-title', group.label);
    const actions     = el('div');
    actions.style.cssText = 'display:flex;gap:6px;';

    const flagAll  = el('button', 'group-action-btn flag-all-btn',  '<i class="ti ti-flag"></i> Flag all');
    const clearAll = el('button', 'group-action-btn clear-all-btn', '<i class="ti ti-x"></i> Clear all');

    flagAll.addEventListener('click',  () => { group.locations.forEach(loc => { state.dashboardFlags[loc] = 'flagged'; }); buildManagerView(); });
    clearAll.addEventListener('click', () => { group.locations.forEach(loc => { delete state.dashboardFlags[loc]; });       buildManagerView(); });

    actions.appendChild(flagAll);
    actions.appendChild(clearAll);
    groupHeader.appendChild(groupTitle);
    groupHeader.appendChild(actions);
    dashSection.appendChild(groupHeader);

    // Location rows
    group.locations.forEach(loc => {
      const isFlagged = state.dashboardFlags[loc] === 'flagged';
      const row = el('div', 'location-row' + (isFlagged ? ' flagged' : ''));
      row.innerHTML = `
        <div class="location-name">${loc}</div>
        <span class="badge ${isFlagged ? 'badge-needs' : 'badge-clean'}">
          ${isFlagged ? 'Needs Cleaning' : 'Clean'}
        </span>
        <button class="flag-btn ${isFlagged ? 'active' : ''}" data-loc="${loc}" aria-label="Toggle flag">
          <i class="ti ${isFlagged ? 'ti-flag-filled' : 'ti-flag'}"></i>
        </button>
      `;
      row.querySelector('.flag-btn').addEventListener('click', () => {
        if (state.dashboardFlags[loc]) delete state.dashboardFlags[loc];
        else state.dashboardFlags[loc] = 'flagged';
        buildManagerView();
      });
      dashSection.appendChild(row);
    });
  });

  container.appendChild(dashSection);

  // Quick Actions
  container.appendChild(el('div', 'dashboard-section-title', 'Quick Actions'));
  const qa = el('div', 'quick-actions');

  const links = [
    { title: 'View Cleaning Records',             sub: 'Open Google Sheets',      url: 'YOUR_GOOGLE_SHEET_URL_HERE', muted: false },
    { title: 'All Form Submissions',              sub: 'View records in Sheets',   url: null, muted: true },
    { title: 'Smoke Alarm Installation Register', sub: 'View in Sheets',           url: null, muted: true },
  ];

  links.forEach(link => {
    const isLink = link.url && link.url !== 'YOUR_GOOGLE_SHEET_URL_HERE';
    const item   = el(isLink ? 'a' : 'div', `quick-action-item${(link.url && !isLink) || !link.url ? ' no-link' : ''}`);
    if (isLink) { item.href = link.url; item.target = '_blank'; }
    item.innerHTML = `
      <div class="form-item-icon green"><i class="ti ti-external-link"></i></div>
      <div class="form-item-text">
        <div class="quick-action-title ${link.muted ? 'muted' : ''}">${link.title}</div>
        <div class="quick-action-sub">${link.sub}</div>
      </div>
      ${isLink ? '<i class="ti ti-chevron-right text-muted"></i>' : ''}
    `;
    qa.appendChild(item);
  });
  container.appendChild(qa);
}

// ── HEADER HELPERS ─────────────────────────────────────────────────────────────
function setHeader(title, backFn) {
  const titleEl = $('header-title-text');
  const subEl   = $('header-sub-text');
  const backBtn = $('header-back');
  const brand   = document.querySelector('.header-brand');
  const bell    = document.querySelector('.header-bell');

  if (titleEl) titleEl.textContent = title;
  if (subEl)   subEl.textContent   = TRR_CONFIG.ranchName;

  if (backBtn) {
    backBtn.style.display = 'flex';
    backBtn.onclick = backFn;
  }
  // Hide logo mark and bell when in sub-view
  if (brand)  brand.style.paddingLeft = '0';
  if (bell)   bell.style.display = 'none';
}

function resetHeader() {
  const titleEl = $('header-title-text');
  const subEl   = $('header-sub-text');
  const backBtn = $('header-back');
  const bell    = document.querySelector('.header-bell');

  if (titleEl) titleEl.textContent = TRR_CONFIG.appName;
  if (subEl)   subEl.textContent   = TRR_CONFIG.ranchName;
  if (backBtn) backBtn.style.display = 'none';
  if (bell)    bell.style.display = 'flex';
}

// ── OFFLINE DETECTION ──────────────────────────────────────────────────────────
function setupOfflineDetection() {
  const banner = $('offline-banner');
  if (!banner) return;
  const update = () => {
    banner.classList.toggle('visible', !navigator.onLine);
    if (navigator.onLine) syncOfflineQueue();
  };
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}
