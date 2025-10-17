export const GetDateObjFromDateTimeString = (dateStr, timeStr) => {
  const dateObj = new Date(dateStr);
  const [hour, min] = timeStr.split(":").map(Number);
  dateObj.setHours(hour, min, 0, 0);
  return dateObj;
};
