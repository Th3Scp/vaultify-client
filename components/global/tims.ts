import moment from "jalali-moment";

export function convertTime(time: Date) {
  if (localStorage.lang !== undefined && localStorage.lang === "fa") {
    const persianDay = time.toLocaleDateString("fa-IR", {
        weekday: "long",
      })
    return `${persianDay} ${moment(time).locale("fa").format("YYYY/M/D")}`;
  } else return time.toDateString();
}
