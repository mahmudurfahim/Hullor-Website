import { cookies } from "next/headers";
import { COOKIE, makeI18n, normLang } from "./i18n";
import { serverGet } from "./api";

/** সার্ভার কম্পোনেন্টে ভাষা + হেল্পার: const { t, n, taka } = await getI18n(); */
export async function getI18n() {
  const jar = await cookies();
  return makeI18n(normLang(jar.get(COOKIE)?.value));
}

/** সার্ভার কম্পোনেন্টে ডাটা আনা — কুকির ভাষা অনুযায়ী (?lang=en) */
export async function sget(path, revalidate = 60) {
  const jar = await cookies();
  return serverGet(path, revalidate, normLang(jar.get(COOKIE)?.value));
}
