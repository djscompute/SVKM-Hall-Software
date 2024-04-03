import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance.ts";
import { EachHallType } from "../types/Hall.types.ts";
import { toast } from "react-toastify";
import Calendar from "../components/Calender/calendar.tsx";
import "react-toastify/dist/ReactToastify.css";

function Hall() {
  const { id } = useParams<{ id: string }>();

  const { data, isFetching } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const responsePromise = axiosInstance.get(`getHall/${id}`);
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
