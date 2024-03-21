import HallLocation from "../components/editHall/HallLocation";
import AboutHall from "../components/editHall/AboutHall";
import HallCapacity from "../components/editHall/HallCapacity";
import HallPricing from "../components/editHall/HallPricing";
import HallAdditionalFeatures from "../components/editHall/HallAdditionalFeatures";
import ImageCarousel from "../components/editHall/ImageCarousel";
import { useState } from "react";
import { EachHallType } from "../types/Hall.types";
import "../styles/hallInfo.css";
import HallSessions from "../components/editHall/HallSessions";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance";
import { useParams } from "react-router-dom";
import { queryClient } from "../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditHall() {
  let { id: HallID } = useParams();

  const [hallData, setHallData] = useState<EachHallType | undefined>(undefined);

  const { data: databaseHallData } = useQuery({
    queryKey: [`getHall/${HallID}`],
    queryFn: async () => {
      try {
        console.log("FETCHING");
        const responsePromise = axiosInstance.get(`getHall/${HallID}`);
        toast.promise(responsePromise, {
          pending: "Updating with latest data...",
          success: "Fetched Hall Data",
          error: "Failed to fetch hall Data",
        });
        const response = await responsePromise;
        setHallData(response.data);
        return response.data as EachHallType;
      } catch (error) {
        throw error;
      }
    },
  });

  const editHallMutation = useMutation({
    mutationFn: async () => {
      console.log(hallData);
      const responsePromise = axiosInstance.post(
        `/editHall/${HallID}`,
        hallData
      );
      toast.promise(responsePromise, {
        pending: "Updating...",
        success: "Hall Edited!",
        error: "Failed to Edit Hall. Please try again.",
      });
      const response = await responsePromise;
      console.log(response.data);
    },
    onSuccess: async () => {
      console.log("REVALIDATING");
      await queryClient.refetchQueries({
        queryKey: [`getHall/${HallID}`],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="hall-info-container grid place-items-center gap-y-12 mx-auto w-11/12 pt-10 overflow-y-hidden">
      {databaseHallData && hallData && (
        <>
          <div className="flex flex-col items-center">
            <p className="text-blue-700 font-semibold">Edit</p>
            <input
              className="text-5xl text-center border border-gray-400"
              value={hallData.name}
              onChange={(e) => {
                setHallData((prev) => {
                  if (prev) return { ...prev, name: e.target.value };
                });
              }}
            />
          </div>
          {JSON.stringify(databaseHallData) !== JSON.stringify(hallData) && (
            <div className="flex flex-col items-center gap-3">
              <p>Confirm the changes you just made</p>
              <div className="flex gap-5">
                <button
                  className=" bg-green-500 p-1 px-2 rounded-md text-xl font-semibold text-white"
                  onClick={() => {
                    editHallMutation.mutate();
                  }}
                >
                  Confirm
                </button>
                <button
                  className=" bg-red-500 p-1 px-2 rounded-md text-xl font-semibold text-white"
                  onClick={() => {
                    setHallData(databaseHallData);
                  }}
                >
                  Discard
                </button>
              </div>
            </div>
          )}
          <HallLocation
            location={hallData.location}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
          <AboutHall
            about={hallData.about}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
          <HallCapacity
            capacity={hallData.capacity}
            seating={hallData.seating}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
          <HallPricing
            pricing={hallData.pricing}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
          <HallSessions
            sessions={hallData.sessions}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
          {hallData.additionalFeatures && (
            <HallAdditionalFeatures
              additionalFeatures={hallData.additionalFeatures}
              setHallData={
                setHallData as React.Dispatch<
                  React.SetStateAction<EachHallType>
                >
              }
            />
          )}
          <ImageCarousel
            images={hallData.images}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
        </>
      )}
    </div>
  );
}
