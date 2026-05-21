/* ForgeBench｜AI 鍛造台 — shared interactions
   (internal slug: ai-org-pages / AI_ORG / ai-org-runtime) */

function showToast(icon, msg, isError = false) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = '<span id="toast-icon"></span><span id="toast-msg"></span>';
    document.body.appendChild(toast);
  }
  document.getElementById('toast-icon').textContent = icon;
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function buildTopBar(activePage) {
  const pages = [
    { id: 'index',        label: '儀表板',   en: 'Dashboard' },
    { id: 'tasks',        label: '任務',     en: 'Tasks' },
    { id: 'discuss',      label: '討論室',   en: 'Discuss' },
    { id: 'agents',       label: 'AI 員工',  en: 'Agents' },
    { id: 'history',      label: '歷史',     en: 'History' },
    { id: 'constitution', label: '憲法',     en: 'Constitution' },
    { id: 'projects',     label: '專案',     en: 'Projects' },
    { id: 'settings',     label: '設定',     en: 'Settings' },
  ];
  const navHtml = pages.map(p =>
    `<a href="${p.id}.html" class="${p.id === activePage ? 'active' : ''}" title="${p.en}">${p.label}</a>`
  ).join('');

  return `
    <div class="topbar">
      <div class="logo"><span class="dot"></span> ForgeBench <span style="color:var(--dim);font-weight:400">· AI 鍛造台</span><span class="active-project" id="topbar-active-project" style="font-size:11px;color:var(--accent);padding:2px 8px;border:1px solid var(--accent);border-radius:99px;margin-left:6px">default</span></div>
      <nav class="nav">${navHtml}</nav>
      <div class="spacer"></div>
      <div class="stat" id="topbar-agents">8 員工</div>
      <div class="stat">待你批准 <b class="boss" id="topbar-pending">4</b></div>
      <div class="stat always" id="topbar-budget">$48.20 / $200</div>
      <div class="avatar" title="jubileecreator">J</div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const slot = document.getElementById('topbar-slot');
  if (slot) {
    slot.outerHTML = buildTopBar(slot.dataset.active);
  }
  const slug = localStorage.getItem('forge.activeProject') || 'default';
  const el = document.getElementById('topbar-active-project');
  if (el) el.textContent = slug;
});
