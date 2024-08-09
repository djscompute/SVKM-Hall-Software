import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosMasterInstance from "../config/axiosMasterInstance";
import { queryClient } from "../App";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'


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




    Swal.fire({
      title: 'Confirm Deletion !',
      text: 'Are you sure you want to delete this hall ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'bg-green-500 text-white font-bold py-2 px-4 rounded m-2',
        cancelButton: 'bg-red-500 text-white font-bold py-2 px-4 rounded m-2'
      },
      buttonsStyling: false 
    }).then((result) => {
      if (result.isConfirmed) {
      
        console.log('Deletion is confirmed');
        deleteHallMutation.mutate();
      } else if (result.isDismissed) {
        
        console.log('Discarded');
      }
    });
   
  };

  if (isHallsLoading) {
    return <div>Loading...</div>;
  }

  if (hallsError) {
    return <div>Error fetching halls: {hallsError.message}</div>;
  }
  

  return (
    <div className="flex w-full flex-col items-center gap-5 sm:gap-10 px-3 sm:px-10 md:px-16 lg:px-28">
      <div className="flex flex-col items-center gap-3">
        <div className="mt-2">
        <p className="text-red-700 font-bold text-4xl">Delete Hall</p>

        </div>
        <select
          value={selectedHallId}
          onChange={(e) => setSelectedHallId(e.target.value)}
          className="text-2xl md:text-3xl lg:text-4xl text-center border border-gray-400 mt-5 rounded-md"
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
          className="bg-red-400 active:bg-red-600 px-3 py-2 rounded-md border-2 border-red-600 hover:font-bold hover:p-3"
          onClick={deleteHall}
        >
          DELETE
        </button>
      </div>
    </div>
  );
}

export default DeleteHall;
