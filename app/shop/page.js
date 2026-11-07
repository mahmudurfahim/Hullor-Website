import { Suspense } from "react";
import ShopClient from "./ShopClient";
import { getI18n } from "@/lib/lang";

export async function generateMetadata() {
  const { t } = await getI18n();
  return { title: t("শপ — সকল পণ্য", "Shop — all products") };
}
export default async function ShopPage() {
  const { t } = await getI18n();
  return <Suspense fallback={<div className="container section"><p className="muted">{t("লোড হচ্ছে…", "Loading…")}</p></div>}><ShopClient /></Suspense>;
}
