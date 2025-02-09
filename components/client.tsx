"use client";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { AppProvider } from "./context";
import I18nProvider from "@/i18n/provider";
const FontToggle = dynamic(() => import("@/components/fontSw"), { ssr: false });
export default function Client({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <FontToggle>
        <AppProvider>{children}</AppProvider>
      </FontToggle>
    </I18nProvider>
  );
}
