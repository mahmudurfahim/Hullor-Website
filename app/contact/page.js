import { getI18n, sget } from "@/lib/lang";
import { IconPhone, IconPin, IconWhatsapp } from "@/components/Icons";

export async function generateMetadata() {
  const { t } = await getI18n();
  return { title: t("যোগাযোগ", "Contact") };
}
export default async function Contact() {
  const { t, n } = await getI18n();
  const s = (await sget("/settings/", 120)) || {};
  return (
    <div className="container section prose-wrap">
      <span className="eyebrow">{t("যোগাযোগ", "Contact")}</span>
      <h1>{t("আমরা আছি আপনার পাশে", "We're here for you")}</h1>
      <p className="muted">{t("অর্ডার, ডেলিভারি বা এক্সচেঞ্জ নিয়ে যেকোনো প্রশ্নে সরাসরি যোগাযোগ করুন।", "Reach out directly for any question about orders, delivery or exchanges.")}</p>
      <div className="grid-2">
        {s.phone && <a className="card contact-card" href={`tel:${s.phone}`}><IconPhone size={26} /><b>{t("ফোন করুন", "Call us")}</b><span>{n(s.phone)}</span></a>}
        {s.whatsapp && <a className="card contact-card" href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener"><IconWhatsapp size={26} /><b>{t("হোয়াটসঅ্যাপ", "WhatsApp")}</b><span>{t("মেসেজ করুন", "Send a message")}</span></a>}
        {s.address && <div className="card contact-card"><IconPin size={26} /><b>{t("ঠিকানা", "Address")}</b><span>{s.address}</span></div>}
        {s.email && <a className="card contact-card" href={`mailto:${s.email}`}><b>{t("ইমেইল", "Email")}</b><span>{s.email}</span></a>}
      </div>
    </div>
  );
}
