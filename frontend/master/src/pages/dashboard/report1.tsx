import { useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import BasicTimePicker from "../../components/editHall/BasicTimePicker";
import dayjs from "dayjs";

const PieChartComponent = ({ data }: { data: any }) => {
  const chartData = {
    labels: data.map((item: any) => item.hallName),
    datasets: [
      {
        data: data.map((item: any) => item.bookingCount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };
  return (
    <div className="">
      {/* @ts-ignore */}
      <Pie data={chartData} options={options} />
    </div>
  );
};

function Report1() {
  const [queryFilter, setQueryFilter] = useState<{
    from: string;
    to: string;
  }>({
    from: "",
    to: "",
  });
  const [data, setData] = useState<any>();
  const now = dayjs();

  const startOfWeek = now.startOf("week").format("YYYY-MM-DDT00:00:00");
  const endOfWeek = now.endOf("week").format("YYYY-MM-DDT23:59:59");

  const startOfMonth = now.startOf("month").format("YYYY-MM-DDT00:00:00");
  const endOfMonth = now.endOf("month").format("YYYY-MM-DDT23:59:59");

  const startOfYear = now.startOf("year").format("YYYY-MM-DDT00:00:00");
  const endOfYear = now.endOf("year").format("YYYY-MM-DDT23:59:59");

  const getData = async ({ from, to }: { from: string; to: string }) => {
    if (!from || !to) return;
    const responsePromise = axiosInstance.post(
      "dashboard/getHallWiseBookingsCount",
      {
        fromDate: from,
        toDate: to,
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

  const getThisWeek = () => {
    getData({ from: startOfWeek, to: endOfWeek });
  };
  const getThisMonth = () => {
    getData({ from: startOfMonth, to: endOfMonth });
  };
  const getThisYear = () => {
    getData({ from: startOfYear, to: endOfYear });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-2">
      <div className="flex gap-2">
        <BasicTimePicker
          timeModifier={(time) => {
            setQueryFilter((prev) => ({ ...prev, from: time }));
          }}
          timePickerName="from"
        />
        <BasicTimePicker
          timeModifier={(time) => {
            setQueryFilter((prev) => ({ ...prev, to: time }));
          }}
          timePickerName="to"
        />
      </div>
      <button
        className="bg-gray-500 text-white px-2 py-1 rounded-md"
        onClick={() => getData(queryFilter)}
      >
        Get Filter Data
      </button>
      <button
        className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs"
        onClick={() => getThisWeek()}
      >
        Get This Week
      </button>
      <button
        className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs"
        onClick={() => getThisMonth()}
      >
        Get This Month
      </button>
      <button
        className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs"
        onClick={() => getThisYear()}
      >
        Get This Year
      </button>

      {data?.length > 0 && <PieChartComponent data={data} />}
    </div>
  );
}

export default Report1;
