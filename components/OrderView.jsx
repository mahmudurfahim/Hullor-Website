"use client";
import Link from "next/link";
import { FLOW, STATUS, variantText } from "@/lib/format";
import { useI18n } from "@/components/Providers";
import { Placeholder } from "@/components/ProductCard";

/** অর্ডারের বিস্তারিত (লগইন করা কাস্টমারের অর্ডার পেজ ও গেস্টের /track পেজ — দুটোতেই ব্যবহার হয়) */
export default function OrderView({ o, onCancel, back }) {
  const { t, en, n: bn, dateTime: dateTimeBn, taka, tm } = useI18n();
  const L = en ? "en" : "bn";
  const closed = o.status === "cancelled" || o.status === "returned";
  const idx = FLOW.indexOf(o.status);
  return (
    <div className="stack">
      {back && <Link href={back.href} className="link-arrow back">{back.label}</Link>}
      <div className="card">
        <div className="od-head">
          <div><h3>{t("অর্ডার", "Order")} {o.number}</h3><small className="muted">{dateTimeBn(o.created_at)}</small></div>
          <span className={`pill pill-${STATUS[o.status].tone} lg`}>{STATUS[o.status][L]}</span>
        </div>
        {closed ? <div className="alert alert-err">{t(`এই অর্ডারটি ${STATUS[o.status].bn}।`, `This order is ${STATUS[o.status].en.toLowerCase()}.`)}</div> : (
          <ol className="steps">
            {FLOW.map((s, i) => <li key={s} className={i <= idx ? "done" : ""}><i>{i + 1}</i><span>{STATUS[s][L]}</span></li>)}
          </ol>
        )}
        {onCancel && o.status === "pending" && <button className="btn btn-outline btn-sm" onClick={onCancel}>{t("অর্ডার বাতিল করুন", "Cancel order")}</button>}
      </div>
      <div className="card">
        <h3>{t("পণ্যসমূহ", "Items")}</h3>
        {o.items.map((it) => (
          <div key={it.id} className="cline compact">
            <div className="cline-img">{it.image ? <img src={it.image} alt="" /> : <Placeholder />}</div>
            <div className="cline-info">
              {it.slug ? <Link href={`/product/${it.slug}`} className="cline-name">{it.name}</Link> : <span className="cline-name">{it.name}</span>}
              <div className="cline-meta">{[variantText(it.size, it.color, t), `${taka(it.price)} × ${bn(it.quantity)}`].filter(Boolean).join(" · ")}</div>
            </div>
            <b>{taka(it.line_total)}</b>
          </div>
        ))}
        <div className="sum-row"><span>{t("সাবটোটাল", "Subtotal")}</span><b>{taka(o.subtotal)}</b></div>
        {o.discount > 0 && <div className="sum-row ok-text"><span>{t("ছাড়", "Discount")} {o.coupon_code && `(${o.coupon_code})`}</span><b>-{taka(o.discount)}</b></div>}
        <div className="sum-row"><span>{t("ডেলিভারি চার্জ", "Delivery charge")}</span><b>{taka(o.delivery_charge)}</b></div>
        <div className="sum-row total"><span>{t("সর্বমোট", "Total")}</span><b>{taka(o.total)}</b></div>
        <p className="muted small">{t("পেমেন্ট: ক্যাশ অন ডেলিভারি", "Payment: cash on delivery")} · {o.payment_status === "paid" ? t("পরিশোধিত", "Paid") : t("পণ্য হাতে পেয়ে পরিশোধ করুন", "Pay when you receive your order")}</p>
      </div>
      <div className="grid-2">
        <div className="card"><h3>{t("ডেলিভারি ঠিকানা", "Delivery address")}</h3><p><b>{o.customer_name}</b><br />{bn(o.phone)}<br />{o.address}, {o.district}</p>{o.note && <p className="muted">{t("নোট", "Note")}: {o.note}</p>}</div>
        <div className="card"><h3>{t("অর্ডার ইতিহাস", "Order history")}</h3>
          <ul className="timeline">{[...o.history].reverse().map((h, i) => <li key={i}><b>{STATUS[h.status]?.[L] || h.status}</b><small>{dateTimeBn(h.created_at)}{h.note ? ` · ${tm(h.note)}` : ""}</small></li>)}</ul>
        </div>
      </div>
    </div>
  );
}
