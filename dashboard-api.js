/* AI_ORG dashboard API bridge */

const DEFAULT_API_BASE = "http://127.0.0.1:8765";
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
  const now = Date.now();
  if (typeof showToast === "function" && now - lastErrorToastAt > 30000) {
    lastErrorToastAt = now;
    showToast("⚠️", "無法連到 AI_ORG API，暫時保留示範資料", true);
  }
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
window.pollDashboard = pollDashboard;
