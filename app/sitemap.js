import { serverGet } from "@/lib/api";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export default async function sitemap() {
  const d = await serverGet("/products/?page_size=100", 600);
  const prods = (d?.results || []).map((p) => ({ url: `${SITE}/product/${p.slug}`, lastModified: p.created_at }));
  return [{ url: SITE }, { url: `${SITE}/shop` }, { url: `${SITE}/about` }, { url: `${SITE}/contact` }, ...prods];
}
