"use client";

import moment from "jalali-moment";
import { useEffect, useMemo, useState } from "react";
import { CaretTopSvg, TrashSvg } from "../svg/main";
import { getWeekDayNumber } from "../global/getWeekDay";
const months = [
  { name: "", days: 0 },
  { name: "فروردین", days: 31 },
  { name: "اردیبهشت", days: 31 },
  { name: "خرداد", days: 31 },
  { name: "تیر", days: 31 },
  { name: "مرداد", days: 31 },
  { name: "شهریور", days: 31 },
  { name: "مهر", days: 30 },
  { name: "آبان", days: 30 },
  { name: "آذر", days: 30 },
  { name: "دی", days: 30 },
  { name: "بهمن", days: 30 },
  { name: "اسفند", days: 29 },
];
export type DayType = { day: number; month: number; year: number };
export default function DatePicker({
  multiSelect = false,
  toDaySelected = true,
  disableBefore = false,
  onChange,
  defaultValue,
}: {
  multiSelect?: boolean;
  toDaySelected?: boolean;
  disableBefore?: boolean;
  onChange: (e: DayType[]) => void;
  defaultValue?: DayType[];
}) {
  const date = moment().locale("fa").format("YYYY/M/D").split("/");
  const [day, setDay] = useState<DayType[]>(
    defaultValue !== undefined
      ? defaultValue
      : toDaySelected
      ? [
          {
            day: Number(date[2]),
            month: Number(date[1]),
            year: Number(date[0]),
          },
        ]
      : []
  );
  const [month, setMonth] = useState(Number(date[1]));
  const [year, setYear] = useState(Number(date[0]));

  const sortDay = (days: DayType[]) => {
    return days.sort((a, b) =>
      a.year !== b.year
        ? b.year - a.year
        : a.month !== b.month
        ? b.month - a.month
        : b.day - a.day
    );
  };

  const selectDayHandler = (sDay: number, sMonth: number, sYear: number) => {
    const up = { day: sDay, month: sMonth, year: sYear };

    if (multiSelect) {
      const isExisting = day.some(
        (d) => d.day === sDay && d.month === sMonth && d.year === sYear
      );

      if (isExisting) {
        const updated = day.filter(
          (d) => !(d.day === sDay && d.month === sMonth && d.year === sYear)
        );
        setDay(sortDay(updated));
      } else {
        setDay((prevDays) => sortDay([...prevDays, up]));
      }
    } else {
      setDay(sortDay([up]));
    }
  };

  const isSelected = (sDay: number, sMonth: number, sYear: number) => {
    let is = false;
    for (let i = 0; i < day.length; i++) {
      if (
        day[i].day === sDay &&
        day[i].month === sMonth &&
        day[i].year === sYear
      ) {
        is = true;
      }
    }
    return is;
  };

  const removeDay = (sDay: number, sMonth: number, sYear: number) => {
    setDay((g) =>
      g.filter(
        (d) => !(d.day === sDay && d.month === sMonth && d.year === sYear)
      )
    );
  };

  const showSelectedDays = useMemo(() => {
    return day.length === 0 ? <>
    <div className="text-xl">
      هیچ زمانی انتخاب نشده است
    </div>
    </> :day.map((e, i) => (
      <div className="w-6/12 p-1" key={i}>
        <div className="mid p-2 rounded-lg border-2 border-white/10">
          <button
            className="me-auto text-red-600/60 hover:text-red-600/100 transition-all"
            onClick={() => removeDay(e.day, e.month, e.year)}
          >
            <TrashSvg />
          </button>
          {e.year}/{e.month}/{e.day}
        </div>
      </div>
    ));
  }, [day]);

  const days = useMemo(() => {
    let skip = getWeekDayNumber(year, month, 1);
    return (
      <>
        {Array.from({ length: skip === 7 ? 0 : skip }, (_, i) => (
          <div className="h-10 w-10 p-1" key={i}></div>
        ))}
        {Array.from({ length: months[month].days }, (_, i) => {
          const day = i + 1;
          let isDisabled = true;
          if (Number(date[0]) < year) {
            isDisabled = false;
          } else if (Number(date[0]) === year && Number(date[1]) < month) {
            isDisabled = false;
          } else if (
            Number(date[0]) === year &&
            Number(date[1]) === month &&
            Number(date[2]) < i + 1
          ) {
            isDisabled = false;
          }
          const isSelectedDay = isSelected(day, month, year);
          const isToday =
            year === Number(date[0]) &&
            month === Number(date[1]) &&
            day === Number(date[2]);

          return (
            <div className="h-10 w-10 p-1" key={i}>
              <button
                onClick={() => selectDayHandler(day, month, year)}
                disabled={isDisabled}
                className={`rounded-full bg-neutral-900 w-full h-full mid pwshh1 font-bold letter-1 
          ${isSelectedDay && "bg-colored"} 
          ${isDisabled && "opacity-60"} 
          ${isToday && "pws"}`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </>
    );
  }, [month, day, year]);

  const weekDayNames = useMemo(() => {
    return (
      <>
        {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((e, i) => (
          <div className="h-10 w-10 p-1" key={i}>
            <div className="rounded-full w-full h-full mid letter-1 opacity-90">
              {e}
            </div>
          </div>
        ))}
      </>
    );
  }, [month, year]);

  useEffect(() => {
    onChange(day);
  }, [day]);


  return (
    <>
      <div className="w-80 p-3 rounded-xl row text-white dark:text-black">
        <div className="w-6/12 p-2">
          <div className="p-1 border-2 border-white/10 bg-neutral-950 flex rounded-xl mid">
            <button
              onClick={() => setMonth((g) => g + 1)}
              className={`opacity-70 hover:opacity-100 border-l-2 border-white/10 h-full hotexcolored transition-all ${
                month === 0 && "disabled"
              }`}
              disabled={month === 12 ? true : false}
            >
              <div className="rotate-90">
                <CaretTopSvg />
              </div>
            </button>
            <div className="mx-auto">{months[month].name}</div>
            <button
              onClick={() => setMonth((g) => g - 1)}
              className={`opacity-70 hover:opacity-100 border-r-2 border-white/10 h-full hotexcolored transition-all ${
                month === 0 && "disabled"
              }`}
              disabled={month === 1 ? true : false}
            >
              <div className="-rotate-90">
                <CaretTopSvg />
              </div>
            </button>
          </div>
        </div>
        <div className="w-6/12 p-2">
          <div className="p-1 border-2 border-white/10 bg-neutral-950 flex rounded-xl mid">
            <button
              onClick={() => setYear((g) => g + 1)}
              className="opacity-70 hover:opacity-100 border-l-2 border-white/10 h-full hotexcolored transition-all"
            >
              <div className="rotate-90">
                <CaretTopSvg />
              </div>
            </button>
            <div className="mx-auto">{year}</div>
            <button
              onClick={() => setYear((g) => g - 1)}
              className="opacity-70 hover:opacity-100 border-r-2 border-white/10 h-full hotexcolored transition-all"
            >
              <div className="-rotate-90">
                <CaretTopSvg />
              </div>
            </button>
          </div>
        </div>
        <div className="w-full row text-black">{weekDayNames}</div>
        <div className="w-full row">{days}</div>
      </div>
      <div className="w-[calc(100%-320px)] row justify-center max-h-full overflow-y-scroll py-3">
        {multiSelect && showSelectedDays}
      </div>
    </>
  );
}
