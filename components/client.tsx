"use client";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { AppProvider } from "./context";
const FontToggle = dynamic(() => import("@/components/fontSw"), { ssr: false });
export default function Client({ children }: { children: ReactNode }) {
  return <FontToggle><AppProvider>{children}</AppProvider></FontToggle>;
}
