import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Client from "@/components/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainDialog from "@/components/dialog/custom";
import { colors } from "@/config";
import { CSSProperties } from "react";

const darvish = localFont({
  src: "./font/darvish.ttf",
  variable: "--font-darvish",
});
const khodkar = localFont({
  src: "./font/khodkar.ttf",
  variable: "--font-khodkar",
});
const koodak = localFont({
  src: "./font/koodak.ttf",
  variable: "--font-koodak",
});
const lalezar = localFont({
  src: "./font/lalezar.otf",
  variable: "--font-lalezar",
});
const nazanin = localFont({
  src: "./font/nazanin.ttf",
  variable: "--font-nazanin",
});
const parsa = localFont({
  src: "./font/parsa.ttf",
  variable: "--font-parsa",
});
const ziba = localFont({
  src: "./font/ziba.ttf",
  variable: "--font-ziba",
});

export const metadata: Metadata = {
  title: "Vaultify",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body
        className={`${ziba.variable} ${parsa.variable} ${nazanin.variable} ${lalezar.variable} ${koodak.variable} ${khodkar.variable} ${darvish.variable} h-[100vh] antialiased dark:bg-zinc-950 bg-neutral-300 text-black dark:text-white`}
        style={{ "--colored": colors[0] } as CSSProperties}
      >
        <Client>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <MainDialog />
          {children}
        </Client>
      </body>
    </html>
  );
}
