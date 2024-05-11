import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import the utc plugin
import timezone from "dayjs/plugin/timezone"; // Import the timezone plugin

dayjs.extend(utc);
dayjs.extend(timezone);

export function convertISO_To_IST(ISO_String: string) {
  // CONVERTS ISO STRING TO IST timsstampstring
  const parsedDate = dayjs(ISO_String);
  const istTime = parsedDate.tz("Asia/Kolkata");
  const formattedISTString = istTime.format("YYYY-MM-DDTHH:mm:ss");
  return formattedISTString;
}

export function convertIST_To_ISO(IST_String: string): string {
  const istTime = dayjs.tz(IST_String, "Asia/Kolkata");
  const utcTime = istTime.utc();
  const isoString = utcTime.toISOString();
  return isoString;
}