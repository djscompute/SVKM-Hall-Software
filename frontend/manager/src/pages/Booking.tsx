import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import axiosInstance from "../config/axiosInstance";
import { toast } from "react-toastify";
import {
  EachHallType,
  HallBookingType,
  bookingStatusType,
} from "../../../../types/global";
import { useParams } from "react-router-dom";
// import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat";
import { useState } from "react";
import { queryClient } from "../App";

const possibleBookingTypes: bookingStatusType[] = [
  "CONFIRMED",
  //"TENTATIVE",
  "CANCELLED",
  "ENQUIRY",
];

function Booking() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [hallData, setHallData] = useState<EachHallType>();
  const [editingMode, setEditingMode] = useState(false);
  const [editedData, setEditedData] = useState<HallBookingType>();

  const { data, error, isFetching } = useQuery({
    queryKey: [`booking/${bookingId}`],
    queryFn: async () => {
      try {
        const responsePromise = axiosInstance.get(
          `getBookingByID?_id=${bookingId}`
        );
        toast.promise(responsePromise, {
          pending: "Fetching Booking...",
          error: "Failed to fetch Booking. Please try again.",
        });
        const response = await responsePromise;
        if (response.data.hallId) {
          const result = await axiosInstance.get(
            `getHall/${response.data.hallId}`
          );
          setHallData(result.data);
        }
        return response.data as HallBookingType;
      } catch (error) {
        throw error;
      }
    },
  });

  const editBookingStatus = useMutation({
    mutationFn: async (newStatus: bookingStatusType) => {
      console.log(hallData);
      const responsePromise = axiosInstance.post(`/editBooking/${bookingId}`, {
        ...data,
        status: newStatus,
      });
      toast.promise(responsePromise, {
        pending: "Updating...",
        success: "Booking Status Edited!",
        error: "Failed to Booking Hall. Please Reload and try again.",
      });
      const response = await responsePromise;
      console.log(response.data);
    },
    onSuccess: async () => {
      console.log("REVALIDATING");
      await queryClient.refetchQueries({
        queryKey: [`booking/${bookingId}`],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleEdit = () => {
    setEditingMode(true);
    if (!editedData) {
      setEditedData(data);
    }
  };

  const handleSave = async () => {
    const response =  axiosInstance.post(
      `/editBooking/${bookingId}`,
      editedData
    );
    setEditingMode(false);
    await queryClient.refetchQueries({
      queryKey: [`booking/${bookingId}`],
    });
    toast.promise(response, {
      pending: "Updating...",
      success: "Booking Status Edited!",
      error: "Failed to Booking Hall. Please Reload and try again.",
    });
  };


  if (isFetching) return <h1>Loading</h1>;

  return (
    <div className="flex flex-col items-center my-10 w-11/12 sm:w-3/4 lg:w-1/2 mx-auto">
      <span className=" text-lg font-medium">User</span>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Name : </span>
        <span className="w-full text-right">{data?.user.username}</span>
      </div>

      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Mobile Number : </span>
        <span className="w-full text-right">{data?.user.mobile}</span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Contact Person : </span>
        <span className="w-full text-right">{data?.user?.contact}</span>
      </div>
      {editingMode ? (
  <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
    <span className="w-full text-left">Aadhar No : </span>
    <input
      type="text"
      value={editedData?.user?.aadharNo}
      onChange={(e) =>
        setEditedData((prev) => {
          if (!prev) return undefined;
          return {
            ...prev,
            user: {
              ...prev.user,
              aadharNo: e.target.value,
            },
          };
        })
      }
      placeholder="Enter Aadhar Number"
      className="px-2"
    />
  </div>
) : (
  <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
    <span className="w-full text-left">Aadhar No : </span>
    <span className="w-full text-right">
      {data?.user.aadharNo || "-"}
    </span>
  </div>
)}

{editingMode ? (
  <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
    <span className="w-full text-left">Pan No. : </span>
    <input
      type="text"
      value={editedData?.user?.panNo}
      onChange={(e) =>
        setEditedData((prev) => {
          if (!prev) return undefined;
          return {
            ...prev,
            user: {
              ...prev.user,
              panNo: e.target.value,
            },
          };
        })
      }
      placeholder="Enter PAN Number"
      className="px-2"
    />
  </div>
) : (
  <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
    <span className="w-full text-left">Pan No. : </span>
    <span className="w-full text-right">{data?.user.panNo || "-"}</span>
  </div>
)}

{editingMode ? (
  <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
    <span className="w-full text-left">Address : </span>
    <input
      type="text"
      value={editedData?.user?.address}
      onChange={(e) =>
        setEditedData((prev) => {
          if (!prev) return undefined;
          return {
            ...prev,
            user: {
              ...prev.user,
              address: e.target.value,
            },
          };
        })
      }
      placeholder="Enter Address"
      className="px-2"
    />
  </div>
) : (
  <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
    <span className="w-full text-left">Address : </span>
    <span className="w-full text-right">{data?.user.address || "-"}</span>
  </div>
)}

{editingMode ? (
  <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
    <span className="w-full text-left">Remark : </span>
    <input
      type="text"
      value={editedData?.user?.remark}
      onChange={(e) =>
        setEditedData((prev) => {
          if (!prev) return undefined;
          return {
            ...prev,
            user: {
              ...prev.user,
              remark: e.target.value,
            },
          };
        })
      }
      placeholder="Enter Remark"
      className="px-2"
    />
  </div>
) : (
  <div className="flex items-center gap-3 w-full bg-red-600 rounded-sm px-2 py-1 border border-blue-600"> 
  {/* just to highlight it's laal hai */}
    <span className="w-full text-left">Remark : </span>
    <span className="w-full text-right">{data?.user.remark || "-"}</span>
  </div>
)}

      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Email Id : </span>
        <span className="w-full text-right">{data?.user.email || "-"}</span>
      </div>

      <span className=" text-lg font-medium">Slot</span>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">From : </span>
        <span className="w-full text-right">
          {dayjs(data?.from).format("h:mm A, MMMM D, YYYY") || "-"}
        </span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">To : </span>
        <span className="w-full text-right">
          {dayjs(data?.to).format("h:mm A, MMMM D, YYYY") || "-"}
        </span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Predicted Price : </span>
        <span className="w-full text-right">{data?.price || "-"}</span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Status : </span>
        <span className="w-full text-right">{data?.status || "-"}</span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">HallId : </span>
        <span className="w-full text-right">{data?.hallId || "-"}</span>
      </div>
      {hallData?.name && (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Hall Name : </span>
          <span className="w-full text-right">{hallData?.name || "-"}</span>
        </div>
      )}
      <span className=" text-lg font-medium">Additional Features</span>
      {data?.features.map((eachFeature, index) => (
        <div key={index} className="flex flex-col w-full mb-2">
          <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span>name : </span>
            <span>{eachFeature.heading || "-"}</span>
          </div>
          <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span>desc : </span>
            <span>{eachFeature.desc || "-"}</span>
          </div>
          <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span>price : </span>
            <span>{eachFeature.price || "-"}</span>
          </div>
        </div>
      ))}
      <span className=" mb-3">STATUS: {data?.status}</span>

      {editingMode ? (
        <button
          onClick={handleSave}
          className="mb-2 bg-blue-600 px-4 text-white py-1 rounded-lg"
        >
          Save Details
        </button>
      ) : (
        <button
          onClick={handleEdit}
          className=" mb-2 bg-red-600 px-4 text-white py-1 rounded-lg"
        >
          Edit Details
        </button>
      )}

      <select
        value={data?.status}
        onChange={(e) => {
          console.log(e.target.value);
          editBookingStatus.mutate(e.target.value as bookingStatusType);
        }}
        className="px-2 py-1 rounded-md border border-gray-400"
      >
        {possibleBookingTypes.map((eachBooktingType) => (
          <option value={eachBooktingType}>{eachBooktingType}</option>
        ))}
      </select>
    </div>
  );
}

export default Booking;
