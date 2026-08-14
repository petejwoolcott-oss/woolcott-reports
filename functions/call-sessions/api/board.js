/**
 * GET /call-sessions/api/board?week=YYYY-MM-DD
 * Returns the week's sign-ups: { week, signups: [{ name, sessions: ["YYYY-MM-DD", ...] }] }
 * Names and session days only — no emails, no timestamps.
 */
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const week = url.searchParams.get("week") || "";
  if (!DATE_RE.test(week)) {
    return new Response(JSON.stringify({ error: "bad week" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const list = await env.CALL_SESSIONS.list({ prefix: `signup:${week}:` });
  const signups = [];
  for (const key of list.keys) {
    const rec = await env.CALL_SESSIONS.get(key.name, "json");
    if (rec && rec.name) signups.push({ name: rec.name, sessions: rec.sessions || [] });
  }
  signups.sort((a, b) => a.name.localeCompare(b.name));

  return new Response(JSON.stringify({ week, signups }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
