import Link from "next/link";
import { getI18n } from "@/lib/lang";
import { IconCash, IconPhone, IconTruck, IconPin, IconWhatsapp } from "./Icons";

export default async function Footer({ settings, categories = [] }) {
  const { t, n, catName } = await getI18n();
  const s = settings || {};
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand"><img src="/images/logo.jpg" alt="" /><span>hullor</span></Link>
          <p className="footer-about">{s.tagline || "Stay true to your style."} {t(
            "বাংলাদেশের অনলাইন শপ — ইলেকট্রনিক্স, ঘর-গৃহস্থালি, ফ্যাশন, বিউটিসহ সব ধরনের পণ্য এক জায়গায়, সারা দেশে হোম ডেলিভারি।",
            "A Bangladeshi online shop — electronics, home, fashion, beauty and more, all in one place with home delivery nationwide.",
          )}</p>
          <div className="social">
            {s.facebook_url && <a href={s.facebook_url} target="_blank" rel="noopener">Facebook</a>}
            {s.instagram_url && <a href={s.instagram_url} target="_blank" rel="noopener">Instagram</a>}
            {s.whatsapp && <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener"><IconWhatsapp size={16} /> WhatsApp</a>}
          </div>
        </div>
        <div>
          <h4>{t("ক্যাটাগরি", "Categories")}</h4>
          <ul>
            {categories.slice(0, 8).map((c) => <li key={c.id}><Link href={`/shop?category=${c.slug}`}>{catName(c)}</Link></li>)}
            {categories.length === 0 && <li><Link href="/shop">{t("সকল পণ্য", "All products")}</Link></li>}
          </ul>
        </div>
        <div>
          <h4>{t("সহায়তা", "Help")}</h4>
          <ul>
            <li><Link href="/about">{t("আমাদের সম্পর্কে", "About us")}</Link></li>
            <li><Link href="/track">{t("অর্ডার ট্র্যাকিং", "Track your order")}</Link></li>
            <li><Link href="/policy">{t("ডেলিভারি, রিটার্ন ও এক্সচেঞ্জ", "Delivery, returns & exchange")}</Link></li>
            <li><Link href="/contact">{t("যোগাযোগ", "Contact")}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t("যোগাযোগ", "Contact")}</h4>
          <ul className="footer-contact">
            {s.phone && <li><IconPhone size={16} /> <a href={`tel:${s.phone}`}>{n(s.phone)}</a></li>}
            {s.address && <li><IconPin size={16} /> {s.address}</li>}
            <li><IconTruck size={16} /> {t("সারা বাংলাদেশে হোম ডেলিভারি", "Home delivery across Bangladesh")}</li>
            <li><IconCash size={16} /> {t("শুধুমাত্র ক্যাশ অন ডেলিভারি", "Cash on delivery only")}</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {n(new Date().getFullYear())} {s.store_name || "HULLOR"}. {t("সর্বস্বত্ব সংরক্ষিত।", "All rights reserved.")}</span>
        <span>{t("তৈরি হয়েছে ভালোবাসা দিয়ে, বাংলাদেশ থেকে 🇧🇩", "Made with love in Bangladesh 🇧🇩")}</span>
      </div>
    </footer>
  );
}
