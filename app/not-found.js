import Link from "next/link";
import { getI18n } from "@/lib/lang";

export default async function NotFound() {
  const { t, n } = await getI18n();
  return (
    <div className="container page-center">
      <div className="big-num">{n(404)}</div>
      <h1>{t("পেজটি খুঁজে পাওয়া যায়নি", "Page not found")}</h1>
      <p className="muted">{t("লিংকটি ভুল হতে পারে অথবা পণ্যটি আর নেই।", "The link may be wrong, or the product is no longer available.")}</p>
      <Link href="/shop" className="btn">{t("শপে ফিরে যান", "Back to shop")}</Link>
    </div>
  );
}
