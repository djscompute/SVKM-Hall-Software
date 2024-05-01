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
  });

  if (isFetching) return <h1>LOADING</h1>;
  return (
    <div className="flex flex-col items-center">
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
