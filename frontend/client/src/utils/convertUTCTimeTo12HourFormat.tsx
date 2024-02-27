// export const convertUTCTimeTo12HourFormat = (timeString: string): string => {

//   const date = new Date(timeString);

//   const formattedTime = date.toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "numeric",
//     hour12: true,
//   });

//   return formattedTime;
// };



export const convertUTCTimeTo12HourFormat = (timeString: string): string => {
    // Parse the time string into individual components
    const [hour, minute, second] = timeString.split(/[:.]/);
  
    // Create a new Date object using UTC time
    const date = new Date(Date.UTC(0, 0, 0, +hour, +minute, +second));
  
    // Format the time using toLocaleTimeString
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  
    return formattedTime;
  };
  