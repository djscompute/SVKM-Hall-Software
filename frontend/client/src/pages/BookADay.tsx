import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { EachHallType } from "../types/Hall.types";
import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat";
import { useState } from "react";

function BookADay() {
  const { id, day } = useParams();
  const [selectedSessionId, setSelectedSessionId] = useState<string>();

  const dayjsObject = dayjs(day);
  const humanReadableDate = dayjsObject.format("MMMM D, YYYY");

  const {
    data: HallData,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const responsePromise = axiosInstance.get(`getHall/${id}`);
        toast.promise(responsePromise, {
          pending: "Fetching hall...",
          // success: "Hall fetched successfully!",
          error: "Failed to fetch Hall. Please try again.",
        });
        const response = await responsePromise;
        return response.data as EachHallType;
      } catch (error) {
        throw error;
      }
    },
  });
  if (isFetching) return <h1>Loading</h1>;

  return (
    <div className="flex flex-col items-center pt-10 gap-3">
      <h1 className=" text-3xl font-semibold">
        Book HallName for {humanReadableDate}
      </h1>
      <select
        className=" px-2 py-1 rounded-md"
        value={selectedSessionId}
        onChange={(e) => {
          setSelectedSessionId(e.target.value);
        }}
      >
        {HallData?.sessions?.map((eachSession) => (
          <option
            key={eachSession._id}
            value={eachSession._id}
            className={`flex flex-col text-center ${
              !eachSession.active && "hidden"
            }`}
          >
            {eachSession.name} |{" "}
            {convert_IST_TimeString_To12HourFormat(eachSession.from as string)}{" "}
            - {convert_IST_TimeString_To12HourFormat(eachSession.to)}
          </option>
        ))}
      </select>
      <span className=" font-semibold text-2xl mt-10">
        IDHAR AUR FORM KE FEILDS CHAHIYE
      </span>
    </div>
  );
}

export default BookADay;
