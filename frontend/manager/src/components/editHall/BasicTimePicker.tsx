import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { convertISO_To_IST, convertIST_To_ISO } from "../../utils/ISO-IST";
// import { useState } from "react";

type Props = {
  timePickerName: string;
  timeModifier: (newTimeString: string) => void;
};

export default function BasicTimePicker({
  timePickerName,
  timeModifier,
}: Props) {
  const handleTimeChange = (newTime: any) => {
    // Function to handle time selection
    
    // console.log("newTime.date", newTime.$d);
    const isoString = newTime.$d.toISOString();
    // console.log("isoString ", isoString);
    const istString = convertISO_To_IST(isoString);
    // console.log("istString ", istString);

    const onlyTime = istString.split("T")[1];

    console.log(onlyTime);

    timeModifier(onlyTime);
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
