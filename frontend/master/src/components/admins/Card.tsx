import { Link } from "react-router-dom";
import { EachHallType, adminType } from "../../../../../types/global";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosInstance";

export default function Card({ adminData }: { adminData: adminType }) {
  const managedHalls = adminData.managedHalls || [];

  const { data: hallDataArray, isFetching } = useQuery({
    queryKey: managedHalls.map((id) => [`hallName${id}`]),
    queryFn: async () => {
      //Remove these lines after database is fixed, was throwing continuous errors
      if (adminData.managedHalls?.[0] == "BJ Hall") return null;
      if (adminData.managedHalls?.[0] == "BJ Hall Upgraded Version")
        return null;
      //Remove these lines after database is fixed, was throwing continuous errors

      try {
        const promises = managedHalls?.map((id) =>
          axiosInstance.get(`getHall/${id}`)
        );
        const responses = await Promise.all(promises);
        const hallData = responses.map(
          (response) => response.data as EachHallType
        );
        return hallData;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });

  return (
    <div className="flex flex-col rounded-lg bg-white w-full lg:w-1/3 m-3 md:m-10 lg:m-2 drop-shadow-2xl p-4 border-2 border-gray-300 ">
      {/* TEXT PART */}
      <div className="flex flex-col px-5 py-2">
        <div className="text-base sm:text-xl text-black mb-2">
          <span className="font-bold">Name:</span> {adminData.username}
        </div>

        <div className="text-base sm:text-xl text-black mb-2">
          <span className="font-bold">ID:</span> {adminData._id}
        </div>

        <div className="text-base sm:text-xl text-black mb-2">
          <span className="font-bold">Email:</span> {adminData.email}
        </div>

        <div className="text-base sm:text-xl text-black mb-2">
          <span className="font-bold">Role:</span> {adminData.role}
        </div>

        {/* Display names of managed halls */}
        {adminData.role == "MANAGER" && (
          <div className="text-base sm:text-xl text-black mb-2">
            <span className="font-bold">Managed Halls:</span>{" "}
            {hallDataArray &&
              hallDataArray.map((hallData, index) => (
                <span key={index}>{hallData.name}</span>
              ))}
          </div>
        )}

        <div className="flex flex-row items-center justify-between mt-3">
          <Link to={`/admin/${adminData._id}`}>
            <div className="text-pink-600 border-2 text-sm sm:text-base border-pink-600 hover:bg-pink-600 hover:text-white px-4 py-1 rounded-full">
              Edit Admin
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
