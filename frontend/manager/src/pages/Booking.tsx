import { useQuery } from "@tanstack/react-query";
import React from "react";
import axiosInstance from "../config/axiosInstance";
import { toast } from "react-toastify";
import { HallBookingType } from "../../../../types/global";
import { useParams } from "react-router-dom";

function Booking() {
  const { bookingId } = useParams<{ bookingId: string }>();

  const { data, error, isFetching } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const responsePromise = axiosInstance.get(
          `getBookingByID?_id=${bookingId}`
        );
        toast.promise(responsePromise, {
          pending: "Fetching hall...",
          // success: "Hall fetched successfully!",
          error: "Failed to fetch Hall. Please try again.",
        });
        const response = await responsePromise;
        return response.data as HallBookingType;
      } catch (error) {
        throw error;
      }
    },
  });
  return <div>{data?.user.username}</div>;
}

export default Booking;
