import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";
import "chart.js/auto";
import dayjs from "dayjs";
import BasicDateTimePicker from "../../components/editHall/BasicDateTimePicker";
import { EachHallType } from "../../../../../types/global.ts";
import { useQuery } from "@tanstack/react-query";

function Report7() {
  const [hallData, setHallData] = useState<EachHallType[]>([]);
  const [selectedAdditionalFeatures, setSelectedAdditionalFeatures] = useState<string[]>([]);


  useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const responsePromise = axiosInstance.get("getAllHalls");
        console.log("FETCHING");
        toast.promise(responsePromise, {
          pending: "Fetching halls...",
          success: "Latest Halls Data Fetched !",
          error: "Failed to fetch Halls. Please try again.",
        });
        const response = await responsePromise;
        console.log(response.data);
        setHallData(response.data);
        return response.data as EachHallType[];
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });

  const [data, setData] = useState<any>();
  const [selectedHall, setSelectedHall] = useState<String>();

  const [date, setDate] = useState<{
    from: string;
    to: string;
  }>({
    from: "",
    to: "",
  });

  const [humanReadable, setHumanReadable] = useState<{
    fromHuman: string;
    toHuman: string;
  }>({
    fromHuman: "",
    toHuman: "",
  });

  const now = dayjs();

  const startOfWeek = now.startOf("week").format("YYYY-MM-DDT00:00:00");
  const endOfWeek = now.endOf("week").format("YYYY-MM-DDT23:59:59");

  const startOfMonth = now.startOf("month").format("YYYY-MM-DDT00:00:00");
  const endOfMonth = now.endOf("month").format("YYYY-MM-DDT23:59:59");

  const startOfYear = now.startOf("year").format("YYYY-MM-DDT00:00:00");
  const endOfYear = now.endOf("year").format("YYYY-MM-DDT23:59:59");

  const getThisWeek = () => {
    getData({
      from: startOfWeek,
      to: endOfWeek,
      hallName: "BJ Hall",
      additionalFeatures: ["Dining Area"],
    });
    handleHumanReadable(startOfWeek, endOfWeek);
  };
  const getThisMonth = () => {
    getData({
      from: startOfMonth,
      to: endOfMonth,
      hallName: "BJ Hall",
      additionalFeatures: ["Dining Area"],
    });
    handleHumanReadable(startOfMonth, endOfMonth);
  };
  const getThisYear = () => {
    getData({
      from: startOfYear,
      to: endOfYear,
      hallName: "BJ Hall",
      additionalFeatures: ["Dining Area"],
    });
    handleHumanReadable(startOfYear, endOfYear);
  };

  const handleHumanReadable = (from: string, to: string) => {
    let humanReadableFrom = "";
    let humanReadableTo = "";
    if (from) {
      humanReadableFrom = dayjs(from)?.format("MMMM D, YYYY");
    }
    if (to) {
      humanReadableTo = dayjs(to)?.format("MMMM D, YYYY");
    }
    console.log(humanReadableFrom, humanReadableTo);
    setHumanReadable({
      fromHuman: humanReadableFrom,
      toHuman: humanReadableTo,
    });
  };

  const getData = async ({
    from,
    to,
    hallName,
    additionalFeatures,
  }: {
    from: string;
    to: string;
    hallName: string;
    additionalFeatures: string[];
  }) => {
    if (!from || !to) return;
    const responsePromise = axiosInstance.post(
      "dashboard/generateAdditionalFeatureReport",
      {
        fromDate: from,
        toDate: to,
        hallName: hallName,
        additionalFeatures: additionalFeatures,
      }
    );
    toast.promise(responsePromise, {
      pending: "Fetching Report...",
      error: "Failed to fetch Report. Please contact maintainer.",
    });
    const response = await responsePromise;
    console.log(response.data);
    setData(response.data);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 mb-20">
      <span className="text-xl font-medium mt-5">Hall Wise Bookings</span>
      <div className="flex gap-2">
        <BasicDateTimePicker
          timeModifier={(time) => {
            setDate((prev) => ({ ...prev, from: time }));
          }}
          timePickerName="from"
        />
        <BasicDateTimePicker
          timeModifier={(time) => {
            setDate((prev) => ({ ...prev, to: time }));
          }}
          timePickerName="to"
        />
      </div>
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded-md"
        onClick={() =>
          getData({
            from: date.from,
            to: date.to,
            hallName: "BJ Hall",
            additionalFeatures: ["Dining Area"],
          })
        }
      >
        Get for Time Period
      </button>
      <span>or</span>

      <button
        className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-xs"
        onClick={() => getThisWeek()}
      >
        Get for this Week
      </button>
      <button
        className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-xs"
        onClick={() => getThisMonth()}
      >
        Get for this Month
      </button>
      <button
        className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-xs"
        onClick={() => getThisYear()}
      >
        Get for this Year
      </button>

      <hr className=" bg-gray-300 h-[1.5px] w-[50%] my-5" />

      <div>
        <select
          className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-l mt-3"
          onChange={(e) => setSelectedHall(e.target.value)}
        >
          <option value="">Select Hall</option>
          {hallData &&
            hallData.map((hall, index) => (
              <option key={index} value={hall.name}>
                {hall.name}
              </option>
            ))}
        </select>
      </div>


      <hr className=" bg-gray-300 h-[1.5px] w-[50%] my-5" />

      <div>

        {hallData &&
          hallData.map((hall, index) => {
            if (hall.name === selectedHall) {
              return (
                <div key={index}>
                  <span className="my-2 block">Select Additional Features:</span>
                  {hall.additionalFeatures?.map((feature, featureIndex) => (
                    <label key={featureIndex}>
                      <input
                        type="checkbox"
                        value={feature.heading}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            setSelectedAdditionalFeatures((prev) => [...prev, feature.heading]);
                          } else {
                            setSelectedAdditionalFeatures((prev) =>
                              prev.filter((item) => item !== feature.heading)
                            );
                          }
                        }}
                      />
                      <h1 className="mx-3 inline-block">{feature.heading}</h1>
                    </label>
                  ))}
                </div>
              );
            }
            return null;
          })}
      </div>

    </div>
  );
}

export default Report7;