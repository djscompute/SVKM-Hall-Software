import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "chart.js/auto";
import dayjs from "dayjs";
import BasicDateTimePicker from "../../components/Calender/BasicTimePicker.tsx";
import { EachHallType } from "../../../../../types/global.ts";
import { useQuery } from "@tanstack/react-query";
import axiosManagerInstance from "../../config/axiosManagerInstance.ts";

function Report7() {
  const [hallData, setHallData] = useState<EachHallType[]>([]);
  const [selectedAdditionalFeatures, setSelectedAdditionalFeatures] = useState<
    string[]
  >([]);

  useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const responsePromise = axiosManagerInstance.get("getAllHalls");
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
  const [selectedHall, setSelectedHall] = useState<string>();

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

  const formatDate = (date: dayjs.Dayjs) => date.format("DD-MM-YYYY");

  const startOfWeek = now.startOf("week").format("YYYY-MM-DDT00:00:00");
  const endOfWeek = now.endOf("week").format("YYYY-MM-DDT23:59:59");

  const startOfMonth = now.startOf("month").format("YYYY-MM-DDT00:00:00");
  const endOfMonth = now.endOf("month").format("YYYY-MM-DDT23:59:59");

  const startOfYear = now.startOf("year").format("YYYY-MM-DDT00:00:00");
  const endOfYear = now.endOf("year").format("YYYY-MM-DDT23:59:59");

  const getThisWeek = () => {
    if (!selectedHall) return;
    getData({
      from: startOfWeek,
      to: endOfWeek,
      hallName: selectedHall,
      additionalFeatures: selectedAdditionalFeatures,
    });
    handleHumanReadable(startOfWeek, endOfWeek);
  };
  const getThisMonth = () => {
    if (!selectedHall) return;
    getData({
      from: startOfMonth,
      to: endOfMonth,
      hallName: selectedHall,
      additionalFeatures: selectedAdditionalFeatures,
    });
    handleHumanReadable(startOfMonth, endOfMonth);
  };
  const getThisYear = () => {
    if (!selectedHall) return;
    getData({
      from: startOfYear,
      to: endOfYear,
      hallName: selectedHall,
      additionalFeatures: selectedAdditionalFeatures,
    });
    handleHumanReadable(startOfYear, endOfYear);
  };

  const handleHumanReadable = (from: string, to: string) => {
    let humanReadableFrom = "";
    let humanReadableTo = "";
    if (from) {
      humanReadableFrom = formatDate(dayjs(from));
    }
    if (to) {
      humanReadableTo = formatDate(dayjs(to));
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
    console.log({
      fromDate: from,
      toDate: to,
      hallName: hallName,
      additionalFeatures: additionalFeatures,
    });
    const responsePromise = axiosManagerInstance.post(
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
  const calculateTotalBookingAmount = () => {
    if (!data || !selectedAdditionalFeatures) return 0;
    return data.reduce((sum: number, booking: { [x: string]: any }) => sum + Number(booking["Booking Amount"] || 0), 0);
  };

  const calculateTotalAmountPaid = () => {
    if (!data || !selectedAdditionalFeatures) return 0;
    return data.reduce((sum: number, booking: { [x: string]: any }) => sum + Number(booking["Amount Paid"] || 0), 0);
  };

  const calculateTotalSecurityDeposit = () => {
    if (!data || !selectedAdditionalFeatures) return 0;
    return data.reduce((sum: number, booking: { [x: string]: any }) => sum + Number(booking["Security Deposit"] || 0), 0);
  };

  const calculateTotalGST = () => {
    if (!data || !selectedAdditionalFeatures) return 0;
    return data.reduce((sum: number, booking: { [x: string]: any }) => sum + Number(booking["GST"] || 0), 0);
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

  // const downloadCsv = () => {
  //   if (!data) return;
  //   const flattenedData: FlattenedBookingData[] = data.map((row: BookingData) => {
  //     const flatRow: FlattenedBookingData = { ...row };
  //     if (row.transaction) {
  //       flatRow["transaction type"] = row.transaction.type || "";
  //       flatRow["transaction date"] = row.transaction.date || "";
  //       flatRow["transaction id"] = row.transaction.transactionID || "";
  //       flatRow["payee Name"] = row.transaction.payeeName || "";
  //       flatRow["utr no."] = row.transaction.utrNo || "";
  //       flatRow["cheque no."] = row.transaction.chequeNo || "";
  //       flatRow["bank"] = row.transaction.bank || "";
  //     }
  //     delete (flatRow as any).transaction;
  //     return flatRow;
  //   });
  //   const totalAmountPaid = flattenedData.reduce((sum, row) => sum + (Number(row["Amount Paid"]) || 0), 0);
  //   const totalBookingAmount = flattenedData.reduce((sum, row) => sum + (Number(row["Booking Amount"]) || 0), 0);
  //   const totalSecurityDeposit = flattenedData.reduce((sum, row) => sum + (Number(row["Security Deposit"]) || 0), 0);
  //   const totalGST = flattenedData.reduce((sum, row) => sum + (Number(row["GST"]) || 0), 0);
  
  //   // Add totals row
  //   flattenedData.push({
  //     "Manager Name": "Total",
  //     "Booking Amount": totalBookingAmount.toFixed(2),
  //     "Amount Paid": totalAmountPaid.toFixed(2),
  //     "Security Deposit": totalSecurityDeposit.toFixed(2),
  //     "GST": totalGST.toFixed(2),
  //   } as FlattenedBookingData);
  //   const csvRows = [];
  //   const headers = Object.keys(data[0]);
  //   csvRows.push(headers.join(","));

  //   for (const row of data) {
  //     const values = headers.map((header) => {
  //       const escaped = ("" + row[header]).replace(/"/g, '\\"');
  //       return `"${escaped}"`;
  //     });
  //     csvRows.push(values.join(","));
  //   }

  //   const csvString = csvRows.join("\n");
  //   const blob = new Blob([csvString], { type: "text/csv" });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = `${selectedHall} Additional Feature Reports ${humanReadable.fromHuman}-${humanReadable.toHuman} .csv`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  const downloadCsv = () => {
    if (!data) return;
  
    const flattenedData: FlattenedBookingData[] = data.map((row: BookingData) => {
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
    });
  
    const totalAmountPaid = flattenedData.reduce((sum, row) => sum + (Number(row["Amount Paid"]) || 0), 0);
    const totalBookingAmount = flattenedData.reduce((sum, row) => sum + (Number(row["Booking Amount"]) || 0), 0);
    const totalSecurityDeposit = flattenedData.reduce((sum, row) => sum + (Number(row["Security Deposit"]) || 0), 0);
    const totalGST = flattenedData.reduce((sum, row) => sum + (Number(row["GST"]) || 0), 0);
  
    // Add totals row
    flattenedData.push({
      "Manager": "Total",
      "Booking Amount": totalBookingAmount.toFixed(2),
      "Amount Paid": totalAmountPaid.toFixed(2),
      "Security Deposit": totalSecurityDeposit.toFixed(2),
      "GST": totalGST.toFixed(2),
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
    link.download = `${selectedHall} Additional Feature Reports ${humanReadable.fromHuman}-${humanReadable.toHuman} .csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 mb-20">
      <span className="text-xl font-medium mt-5">
        Hall Wise Additional Feature Reports
      </span>
      {/* SELECT HALL */}
      <div>
        <select
          className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md"
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
      {/* SELECT ADDITIONAL FEATURES */}
      <div className="w-full flex flex-col items-center">
        {hallData &&
          hallData.map((hall, index) => {
            if (hall.name === selectedHall) {
              return (
                <div className="w-full flex flex-col items-center" key={index}>
                  <hr className=" bg-gray-300 h-[1.5px] w-[50%] my-2" />
                  <span className="my-2 block">
                    Select Additional Features:
                  </span>
                  {hall.additionalFeatures?.map((feature, featureIndex) => (
                    <label key={featureIndex}>
                      <input
                        type="checkbox"
                        value={feature.heading}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            setSelectedAdditionalFeatures((prev) => [
                              ...prev,
                              feature.heading,
                            ]);
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
      <hr className=" bg-gray-300 h-[1.5px] w-[50%] my-2" />
      {/* SELECT TIME PERIOD */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex gap-2">
          <BasicDateTimePicker
            id="fromDate"
            timeModifier={(time) => {
              setDate((prev) => ({ ...prev, from: time }));
            }}
            timePickerName="from"
          />
          <BasicDateTimePicker
            id="toDate"
            timeModifier={(time) => {
              setDate((prev) => ({ ...prev, to: time }));
            }}
            timePickerName="to"
          />
        </div>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded-md"
          onClick={() => {
            if (selectedHall)
              getData({
                from: date.from,
                to: date.to,
                hallName: selectedHall,
                additionalFeatures: selectedAdditionalFeatures,
              });
          }}
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
      </div>
      {/* Display Data */}
      {data?.length && (
        <div className="flex flex-col items-center w-full overflow-x-auto mt-5">
          <span className="font-medium text-lg my-5">
            Showing analytics from {humanReadable.fromHuman} to
            {humanReadable.toHuman}
          </span>
          <div className=" flex flex-row items-center gap-3 mb-3">
            <span className="font-medium ">{data?.length} entries found </span>
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
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2">Booking Date</th>
                <th className="px-4 py-2">Confirmation Date</th>
                <th className="px-4 py-2">Event Date</th>
                <th className="px-4 py-2">Session</th>
                <th className="px-4 py-2">From</th>
                <th className="px-4 py-2">To</th>
                <th className="px-4 py-2">Hall Name</th>
                <th className="px-4 py-2">Facility</th>
                <th className="px-4 py-2">Manager</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Customer Name</th>
                <th className="px-4 py-2">Contact Person</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">Contact No.</th>
                  {selectedAdditionalFeatures && <th className="px-4 py-2 text-center whitespace-nowrap">Booking Amount</th>}
                  {selectedAdditionalFeatures && <th className="px-4 py-2 text-center whitespace-nowrap">Security Deposit</th>}
                  {selectedAdditionalFeatures && <th className="px-4 py-2 text-center whitespace-nowrap">GST</th>}
                  {selectedAdditionalFeatures && <th className="px-4 py-2 text-center whitespace-nowrap">Amount Paid</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((booking: any, index: number) => (
                <tr key={index} className="bg-white border-b">
                  <td className="px-4 py-2">{booking.bookingDate}</td>
                  <td className="px-4 py-2">{booking.confirmationDate}</td>
                  <td className="px-4 py-2">{booking.eventDate}</td>
                  <td className="px-4 py-2">{booking.Session}</td>
                  <td className="px-4 py-2">{booking.From}</td>
                  <td className="px-4 py-2">{booking.To}</td>
                  <td className="px-4 py-2">{booking["Hall Name"]}</td>
                  <td className="px-4 py-2">
                    {booking["Additional Facility Name"]}
                  </td>
                  <td className="px-4 py-2">{booking["Manager Name"]}</td>
                  <td className="px-4 py-2">{booking["Customer Category"]}</td>
                  <td className="px-4 py-2">{booking["Customer Name"]}</td>
                  <td className="px-4 py-2">{booking["Contact Person"]}</td>
                  <td className="px-4 py-2">{booking["Contact Details"]}</td>
                  {selectedAdditionalFeatures && <td className="px-4 py-2 text-center whitespace-nowrap">{booking["Booking Amount"]}</td>}
                      {selectedAdditionalFeatures && <td className="px-4 py-2 text-center whitespace-nowrap">{booking["Security Deposit"]}</td>}
                      {selectedAdditionalFeatures && <td className="px-4 py-2 text-center whitespace-nowrap">{booking["GST"]}</td>}
                      {selectedAdditionalFeatures && <td className="px-4 py-2 text-center whitespace-nowrap">{booking["Amount Paid"]}</td>}
                </tr>
              ))}
              <tr className="font-semibold">
                  <td className="px-4 py-2 text-center whitespace-nowrap">Total</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">-</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">-</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">-</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">-</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">-</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">-</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">-</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">Total</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">-</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">-</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">-</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">-</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">{calculateTotalBookingAmount()}</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">{calculateTotalSecurityDeposit()}</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">{calculateTotalGST()}</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">{calculateTotalAmountPaid()}</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap"></td>
                  <td className="px-4 py-2 text-center whitespace-nowrap"></td>
                  {/* Add other cells as needed */}
                </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Report7;
