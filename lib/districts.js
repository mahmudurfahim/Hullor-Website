// [value (ইংরেজি, অর্ডারে সেভ হয়), বাংলা নাম]
export const DISTRICTS = [
  ["Dhaka","ঢাকা"],["Gazipur","গাজীপুর"],["Narayanganj","নারায়ণগঞ্জ"],["Narsingdi","নরসিংদী"],["Munshiganj","মুন্সিগঞ্জ"],["Manikganj","মানিকগঞ্জ"],["Tangail","টাঙ্গাইল"],["Kishoreganj","কিশোরগঞ্জ"],["Faridpur","ফরিদপুর"],["Gopalganj","গোপালগঞ্জ"],["Madaripur","মাদারীপুর"],["Rajbari","রাজবাড়ী"],["Shariatpur","শরীয়তপুর"],
  ["Chattogram","চট্টগ্রাম"],["Cox's Bazar","কক্সবাজার"],["Cumilla","কুমিল্লা"],["Feni","ফেনী"],["Noakhali","নোয়াখালী"],["Lakshmipur","লক্ষ্মীপুর"],["Chandpur","চাঁদপুর"],["Brahmanbaria","ব্রাহ্মণবাড়িয়া"],["Rangamati","রাঙ্গামাটি"],["Khagrachhari","খাগড়াছড়ি"],["Bandarban","বান্দরবান"],
  ["Sylhet","সিলেট"],["Moulvibazar","মৌলভীবাজার"],["Habiganj","হবিগঞ্জ"],["Sunamganj","সুনামগঞ্জ"],
  ["Rajshahi","রাজশাহী"],["Natore","নাটোর"],["Naogaon","নওগাঁ"],["Chapainawabganj","চাঁপাইনবাবগঞ্জ"],["Pabna","পাবনা"],["Sirajganj","সিরাজগঞ্জ"],["Bogura","বগুড়া"],["Joypurhat","জয়পুরহাট"],
  ["Rangpur","রংপুর"],["Dinajpur","দিনাজপুর"],["Thakurgaon","ঠাকুরগাঁও"],["Panchagarh","পঞ্চগড়"],["Nilphamari","নীলফামারী"],["Lalmonirhat","লালমনিরহাট"],["Kurigram","কুড়িগ্রাম"],["Gaibandha","গাইবান্ধা"],
  ["Khulna","খুলনা"],["Bagerhat","বাগেরহাট"],["Satkhira","সাতক্ষীরা"],["Jashore","যশোর"],["Narail","নড়াইল"],["Magura","মাগুরা"],["Jhenaidah","ঝিনাইদহ"],["Kushtia","কুষ্টিয়া"],["Chuadanga","চুয়াডাঙ্গা"],["Meherpur","মেহেরপুর"],
  ["Barishal","বরিশাল"],["Bhola","ভোলা"],["Patuakhali","পটুয়াখালী"],["Pirojpur","পিরোজপুর"],["Jhalokathi","ঝালকাঠি"],["Barguna","বরগুনা"],
  ["Mymensingh","ময়মনসিংহ"],["Jamalpur","জামালপুর"],["Netrokona","নেত্রকোণা"],["Sherpur","শেরপুর"],
];
export const districtBn = (en) => DISTRICTS.find((d) => d[0] === en)?.[1] || en;
/** ভাষা অনুযায়ী জেলার নাম (অর্ডারে ইংরেজি নামই সেভ হয়) */
export const districtName = (value, lang) => (lang === "en" ? value : districtBn(value));
