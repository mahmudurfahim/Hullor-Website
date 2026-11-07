"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n, useWishlist } from "./Providers";
import { IconHeart, IconStar } from "./Icons";

export function Placeholder({ label }) {
  return (
    <div className="ph" aria-hidden="true">
      <img src="/images/logo.jpg" alt="" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}

export default function ProductCard({ p }) {
  const wish = useWishlist();
  const { t, taka, catName } = useI18n();
  const router = useRouter();
  const liked = wish.ids.includes(p.id);
  return (
    <article className="pcard">
      <Link href={`/product/${p.slug}`} className="pcard-media" aria-label={p.name}>
        {p.image ? (
          <>
            <img src={p.image} alt={p.name} loading="lazy" className="pcard-img" />
            {p.image2 ? <img src={p.image2} alt="" loading="lazy" className="pcard-img pcard-img2" /> : null}
          </>
        ) : <Placeholder />}
        <div className="pcard-badges">
          {p.discount_percent > 0 && <span className="badge badge-gold">-{p.discount_percent}%</span>}
          {!p.in_stock && <span className="badge badge-dark">{t("স্টক শেষ", "Out of stock")}</span>}
        </div>
      </Link>
      <button className={`pcard-heart ${liked ? "on" : ""}`} aria-label={t("উইশলিস্ট", "Wishlist")} onClick={async () => { if ((await wish.toggle(p.id)) === "login") router.push("/login?next=/account/wishlist"); }}>
        <IconHeart size={18} fill={liked ? "currentColor" : "none"} />
      </button>
      <div className="pcard-body">
        <div className="pcard-cat">{p.category ? catName(p.category) : " "}</div>
        <Link href={`/product/${p.slug}`} className="pcard-name">{p.name}</Link>
        <div className="pcard-row">
          <div className="price">
            <b>{taka(p.price)}</b>
            {p.old_price ? <s>{taka(p.old_price)}</s> : null}
          </div>
          {p.rating_count > 0 && (
            <span className="rate"><IconStar size={14} /> {p.rating_avg}</span>
          )}
        </div>
        {p.colors?.length > 0 && (
          <div className="swatches">
            {p.colors.slice(0, 5).map((c) => <i key={c.name} title={c.name} style={{ background: c.hex || "#d8d1bf" }} />)}
          </div>
        )}
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ n = 8 }) {
  return (
    <div className="grid-products">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="pcard skeleton-card"><div className="sk sk-media" /><div className="sk sk-line" /><div className="sk sk-line short" /></div>
      ))}
    </div>
  );
}
