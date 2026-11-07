"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth, useCart, useI18n, useToast, useWishlist } from "@/components/Providers";
import ProductCard, { Placeholder } from "@/components/ProductCard";
import Stars from "@/components/Stars";
import { IconCash, IconHeart, IconMinus, IconPlus, IconTruck, IconWhatsapp, IconCheck } from "@/components/Icons";

export default function ProductView({ product: p }) {
  const router = useRouter();
  const { t, n: bn, date: dateBn, taka, catName } = useI18n();
  const { addItem } = useCart();
  const { user } = useAuth();
  const wish = useWishlist();
  const toast = useToast();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState(null);
  const [rv, setRv] = useState({ rating: 5, comment: "" });
  const [tab, setTab] = useState("details");

  const colors = useMemo(() => {
    const seen = new Map();
    p.variants.forEach((v) => { if (v.color && !seen.has(v.color)) seen.set(v.color, v.color_hex); });
    return [...seen.entries()].map(([name, hex]) => ({ name, hex }));
  }, [p]);
  const sizes = useMemo(() => [...new Set(p.variants.map((v) => v.size))], [p]);

  useEffect(() => { if (colors.length === 1) setColor(colors[0].name); }, [colors]);
  useEffect(() => { if (sizes.length === 1) setSize(sizes[0]); }, [sizes]);
  useEffect(() => { api(`/products/${p.slug}/reviews/`).then(setReviews).catch(() => {}); }, [p.slug, user]);

  const variantFor = (s, c) => p.variants.find((v) => v.size === s && (colors.length === 0 || v.color === c));
  const selected = size && (colors.length === 0 || color) ? variantFor(size, color) : null;
  const sizeAvail = (s) => p.variants.some((v) => v.size === s && v.stock > 0 && (!color || v.color === color));
  const colorAvail = (c) => p.variants.some((v) => v.color === c && v.stock > 0 && (!size || v.size === size));
  const maxQty = selected ? Math.min(selected.stock, 20) : 20;

  const imgs = p.images || [];
  const needs = !size ? t("সাইজ/অপশন", "a size/option") : colors.length && !color ? t("কালার", "a color") : null;
  const hideOpt = sizes.length === 1 && String(sizes[0]).trim().toLowerCase() === "free";

  const toItem = (v) => ({
    variant_id: v.id, product_id: p.id, slug: p.slug, name: p.name, code: p.code, size: v.size, color: v.color,
    price: p.price, old_price: p.old_price, image: imgs[0] || null, stock: v.stock,
  });
  const add = (buy) => {
    if (needs) { toast(t(`আগে ${needs} বেছে নিন`, `Please choose ${needs} first`), "err"); return; }
    if (!selected || selected.stock < 1) { toast(t("এই অপশনটি স্টকে নেই", "This option is out of stock"), "err"); return; }
    addItem(toItem(selected), qty, !buy);
    if (buy) router.push("/checkout");
    else toast(t("কার্টে যোগ হয়েছে", "Added to cart"));
  };
  const submitReview = async (e) => {
    e.preventDefault();
    try { setReviews(await api(`/products/${p.slug}/reviews/`, { method: "POST", body: rv })); toast(t("রিভিউ দেওয়ার জন্য ধন্যবাদ!", "Thanks for your review!")); }
    catch (err) { toast(err.message, "err"); }
  };

  const liked = wish.ids.includes(p.id);
  const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);

  return (
    <div className="container section">
      <nav className="crumbs"><Link href="/">{t("হোম", "Home")}</Link> / <Link href="/shop">{t("শপ", "Shop")}</Link>{p.category && <> / <Link href={`/shop?category=${p.category.slug}`}>{catName(p.category)}</Link></>} / <span>{p.name}</span></nav>
      <div className="pd">
        <div className="pd-gallery">
          <div className="pd-main">
            {imgs[img] ? <img src={imgs[img]} alt={p.name} /> : <Placeholder label={t("ছবি শীঘ্রই আসছে", "Image coming soon")} />}
            {p.discount_percent > 0 && <span className="badge badge-gold pd-badge">-{p.discount_percent}%</span>}
          </div>
          {imgs.length > 1 && (
            <div className="pd-thumbs">
              {imgs.map((s, i) => <button key={s} className={i === img ? "on" : ""} onClick={() => setImg(i)}><img src={s} alt="" /></button>)}
            </div>
          )}
        </div>
        <div className="pd-info">
          <div className="pcard-cat">{p.category ? catName(p.category) : ""} · {t("কোড", "Code")}: {p.code}</div>
          <h1>{p.name}</h1>
          {p.rating_count > 0 && <div className="pd-rate"><Stars value={p.rating_avg} /> <span>{bn(p.rating_avg)} ({t(`${bn(p.rating_count)}টি রিভিউ`, `${p.rating_count} ${p.rating_count === 1 ? "review" : "reviews"}`)})</span></div>}
          <div className="price price-lg"><b>{taka(p.price)}</b>{p.old_price ? <s>{taka(p.old_price)}</s> : null}{p.discount_percent > 0 && <em>{t(`${bn(p.discount_percent)}% ছাড়`, `${p.discount_percent}% off`)}</em>}</div>

          {colors.length > 0 && (
            <div className="opt">
              <div className="opt-label">{t("কালার", "Color")}: <b>{color || t("বেছে নিন", "Select")}</b></div>
              <div className="opt-row">
                {colors.map((c) => (
                  <button key={c.name} className={`chip chip-color ${color === c.name ? "on" : ""} ${!colorAvail(c.name) ? "off" : ""}`} onClick={() => { setColor(c.name); setQty(1); }}>
                    <i style={{ background: c.hex || "#d8d1bf" }} />{c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!hideOpt && <div className="opt">
            <div className="opt-label">{t("সাইজ/অপশন", "Size / Option")}: <b>{size || t("বেছে নিন", "Select")}</b></div>
            <div className="opt-row">
              {sizes.map((s) => <button key={s} className={`chip ${size === s ? "on" : ""} ${!sizeAvail(s) ? "off" : ""}`} onClick={() => { setSize(s); setQty(1); }}>{s}</button>)}
            </div>
          </div>}
          {selected && <p className={`stock ${selected.stock < 1 ? "out" : selected.stock <= 5 ? "low" : ""}`}>{selected.stock < 1 ? t("স্টক শেষ", "Out of stock") : selected.stock <= 5 ? t(`মাত্র ${bn(selected.stock)}টি বাকি!`, `Only ${selected.stock} left!`) : t("স্টকে আছে", "In stock")}</p>}
          {!selected && totalStock === 0 && <p className="stock out">{t("স্টক শেষ", "Out of stock")}</p>}

          <div className="buy-row">
            <div className="qty qty-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label={t("কমান", "Decrease")}><IconMinus size={16} /></button>
              <span>{bn(qty)}</span>
              <button onClick={() => setQty(Math.min(maxQty, qty + 1))} aria-label={t("বাড়ান", "Increase")}><IconPlus size={16} /></button>
            </div>
            <button className="btn btn-lg grow" onClick={() => add(false)} disabled={totalStock === 0}>{t("কার্টে যোগ করুন", "Add to cart")}</button>
            <button className={`icon-btn lg ${liked ? "liked" : ""}`} aria-label={t("উইশলিস্ট", "Wishlist")} onClick={async () => { if ((await wish.toggle(p.id)) === "login") router.push(`/login?next=/product/${p.slug}`); }}><IconHeart fill={liked ? "currentColor" : "none"} /></button>
          </div>
          <button className="btn btn-gold btn-lg btn-block" onClick={() => add(true)} disabled={totalStock === 0}>{t("এখনই কিনুন", "Buy now")}</button>

          <ul className="pd-perks">
            <li><IconCash size={18} /> {t("ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে টাকা দিন", "Cash on delivery — pay when you receive it")}</li>
            <li><IconTruck size={18} /> {t("সারা বাংলাদেশে হোম ডেলিভারি", "Home delivery across Bangladesh")}</li>
            <li><IconCheck size={18} /> {t("ইউনিক প্রোডাক্ট কোড", "Unique product code")}: <b>{p.code}</b></li>
          </ul>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === "details" ? "on" : ""} onClick={() => setTab("details")}>{t("বিস্তারিত", "Details")}</button>
        <button className={tab === "reviews" ? "on" : ""} onClick={() => setTab("reviews")}>{t("রিভিউ", "Reviews")} {reviews ? `(${bn(reviews.count)})` : ""}</button>
      </div>
      {tab === "details" ? (
        <div className="tab-panel">
          {p.description && <p className="prewrap">{p.description}</p>}
          <dl className="specs">
            {p.fabric && <><dt>{t("উপাদান / মেটেরিয়াল", "Material")}</dt><dd>{p.fabric}</dd></>}
            {p.fit && <><dt>{t("ধরন / বৈশিষ্ট্য", "Type / Features")}</dt><dd>{p.fit}</dd></>}
            {p.care && <><dt>{t("যত্ন ও ব্যবহার", "Care & usage")}</dt><dd>{p.care}</dd></>}
            <dt>{t("প্রোডাক্ট কোড", "Product code")}</dt><dd>{p.code}</dd>
          </dl>
        </div>
      ) : (
        <div className="tab-panel">
          {reviews?.results.length ? reviews.results.map((r) => (
            <div key={r.id} className="review"><div><b>{r.user_name}</b> <Stars value={r.rating} size={14} /> <small className="muted">{dateBn(r.created_at)}</small></div>{r.comment && <p>{r.comment}</p>}</div>
          )) : <p className="muted">{t("এখনও কোনো রিভিউ নেই।", "No reviews yet.")}</p>}
          {reviews?.can_review && (
            <form className="review-form" onSubmit={submitReview}>
              <h4>{reviews.has_reviewed ? t("আপনার রিভিউ আপডেট করুন", "Update your review") : t("রিভিউ লিখুন", "Write a review")}</h4>
              <div className="rate-pick">{[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} onClick={() => setRv({ ...rv, rating: n })} className={n <= rv.rating ? "on" : ""}>★</button>)}</div>
              <textarea rows={3} placeholder={t("পণ্যটি কেমন লেগেছে?", "How was the product?")} value={rv.comment} onChange={(e) => setRv({ ...rv, comment: e.target.value })} />
              <button className="btn btn-sm">{t("জমা দিন", "Submit")}</button>
            </form>
          )}
          {!user && <p className="muted small">{t(<>রিভিউ দিতে <Link href={`/login?next=/product/${p.slug}`} className="u">লগইন করুন</Link> (পণ্য ডেলিভারি পাওয়ার পর)।</>, <>To write a review, <Link href={`/login?next=/product/${p.slug}`} className="u">log in</Link> (after your order is delivered).</>)}</p>}
        </div>
      )}

      {p.related?.length > 0 && (
        <section className="related">
          <h2>{t("আরও দেখুন", "You may also like")}</h2>
          <div className="grid-products">{p.related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}
