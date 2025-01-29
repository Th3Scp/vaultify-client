import moment from "jalali-moment";

export const getWeekDayName = (year: number, month: number, day: number,loc="en"): string => {

  const date = moment(`${year}/${month}/${day}`, "jYYYY/jM/jD").locale(loc);

  return date.format("dddd");
};
export const getWeekDayNumber = (year: number, month: number, day: number): number => {
  const date = moment(`${year}/${month}/${day}`, "jYYYY/jM/jD");

  const weekday = date.format("d");
  return (parseInt(weekday) + 1);
};
