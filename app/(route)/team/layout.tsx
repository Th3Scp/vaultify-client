"use client";
import { useContext, useEffect, useState } from "react";
import Navbar from "./layout/navbar";
import { AppContext } from "@/components/context";
import Loader from "@/components/ui/loader";
import Login from "@/components/side/login";
import { CookGet } from "@/components/global/cookie";
import { chechIsLogin } from "@/components/actions/login";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLogin, setIsLogin, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  async function check() {
    const jwt = CookGet("jwt");
    if (jwt) {
      const res = await chechIsLogin({ jwt: jwt });
      if (res.status === 200) {
        setIsLogin(true);
        setUser({ email: res.email, avatar: res.avatar });
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    if (isLogin === false) {
      check();
    }
  }, [isLogin]);

  return (
    <div dir="ltr" className="h-[100vh]">
      {loading ? (
        <Loader />
      ) : !isLogin ? (
        <Login />
      ) : (
        <>
          <Navbar />
          <div className="w-full min-h-full pt-16 mid-c pb-10">{children}</div>
        </>
      )}
    </div>
  );
}
