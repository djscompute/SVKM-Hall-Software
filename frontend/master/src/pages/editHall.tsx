import HallLocation from "../components/editHall/HallLocation";
import AboutHall from "../components/editHall/AboutHall";
import HallCapacity from "../components/editHall/HallCapacity";
import HallAdditionalFeatures from "../components/editHall/HallAdditionalFeatures";
import ImageCarousel from "../components/editHall/ImageCarousel";
import { useState, useEffect } from "react";
import { EachHallType } from "../types/Hall.types";
import "../styles/hallInfo.css";
import HallSessions from "../components/editHall/HallSessions";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosMasterInstance from "../config/axiosMasterInstance";
import { useParams } from "react-router-dom";
import { queryClient } from "../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HallPricing from "../components/editHall/HallPricing";

export default function EditHall() {
  let { id: HallID } = useParams();
  const [hallData, setHallData] = useState<EachHallType | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { data: databaseHallData } = useQuery({
    queryKey: [`allhalls`, `hall-${HallID}`],
    queryFn: async () => {
      console.log("FETCHING");
      const responsePromise = axiosMasterInstance.get(`getHall/${HallID}`);
      toast.promise(responsePromise, {
        pending: "Updating with latest data...",
        success: "Fetched Hall Data",
        error: "Failed to fetch hall Data",
      });
      const response = await responsePromise;
      setHallData(response.data);
      return response.data as EachHallType;
    },
    staleTime: 5 * 60 * 1000,
  });

  const editHallMutation = useMutation({
    mutationFn: async () => {
      console.log(hallData);
      const responsePromise = axiosMasterInstance.post(
        `/editHall/${HallID}`,
        hallData
      );
      toast.promise(responsePromise, {
        pending: "Updating...",
        success: "Hall Details Edited!",
        error: "Failed to Edit Hall. Please try again.",
      });
      const response = await responsePromise;
      console.log(response.data);
    },
    onSuccess: async () => {
      console.log("REVALIDATING");
      await queryClient.refetchQueries({
        queryKey: [`allhalls`],
      });
      setIsEditing(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (JSON.stringify(databaseHallData) !== JSON.stringify(hallData)) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [hallData, databaseHallData]);

  return (
    <div className="flex flex-col items-center gap-5 sm:gap-10 px-3 sm:px-10 md:px-16 lg:px-28 pt-10">
      {databaseHallData && hallData && (
        <>
          <div className="flex flex-col items-center">
            <p className="text-blue-700 font-semibold">Edit</p>
            <input
              className="text-3xl md:text-4xl lg:text-5xl text-center border border-gray-400"
              value={hallData.name}
              onChange={(e) => {
                setHallData((prev) => {
                  if (prev) return { ...prev, name: e.target.value };
                });
              }}
            />
          </div>
          {isEditing && (
            <div className="w-full flex flex-col items-center gap-3 fixed z-20 top-0 bg-white px-3 py-2 border-gray-400 rounded-md shadow-md">
              <p>Confirm the changes you just made</p>
              <div className="flex gap-5">
                <button
                  className="bg-green-500 p-1 px-2 rounded-md text-xl font-semibold text-white"
                  onClick={() => editHallMutation.mutate()}
                >
                  Confirm
                </button>
                <button
                  className="bg-red-500 p-1 px-2 rounded-md text-xl font-semibold text-white"
                  onClick={() => {
                    setHallData(databaseHallData);
                    setIsEditing(false);
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
          <hr className="bg-gray-300 h-[1.5px] w-full" />
          <AboutHall
            data={hallData}
            about={hallData.about}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
          <div className="flex gap-3 items-center w-full">
            <h1 className="w-1/5 ">Contact Email:</h1>
            <textarea
              name="contactEmail"
              value={hallData.contactEmail}
              onChange={(e) => {
                setHallData((prev) => {
                  if (prev) return { ...prev, contactEmail: e.target.value };
                });
              }}
              className="px-3 py-1 rounded w-full h-auto border-2 border-black"
            />
          </div>
          <HallCapacity
            data={hallData}
            capacity={hallData.capacity}
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
          <HallPricing
            sessions={hallData.sessions}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
          {hallData.additionalFeatures && (
            <HallAdditionalFeatures
              data={hallData}
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
