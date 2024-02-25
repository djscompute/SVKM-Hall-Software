import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import { useState } from "react";

type Props = {
  timePickerName: string;
  timeModifier: (newTimeString: string) => void;
};

export default function BasicTimePicker({
  timePickerName,
  timeModifier,
}: Props) {
  // Function to handle time selection
  const handleTimeChange = (newTime: any) => {
    // Convert the selected time to UTC
    const stringArray = new Date(newTime).toISOString().split("T");
    const utcTime: any = stringArray[1];
    timeModifier(utcTime);
    console.log("utcTime", utcTime);
  };

  return (
    <div className=" w-full">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["TimePicker"]}>
          <TimePicker
            className="w-full bg-gray-100"
            label={timePickerName}
            onChange={handleTimeChange}
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
}
