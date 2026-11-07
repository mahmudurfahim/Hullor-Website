import { getI18n } from "@/lib/lang";

export async function generateMetadata() {
  const { t } = await getI18n();
  return { title: t("ডেলিভারি, রিটার্ন ও এক্সচেঞ্জ", "Delivery, returns & exchange") };
}
export default async function Policy() {
  const { t } = await getI18n();
  return (
    <div className="container section prose-wrap">
      <h1>{t("ডেলিভারি, রিটার্ন ও এক্সচেঞ্জ নীতি", "Delivery, return & exchange policy")}</h1>
      <div className="prose">
        <h3>{t("ডেলিভারি", "Delivery")}</h3>
        <p>{t(
          "সারা বাংলাদেশে হোম ডেলিভারি দেওয়া হয়। সাধারণত ঢাকায় ১–২ দিন এবং ঢাকার বাইরে ২–৫ কর্মদিবসের মধ্যে পণ্য পৌঁছে যায়। ডেলিভারি চার্জ চেকআউটে দেখানো হয়।",
          "We deliver to your door across Bangladesh. Orders usually arrive within 1–2 days in Dhaka and 2–5 working days outside Dhaka. The delivery charge is shown at checkout.",
        )}</p>
        <h3>{t("পেমেন্ট", "Payment")}</h3>
        <p>{t(
          "শুধুমাত্র ক্যাশ অন ডেলিভারি। পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে টাকা পরিশোধ করুন। অগ্রিম কোনো পেমেন্ট লাগে না।",
          "Cash on delivery only. Pay the delivery person when you receive your order. No advance payment is needed.",
        )}</p>
        <h3>{t("অর্ডার বাতিল", "Cancelling an order")}</h3>
        <p>{t(
          "অর্ডার “অপেক্ষমাণ” অবস্থায় থাকলে আপনার অ্যাকাউন্ট থেকে নিজেই বাতিল করতে পারবেন। কনফার্ম হয়ে গেলে আমাদের সাপোর্টে যোগাযোগ করুন।",
          "While an order is “Pending” you can cancel it yourself from your account. Once it is confirmed, please contact our support.",
        )}</p>
        <h3>{t("রিটার্ন ও এক্সচেঞ্জ", "Returns & exchange")}</h3>
        <p>{t(
          "ভুল, ত্রুটিপূর্ণ বা ক্ষতিগ্রস্ত পণ্য পেলে ডেলিভারির ৩ দিনের মধ্যে আমাদের জানান। পণ্যটি অব্যবহৃত ও অরিজিনাল প্যাকেজিংসহ থাকতে হবে।",
          "If you receive a wrong, defective or damaged item, let us know within 3 days of delivery. The product must be unused and in its original packaging.",
        )}</p>
      </div>
    </div>
  );
}
