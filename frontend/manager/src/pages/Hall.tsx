import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosManagerInstance from "../config/axiosManagerInstance.ts";
import { EachHallType } from "../types/Hall.types.ts";
import { toast } from "react-toastify";
import Calendar from "../components/Calender/calendar.tsx";
import "react-toastify/dist/ReactToastify.css";

function Hall() {
  const { id } = useParams<{ id: string }>();

  const { data, isFetching } = useQuery({
    queryKey: ["allhalls", `hall-${id}`],
    queryFn: async () => {
      try {
        const responsePromise = axiosManagerInstance.get(`getHall/${id}`);
        toast.promise(responsePromise, {
          pending: "Fetching hall...",
          // success: "Hall fetched successfully!",
          error: "Failed to fetch Hall. Please try again.",
        });
        const response = await responsePromise;
        return response.data as EachHallType;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });

  if (isFetching) {
    return (
      <>
        <div>Fetching Info</div>
      </>
    );
  }
  return (
    <>
      {data && (
        <div>
          {data ? (
            <div className="flex w-full flex-col gap-10 my-10">
              <h1 className="text-center text-5xl ">
                Bookings for {data.name}
              </h1>
              <Calendar hallId={id as string} HallData={data} />
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-semibold my-5 text-center">
                NO SUCH HALL EXISTS
              </h1>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Hall;
