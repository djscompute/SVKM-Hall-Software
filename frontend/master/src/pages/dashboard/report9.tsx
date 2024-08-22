import { useEffect, useState } from "react";
import axiosMasterInstance from "../../config/axiosMasterInstance";
import { toast } from "react-toastify";
import "chart.js/auto";
import dayjs from "dayjs";
import BasicDateTimePicker from "../../components/editHall/BasicDateTimePicker";
import { EachHallType } from "../../../../../types/global.ts";
import { useQuery } from "@tanstack/react-query";
import {
  getFinancialYearEnd,
  getFinancialYearStart,
} from "../../utils/financialYearRange.tsx";

function Report9() {
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

  function formatToDDMMYYYY(dateTimeString: string) {
    const datePart = dateTimeString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    const formattedDate = `${day}-${month}-${year}`;
    return `${formattedDate}${dateTimeString.substring(10)}`;
  }

  const handleHumanReadable = (from: string, to: string) => {
    let humanReadableFrom = "";
    let humanReadableTo = "";
    const now = dayjs();

    if (selectedDisplayPeriod === "Today") {
      humanReadableFrom = humanReadableTo = now.format("MMMM D, YYYY");
    } else if (selectedDisplayPeriod === "Week") {
      humanReadableFrom = now.startOf("week").format("MMMM D, YYYY");
      humanReadableTo = now.endOf("week").format("MMMM D, YYYY");
    } else if (selectedDisplayPeriod === "Month") {
      humanReadableFrom = now.startOf("month").format("MMMM D, YYYY");
      humanReadableTo = now.endOf("month").format("MMMM D, YYYY");
    } else if (selectedDisplayPeriod === "Year") {
      humanReadableFrom = now.startOf("year").format("MMMM D, YYYY");
      humanReadableTo = now.endOf("year").format("MMMM D, YYYY");
    } else if (selectedDisplayPeriod === "Fin-Year") {
      humanReadableFrom = getFinancialYearStart().format("MMMM D, YYYY");
      humanReadableTo = getFinancialYearEnd().format("MMMM D, YYYY");
    } else {
      humanReadableFrom = from ? dayjs(from).format("MMMM D, YYYY") : "";
      humanReadableTo = to ? dayjs(to).format("MMMM D, YYYY") : "";
    }

    setHumanReadable({
      fromHuman: humanReadableFrom,
      toHuman: humanReadableTo,
    });
  };

  useEffect(() => {
    handleHumanReadable(date.from, date.to);
  }, [selectedDisplayPeriod, date.from, date.to]);

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
        fromDate: fromDate, // This is already in the correct format from BasicDateTimePicker
        toDate: toDate, // This is already in the correct format from BasicDateTimePicker
        displayHall: displayHall,
        displayCustomerCategory: displayCustomerCategory,
        displaySession: displaySession,
        displayHallCharges: displayHallCharges,
      };
    } else {
      request = {
        displayPeriod: displayPeriod,
        displayHall: displayHall,
        displayCustomerCategory: displayCustomerCategory,
        displaySession: displaySession,
        displayHallCharges: displayHallCharges,
      };
    }

    const responsePromise = axiosMasterInstance.post(
      "dashboard/generateBookingConfirmationReport",
      request
    );
    toast.promise(responsePromise, {
      pending: "Fetching Report...",
      error: "Failed to fetch Report. Please contact maintainer.",
    });
    const response = await responsePromise;
    console.log("data here ", response.data);
    setData(response.data);
  };

  const calculateTotalAmountPaid = () => {
    if (!data || !responseHallCharges) return 0;
    return data.reduce(
      (sum: number, booking: { [x: string]: any }) =>
        sum + Number(booking["Amount Paid"] || 0),
      0
    );
  };

  interface TransactionData {
    type?: string;
    date?: string;
    transactionID?: string;
    payeeName?: string;
    utrNo?: string;
    chequeNo?: string;
    bank?: string;
  }

  interface BookingData {
    "Manager Name": string;
    "Customer Category": string;
    "Customer Name": string;
    "Contact Person": string;
    "Contact No.": string;
    "Booking Amount": string;
    "Amount Paid": string;
    transaction?: TransactionData;
    [key: string]: any; // For any additional fields
  }

  interface FlattenedBookingData extends Omit<BookingData, "transaction"> {
    "transaction type"?: string;
    "transaction date"?: string;
    "transaction id"?: string;
    "payee Name"?: string;
    "utr no."?: string;
    "cheque no."?: string;
    bank?: string;
  }

  const downloadCsv = () => {
    if (!data) return;

    const flattenedData: FlattenedBookingData[] = data.map(
      (row: BookingData) => {
        const flatRow: FlattenedBookingData = { ...row };
        if (row.transaction) {
          flatRow["transaction type"] = row.transaction.type || "";
          flatRow["transaction date"] = row.transaction.date || "";
          flatRow["transaction id"] = row.transaction.transactionID || "";
          flatRow["payee Name"] = row.transaction.payeeName || "";
          flatRow["utr no."] = row.transaction.utrNo || "";
          flatRow["cheque no."] = row.transaction.chequeNo || "";
          flatRow["bank"] = row.transaction.bank || "";
        }
        delete (flatRow as any).transaction;
        return flatRow;
      }
    );

    const totalAmountPaid = flattenedData.reduce(
      (sum, row) => sum + (Number(row["Amount Paid"]) || 0),
      0
    );

    flattenedData.push({
      "Manager Name": "Total",
      "Amount Paid": totalAmountPaid.toFixed(2),
    } as FlattenedBookingData);

    const headers = Object.keys(flattenedData[0]);
    const csvRows = [headers.join(",")];

    for (const row of flattenedData) {
      const values = headers.map((header) => {
        const escaped = ("" + (row[header] || "")).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedHall} Booking Confirmation Reports ${humanReadable.fromHuman}-${humanReadable.toHuman}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 mb-20">
      <span className="text-xl font-medium mt-5">
        Booking Confirmation Report
      </span>
      {/* SELECT DISPLAY PERIOD */}
      <div>
        <div className="mt-4 flex items-center gap-4 justify-between">
          <label htmlFor="displayPeriod" className="font-medium text-nowrap">
            Display Period:
          </label>
          <select
            id="displayPeriod"
            className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-center w-full"
            onChange={(e) => setSelectedDisplayPeriod(e.target.value)}
          >
            <option value="Select">Select Display Period</option>
            <option value="Today">Today</option>
            <option value="Week">This week</option>
            <option value="Month">Current Month</option>
            <option value="Year">Current Year</option>
            <option value="Fin-Year">Financial Year</option>
          </select>
        </div>

        {/* SELECT HALL */}
        <div className="my-4 flex items-center gap-4 justify-between">
          <label htmlFor="hall" className="font-medium text-nowrap">
            Select Hall:
          </label>
          <select
            id="hall"
            className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-center w-full"
            onChange={(e) => {
              if (e.target.value === "All") {
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
        <div className="flex items-center gap-4 justify-between">
          <label htmlFor="session" className="font-medium text-nowrap">
            Select Session:
          </label>
          <select
            id="session"
            className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-center w-full"
            onChange={(e) => {
              setSelectedSession(e.target.value);
            }}
          >
            <option value="All">All</option>
            {selectedHall != "All" &&
              hallData
                .find((hall) => hall.name === selectedHall)
                ?.sessions.map((session) => (
                  <option key={session.name} value={session._id}>
                    {session.name}
                  </option>
                ))}
          </select>
        </div>

        {/* SELECT CATEGORY */}
        <div className="my-4 flex items-center gap-4 justify-between">
          <label htmlFor="category" className="font-medium text-nowrap">
            Select Category:
          </label>
          <select
            id="category"
            className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-center w-full"
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
        <div className="flex items-center gap-4 justify-between">
          <label htmlFor="hallCharges" className="font-medium text-nowrap">
            Display Hall Charges:
          </label>
          <select
            id="hallCharges"
            className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md text-center w-full"
            onChange={(e) => {
              setHallCharges(e.target.value === "true");
            }}
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      <hr className=" bg-gray-300 h-[1.5px] w-[50%] my-2" />
      {/* SELECT TIME PERIOD */}

      {selectedDisplayPeriod == "Select" && (
        <div className={`flex flex-col items-center justify-center gap-2 `}>
          <div className="flex gap-2">
            <BasicDateTimePicker
              timeModifier={(time) => {
                const formattedTime = formatToDDMMYYYY(time);
                setDate((prev) => ({ ...prev, from: formattedTime }));
              }}
              timePickerName="from"
            />
            <BasicDateTimePicker
              timeModifier={(time) => {
                const formattedTime = formatToDDMMYYYY(time);
                setDate((prev) => ({ ...prev, to: formattedTime }));
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
            <table className="">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    Confirmation Date
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    Event Date
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    Hall Name
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    Session
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    Additional Facility
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    Manager Name
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    Customer Category
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    Customer Name
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    Contact Person
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    Contact No.
                  </th>
                  {responseHallCharges && (
                    <th className="px-4 py-2 text-center whitespace-nowrap">
                      Booking Amount
                    </th>
                  )}
                  {responseHallCharges && (
                    <th className="px-4 py-2 text-center whitespace-nowrap">
                      Amount Paid
                    </th>
                  )}
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    transaction type
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    date
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    transaction id
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    payee Name
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    utr no.
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    cheque no.
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    bank
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((booking: any, index: number) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-4 py-2 text-center">
                      {booking.confirmationDate}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {booking.eventDate}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["Hall Name"]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {booking["Session"]}
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
              {responseHallCharges && (
                <tfoot>
                  <tr className="bg-gray-200 font-bold">
                    <td
                      colSpan={responseHallCharges ? 10 : 9}
                      className="px-4 py-2 text-right"
                    >
                      Total Amount Paid:
                    </td>
                    <td className="px-4 py-2 text-center">
                      {calculateTotalAmountPaid().toFixed(2)}
                    </td>
                    <td colSpan={8}></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Report9;
