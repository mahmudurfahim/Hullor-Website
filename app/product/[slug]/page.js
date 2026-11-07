import { notFound } from "next/navigation";
import ProductView from "./ProductView";
import { getI18n, sget } from "@/lib/lang";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await sget(`/products/${slug}/`, 30);
  const { t } = await getI18n();
  if (!p) return { title: t("পণ্য", "Product") };
  return {
    title: p.name,
    description: p.description?.slice(0, 150) || `${p.name} — HULLOR`,
    openGraph: { title: p.name, images: p.image ? [p.image] : ["/images/logo.jpg"] },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = await sget(`/products/${slug}/`, 30);
  if (!p) notFound();
  return <ProductView product={p} />;
}
