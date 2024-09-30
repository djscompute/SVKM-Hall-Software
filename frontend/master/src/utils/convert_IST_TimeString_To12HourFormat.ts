import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import the utc plugin
import timezone from "dayjs/plugin/timezone"; // Import the timezone plugin

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const convert_IST_TimeString_To12HourFormat = (
  timeString: string
): string => {
  // timeString should be of format "08:00:00" which is in IST
  // NOT "08:00:00.000Z"
  try {
    const currentDate = dayjs();
    const dateString = currentDate.format("YYYY-MM-DD");
    const completeISTString = `${dateString}T${timeString}`;
    const istTime = dayjs.tz(completeISTString, "Asia/Kolkata");
    return istTime.format("h:mm A");
  } catch (err) {
    console.log(`ERROR WHILE doing ${timeString} ${err}`);
    return "SUS";
  }
};

// const currentDate = dayjs();
// const dateString = currentDate.format("YYYY-MM-DD");
// const completeISTString = `${dateString}T${timeString}`;
// const istTime = dayjs.tz(completeISTString, "Asia/Kolkata");
// const formattedTime = istTime.format("h:mm A");
// return formattedTime;
