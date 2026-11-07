"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { STATUS } from "@/lib/format";
import { useI18n } from "@/components/Providers";
import { Placeholder } from "@/components/ProductCard";

export default function Orders() {
  const { t, en, n: bn, date: dateBn, taka } = useI18n();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => { api("/orders/").then(setData).catch((e) => setErr(e.message)); }, []);
  if (err) return <div className="alert alert-err">{err}</div>;
  if (!data) return <p className="muted">{t("লোড হচ্ছে…", "Loading…")}</p>;
  return (
    <div className="card">
      <h3>{t("আমার অর্ডার", "My orders")}</h3>
      {data.results.length === 0 ? (
        <div className="empty-box"><p className="muted">{t("আপনি এখনও কোনো অর্ডার করেননি।", "You haven't placed any orders yet.")}</p><Link href="/shop" className="btn">{t("কেনাকাটা শুরু করুন", "Start shopping")}</Link></div>
      ) : data.results.map((o) => (
        <Link key={o.id} href={`/account/orders/${o.number}`} className="order-row">
          <div className="or-img">{o.thumb ? <img src={o.thumb} alt="" /> : <Placeholder />}</div>
          <div className="grow"><b>{o.number}</b><small>{dateBn(o.created_at)} · {t(`${bn(o.items_count)}টি পণ্য`, `${o.items_count} ${o.items_count === 1 ? "item" : "items"}`)}</small></div>
          <div className="right"><b>{taka(o.total)}</b><span className={`pill pill-${STATUS[o.status].tone}`}>{STATUS[o.status][en ? "en" : "bn"]}</span></div>
        </Link>
      ))}
    </div>
  );
}
