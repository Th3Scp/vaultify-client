export const formattedTime = (is24Hour:Boolean,time:Date) => {
    const options: Intl.DateTimeFormatOptions = {
      // timeZone: "Asia/Tehran",
      hour: is24Hour ? "2-digit" : ("numeric" as "2-digit" | "numeric"),
      minute: "2-digit",
      hour12: !is24Hour,
    };
    return new Intl.DateTimeFormat("en-US", options).format(time);
  };
