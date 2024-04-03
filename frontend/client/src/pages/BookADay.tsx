import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { EachHallType } from "../types/Hall.types";
import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function BookADay() {
  const { id, day } = useParams();
  const [selectedSessionId, setSelectedSessionId] = useState<string>();
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const dayjsObject = dayjs(day);
  const humanReadableDate = dayjsObject.format("MMMM D, YYYY");

  const { data: HallData, isFetching } = useQuery({
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);
  console.log(errors);

  const featureNames =
    HallData?.additionalFeatures?.map((feature) => feature.heading) || [];
  const watchedFeatures = watch(featureNames);

  console.log(watchedFeatures);

  useEffect(() => {
    if (HallData) {
      const selectedFeaturesPrices = HallData.additionalFeatures
        .filter((feature) => watchedFeatures[feature.heading])
        .reduce((acc, curr) => acc + curr.price, 0);
      setTotalPrice((Number(HallData.pricing) || 0) + selectedFeaturesPrices);
    }
  }, [watchedFeatures, HallData]);

  if (isFetching) return <h1>Loading</h1>;

  return (
    <div className="flex flex-col items-center pt-10 gap-3">
      <h1 className=" text-3xl font-semibold">
        Book HallName for {humanReadableDate}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <h1>Price {totalPrice}</h1>
        <select
          className=" px-2 py-1 rounded-md"
          value={selectedSessionId}
          onChange={(e) => {
            setSelectedSessionId(e.target.value);
          }}
        >
          {HallData?.sessions?.map((eachSession) => (
            <option
              key={eachSession._id}
              value={eachSession._id}
              className={`flex flex-col text-center ${
                !eachSession.active && "hidden"
              }`}
            >
              {eachSession.name} |{" "}
              {convert_IST_TimeString_To12HourFormat(
                eachSession.from as string
              )}{" "}
              - {convert_IST_TimeString_To12HourFormat(eachSession.to)}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder=" Name"
          {...register(" Name", { required: true })}
        />
        <input type="email" placeholder="Email" {...register("Email", {})} />
        <input
          type="tel"
          placeholder="Mobile Number"
          {...register("Mobile Number", { required: true })}
        />
        <input
          type="number"
          placeholder="Aadhar Number"
          {...register("Aadhar Number", { required: true, max: 12, min: 12 })}
        />
        <h6>Additional Features</h6>
        {HallData?.additionalFeatures?.map((eachFeature) => (
          <span>
            <input
              type="checkbox"
              id={eachFeature.heading}
              placeholder={eachFeature.heading}
              {...register(eachFeature.heading)}
            />
            <label htmlFor={eachFeature.heading}>
              {" "}
              {eachFeature.desc} Rs{eachFeature.price}
            </label>
          </span>
        ))}
        <input
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        />
      </form>
    </div>
  );
}

export default BookADay;
