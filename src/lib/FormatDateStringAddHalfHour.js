export const FormatDateStringAddHalfHour = (dateStr) => {
  const newDate = new Date(dateStr.getTime() + 30 * 60 * 1000); // add 1 hour in ms
  const offsetMs = newDate.getTimezoneOffset() * 60000;
  const localISO = new Date(newDate - offsetMs).toISOString().slice(0, -5);
  const tzOffset =
    (offsetMs <= 0 ? "+" : "-") +
    String(Math.floor(Math.abs(newDate.getTimezoneOffset()) / 60)).padStart(
      2,
      "0"
    ) +
    ":" +
    String(Math.abs(newDate.getTimezoneOffset()) % 60).padStart(2, "0");
  return localISO + tzOffset;
};
