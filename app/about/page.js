import Link from "next/link";
import { getI18n, sget } from "@/lib/lang";

export async function generateMetadata() {
  const { t } = await getI18n();
  return { title: t("আমাদের সম্পর্কে", "About us") };
}
export default async function About() {
  const { t } = await getI18n();
  const settings = (await sget("/settings/", 120)) || {};
  const paras = (settings.about_text || "").split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
  return (
    <div className="container section prose-wrap">
      <span className="eyebrow">{t("আমাদের গল্প", "Our story")}</span>
      <h1>{settings.about_title || "Stay true to your style."}</h1>
      <div className="about-in static">
        <div className="about-img"><img src={settings.about_image || "/images/logo.jpg"} alt="HULLOR" /></div>
        <div className="prose">
          {paras.length > 0 ? paras.map((x, i) => <p key={i}>{x}</p>) : <>
          <p>{t(
            "HULLOR একটি বাংলাদেশি অনলাইন শপ। আমাদের বিশ্বাস — প্রয়োজনের সব পণ্য এক জায়গায়, ভরসার সাথে পাওয়া উচিত। তাই আমরা তিনটি জিনিসের ওপর নজর রাখি: মান, দাম আর সময়মতো ডেলিভারি।",
            "HULLOR is a Bangladeshi online shop. We believe everything you need should be available in one place, with trust. That's why we focus on three things: quality, fair prices and on-time delivery.",
          )}</p>
          <p>{t(
            "ইলেকট্রনিক্স, ঘর-গৃহস্থালি, ফ্যাশন, বিউটি থেকে শুরু করে প্রতিদিনের দরকারি জিনিস — প্রতিটি পণ্য বাছাই করা হয় যত্ন নিয়ে, যাতে আপনি নিশ্চিন্তে কেনাকাটা করতে পারেন।",
            "From electronics, home & kitchen, fashion and beauty to everyday essentials — every product is selected with care so you can shop with confidence.",
          )}</p></>}
          <ul className="ticks">
            <li>{t("যাচাই করা, মানসম্মত পণ্য", "Quality-checked products")}</li>
            <li>{t("সারা বাংলাদেশে হোম ডেলিভারি", "Home delivery across Bangladesh")}</li>
            <li>{t("ক্যাশ অন ডেলিভারি — আগে পণ্য দেখুন, পরে টাকা দিন", "Cash on delivery — see your order first, pay after")}</li>
            <li>{t("সহজ এক্সচেঞ্জ ও সরাসরি সাপোর্ট", "Easy exchange and direct support")}</li>
          </ul>
          <Link href="/shop" className="btn">{t("পণ্য দেখুন", "Browse products")}</Link>
        </div>
      </div>
    </div>
  );
}
