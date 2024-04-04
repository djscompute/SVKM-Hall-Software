import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  EachHallAdditonalFeaturesType,
  EachHallType,
} from "../types/Hall.types";
import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat";
import { useState, useEffect } from "react";
import { queryClient } from "../App";
import { isValidEmail } from "../utils/validateEmail";

function BookADay() {
  const { id, day } = useParams();
  const [selectedSessionId, setSelectedSessionId] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  //const [aadharNumber, setAadharNumber] = useState("");
  //const [panCard, setPanCard] = useState("");
  //const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({ name: "",email:"", mobileNumber: "" });
  const [selectedFeatures, setSelectedFeatures] = useState<{
    [key: string]: EachHallAdditonalFeaturesType;
  }>({});
  const [price, setPrice] = useState<number>();

  const dayjsObject = dayjs(day);
  const humanReadableDate = dayjsObject.format("MMMM D, YYYY");

  const { data: HallData, isFetching } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      try {
        const responsePromise = axiosInstance.get(`getHall/${id}`);
        toast.promise(responsePromise, {
          pending: "Fetching hall...",
          error: "Failed to fetch Hall. Please try again.",
        });
        const response = await responsePromise;
        return response.data as EachHallType;
      } catch (error) {
        throw error;
      }
    },
  });

  const addBookingMutation = useMutation({
    mutationFn: () =>
      axiosInstance
        .post(`/addBooking`, {
          user: {
            username: name,
            email: email,
            //aadharNo: aadharNumber,
            //panNo: panCard,
            //address: address,
            mobile: mobileNumber,
          },
          features: Object.values(selectedFeatures),
          status: "ENQUIRY",
          price: price,
          hallId: id,
          session_id: selectedSessionId,
          from: `${day}T${
            HallData?.sessions.find((ecssn) => ecssn._id == selectedSessionId)
              ?.from
          }`,
          to: `${day}T${
            HallData?.sessions.find((ecssn) => ecssn._id == selectedSessionId)
              ?.to
          }`,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        }),
    mutationKey: ["addhall"],
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [`bookings`],
      });
    },
  });

  const handleSubmit = () => {
    console.log("running");
    let hasErrors = false;
    let newErrors = { name: "",email:"", mobileNumber: "" };

    if (!name) {
      newErrors.name = "Name is required";
      hasErrors = true;
      setErrors(newErrors);
      return;
    }
    if (!email) {
      newErrors.email = "Email Address is required";
      hasErrors = true;
      setErrors(newErrors);
      return;
    }else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      hasErrors = true;
    }
    if (!mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
      hasErrors = true;
      setErrors(newErrors);
      return;
    }
    setErrors({ name: "",email:"", mobileNumber: "" });

    if (!hasErrors) {
      const yes = {
        user: {
          username: name,
          email: email,
          //aadharNo: aadharNumber,
          //panNo: panCard,
          //address: address,
          mobile: mobileNumber,
        },
        features: Object.values(selectedFeatures),
        status: "ENQUIRY",
        price: price,
        hallId: id,
        session_id: selectedSessionId,
        from: `${day}T${
          HallData?.sessions.find((ecssn) => ecssn._id == selectedSessionId)
            ?.from
        }`,
        to: `${day}T${
          HallData?.sessions.find((ecssn) => ecssn._id == selectedSessionId)?.to
        }`,
      };
      console.log(yes);
      addBookingMutation.mutate();
    }
  };

  const handleCheckboxChange = (feature: EachHallAdditonalFeaturesType) => {
    setSelectedFeatures((prevSelectedFeatures) => {
      if (prevSelectedFeatures[feature._id!]) {
        // If the feature is already selected, remove it from the selected features
        const updatedFeatures = { ...prevSelectedFeatures };
        delete updatedFeatures[feature._id!];
        return updatedFeatures;
      } else {
        // If the feature is not selected, add it to the selected features
        return { ...prevSelectedFeatures, [feature._id!]: feature };
      }
    });
  };

  useEffect(() => {
    let totalPrice = Object.values(selectedFeatures).reduce(
      (acc, feature) => acc + feature.price,
      0
    );
    const slctdsession = HallData?.sessions.find(
      (ss) => ss._id == selectedSessionId
    );
    totalPrice +=
      slctdsession?.price.find((e) => e.categoryName == selectedCategory)
        ?.price || 0;
    setPrice(totalPrice);
  }, [selectedFeatures, selectedSessionId, selectedCategory]);

  useEffect(() => {
    setSelectedSessionId(HallData?.sessions[0]._id);
    setSelectedCategory(HallData?.sessions[0].price[0].categoryName);
  }, [HallData]);

  return (
    <div className="flex flex-col items-center py-10 gap-3">
      <h1 className="text-3xl font-semibold">
        Book {HallData?.name} for {humanReadableDate}
      </h1>
      <span>Estimated Price : ₹{price}</span>
      <div className="flex flex-col gap-4">
        <select
          className="p-2 rounded-md"
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
        {selectedSessionId && (
          <select
            className="p-2 rounded-md"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
          >
            {HallData?.sessions
              .find((ss) => ss._id == selectedSessionId)
              ?.price?.map((eachSessionCategory) => (
                <option
                  key={eachSessionCategory.categoryName}
                  value={eachSessionCategory.categoryName}
                  className={`flex flex-col text-center`}
                >
                  {eachSessionCategory.categoryName}
                </option>
              ))}
          </select>
        )}
        <input
          className="bg-gray-200 border-gray-300 border rounded-md px-2 p-1"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
        <input
          className="bg-gray-200 border-gray-300 border rounded-md px-2 p-1"
          type="email"
          placeholder="Email Id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <p className="text-red-500">{errors.email}</p>
        )}
        <input
          className="bg-gray-200 border-gray-300 border rounded-md px-2 p-1"
          type="tel"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        {errors.mobileNumber && (
          <p className="text-red-500">{errors.mobileNumber}</p>
        )}
        {/*
        <input
          className="bg-gray-200 border-gray-300 border rounded-md px-2 p-1"
          type="number"
          placeholder="Aadhar Number"
          value={aadharNumber}
          onChange={(e) => setAadharNumber(e.target.value)}
        />
        <input
          className="bg-gray-200 border-gray-300 border rounded-md px-2 p-1"
          type="text"
          placeholder="Pan Card"
          value={panCard}
          onChange={(e) => setPanCard(e.target.value)}
        />
        <input
          className="bg-gray-200 border-gray-300 border rounded-md px-2 p-1"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        */}
        <h6>Additional Features</h6>
        {HallData?.additionalFeatures?.map((eachFeature) => (
          <span className="flex items-center gap-2" key={eachFeature.heading}>
            <input
              type="checkbox"
              id={eachFeature._id}
              checked={!!selectedFeatures[eachFeature._id!]}
              onChange={() => handleCheckboxChange(eachFeature)}
            />
            <label htmlFor={eachFeature._id}>
              {eachFeature.heading} - ₹{eachFeature.price}
            </label>
          </span>
        ))}
        <button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          value="Submit"
        >
          Enquire
        </button>
      </div>
    </div>
  );
}

export default BookADay;
