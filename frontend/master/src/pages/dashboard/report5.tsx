/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axiosMasterInstance from "../../config/axiosMasterInstance";
import { toast } from "react-toastify";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
import BasicDateTimePicker from "../../components/editHall/BasicDateTimePicker";

const PieChartComponent = ({ data }: { data: any }) => {
  const chartData = {
    labels: data.map((item: any) => item.month),
    datasets: [
      {
        data: data.map((item: any) => item.collection),
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
        labels: {
          font: {
            size: 16, // Set the font size here
          },
        },
      },
    },
  };
  return (
    <div style={{ width: "500px", height: "500px" }}>
      {/* @ts-ignore */}
      <Pie data={chartData} options={options} />
    </div>
  );
};

const BarChartComponent = ({ data }: { data: any }) => {
  const chartData = {
    labels: data.map((item: any) => item.month),
    datasets: [
      {
        label: "Collection",
        data: data.map((item: any) => item.collection),
        backgroundColor: ["rgba(11, 127, 225, 0.8)"],
        borderColor: ["rgba(11, 127, 225, 0.8)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <div style={{ width: "600px", height: "400px" }}>
      {/* @ts-ignore */}
      <Bar data={chartData} options={options} />
    </div>
  );
};

function Report5() {
  const [allHalls, setAllHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState<string>("");
  async function getHalls() {
    console.log("hii");
    try {
      const response = await axiosMasterInstance.get("getAllHalls");
      if (response.data.length > 0) {
        setAllHalls(response.data);
      }
    } catch (error) {
      console.log("Error while fetching hall data:", error);
    }
  }
  const [queryFilter, setQueryFilter] = useState<{
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
    console.log(selectedHall);
    const responsePromise = axiosMasterInstance.post(
      "dashboard/getMonthwiseCollectionDetails",
      {
        fromDate: from,
        toDate: to,
        hallName: selectedHall,
      }
    );
    toast.promise(responsePromise, {
      pending: "Fetching Report...",
      error: "Failed to fetch Report. Please contact maintainer.",
    });
    const response = await responsePromise;
    console.log("response:", response.data);
    setData(response.data);
  };

  const getThisWeek = () => {
    getData({ from: startOfWeek, to: endOfWeek });
    handleHumanReadable(startOfWeek, endOfWeek);
  };
  const getThisMonth = () => {
    getData({ from: startOfMonth, to: endOfMonth });
    handleHumanReadable(startOfMonth, endOfMonth);
  };
  const getThisYear = () => {
    getData({ from: startOfYear, to: endOfYear });
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

  useEffect(() => {
    handleHumanReadable(queryFilter.from, queryFilter.to);
  }, [queryFilter]);

  useEffect(() => {
    getHalls();
  }, []);

  const DownloadReport = () => {
    // jspdf was generating more than 9 mb pdf,so this was optimal soln
    window.print();
  };
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 mb-20">
      <span className=" text-xl font-medium mt-5">Month Wise Collections</span>
      <div className="flex gap-2">
        <BasicDateTimePicker
         id="fromDate"
          timeModifier={(time) => {
            setQueryFilter((prev) => ({ ...prev, from: time }));
          }}
          timePickerName="from"
        />
        <BasicDateTimePicker
         id="toDate"
          timeModifier={(time) => {
            setQueryFilter((prev) => ({ ...prev, to: time }));
          }}
          timePickerName="to"
        />
      </div>
      <div>
        <select
          className="bg-gray-100 border border-gray-300 shadow-sm px-2 py-1 rounded-md"
          onChange={(event) => {
            setSelectedHall(event.target.value);
          }}
        >
          <option key="1" value="">
            Select a hall
          </option>
          {allHalls.map((hall: any) => (
            <option value={hall.hall}>{hall.name}</option>
          ))}
        </select>
      </div>
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded-md"
        onClick={() => getData(queryFilter)}
      >
        Get for Time Period
      </button>
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded-md"
        onClick={() => DownloadReport()}
      >
        Download Report
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

      {data?.length > 0 && (
        <div className="flex flex-col items-center mt-5 gap-10">
          <span className="font-medium text-lg">
            Showing analytics from {humanReadable.fromHuman} to
            {humanReadable.toHuman}
          </span>
          <div className="flex flex-row flex-wrap justify-evenly items-end gap-5">
            <BarChartComponent data={data} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Report5;
