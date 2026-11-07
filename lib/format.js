// অর্ডার স্ট্যাটাস (লেবেল দুই ভাষায়)
export const STATUS = {
  pending: { bn: "অপেক্ষমাণ", en: "Pending", tone: "warn" },
  confirmed: { bn: "কনফার্মড", en: "Confirmed", tone: "info" },
  processing: { bn: "প্রসেসিং", en: "Processing", tone: "info" },
  shipped: { bn: "শিপড", en: "Shipped", tone: "info" },
  delivered: { bn: "ডেলিভারড", en: "Delivered", tone: "ok" },
  cancelled: { bn: "বাতিল", en: "Cancelled", tone: "bad" },
  returned: { bn: "রিটার্ন", en: "Returned", tone: "bad" },
};
export const FLOW = ["pending", "confirmed", "processing", "shipped", "delivered"];
export const statusLabel = (s, lang) => STATUS[s]?.[lang === "en" ? "en" : "bn"] || s;

/** ভ্যারিয়েন্টের সংক্ষিপ্ত লেখা: "সাইজ/অপশন: M · ব্ল্যাক" ("Free" হলে অপশন দেখায় না) */
export function variantText(size, color, t) {
  const hasOpt = size && String(size).trim().toLowerCase() !== "free";
  return [hasOpt ? `${t("সাইজ/অপশন", "Size/Option")}: ${size}` : "", color].filter(Boolean).join(" · ");
}
