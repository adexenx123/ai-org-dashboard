/* AI_ORG dashboard API bridge */

const DEFAULT_API_BASE = "http://127.0.0.1:8080";
const API_BASE = (() => {
  const params = new URLSearchParams(window.location.search);
  const override = params.get("api");
  return override ? override.replace(/\/+$/, "") : DEFAULT_API_BASE;
})();
let lastErrorToastAt = 0;

function dashboardUrl(path) {
  return `${API_BASE}${path}`;
}

function notifyDashboardFetchError(error) {
  console.warn("[dashboard-api] fetch failed", error);
}

async function readJson(path, label) {
  const response = await fetch(dashboardUrl(path), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`${label} failed: HTTP ${response.status}`);
  }

  return response.json();
}

function normalizeTaskList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.tasks)) return payload.tasks;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

async function fetchAwaitingApproval() {
  const payload = await readJson(
    "/tasks?status=awaiting_approval",
    "fetch awaiting approval",
  );
  return normalizeTaskList(payload);
}

async function fetchAgents() {
  return readJson("/agents", "fetch agents");
}

async function fetchDashboardSnapshot() {
  const [approvals, agents] = await Promise.all([
    fetchAwaitingApproval(),
    fetchAgents(),
  ]);

  return { approvals, agents };
}

async function listProjects(apiBase) {
  const r = await fetch(`${apiBase}/projects`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function createProject(apiBase, payload) {
  const r = await fetch(`${apiBase}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw Object.assign(new Error(data.detail || `HTTP ${r.status}`), {
      status: r.status,
      data,
    });
  }
  return data;
}

function pollDashboard(intervalMs = 5000, onData) {
  let stopped = false;
  let timerId = null;

  const run = async () => {
    try {
      const snapshot = await fetchDashboardSnapshot();
      if (!stopped && typeof onData === "function") {
        onData(snapshot);
      }
    } catch (error) {
      notifyDashboardFetchError(error);
    }
  };

  run();
  timerId = window.setInterval(run, intervalMs);

  return () => {
    stopped = true;
    if (timerId) window.clearInterval(timerId);
  };
}

window.API_BASE = API_BASE;
window.fetchAwaitingApproval = fetchAwaitingApproval;
window.fetchAgents = fetchAgents;
window.listProjects = listProjects;
window.createProject = createProject;
window.pollDashboard = pollDashboard;
