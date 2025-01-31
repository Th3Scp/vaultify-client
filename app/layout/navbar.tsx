"use client";
import Setting from "@/components/dialog/setting";
import moment from "jalali-moment";
import { useContext, useEffect, useState } from "react";
import { formattedTime } from "@/components/global/formattedTime";
import { FontContext } from "@/components/fontSw";
import Data from "@/components/dialog/data";

export default function Navbar() {
  const [is24Hour, setIs24Hour] = useState<boolean>(
    typeof window !== "undefined" && localStorage.clockIs24=== "T" ? true : false
  );
  const [miladi, setMiladi] = useState<boolean>(
    typeof window !== "undefined" && localStorage.mildaiShow=== "T" ? true : false
  );
  const [khorshidi, setKhorshidi] = useState<boolean>(
    typeof window !== "undefined" && localStorage.khorshidiShow === "T" ? true : false
  );

  useEffect(() => {
    localStorage.setItem("mildaiShow", miladi ? "T" : "F");
  }, [miladi]);
  useEffect(() => {
    localStorage.setItem("khorshidiShow", khorshidi? "T" : "F");
  }, [khorshidi]);
  useEffect(() => {
    localStorage.setItem("clockIs24", is24Hour? "T" : "F");
  }, [is24Hour]);

  return (
    <>
      <div className="w-full mid pt-6">
        <div className="container px-2 md:px-4 lg:px-7 flex">
          <Setting
            miladi={!miladi}
            setMiladi={(c) => setMiladi((g: boolean) => !g)}
            khorshidi={!khorshidi}
            setKhorshidi={(c) => setKhorshidi((g: boolean) => !g)}
            is24Hour={!is24Hour}
            setIs24Hour={(c) => setIs24Hour((g: boolean) => !g)}
          />
          <Data/>

          <DigitalClock
            is24Hour={is24Hour}
            miladi={miladi}
            khorshidi={khorshidi}
          />
        </div>
      </div>
    </>
  );
}

function DigitalClock({
  is24Hour,
  miladi,
  khorshidi,
}: {
  is24Hour: boolean;
  miladi: boolean;
  khorshidi: boolean;
}) {
  const { clockFont } = useContext(FontContext);
  const date = new Date();
  const persianDay = date.toLocaleDateString("fa-IR", {
    weekday: "long",
  });
  const [time, setTime] = useState(date);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="me-auto row justify-center items-center" dir="ltr">
      
      <div className="mid-c w-52">
        <div
          className="colored text-4xl m-0"
          style={clockFont !== null ? { fontFamily: clockFont } : undefined}
        >
          {formattedTime(is24Hour, time)}
        </div>
        <div className="text-lg letter-1">{persianDay}</div>
      </div>

      <div className="text-lg px-7 opacity-80">
        {miladi && (
          <div className="flex">
            <div className="text-[11px] mx-1">میلادی</div>
            {date.getFullYear()}/{date.getDay()}/{date.getMonth() + 1}{" "}
          </div>
        )}
        {khorshidi && (
          <div className="flex">
            <div className="text-[11px] mx-1">خورشیدی</div>
            {moment().locale("fa").format("YYYY/M/D")}
          </div>
        )}
      </div>

    </div>
  );
}
