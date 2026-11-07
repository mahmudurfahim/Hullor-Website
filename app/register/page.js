import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import { getI18n } from "@/lib/lang";

export async function generateMetadata() {
  const { t } = await getI18n();
  return { title: t("রেজিস্টার", "Register") };
}
export default function Page() {
  return <Suspense><AuthForm mode="register" /></Suspense>;
}
