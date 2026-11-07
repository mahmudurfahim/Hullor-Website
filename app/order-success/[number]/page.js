"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth, useI18n } from "@/components/Providers";
import { IconCheck } from "@/components/Icons";

export default function OrderSuccess({ params }) {
  const { number } = use(params);
  const { user, loading } = useAuth();
  const { t, n: bn, taka } = useI18n();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    // গেস্ট অর্ডারের তথ্য অর্ডার করার সময়ই sessionStorage এ রাখা হয়; লগইন করা হলে সার্ভার থেকে আনে।
    try {
      const saved = JSON.parse(sessionStorage.getItem("hullor_last_order") || "null");
      if (saved && saved.number === number) { setOrder(saved); return; }
    } catch {}
    if (user) api(`/orders/${number}/`).then(setOrder).catch(() => {});
  }, [user, number]);
  return (
    <div className="container page-center success">
      <div className="success-icon"><IconCheck size={40} /></div>
      <h1>{t("ধন্যবাদ! আপনার অর্ডার সম্পন্ন হয়েছে", "Thank you! Your order has been placed")}</h1>
      <p className="muted">{t("অর্ডার নম্বর", "Order number")}</p>
      <div className="order-no">{number}</div>
      {order && (
        <div className="card success-card">
          <div className="sum-row"><span>{t("মোট (ক্যাশ অন ডেলিভারি)", "Total (cash on delivery)")}</span><b>{taka(order.total)}</b></div>
          <div className="sum-row"><span>{t("ডেলিভারি ঠিকানা", "Delivery address")}</span><b className="right">{order.customer_name}, {bn(order.phone)}<br />{order.address}, {order.district}</b></div>
        </div>
      )}
      {!user && <p className="muted small">{t("অর্ডার নম্বরটি সংরক্ষণ করুন — “অর্ডার ট্র্যাকিং” এ নম্বর ও মোবাইল নম্বর দিয়ে অর্ডারের অবস্থা দেখতে পারবেন।", "Please keep your order number — you can check your order status under “Track your order” with the number and your mobile number.")}</p>}
      <p className="muted">{t("আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করে অর্ডার কনফার্ম করবে। পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।", "Our team will contact you shortly to confirm your order. Pay when you receive it.")}</p>
      <div className="hero-cta center">
        <Link href={user ? `/account/orders/${number}` : `/track?number=${number}${order?.phone ? `&phone=${order.phone}` : ""}`} className="btn">{t("অর্ডার ট্র্যাক করুন", "Track order")}</Link>
        <Link href="/shop" className="btn btn-outline">{t("আরও কেনাকাটা", "Continue shopping")}</Link>
      </div>
    </div>
  );
}
