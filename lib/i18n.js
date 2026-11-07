// বাংলা / English — একটাই জায়গায় সব হেল্পার। কুকি: hl_lang = "bn" | "en"
export const COOKIE = "hl_lang";
export const DEFAULT_LANG = "bn";
export const normLang = (v) => (v === "en" ? "en" : "bn");

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** ক্লায়েন্টে (browser) বর্তমান ভাষা কুকি থেকে পড়ে */
export function clientLang() {
  if (typeof document === "undefined") return DEFAULT_LANG;
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  return normLang(m && decodeURIComponent(m[1]));
}

/* ব্যাকএন্ড থেকে আসা বাংলা মেসেজ → English (ব্যাকএন্ড অপরিবর্তিত) */
const MSG = {
  "এই মোবাইল নম্বর দিয়ে আগেই অ্যাকাউন্ট খোলা আছে। লগইন করুন।": "An account with this mobile number already exists. Please log in.",
  "মোবাইল নম্বরে পাঠানো ৬ ডিজিটের কোড দিন।": "Enter the 6-digit code sent to your mobile number.",
  "পাসওয়ার্ড পরিবর্তন হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।": "Your password has been changed. Please log in with the new password.",
  "কোডটি সঠিক নয়।": "That code is incorrect.",
  "অর্ডারের আগে মোবাইল নম্বর যাচাই করুন।": "Please verify your mobile number before ordering.",
  "কোডের মেয়াদ শেষ। নতুন কোড নিন।": "The code has expired. Please request a new one.",
  "অনেকবার ভুল কোড দেওয়া হয়েছে। নতুন কোড নিন।": "Too many wrong attempts. Please request a new code.",
  "এই নম্বরে অনেকবার কোড পাঠানো হয়েছে। এক ঘণ্টা পর আবার চেষ্টা করুন।": "Too many codes were sent to this number. Please try again in an hour.",
  "আজকের জন্য কোড পাঠানোর সীমা শেষ। সরাসরি কল করে অর্ডার করুন।": "Today's code limit has been reached. Please place your order by phone.",
  "এই মুহূর্তে SMS পাঠানো যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।": "We can't send SMS right now. Please try again shortly.",
  "মোবাইল নম্বরটি সঠিক নয়।": "The mobile number is not valid.",
  "৬ ডিজিটের কোড দিন।": "Enter the 6-digit code.",
  "অর্ডার পাওয়া যায়নি।": "Order not found.",
  "এই পণ্যটি আর পাওয়া যাচ্ছে না।": "This product is no longer available.",
  "অনুপলব্ধ পণ্য": "Unavailable product",
  "স্টক শেষ।": "Out of stock.",
  "কুপন কোডটি সঠিক নয়।": "This coupon code is not valid.",
  "এই কুপনটি এখন সক্রিয় নেই।": "This coupon is not active right now.",
  "এই কুপনটি এখনও শুরু হয়নি।": "This coupon has not started yet.",
  "কুপনের মেয়াদ শেষ হয়ে গেছে।": "This coupon has expired.",
  "এই কুপনের ব্যবহারের সীমা শেষ।": "This coupon has reached its usage limit.",
  "আপনার কার্ট খালি।": "Your cart is empty.",
  "অবৈধ স্ট্যাটাস।": "Invalid status.",
  "অর্ডার করা হয়েছে": "Order placed",
  "কাস্টমার বাতিল করেছেন": "Cancelled by customer",
  "রিভিউ দিতে লগইন করুন।": "Please log in to write a review.",
  "পণ্যটি ডেলিভারি পাওয়ার পর রিভিউ দিতে পারবেন।": "You can review this product after it has been delivered.",
  "১ থেকে ৫ এর মধ্যে রেটিং দিন।": "Please give a rating between 1 and 5.",
  "পণ্যটি পাওয়া যায়নি।": "Product not found.",
  "অর্ডার কনফার্ম হয়ে গেছে, এখন বাতিল করা যাবে না। সাপোর্টে যোগাযোগ করুন।": "This order is already confirmed and can no longer be cancelled. Please contact support.",
  "নাম লিখুন।": "Please enter your name.",
  "এই মোবাইল নম্বর দিয়ে আগেই অ্যাকাউন্ট খোলা আছে।": "An account with this mobile number already exists.",
  "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা আছে।": "An account with this email already exists.",
  "মোবাইল/ইমেইল অথবা পাসওয়ার্ড ভুল।": "Incorrect mobile/email or password.",
  "এই অ্যাকাউন্টটি বন্ধ করা আছে।": "This account has been disabled.",
  "এই ইমেইল অন্য অ্যাকাউন্টে ব্যবহার হচ্ছে।": "This email is used by another account.",
  "বর্তমান পাসওয়ার্ড ভুল।": "Current password is incorrect.",
  "পাসওয়ার্ড পরিবর্তন হয়েছে।": "Password changed.",
  "সঠিক মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)।": "Enter a valid mobile number (e.g. 01XXXXXXXXX).",
  "পূর্ণ ঠিকানা লিখুন (বাসা/রোড/এলাকা)।": "Enter your full address (house/road/area).",
  "অনুরোধটি সম্পন্ন করা যায়নি।": "The request could not be completed.",
};
const MSG_RE = [
  [/^আবার কোড পেতে (\d+) সেকেন্ড অপেক্ষা করুন।$/, (m) => `Please wait ${m[1]} seconds before requesting a new code.`],
  [/^কোডটি সঠিক নয়। আর (\d+) বার চেষ্টা করতে পারবেন।$/, (m) => `That code is incorrect. You have ${m[1]} attempt(s) left.`],
  [/^মাত্র (\d+)টি স্টকে আছে।$/, (m) => `Only ${m[1]} left in stock.`],
  [/^এই কুপনের জন্য সর্বনিম্ন অর্ডার ৳(\d+)।$/, (m) => `Minimum order for this coupon is ৳${m[1]}.`],
  [/^(.+): (.+) কার্ট আপডেট করে আবার চেষ্টা করুন\.$/, (m, tm) => `${m[1]}: ${tm(m[2])} Please update your cart and try again.`],
  [/^(.+) \((.+)\) এর পর্যাপ্ত স্টক নেই।$/, (m) => `Not enough stock for ${m[1]} (${m[2]}).`],
];
export function translateMsg(msg, lang) {
  if (lang !== "en" || typeof msg !== "string") return msg;
  if (MSG[msg]) return MSG[msg];
  for (const [re, fn] of MSG_RE) {
    const m = msg.match(re);
    if (m) return fn(m, (x) => translateMsg(x, lang));
  }
  return msg;
}

/* ডিফল্ট ক্যাটাগরির (slug অনুযায়ী) ইংরেজি নাম। অন্য ক্যাটাগরির নাম যেমন আছে তেমনই দেখাবে। */
export const CAT_EN = {
  electronics: "Electronics",
  "mobile-accessories": "Mobile & Accessories",
  "home-kitchen": "Home & Kitchen",
  fashion: "Fashion",
  "beauty-care": "Beauty & Personal Care",
  grocery: "Grocery",
  "sports-fitness": "Sports & Fitness",
  "toys-kids": "Toys & Kids",
  "books-stationery": "Books & Stationery",
  combo: "Combo Offers",
};

export function makeI18n(rawLang) {
  const lang = normLang(rawLang);
  const en = lang === "en";
  /** t("বাংলা", "English") */
  const t = (bnText, enText) => (en ? (enText ?? bnText) : bnText);
  /** সংখ্যা: বাংলায় ০১২৩, English এ 0123 */
  const n = (v) => {
    const s = String(v ?? "");
    return en ? s : s.replace(/\d/g, (d) => BN_DIGITS[d]);
  };
  const taka = (v) => `৳${n(Number(v || 0).toLocaleString("en-IN"))}`;
  const date = (iso) => n(new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
  const dateTime = (iso) =>
    n(new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }));
  const catName = (c) => (c ? (en && /[\u0980-\u09FF]/.test(c.name || "") && CAT_EN[c.slug]) || c.name : "");
  const tm = (msg) => translateMsg(msg, lang);
  return { lang, en, t, n, taka, date, dateTime, catName, tm };
}
