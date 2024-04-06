import dayjs from "dayjs";
import { useParams , useNavigate} from "react-router-dom";
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
import { isValidMobile } from "../utils/validateMobile"; 
import { AxiosError } from "axios";

function BookADay() {
  const navigate = useNavigate();
  const { id, day } = useParams();
  const [selectedSessionId, setSelectedSessionId] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [name, setName] = useState("");
  const [person, setPerson] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  //const [aadharNumber, setAadharNumber] = useState("");
  //const [panCard, setPanCard] = useState("");
  //const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobileNumber: "",
  });
  const [selectedFeatures, setSelectedFeatures] = useState<{
    [key: string]: EachHallAdditonalFeaturesType;
  }>({});
  const [price, setPrice] = useState<number>();
  const [isSame, setIsSame] = useState<boolean>(false);
  const [isDetailsConfirmed, setIsDetailsConfirmed] = useState<boolean>(false);

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
            contact: person,
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
          return response.data; 
        })
        .catch((error) => {
          console.log(error);
          throw error; 
        }),
    mutationKey: ["addhall"],
    onSuccess: async (data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        navigate("/bookingsuccessful", {
          state: {
            bookingDetails: {
              username: name,
              contact: person,
              email: email,
              mobile: mobileNumber,
              hallName: HallData?.name,
              sessionType:selectedSessionId,
              estimatedPrice:price,
              additionalFeatures:selectedFeatures
            },
          },
        });
      }
      await queryClient.refetchQueries({
        queryKey: [`bookings`],
      });
    },
    onError: (error: AxiosError) => {
      if (error.response && error.response.status === 400) {
        toast.error("Oops!!Session booked already. Cannot enquire for a session which is already booked. Please try to enquire for the sessions not booked.");
      } else {
        console.error("An error occurred:", error);
      }
    },
  
  });

  const handleSubmit = () => {
    console.log("running");
    let hasErrors = false;
    let newErrors = { name: "", person: "", email: "", mobileNumber: "" };

    if (!name) {
      newErrors.name = "Name is required";
      hasErrors = true;
      setErrors(newErrors);
      return;
    }
    if (!person) {
      newErrors.person = "Contact Person is required";
      hasErrors = true;
      setErrors(newErrors);
      return;
    }
    if (!email) {
      newErrors.email = "Email Address is required";
      hasErrors = true;
      setErrors(newErrors);
      return;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      hasErrors = true;
    }
    if (!mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
      hasErrors = true;
      setErrors(newErrors);
      return;
    } else if (!isValidMobile(mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid Mobile Number";
      hasErrors = true;
      setErrors(newErrors);
      return;
    }
    setErrors({ name: "", email: "", mobileNumber: "" });

    if (!hasErrors && isDetailsConfirmed) {
      const yes = {
        user: {
          username: name,
          contact: person,
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

  const handleSameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSame(event.target.checked);
    if (event.target.checked) {
      setPerson(name);
    }
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
      <span>Estimated Price : ₹{price} + GST (if applicable)</span>
      <div className="flex flex-col gap-4">
        <label htmlFor="session">Session Type</label>
        <select
          className="p-2 rounded-md"
          id="session"
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
        <label htmlFor="booking">Booking Type</label>
        {selectedSessionId && (
          <select
            className="p-2 rounded-md"
            id="booking"
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
        <label htmlFor="name">Customer Name</label>
        <input
          className="bg-gray-200 border-gray-300 border rounded-md px-2 p-1"
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="person">Contact Person</label>
        <input
          className="bg-gray-200 border-gray-300 border rounded-md px-2 p-1"
          id="person"
          type="text"
          placeholder="Jane Smith"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
        />
        <span>
          <input
            type="checkbox"
            id="same"
            checked={isSame}
            onChange={handleSameChange}
          />
          <label htmlFor="same"> Same as Customer Name</label>
        </span>
        {errors.name && <p className="text-red-500">{errors.name}</p>}
        <label htmlFor="email">Email</label>
        <input
          className="bg-gray-200 border-gray-300 border rounded-md px-2 p-1"
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
        <label htmlFor="mobile">Mobile</label>
        <input
          className="bg-gray-200 border-gray-300 border rounded-md px-2 p-1"
          id="mobile"
          type="tel"
          placeholder="999999999"
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
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="confirmDetails"
            checked={isDetailsConfirmed}
            onChange={(e) => setIsDetailsConfirmed(e.target.checked)}
          />
          <label htmlFor="confirmDetails">
              Re-check all the entered details (important that the email and
              mobile details entered are correct)
          </label>
        </div>
        <button
            onClick={handleSubmit}
            className={`font-bold py-2 px-4 rounded cursor-pointer ${
            isDetailsConfirmed
                ? "bg-green-500 hover:bg-green-700 text-white"
                : "bg-gray-500 text-white"
            }`}
            value="Submit"
            disabled={!isDetailsConfirmed}
        >
          Enquire
        </button>
      </div>
    </div>
  );
}

export default BookADay;
