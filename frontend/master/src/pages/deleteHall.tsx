import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosMasterInstance from "../config/axiosMasterInstance";
import { queryClient } from "../App";
import { toast } from "react-toastify";

function DeleteHall() {
  const [selectedHallId, setSelectedHallId] = useState<string>("");

  // Fetch the list of halls
  const { data: halls, isLoading: isHallsLoading, error: hallsError } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      const response = await axiosMasterInstance.get("/getAllHalls");
      return response.data;
    },
  });

  const deleteHallMutation = useMutation({
    mutationFn: () =>
      toast.promise(axiosMasterInstance.delete(`/halls/${selectedHallId}`), {
        success: "Hall deleted successfully!",
        error: "Error deleting hall.",
        pending: "Deleting hall...",
      }),
    mutationKey: ["deletehall"],
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["allhalls"],
      });
    },
  });

  const deleteHall = () => {
    if (selectedHallId.trim() === "") {
      toast.error("Please select a hall to delete");
      return;
    }
    deleteHallMutation.mutate();
  };

  if (isHallsLoading) {
    return <div>Loading...</div>;
  }

  if (hallsError) {
    return <div>Error fetching halls: {hallsError.message}</div>;
  }

  return (
    <div className="flex w-full flex-col items-center gap-5 sm:gap-10 px-3 sm:px-10 md:px-16 lg:px-28">
      <div className="flex flex-col items-center">
        <p className="text-red-700 font-semibold">Delete Hall</p>
        <select
          value={selectedHallId}
          onChange={(e) => setSelectedHallId(e.target.value)}
          className="text-3xl md:text-4xl lg:text-5xl text-center border border-gray-400"
        >
          <option value="">Select a Hall</option>
          {halls.map((hall: any) => (
            <option key={hall._id} value={hall._id}>
              {hall.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex mb-20">
        <button
          className="bg-red-400 active:bg-red-600 px-3 py-2 rounded-md border-2 border-red-600"
          onClick={deleteHall}
        >
          DELETE
        </button>
      </div>
    </div>
  );
}

export default DeleteHall;
