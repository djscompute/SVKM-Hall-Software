import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance.ts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../components/admins/Card.tsx";
import { adminType } from "../../../../types/global.ts";

function Admins() {
  const { data, isFetching } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      try {
        const responsePromise = axiosInstance.get("getAllAdmins");
        console.log("FETCHING");
        toast.promise(responsePromise, {
          pending: "Fetching admins...",
          success: "Admins Fetched !",
          error: "Failed to fetch Admins. Please try again.",
        });
        const response = await responsePromise;
        return response.data as adminType[];
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });

  if (isFetching) return <h1>LOADING</h1>;
  return (
    <div className="flex flex-col items-center mb-20">
      <div className="flex flex-col items-end w-4/5 mt-5">
        <a className="border-2 border-green-500 rounded-lg text-green-500 px-3 py-1" href="/createadmin">
          Create New Admin
        </a>
      </div>
      <h1 className=" text-3xl font-semibold my-5">All Admins</h1>
      <div className="flex flex-wrap justify-around w-full">
        {data?.map((adminProp) => (
          <Card key={adminProp._id} adminData={adminProp} />
        ))}
      </div>
    </div>
  );
}

export default Admins;
