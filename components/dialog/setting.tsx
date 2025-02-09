"use client";
import { Button } from "@/components/ui/button";
import MyDialog from "@/components/ui/dialog";
import { FontContext } from "@/components/fontSw";
import { clockFonts, colors, fonts } from "@/config";
import { Switch } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import {
  SettingSvg,
  CloseSvg,
  PaintSvg,
  BrushSvg,
  Setting2Svg,
} from "../svg/main";
import { formattedTime } from "../global/formattedTime";

const sets = [
  { key: "font", name: "فونت", svg: <BrushSvg /> },
  { key: "theme", name: "تم و رنگ", svg: <PaintSvg /> },
  { key: "global", name: "عمومی", svg: <Setting2Svg /> },
];

type FontKey = keyof typeof fonts;

export default function Setting({
  setIs24Hour,
  is24Hour,
  setKhorshidi,
  khorshidi,
  setMiladi,
  miladi,
}: {
  setIs24Hour: (c: boolean) => void;
  is24Hour: boolean;
  setKhorshidi: (c: boolean) => void;
  khorshidi: boolean;
  setMiladi: (c: boolean) => void;
  miladi: boolean;
}) {
  const { changeFont, setClockFont } = useContext(FontContext);
  const [isOpen, setIsOpen] = useState(false);
  const [wh, setWh] = useState("theme");
  const [theme, setTheme] = useState<"light" | "dark">(
    typeof window !== "undefined" ? localStorage.theme : "dark"
  );
  const [color, setColor] = useState(
    typeof window !== "undefined"
      ? localStorage.mainColor
        ? localStorage.mainColor
        : colors[0]
      : colors[0]
  );

  const time = new Date();

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    document.body.style.setProperty("--colored", color);
  }, [theme]);

  useEffect(() => {
    document.body.style.setProperty("--colored", color);
    localStorage.setItem("mainColor", color);
  }, [color]);

  const Font = () => (
    <div className="row">
      <div className="w-full mid text-lg">فونت اصلی</div>
      {Object.keys(fonts).map((e: string, i: number) => (
        <div className="w-6/12 md:w-4/12 p-2" key={i}>
          <button
            onClick={() => {
              changeFont(e);
            }}
            className="px-3 py-2 rounded-xl font-bold text-lg bg-slate-500/10 w-full letter-1"
            style={{ fontFamily: `var(--font-${e})` }}
          >
            {fonts[e as FontKey]}
          </button>
        </div>
      ))}
      <div className="w-full mid text-lg mt-3">فونت ساعت</div>
      <div className="w-6/12 md:w-4/12 p-2">
        <button
          onClick={() => {
            setClockFont(null);
          }}
          className="px-3 py-2 rounded-xl font-bold text-lg bg-slate-500/10 w-full letter-1"
        >
          {formattedTime(false, time)}
        </button>
      </div>
      {clockFonts.map((e: string, i: number) => (
        <div className="w-6/12 md:w-4/12 p-2" key={i}>
          <button
            onClick={() => {
              setClockFont(e);
            }}
            className="px-3 py-2 rounded-xl font-bold text-lg bg-slate-500/10 w-full letter-1"
            style={{ fontFamily: e }}
          >
            {formattedTime(false, time)}
          </button>
        </div>
      ))}
    </div>
  );

  const Theme = () => (
    <div className="">
      <div className="text-xl">تم رنگی</div>
      <div className="flex">
        <button className="p-3 m-1" onClick={() => toggleTheme("light")}>
          <div className="border-4 border-white/40 rounded-full bg-white w-10 h-10 mb-1"></div>
          لایت
        </button>
        <button className="p-3 m-1" onClick={() => toggleTheme("dark")}>
          <div className="border-4 border-white/40 rounded-full bg-black w-10 h-10 mb-1"></div>
          دارک
        </button>
      </div>
      {/* ==================== */}
      <div className="text-xl my-3">رنگ اصلی</div>
      <div className="row">
        {colors.map((e, i) => (
          <button className="p-3 m-1" onClick={() => setColor(e)} key={i}>
            <div
              className="border-4 border-white/40 rounded-full w-10 h-10 mb-1"
              style={{ background: e }}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );

  const Global = () => (
    <div className="">
      <div className="p-2">
        <div className="flex">
          <div className="">تاریخ میلادی</div>
          <Switch
            dir="ltr"
            checked={miladi}
            onChange={setMiladi}
            className="group mx-3 relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
            />
          </Switch>
        </div>
      </div>
      <div className="p-2">
        <div className="flex">
          <div className="">تاریخ خورشیدی</div>
          <Switch
            dir="ltr"
            checked={khorshidi}
            onChange={setKhorshidi}
            className="group mx-3 relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
            />
          </Switch>
        </div>
        <div className="p-2">
          <div className="flex">
            <div className="">ساعت {"(12 یا 24)"}</div>
            <Switch
              dir="ltr"
              checked={is24Hour}
              onChange={setIs24Hour}
              className="group mx-3 relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );

  const toggleTheme = (th: "dark" | "light") => {
    setTheme(th);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <SettingSvg />
      </Button>
      <MyDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        leftBtns={
          <button
            onClick={() => setIsOpen(false)}
            className="absolute left-3 opacity-75"
          >
            <CloseSvg />
          </button>
        }
        title={
          <div className="flex mb-1">
            <div className="text-xl">تنظیمات</div>{" "}
            <div className="mx-1 pt-1">{"<"}</div>
            <div className="font-bold text-xl">
              {sets.filter((g) => g.key === wh)[0].name}
            </div>
          </div>
        }
      >
        <div className="flex">
          <div className="w-52 h-full p-2">
            {sets.map((e, i) => (
              <button
                className={`text-xl py-1 px-3 rounded-md w-full transition-all flex my-1 ${
                  wh === e.key
                    ? "dark:text-white dark:bg-white/10 text-black bg-gray-700/20"
                    : "dark:text-white/50 dark:hover:bg-white/5 text-black/70 hover:bg-gray-700/5"
                }`}
                onClick={() => setWh(e.key)}
                key={i}
              >
                {e.svg}
                <div className="mx-1">{e.name}</div>
              </button>
            ))}
          </div>
          <div className="w-full overflow-y-scroll h-[360px]">
            <div className="py-2 ps-4">
              {wh === "font" ? (
                <Font />
              ) : wh === "theme" ? (
                <Theme />
              ) : wh === "global" ? (
                <Global />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </MyDialog>
    </>
  );
}
