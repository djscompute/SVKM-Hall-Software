import { useEffect, useState } from "react";
import axiosMasterInstance from "../../config/axiosMasterInstance";
import { toast } from "react-toastify";
import "chart.js/auto";
import dayjs from "dayjs";
import BasicDateTimePicker from "../../components/editHall/BasicDateTimePicker";
import { EachHallType } from "../../../../../types/global.ts";
import { useQuery } from "@tanstack/react-query";
import { getFinancialYearEnd, getFinancialYearStart } from "../../utils/financialYearRange.tsx";

function Report8() {
  const [hallData, setHallData] = useState<EachHallType[]>([]);

  useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const responsePromise = axiosMasterInstance.get("getAllHalls");
        console.log("FETCHING");
        toast.promise(responsePromise, {
          pending: "Fetching halls...",
          error: "Failed to fetch Halls. Please try again.",
        });
        const response = await responsePromise;
        setHallData(response.data);
        return response.data as EachHallType[];
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });

  const [data, setData] = useState<any>();
  const [selectedHall, setSelectedHall] = useState<string>("All");
  const [selectedHallId, setSelectedHallId] = useState<string>("All");
  const [selectedSession, setSelectedSession] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [hallCharges, setHallCharges] = useState<boolean>(false);
  const [responseHallCharges, setresponseHallCharges] = useState<boolean>();
  const [selectedDisplayPeriod, setSelectedDisplayPeriod] =
    useState<string>("Select");

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
  const [humanReadableRequest, setHumanReadableRequest] = useState<{
    fromHuman: string;
    toHuman: string;
  }>({
    fromHuman: "",
    toHuman: "",
  });

  const now = dayjs();

  const handleHumanReadable = (from: string, to: string) => {
    let humanReadableFrom = "";
    let humanReadableTo = "";
    if (selectedDisplayPeriod === "Today") {
      humanReadableFrom = dayjs().format("MMMM D, YYYY");
      humanReadableTo = dayjs().format("MMMM D, YYYY");
    } else if (selectedDisplayPeriod === "Tomorrow") {
      humanReadableFrom = dayjs().add(1, "day").format("MMMM D, YYYY");
      humanReadableTo = dayjs().add(1, "day").format("MMMM D, YYYY");
    } else if (selectedDisplayPeriod === "Week") {
      humanReadableFrom = dayjs().startOf("week").format("MMMM D, YYYY");
      humanReadableTo = dayjs().endOf("week").format("MMMM D, YYYY");
    } else if (selectedDisplayPeriod === "Month") {
      humanReadableFrom = dayjs().startOf("month").format("MMMM D, YYYY");
      humanReadableTo = dayjs().endOf("month").format("MMMM D, YYYY");
    } else if (selectedDisplayPeriod === "Year") {
      humanReadableFrom = dayjs().startOf("year").format("MMMM D, YYYY");
      humanReadableTo = dayjs().endOf("year").format("MMMM D, YYYY");
    } else if(selectedDisplayPeriod === "Fin-Year"){
      humanReadableFrom = getFinancialYearStart().format("MMMM D, YYYY");
      humanReadableTo = getFinancialYearEnd().format("MMMM D, YYYY");
    }else {
      if (from) {
        humanReadableFrom = dayjs(from).format("MMMM D, YYYY");
      }
      if (to) {
        humanReadableTo = dayjs(to).format("MMMM D, YYYY");
      }
    }
    setHumanReadable({
      fromHuman: humanReadableFrom,
      toHuman: humanReadableTo,
    });
  };

  useEffect(() => {
    handleHumanReadable(date.from, date.to);
  }, [selectedDisplayPeriod, date.from, date.to]);

  useEffect(()=>{
    console.log("booking data",data);
    
  },[])

  const getData = async ({
    displayPeriod,
    fromDate,
    toDate,
    displayHall,
    displayCustomerCategory,
    displaySession,
    displayHallCharges,
  }: {
    displayPeriod: string;
    fromDate: string;
    toDate: string;
    displayHall: string;
    displayCustomerCategory: string;
    displaySession: string;
    displayHallCharges: boolean;
  }) => {
    if (!displayPeriod) return;
    setresponseHallCharges(displayHallCharges);
    setHumanReadableRequest(humanReadable);
    let request;
    if (displayPeriod === "Select") {
      request = {
        displayPeriod: displayPeriod,
        fromDate: fromDate,
        toDate: toDate,
        displayHall: displayHall,
        displayCustomerCategory: displayCustomerCategory,
        displaySession: displaySession,
        displayHallCharges: displayHallCharges,
      };
      console.log(request);
    } else {
      request = {
        displayPeriod: displayPeriod,
        displayHall: displayHall,
        displayCustomerCategory: displayCustomerCategory,
        displaySession: displaySession,
        displayHallCharges: displayHallCharges,
      };
      console.log(request);
    }

    const responsePromise = axiosMasterInstance.post(
      "dashboard/generateBookingInformationReport",
      request
    );
    toast.promise(responsePromise, {
      pending: "Fetching Report...",
      error: "Failed to fetch Report. Please contact maintainer.",
    });
    const response = await responsePromise;
    console.log("data here ", response.data);
    // console.log("got session is",data[0].Session);
    
    // const newresp=await axiosMasterInstance.post("/getSessionName",{sessionName:data[0].Session});
    // console.log("session name",newresp.data);
    
    setData(response.data);
  };

  const downloadCsv = () => {
    if (!data) return;
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedHall} Booking Information Reports ${humanReadable.fromHuman}-${humanReadable.toHuman} .csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 mb-20">
      <span className="text-xl font-medium mt-5">
        Booking Information Report
      </span>
      {/* SELECT DISPLAY PERIOD */}
      <div className="mt-4">
        <select
          className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-center"
          onChange={(e) => setSelectedDisplayPeriod(e.target.value)}
        >
          <option value="Select">Select Display Period</option>
          <option value="Today">Today</option>
          <option value="Tomorrow">Tomorrow</option>
          <option value="Week">This week</option>
          <option value="Month">Current Month</option>
          <option value="Year">Current Year</option>
          <option value="Fin-Year">Financial Year</option>
        </select>
      </div>
      {/* SELECT HALL */}
      <div className="my-4">
        <select
          className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-center"
          onChange={(e) => {
            if (e.target.value == "All") {
              setSelectedHallId("All");
            } else {
              const selectedHallName = e.target.value;
              const selectedHallId = hallData.find(
                (hall) => hall.name === selectedHallName
              )?._id;
              setSelectedHall(selectedHallName);
              if (selectedHallId) {
                setSelectedHallId(selectedHallId);
              }
            }
          }}
        >
          <option value="All">All</option>
          {hallData &&
            hallData.map((hall) => (
              <option key={hall._id} value={hall.name}>
                {hall.name}
              </option>
            ))}
        </select>
      </div>

      {/* SELECT SESSION */}
      <div className="">
        <select
          className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-center"
          onChange={(e) => {
            setSelectedSession(e.target.value);
          }}
        >
          <option value="All">All</option>
          {hallData
            .find((hall) => hall.name === selectedHall)
            ?.sessions.map((session) => (
              <option key={session.name} value={session._id}>
                {session.name}
              </option>
            ))}
        </select>
      </div>

      {/* SELECT CATEGORY */}
      <div className="my-4">
        <select
          className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-center"
          onChange={(e) => {
            setSelectedCategory(e.target.value);
          }}
        >
          <option value="">Select Category</option>
          <option value="All">All</option>
          {selectedSession === "All"
            ? hallData
                .find((hall) => hall.name === selectedHall)
                ?.sessions[0]?.price.map((category) => (
                  <option
                    key={category.categoryName}
                    value={category.categoryName}
                  >
                    {category.categoryName}
                  </option>
                ))
            : hallData
                .find((hall) => hall.name === selectedHall)
                ?.sessions.find((session) => session._id === selectedSession)
                ?.price.map((category) => (
                  <option
                    key={category.categoryName}
                    value={category.categoryName}
                  >
                    {category.categoryName}
                  </option>
                ))}
        </select>
      </div>

      {/* SELECT HALL CHARGES */}
      <div className="">
        <select
          className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-center"
          onChange={(e) => {
            {
              e.target.value == "true"
                ? setHallCharges(true)
                : setHallCharges(false);
            }
          }}
        >
          <option value="">Display Hall Charges</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>

      <hr className=" bg-gray-300 h-[1.5px] w-[50%] my-2" />
      {/* SELECT TIME PERIOD */}
      {selectedDisplayPeriod == "Select" && (
        <div className={`flex flex-col items-center justify-center gap-2 `}>
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
        </div>
      )}
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded-md"
        onClick={() => {
          if (selectedHallId && selectedCategory) {
            getData({
              displayPeriod: selectedDisplayPeriod,
              fromDate: date.from,
              toDate: date.to,
              displayHall: selectedHallId,
              displayCustomerCategory: selectedCategory,
              displaySession: selectedSession,
              displayHallCharges: hallCharges,
            });
          }
        }}
      >
        Get for Time Period
      </button>

      {/* Display Data */}
      {data?.length && (
        <div className="flex flex-col w-full mt-5">
          <div className="flex flex-col w-full items-center ">
            <span className="font-medium text-lg my-5">
              Showing analytics from {humanReadableRequest.fromHuman} to{" "}
              {humanReadableRequest.toHuman}
            </span>
            <div className=" flex flex-row items-center gap-3 mb-3">
              <span className="font-medium ">
                {data?.length} entries found{" "}
              </span>
              <button
                onClick={downloadCsv}
                className="flex items-center gap-2 bg-green-500 border-green-600 border text-white text-sm font-bold px-2 py-1 rounded-lg shadow-xl"
              >
                Download
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className=" w-full overflow-x-auto">
            <table className=" overflow-auto overflow-x-scroll">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Hall Name</th>
                  <th className="px-4 py-2 text-center">Session</th>
                  <th className="px-4 py-2 text-center">Additional Facility</th>
                  <th className="px-4 py-2 text-center">Manager Name</th>
                  <th className="px-4 py-2 text-center">Customer Category</th>
                  <th className="px-4 py-2 text-center">Customer Name</th>
                  <th className="px-4 py-2 text-center">Contact Person</th>
                  <th className="px-4 py-2 text-center">Contact No.</th>
                  {responseHallCharges && (
                    <th className="px-4 py-2 text-center">Booking Amount</th>
                  )}
                  {responseHallCharges && (
                    <th className="px-4 py-2 text-center">Amount Paid</th>
                  )}
                  <th className="px-4 py-2 text-center">transaction type</th>
                  <th className="px-4 py-2 text-center">date</th>
                  <th className="px-4 py-2 text-center">transaction id</th>
                  <th className="px-4 py-2 text-center">payee Name</th>
                  <th className="px-4 py-2 text-center">utr no.</th>
                  <th className="px-4 py-2 text-center">cheque no.</th>
                  <th className="px-4 py-2 text-center">bank</th>
                </tr>
              </thead>
              <tbody>
                {data.map((booking: any, index: number) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-4 py-2 text-center">{booking.Date}</td>
                    <td className="px-4 py-2 text-center">
                      {booking["Hall Name"]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {/* {booking["Session"]} */}
                      {booking["Session"].name}  {booking["Session"].time.from} -  {booking["Session"].time.to}
                      
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["Additional Facility"]
                        ? booking["Additional Facility"]
                        : "None"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["Manager Name"]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["Customer Category"]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["Customer Name"]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["Contact Person"]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["Contact No."]}
                    </td>
                    {responseHallCharges && (
                      <td className="px-4 py-2 text-center">
                        {booking["Booking Amount"]}
                      </td>
                    )}
                    {responseHallCharges && (
                      <td className="px-4 py-2 text-center">
                        {booking["Amount Paid"]}
                      </td>
                    )}
                    <td className="px-4 py-2 text-center">
                      {booking["transaction"]?.type}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["transaction"]?.date}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["transaction"]?.transactionID}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["transaction"]?.payeeName}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["transaction"]?.utrNo}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["transaction"]?.chequeNo}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["transaction"]?.bank}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Report8;
