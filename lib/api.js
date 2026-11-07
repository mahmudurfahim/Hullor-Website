import { clientLang, translateMsg } from "./i18n";

// NEXT_PUBLIC_API_URL সেট না থাকলে production এ Render backend, লোকালে localhost ব্যবহার হবে।
const DEFAULT_API = process.env.NODE_ENV === "production" ? "https://hullor-api.onrender.com/api" : "http://localhost:8000/api";
function normalizeApi(u) {
  u = (u || "").trim().replace(/\/+$/, "");
  if (!u) return DEFAULT_API;
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  return /\/api$/.test(u) ? u : u + "/api";
}
export const API = normalizeApi(process.env.NEXT_PUBLIC_API_URL);

// Render free plan ঘুমিয়ে থাকলে প্রথম রিকোয়েস্ট ফেইল করে; তাই GET এ কয়েকবার retry করা হয়।
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchWithRetry(url, init, retries) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, init);
      if (retries && i < retries && (res.status === 502 || res.status === 503 || res.status === 504)) {
        await sleep(2500 * (i + 1));
        continue;
      }
      return res;
    } catch (e) {
      if (e.name === "AbortError") throw e;
      lastErr = e;
      if (i < retries) await sleep(2500 * (i + 1));
    }
  }
  throw lastErr;
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const KEY = "hl_tokens";
export const tokens = {
  get() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
  },
  set(t) { try { localStorage.setItem(KEY, JSON.stringify(t)); } catch {} },
  clear() { try { localStorage.removeItem(KEY); } catch {} },
};

let refreshing = null;
async function refreshAccess() {
  const t = tokens.get();
  if (!t?.refresh) return null;
  refreshing ||= fetch(`${API}/auth/refresh/`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refresh: t.refresh }),
  })
    .then(async (r) => {
      if (!r.ok) { tokens.clear(); return null; }
      const d = await r.json();
      tokens.set({ access: d.access, refresh: d.refresh || t.refresh });
      return d.access;
    })
    .catch(() => null)
    .finally(() => { refreshing = null; });
  return refreshing;
}

/** ব্রাউজার থেকে API কল (টোকেনসহ, 401 হলে অটো রিফ্রেশ) */
export async function api(path, { method = "GET", body, auth = true, signal } = {}) {
  if (method === "GET" && clientLang() === "en" && !/[?&]lang=/.test(path)) path += (path.includes("?") ? "&" : "?") + "lang=en";
  const doFetch = (access) =>
    fetchWithRetry(`${API}${path}`, {
      method, signal,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(auth && access ? { Authorization: `Bearer ${access}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    }, method === "GET" ? 3 : 0);
  let res;
  try {
    res = await doFetch(auth ? tokens.get()?.access : null);
    if (res.status === 401 && auth && tokens.get()?.refresh) {
      const access = await refreshAccess();
      if (access) res = await doFetch(access);
    }
  } catch (e) {
    if (e.name === "AbortError") throw e;
    console.error("[HULLOR] API request failed:", `${API}${path}`, e);
    throw new ApiError(clientLang() === "en" ? "Could not reach the server. Please try again shortly." : "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।", 0);
  }
  let data = null;
  try { data = await res.json(); } catch {}
  const L = clientLang();
  if (!res.ok) throw new ApiError(translateMsg(data?.detail, L) || (L === "en" ? "Something went wrong." : "কিছু একটা সমস্যা হয়েছে।"), res.status, data);
  return data;
}

/** সার্ভার কম্পোনেন্টে ডাটা আনা (ISR). ব্যাকএন্ড বন্ধ থাকলে null ফেরত দেয়, বিল্ড ভাঙে না। */
export async function serverGet(path, revalidate = 60, lang = "bn") {
  // ?lang=en দিলে ব্যাকএন্ড English লেখা (name_en ইত্যাদি) পাঠায়; ক্যাশ কী-ও আলাদা হয়।
  if (lang === "en") path += (path.includes("?") ? "&" : "?") + "lang=en";
  // Render free plan ঘুমিয়ে থাকলে প্রথমবার ফেইল করতে পারে, তাই একবার retry।
  for (let i = 0; i < 2; i++) {
    try {
      const r = await fetch(`${API}${path}`, { next: { revalidate } });
      if (r.ok) return await r.json();
      if (r.status < 500) return null;
    } catch {}
    if (i === 0) await sleep(4000);
  }
  return null;
}
