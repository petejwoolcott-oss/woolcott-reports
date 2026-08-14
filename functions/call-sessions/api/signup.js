/**
 * POST /call-sessions/api/signup
 * Body: { name, week: "YYYY-MM-DD" (Monday), sessions: ["YYYY-MM-DD", ...] }
 * Stores to KV (binding CALL_SESSIONS) as signup:{week}:{name} — newest submission wins.
 * Read side: Henry reads the namespace directly via the CF API (no public read endpoint).
 * Roster must match the AGENTS list in call-sessions/index.html (source of truth:
 * workspace/duty-schedule/roster.json — buyer agents, active, minus Ayriana).
 */
const ROSTER = [
  "Alex K","Angus","Christian","Colleen","Deb","Deirdre","Eden",
  "Frances","Geoffrey","Gillian","Jennifer D","Joseph","Kalie","Lira","Madison",
  "Mary","Micaela","Michael S","Olivia","Paulo","Shawn","Spencer","Torri"
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "bad json" }, 400);
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const week = typeof data.week === "string" ? data.week : "";
  const sessions = Array.isArray(data.sessions) ? data.sessions : [];

  if (!ROSTER.includes(name)) return json({ error: "unknown name" }, 400);
  if (!DATE_RE.test(week)) return json({ error: "bad week" }, 400);
  if (
    sessions.length < 2 || sessions.length > 4 ||
    !sessions.every((s) => typeof s === "string" && DATE_RE.test(s))
  ) {
    return json({ error: "pick at least two sessions" }, 400);
  }

  const record = {
    name,
    week,
    sessions: [...new Set(sessions)].sort(),
    at: new Date().toISOString(),
  };
  await env.CALL_SESSIONS.put(`signup:${week}:${name}`, JSON.stringify(record));
  return json({ ok: true });
}
