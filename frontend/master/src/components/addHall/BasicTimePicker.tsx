import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
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
    const timeString = dayjs(newTime.$d).format("HH:mm:ss");
    timeModifier(timeString);
  };

  return (
    <div className=" w-full">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["TimePicker"]}>
          <TimePicker
            className="w-full bg-gray-300"
            label={timePickerName}
            onChange={handleTimeChange}
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
}
