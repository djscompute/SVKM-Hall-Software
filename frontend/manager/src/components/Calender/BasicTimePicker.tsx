import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { convertISO_To_IST } from "../../utils/ISO-IST";
import { DatePicker } from "@mui/x-date-pickers";
// import { useState } from "react";
import dayjs from 'dayjs';


type Props = {
  timePickerName: string;
  timeModifier: (newDateTimeString: string) => void;
};

export default function BasicDateTimePicker({
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

    const onlyDate = istString.split("T")[0];

    let fullDateTimeString = onlyDate;

    // THIS MIGHT BREAK in some cases.
    // adjust according to your need

    if (timePickerName == "from") {
      fullDateTimeString += "T00:00:00";
    } else if (timePickerName == "to") {
      fullDateTimeString += "T23:59:59";
    } else {
      fullDateTimeString += "T00:00:00";
    }

    console.log(fullDateTimeString);

    timeModifier(fullDateTimeString);
  };

  return (
    <div className=" w-full">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["TimePicker"]}>
          <DatePicker
            className="w-full bg-gray-100"
            label={timePickerName}
            onChange={handleTimeChange}
            minDate={dayjs('2024-01-01')}
            maxDate={dayjs('2026-12-31')}
            format="DD/MM/YYYY"
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
}