import "./globals.css";
import { getI18n, sget } from "@/lib/lang";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { IconWhatsapp } from "@/components/Icons";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata() {
  const { t, en } = await getI18n();
  return {
    metadataBase: new URL(SITE),
    title: { default: t("HULLOR | বাংলাদেশের অনলাইন শপ", "HULLOR | Online Shop Bangladesh"), template: "%s | HULLOR" },
    description: t(
      "HULLOR — সারা বাংলাদেশে ক্যাশ অন ডেলিভারিতে ইলেকট্রনিক্স, ঘর-গৃহস্থালি, ফ্যাশন, বিউটিসহ সব ধরনের পণ্য।",
      "HULLOR — electronics, home & kitchen, fashion, beauty and more, with cash on delivery across Bangladesh.",
    ),
    icons: { icon: "/images/favicon.jpg" },
    openGraph: { title: "HULLOR", description: "Stay true to your style.", images: ["/images/logo.jpg"], locale: en ? "en_US" : "bn_BD", type: "website" },
  };
}
export const viewport = { themeColor: "#faf7f0", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }) {
  const { lang, t } = await getI18n();
  const [settings, categories] = await Promise.all([sget("/settings/", 120), sget("/categories/", 120)]);
  const cats = categories || [];
  return (
    <html lang={lang} translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers settings={settings} lang={lang}>
          <Header settings={settings} categories={cats} />
          <main>{children}</main>
          <Footer settings={settings} categories={cats} />
          <CartDrawer />
          {settings?.whatsapp && (
            <a className="wa-float" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener" aria-label={t("WhatsApp এ মেসেজ করুন", "Message us on WhatsApp")}><IconWhatsapp size={26} /></a>
          )}
        </Providers>
      </body>
    </html>
  );
}
