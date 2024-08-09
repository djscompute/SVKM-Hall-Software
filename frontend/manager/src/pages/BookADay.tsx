import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import axiosManagerInstance from "../config/axiosManagerInstance";
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
  const [purpose, setPurpose] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    person: "",
    email: "",
    mobileNumber: "",
    purpose: "",
    sessionType: "",
    bookingType: "",
  });
  const [selectedFeatures, setSelectedFeatures] = useState<{
    [key: string]: EachHallAdditonalFeaturesType;
  }>({});
  const [price, setPrice] = useState<number>(0);
  const [securityDeposit,setSecurityDeposit] = useState<number>(0);
  const [isSame, setIsSame] = useState<boolean>(false);
  const [isDetailsConfirmed, setIsDetailsConfirmed] = useState<boolean>(false);

  const dayjsObject = dayjs(day);
  const humanReadableDate = dayjsObject.format("MMMM D, YYYY");

  const { data: HallData } = useQuery({
    queryKey: ["bookaday", `${humanReadableDate}`],
    queryFn: async () => {
      try {
        const responsePromise = axiosManagerInstance.get(`getHall/${id}`);
        toast.promise(responsePromise, {
          pending: "Fetching hall...",
          error: "Failed to fetch Hall. Please try again.",
        });
        const response = await responsePromise;
        console.log(response.data);
        return response.data as EachHallType;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });

  useEffect(() => {
    if (selectedCategory?.toLowerCase() === "svkm institute") {
      setSecurityDeposit(0);
    } else if (HallData) {
      setSecurityDeposit(HallData.securityDeposit || 0);
    }
  }, [selectedCategory, HallData]);

  const enquiryNumber = `ENQ-${dayjs().format("YYYYMMDD-HHmmss")}`;

  const addBookingMutation = useMutation({
    mutationFn: () =>
      axiosManagerInstance
        .post(`/addBooking`, {
          user: {
            username: name,
            contact: person,
            email: email,
            mobile: mobileNumber,
          },
          features: Object.values(selectedFeatures),
          status: "ENQUIRY",
          baseDiscount: 0,
          deposit: HallData?.securityDeposit || 0,
          isDeposit: true,
          depositDiscount: 0,
          price: price,
          hallId: id,
          session_id: selectedSessionId,
          booking_type: selectedCategory,
          from: `${day}T${
            HallData?.sessions.find((ecssn) => ecssn._id == selectedSessionId)
              ?.from as string
          }`,
          to: `${day}T${
            HallData?.sessions.find((ecssn) => ecssn._id == selectedSessionId)
              ?.to as string
          }`,
          purpose: purpose,
          enquiryNumber: enquiryNumber
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
        const additionalFacilities =
        selectedCategory === "SVKM INSTITUTE"
          ? 0
          : Object.values(selectedFeatures).reduce(
              (acc, feature) => acc + feature.price,
              0
            );

      const sessionPrice =
        HallData?.sessions
          .find((ss) => ss._id === selectedSessionId)
          ?.price.find((e) => e.categoryName === selectedCategory)?.price ||
        0;

      const totalPayable =
        sessionPrice + additionalFacilities + securityDeposit;
        const todayDate = dayjs().format("DD-MM-YYYY");
        const dateOfEvent = dayjs(day).format("DD-MM-YYYY");
      axiosManagerInstance
        .post(`/generateInquiry`, {
          date: todayDate, // Assuming 'day' is the date of booking
          customerName: name,
          contactPerson: person,
          contactNo: mobileNumber,
          enquiryNumber: enquiryNumber, // Generate a unique enquiry number
          hallName: HallData?.name,
          dateOfEvent: dateOfEvent,
          slotTime: `${convert_IST_TimeString_To12HourFormat(
            HallData?.sessions.find((ss) => ss._id === selectedSessionId)
              ?.from!
          )} - ${convert_IST_TimeString_To12HourFormat(
            HallData?.sessions.find((ss) => ss._id === selectedSessionId)?.to!
          )}`,
          purposeOfBooking: purpose,
          hallCharges: sessionPrice,
          additionalFacilities: additionalFacilities,
          hallDeposit: securityDeposit,
          totalPayable: totalPayable,
          hallContact: "Email to be entered"
        })
        .then((response) => {
          console.log(response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });

      axiosManagerInstance
        .post(`/sendEmail`, {
          to: email,
          subject: `SVKM Hall Booking for ${day}`,
          text: "Your enquiry for hall booking has been received. Please find the attachments below.",
          filename: `${name}_${enquiryNumber}_inquiry`,
          path: "",
        })
        .then((response) => {
          console.log(response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });

        navigate("/bookingsuccessful", {
          state: {
            bookingDetails: {
              username: name,
              contact: person,
              email: email,
              mobile: mobileNumber,
              hallName: HallData?.name,
              sessionType: selectedSessionId,
              sessionName: HallData?.sessions.find(
                (ecssn) => ecssn._id == selectedSessionId
              )?.name,
              booking_type: selectedCategory,
              estimatedPrice: price,
              securityDeposit: securityDeposit,
              additionalFeatures: selectedFeatures,
              date: humanReadableDate,
              startTime: `${day}T${
                HallData?.sessions.find(
                  (ecssn) => ecssn._id == selectedSessionId
                )?.from
              }`,
              endTime: `${day}T${
                HallData?.sessions.find(
                  (ecssn) => ecssn._id == selectedSessionId
                )?.to
              }`,
              status: "ENQUIRY",
              eventPurpose: purpose,
            },
          },
        });
      }
      await queryClient.refetchQueries({
        queryKey: ["bookaday", `${humanReadableDate}`],
      });
    },
    onError: (error: AxiosError) => {
      if (error.response && error.response.status === 400) {
        toast.error(
          "Oops!!Session booked already. Cannot enquire for a session which is already booked. Please try to enquire for the sessions not booked."
        );
      } else {
        console.error("An error occurred:", error);
      }
    },
  });

  const handleSubmit = () => {
    let newErrors = {
      name: "",
      person: "",
      email: "",
      mobileNumber: "",
      purpose: "",
      sessionType: "",
      bookingType: "",
    };
    let hasErrors = false;

    // Validate name field
    if (!name) {
      newErrors.name = "Name is required";
      hasErrors = true;
    }

    // Validate contact person field
    if (!person) {
      newErrors.person = "Contact Person is required";
      hasErrors = true;
    }

    // Validate email field
    if (!email) {
      newErrors.email = "Email Address is required";
      hasErrors = true;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      hasErrors = true;
    }

    // Validate mobile number field
    if (!mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
      hasErrors = true;
    } else if (!isValidMobile(mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid Mobile Number";
      hasErrors = true;
    }

    // Validate session type selection
    if (!selectedSessionId) {
      newErrors.sessionType = "Session Type is required";
      hasErrors = true;
    }

    // Validate booking type selection
    if (!selectedCategory) {
      newErrors.bookingType = "Booking Type is required";
      hasErrors = true;
    }

    // Validate purpose field
    if (!purpose) {
      newErrors.purpose = "Purpose is required";
      hasErrors = true;
    }

    // Set errors if any
    setErrors(newErrors);

    // If there are errors, return early
    if (hasErrors) {
      return;
    }

    // Proceed with mutation
    if (isDetailsConfirmed) {
      const bookingData = {
        user: {
          username: name,
          contact: person,
          email: email,
          mobile: mobileNumber,
        },
        features: Object.values(selectedFeatures),
        status: "ENQUIRY",
        baseDiscount: 0,
        deposit: HallData?.securityDeposit || 0,
        isDeposit: true,
        depositDiscount: 0,
        price: price,
        hallId: id,
        session_id: selectedSessionId,
        booking_type: selectedCategory,
        from: `${day}T${
          HallData?.sessions.find((ss) => ss._id === selectedSessionId)?.from
        }`,
        to: `${day}T${
          HallData?.sessions.find((ss) => ss._id === selectedSessionId)?.to
        }`,
        purpose: purpose,
        bookingContact: "Email to be entered"
      };
      console.log(bookingData);
      // Perform mutation
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
    let totalPrice = 0;
    if (selectedCategory?.toLowerCase() !== "svkm institute") {
      totalPrice = Object.values(selectedFeatures).reduce(
        (acc, feature) => acc + feature.price,
        0
      );
    }
    const slctdsession = HallData?.sessions.find(
      (ss) => ss._id == selectedSessionId
    );
    totalPrice +=
      slctdsession?.price.find((e) => e.categoryName == selectedCategory)
        ?.price || 0;
    setPrice(totalPrice);
  }, [selectedFeatures, selectedSessionId, selectedCategory]);

  return (
    <div className="flex flex-col mx-10 items-center py-10 gap-3">
      <h1 className="text-3xl text-center font-semibold">
        Book {HallData?.name} for {humanReadableDate}
      </h1>
      <span className="text-center">
      {selectedCategory == "SVKM INSTITUTE" ? (
          <div>
            <b>Estimated Price :</b> ₹{price} + Security Deposit ₹
            {securityDeposit}
          </div>
        ) : (
          <div>
            <b>Estimated Price :</b> ₹{price} + GST (if applicable) + Security
            Deposit ₹{securityDeposit}
          </div>
        )}
      </span>
      <div className="flex flex-col gap-4">
        <label htmlFor="session">
          <b>Session Type</b>
        </label>
        <select
          className="p-2 rounded-md border border-black"
          id="session"
          value={selectedSessionId}
          onChange={(e) => {
            setSelectedSessionId(e.target.value);
          }}
        >
          <option value="">Select your session type</option>
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
        {errors.sessionType && (
          <p className="text-red-500">{errors.sessionType}</p>
        )}
        {selectedSessionId && (
          <>
            <label htmlFor="booking">
              <b>Booking Type</b>
            </label>

            <select
              className="p-2 rounded-md border border-black"
              id="booking"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
            >
              <option value="">Select your booking type</option>
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
          </>
        )}
        {selectedSessionId && errors.bookingType && (
          <p className="text-red-500">{errors.bookingType}</p>
        )}
        <label htmlFor="name">
          <b>Customer Name</b>
        </label>
        <input
          className="p-2 border-gray-300 border rounded-md px-2 "
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
        <label htmlFor="person">
          <b>Contact Person</b>
        </label>
        <input
          className="p-2 border-gray-300 border rounded-md px-2 "
          id="person"
          type="text"
          placeholder="Jane Smith"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          disabled={isSame}
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
        {errors.person && <p className="text-red-500">{errors.person}</p>}
        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input
          className="p-2 border-gray-300 border rounded-md px-2 "
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
        <label htmlFor="mobile">
          <b>Mobile</b>
        </label>
        <input
          className="p-2 border-gray-300 border rounded-md px-2 "
          id="mobile"
          type="tel"
          placeholder="999999999"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        {errors.mobileNumber && (
          <p className="text-red-500">{errors.mobileNumber}</p>
        )}
        {/* Purpose of Booking */}
        <div>
          <label htmlFor="person">
            <b>Purpose (Event Type)</b>
          </label>
          <div>
            <p className=" text-xs text-orange-500 font-semibold">
              The following types of events are not allowed to be booked at this
              hall:
            </p>
            {HallData &&
            HallData.eventRestrictions &&
            HallData.eventRestrictions.length > 0 ? (
              <p className=" text-xs text-orange-500 font-semibold">
                - {HallData?.eventRestrictions}
              </p>
            ) : (
              <p>- No restrictions</p>
            )}
          </div>
          <br />
          <input
            className="p-2 border-gray-300 border rounded-md px-2  w-full"
            type="text"
            placeholder="Purpose of booking"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
          {errors.purpose && <p className="text-red-500">{errors.purpose}</p>}
        </div>

        <h6 className="text-red-500">
          <b>Security Deposit Charges Applicable: ₹{securityDeposit}</b>
        </h6>

        <h6>
          <b>Additional Features</b>
        </h6>
        {HallData?.additionalFeatures?.map((eachFeature) => (
          <span className="flex items-center gap-2" key={eachFeature.heading}>
            <input
              type="checkbox"
              id={eachFeature._id}
              checked={!!selectedFeatures[eachFeature._id!]}
              onChange={() => handleCheckboxChange(eachFeature)}
            />
            <label htmlFor={eachFeature._id}>
              {eachFeature.heading} - ₹
              {selectedCategory === "SVKM INSTITUTE" ? 0 : eachFeature.price}
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
