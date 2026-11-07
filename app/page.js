import Link from "next/link";
import { getI18n, sget } from "@/lib/lang";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import { IconCash, IconTruck, IconShield, IconPhone, IconChevron } from "@/components/Icons";

export default async function Home() {
  const { t, n, catName } = await getI18n();
  const [banners, categories, featured, newest, settings] = await Promise.all([
    sget("/banners/"), sget("/categories/"),
    sget("/products/?featured=1&page_size=8"), sget("/products/?page_size=8"), sget("/settings/"),
  ]);
  const cats = categories || [];
  const feat = featured?.results || [];
  const fresh = (newest?.results || []).filter((p) => !feat.some((f) => f.id === p.id)).slice(0, 8);
  const aboutParas = (settings?.about_text || "").split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);

  return (
    <>
      <section className="hero">
        <div className="container hero-in">
          <div className="hero-text">
            <span className="eyebrow">{t("বাংলাদেশের অনলাইন শপ", "Bangladesh's online shop")}</span>
            <h1>{t(<>যা দরকার, <em>সবই</em><br />এক জায়গায়</>, <>Everything you need,<br />in <em>one place</em></>)}</h1>
            <p className="lead">{t(
              "ইলেকট্রনিক্স, ঘর-গৃহস্থালি, ফ্যাশন, বিউটি — সব ধরনের পণ্য এক ছাদের নিচে। পছন্দ করুন, পণ্য হাতে পেয়ে টাকা দিন।",
              "Electronics, home & kitchen, fashion, beauty — every kind of product under one roof. Pick what you like and pay when it reaches your hands.",
            )}</p>
            <div className="hero-cta">
              <Link href="/shop" className="btn btn-lg">{t("পণ্য দেখুন", "Browse products")} <IconChevron size={18} /></Link>
              <Link href="/about" className="btn btn-outline btn-lg">{t("আমাদের গল্প", "Our story")}</Link>
            </div>
            <div className="hero-stats">
              <div><b>{n(64)}</b><span>{t("জেলায় ডেলিভারি", "Districts covered")}</span></div>
              <div><b>COD</b><span>{t("ক্যাশ অন ডেলিভারি", "Cash on delivery")}</span></div>
              <div><b>{t("সহজ", "Easy")}</b><span>{t("এক্সচেঞ্জ", "Exchange")}</span></div>
            </div>
          </div>
          <div className="hero-visual">
            {banners && banners.length > 0 ? <HeroSlider banners={banners} /> : (
              <div className="hero-card"><img src="/images/logo.jpg" alt="hullor — Stay true to your style" /></div>
            )}
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="container trust-grid">
          <div><IconTruck /><b>{t("দ্রুত ডেলিভারি", "Fast delivery")}</b><span>{t("সারা বাংলাদেশে হোম ডেলিভারি", "Home delivery across Bangladesh")}</span></div>
          <div><IconCash /><b>{t("ক্যাশ অন ডেলিভারি", "Cash on delivery")}</b><span>{t("পণ্য হাতে পেয়ে টাকা দিন", "Pay when you receive your order")}</span></div>
          <div><IconShield /><b>{t("যাচাই করা পণ্য", "Quality-checked products")}</b><span>{t("বাছাই করা মানসম্মত পণ্য", "Carefully selected, reliable items")}</span></div>
          <div><IconPhone /><b>{t("সরাসরি সাপোর্ট", "Direct support")}</b><span>{settings?.phone ? n(settings.phone) : t("যেকোনো সময় যোগাযোগ করুন", "Reach us any time")}</span></div>
        </div>
      </section>

      {cats.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head"><div><span className="eyebrow">{t("ক্যাটাগরি", "Categories")}</span><h2>{t("আপনার পছন্দ বেছে নিন", "Shop by category")}</h2></div><Link href="/shop" className="link-arrow">{t("সব দেখুন", "View all")} <IconChevron size={16} /></Link></div>
            <div className="cat-grid">
              {cats.map((c, i) => (
                <Link key={c.id} href={`/shop?category=${c.slug}`} className={`cat-card tone-${i % 4}`}>
                  {c.image ? <img src={c.image} alt="" /> : null}
                  <span className="cat-name">{catName(c)}</span>
                  <small>{t(`${n(c.product_count)}টি পণ্য`, `${n(c.product_count)} products`)}</small>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {feat.length > 0 && (
        <section className="section section-soft">
          <div className="container">
            <div className="sec-head"><div><span className="eyebrow">{t("এই সপ্তাহের বাছাই", "This week's picks")}</span><h2>{t("ফিচার্ড প্রোডাক্ট", "Featured products")}</h2></div><Link href="/shop?featured=1" className="link-arrow">{t("আরও দেখুন", "See more")} <IconChevron size={16} /></Link></div>
            <div className="grid-products">{feat.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          </div>
        </section>
      )}

      {fresh.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head"><div><span className="eyebrow">{t("নতুন এসেছে", "Just in")}</span><h2>{t("নতুন পণ্য", "New arrivals")}</h2></div><Link href="/shop" className="link-arrow">{t("সব পণ্য", "All products")} <IconChevron size={16} /></Link></div>
            <div className="grid-products">{fresh.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          </div>
        </section>
      )}

      {feat.length === 0 && fresh.length === 0 && (
        <section className="section"><div className="container page-center"><h2>{t("শীঘ্রই আসছে নতুন পণ্য", "New products coming soon")}</h2><p className="muted">{t("আমরা পণ্য যোগ করছি — একটু পরে আবার দেখুন।", "We're adding products — please check back shortly.")}</p></div></section>
      )}

      <section className="about-strip">
        <div className="container about-in">
          <div className="about-img"><img src={settings?.about_image || "/images/logo.jpg"} alt="HULLOR" /></div>
          <div>
            <span className="eyebrow">{t("আমাদের সম্পর্কে", "About us")}</span>
            <h2>{settings?.about_title || t("বাংলাদেশের নিজস্ব অনলাইন শপ", "A Bangladeshi online shop you can rely on")}</h2>
            {aboutParas.length > 0 ? <p>{aboutParas[0]}</p> : <p>{t(
              "HULLOR শুরু হয়েছিল একটি সহজ ভাবনা থেকে — দরকারি সব পণ্য এক জায়গায়, ভরসার সাথে, হাতে পেয়ে টাকা দেওয়ার সুযোগসহ। আমরা বেছে নিই মানসম্মত পণ্য, আর নজর রাখি যেন প্রতিটি অর্ডার ঠিকভাবে আপনার দরজায় পৌঁছায়।",
              "HULLOR started with a simple idea — everything you need in one place, with trust, and the option to pay on delivery. We pick quality products and make sure every order reaches your door properly.",
            )}</p>}
            <ul className="ticks">
              <li>{t("যাচাই করা, মানসম্মত পণ্য", "Quality-checked products")}</li>
              <li>{t("সারা বাংলাদেশে দ্রুত হোম ডেলিভারি", "Fast home delivery across Bangladesh")}</li>
              <li>{t("ক্যাশ অন ডেলিভারি ও সহজ এক্সচেঞ্জ", "Cash on delivery and easy exchange")}</li>
            </ul>
            <Link href="/about" className="btn btn-outline">{t("আরও জানুন", "Learn more")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
