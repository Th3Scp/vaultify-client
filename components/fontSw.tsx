"use client";
import { createContext, ReactNode, useEffect, useState } from "react";

export type FontNames =
  | "ziba"
  | "parsa"
  | "nazanin"
  | "lalezar"
  | "koodak"
  | "khodkar"
  | "darvish";
export type ClockFontNamse = "n1" | "n2" | "n3" | "n4" | "n5" | "n6";

export const FontContext = createContext<any>(null);

export default function FontToggle({ children }: { children: ReactNode }) {
  const [font, setFont] = useState<FontNames>(
    typeof window !== "undefined" && localStorage.font
      ? localStorage.font
      : "darvish"
  );
  const [clockFont, setClockFont] = useState<ClockFontNamse | null>(
    typeof window !== "undefined" &&
      localStorage.clockFont &&
      localStorage.clockFont !== "null"
      ? localStorage.clockFont
      : null
  );

  function changeFont(fontname: FontNames) {
    setFont(fontname);
    localStorage.setItem("font", fontname);
  }

  useEffect(() => {
    localStorage.setItem("clockFont", clockFont ? clockFont : "null");
  }, [clockFont]);

  return (
    <FontContext.Provider
      value={{
        changeFont: changeFont,
        font: font,
        //
        clockFont: clockFont,
        setClockFont: setClockFont,
      }}
    >
      <div className={`${font}`}>{children}</div>
    </FontContext.Provider>
  );
}
