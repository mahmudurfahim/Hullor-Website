"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useI18n } from "@/components/Providers";
import ProductCard, { ProductGridSkeleton } from "@/components/ProductCard";
import { IconFilter, IconClose } from "@/components/Icons";

const SORTS = [["newest", "নতুন আগে", "Newest first"], ["price_asc", "দাম: কম থেকে বেশি", "Price: low to high"], ["price_desc", "দাম: বেশি থেকে কম", "Price: high to low"], ["rating", "রেটিং", "Top rated"]];

export default function ShopClient() {
  const { t, n: bn, catName } = useI18n();
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [cats, setCats] = useState([]);
  const [data, setData] = useState({ results: [], count: 0, next: null });
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState({ min: sp.get("min_price") || "", max: sp.get("max_price") || "" });

  const category = sp.get("category") || "";
  const search = sp.get("search") || "";
  const ordering = sp.get("ordering") || "newest";
  const featured = sp.get("featured") || "";
  const inStock = sp.get("in_stock") || "";
  const onSale = sp.get("on_sale") || "";
  const min = sp.get("min_price") || "";
  const max = sp.get("max_price") || "";

  const setParam = useCallback((patch) => {
    const n = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k)));
    router.push(`${pathname}?${n.toString()}`, { scroll: false });
  }, [sp, router, pathname]);

  useEffect(() => { api("/categories/", { auth: false }).then(setCats).catch(() => {}); }, []);

  const query = useCallback((page) => {
    const q = new URLSearchParams({ page: String(page), page_size: "12", ordering });
    if (category) q.set("category", category);
    if (search) q.set("search", search);
    if (featured) q.set("featured", "1");
    if (inStock) q.set("in_stock", "1");
    if (onSale) q.set("on_sale", "1");
    if (min) q.set("min_price", min);
    if (max) q.set("max_price", max);
    return `/products/?${q}`;
  }, [category, search, ordering, featured, inStock, onSale, min, max]);

  useEffect(() => {
    let alive = true;
    setLoading(true); setError("");
    api(query(1), { auth: false }).then((d) => { if (alive) setData({ ...d, page: 1 }); })
      .catch((e) => alive && setError(e.message)).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [query]);

  const loadMore = async () => {
    setMore(true);
    try {
      const page = (data.page || 1) + 1;
      const d = await api(query(page), { auth: false });
      setData((prev) => ({ ...d, page, results: [...prev.results, ...d.results] }));
    } catch (e) { setError(e.message); } finally { setMore(false); }
  };

  const activeCat = cats.find((c) => c.slug === category);
  const filters = (
    <div className="filters">
      <div className="f-block">
        <h4>{t("ক্যাটাগরি", "Categories")}</h4>
        <button className={`f-item ${!category ? "on" : ""}`} onClick={() => { setParam({ category: "" }); setOpen(false); }}>{t("সকল পণ্য", "All products")}</button>
        {cats.map((c) => (
          <button key={c.id} className={`f-item ${category === c.slug ? "on" : ""}`} onClick={() => { setParam({ category: c.slug }); setOpen(false); }}>
            {catName(c)} <small>{bn(c.product_count)}</small>
          </button>
        ))}
      </div>
      <div className="f-block">
        <h4>{t("দাম (৳)", "Price (৳)")}</h4>
        <div className="f-price">
          <input inputMode="numeric" placeholder={t("সর্বনিম্ন", "Min")} value={price.min} onChange={(e) => setPrice({ ...price, min: e.target.value.replace(/\D/g, "") })} />
          <span>–</span>
          <input inputMode="numeric" placeholder={t("সর্বোচ্চ", "Max")} value={price.max} onChange={(e) => setPrice({ ...price, max: e.target.value.replace(/\D/g, "") })} />
        </div>
        <button className="btn btn-sm btn-outline" onClick={() => { setParam({ min_price: price.min, max_price: price.max }); setOpen(false); }}>{t("প্রয়োগ করুন", "Apply")}</button>
      </div>
      <div className="f-block">
        <label className="check"><input type="checkbox" checked={!!inStock} onChange={(e) => setParam({ in_stock: e.target.checked ? "1" : "" })} /> {t("শুধু স্টকে আছে", "In stock only")}</label>
        <label className="check"><input type="checkbox" checked={!!onSale} onChange={(e) => setParam({ on_sale: e.target.checked ? "1" : "" })} /> {t("ছাড়ে পাওয়া যাচ্ছে", "On sale")}</label>
      </div>
      {(category || search || featured || inStock || onSale || min || max) && (
        <button className="btn btn-ghost btn-sm" onClick={() => { setPrice({ min: "", max: "" }); router.push(pathname); }}>{t("সব ফিল্টার মুছুন", "Clear all filters")}</button>
      )}
    </div>
  );

  return (
    <div className="container section">
      <div className="page-head">
        <div>
          <h1>{search ? t(`“${search}” এর ফলাফল`, `Results for “${search}”`) : activeCat ? catName(activeCat) : t("সকল পণ্য", "All products")}</h1>
          <p className="muted">{loading ? t("লোড হচ্ছে…", "Loading…") : t(`${bn(data.count)}টি পণ্য`, `${data.count} ${data.count === 1 ? "product" : "products"}`)}</p>
        </div>
        <div className="head-tools">
          <button className="btn btn-outline btn-sm only-mobile" onClick={() => setOpen(true)}><IconFilter size={16} /> {t("ফিল্টার", "Filters")}</button>
          <select value={ordering} onChange={(e) => setParam({ ordering: e.target.value === "newest" ? "" : e.target.value })} aria-label={t("সাজান", "Sort")}>
            {SORTS.map(([v, b, e]) => <option key={v} value={v}>{t(b, e)}</option>)}
          </select>
        </div>
      </div>
      <div className="shop-layout">
        <aside className="shop-side">{filters}</aside>
        {open && (
          <div className="sheet" onClick={() => setOpen(false)}>
            <div className="sheet-in" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-head"><b>{t("ফিল্টার", "Filters")}</b><button className="icon-btn" onClick={() => setOpen(false)}><IconClose /></button></div>
              {filters}
            </div>
          </div>
        )}
        <div>
          {error && <div className="alert alert-err">{error}</div>}
          {loading ? <ProductGridSkeleton /> : data.results.length === 0 ? (
            <div className="empty-box"><h3>{t("কোনো পণ্য পাওয়া যায়নি", "No products found")}</h3><p className="muted">{t("ফিল্টার বদলে আবার চেষ্টা করুন।", "Try changing your filters.")}</p></div>
          ) : (
            <>
              <div className="grid-products">{data.results.map((p) => <ProductCard key={p.id} p={p} />)}</div>
              {data.next && <div className="center"><button className="btn btn-outline" onClick={loadMore} disabled={more}>{more ? t("লোড হচ্ছে…", "Loading…") : t("আরও দেখুন", "Load more")}</button></div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
