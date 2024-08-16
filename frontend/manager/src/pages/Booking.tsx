import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import axiosManagerInstance from "../config/axiosManagerInstance";
import { toast } from "react-toastify";
import {
  CustomerType,
  EachHallType,
  HallBookingType,
  bookingStatusType,
  bookingTransactionType,
  transactionType,
} from "../../../../types/global";
import { useParams } from "react-router-dom";
import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat";
import { useEffect, useState } from "react";
import { queryClient } from "../App";

const possibleBookingTypes: bookingStatusType[] = [
  "CONFIRMED",
  //"TENTATIVE",
  "CANCELLED",
  "ENQUIRY",
];

function Booking() {
  const [totalFeatureCharges, setTotalFeatureCharges] = useState(0);
  const { bookingId } = useParams<{ bookingId: string }>();
  const [hallData, setHallData] = useState<EachHallType>();
  const [editingMode, setEditingMode] = useState(false);
  const [addAdditional, setAdditional] = useState(false);
  const [editedData, setEditedData] = useState<HallBookingType>();
  const [showCancellationReason, setShowCancellationReason] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [grandTotal, setGrandTotal] = useState(0);
  const [allBookingsOfUser, setAllBookingsOfUser] = useState<HallBookingType[]>(
    []
  );
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [selectedBookingData, setSelectedBookingData] =
    useState<HallBookingType | null>(null);

  // let totalFeatureCharges = 0;
  const [datas, setData] = useState({
    features: [{ heading: "", desc: "", price: 0 }],
    booking_type: "",
  });

  const { data, error, isFetching } = useQuery({
    queryKey: [`booking/${bookingId}`],
    queryFn: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const responsePromise = axiosManagerInstance.get(
          `getBookingByID?_id=${bookingId}`
        );
        toast.promise(responsePromise, {
          pending: "Fetching Booking...",
          error: "Failed to fetch Booking. Please try again.",
        });
        const response = await responsePromise;
        if (response.data.hallId) {
          const result = await axiosManagerInstance.get(
            `getHall/${response.data.hallId}`
          );
          setHallData(result.data);
        }
        return response.data as HallBookingType;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });
  console.log("The data is ", data);

  const {
    data: allBookingData,
    error: bookingError,
    isFetching: bookingIsFetching,
  } = useQuery({
    queryKey: [`bookings-${data?.from}-${data?.to}`],
    queryFn: async () => {
      const response = await axiosManagerInstance.get("getBooking", {
        params: {
          from: data?.from,
          to: data?.to,
          hallId: data?.hallId,
        },
      });
      console.log(response.data);
      if (response.data.message == "No bookings found for the specified range.")
        return [];
      // sort based of from
      response.data.sort((a: any, b: any) => dayjs(a.from).diff(dayjs(b.from)));
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // Data is considered fresh for 1 minutes
  });

  console.log(allBookingData);

  // Seperate mutation for confirm and save booking

  const confirmAndSaveBooking = useMutation({
    mutationFn: async () => {
      const responsePromise = axiosManagerInstance.post(
        `/editBooking/${bookingId}`,
        {
          ...editedData,
          date: editedData?.transaction.date || dayjs().format("DD-MM-YYYY"),
          status: "CONFIRMED" as bookingStatusType,
        }
      );
      toast.promise(responsePromise, {
        pending: "Updating and Confirming Booking...",
        success: "Booking Confirmed and Updated Successfully!",
        error: "Failed to Confirm and Update Booking. Please try again.",
      });
      const response = await responsePromise;
      return response.data;
    },
    onSuccess: async () => {
      setEditingMode(false);
      await queryClient.refetchQueries({
        queryKey: [`booking/${bookingId}`],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const generateConfirmationAndEmail = async () => {
    console.log("generating confirmation");
    const hallDeposit =
      editedData?.isDeposit === false
        ? 0
        : editedData?.deposit ??
          (data?.isDeposit === false ? 0 : data?.deposit ?? 0);
    console.log(data?.from);

    const startTime = dayjs(editedData?.from || data?.from).format("HH:mm:ss");
    const endTime = dayjs(editedData?.to || data?.to).format("HH:mm:ss");
    await axiosManagerInstance
      .post(`/generateConfirmation`, {
        date: dayjs().format("DD-MM-YYYY"), // Current date
        customerName: editedData?.user.username || data?.user.username,
        contactPerson: editedData?.user.contact || data?.user.contact,
        contactNo: editedData?.user.mobile || data?.user.mobile,
        enquiryNumber: editedData?.enquiryNumber || data?.enquiryNumber || "",
        gstNo: editedData?.user.gstNo || data?.user.gstNo || "",
        pan: editedData?.user.panNo || data?.user.panNo || "",
        modeOfPayment:
          editedData?.transaction?.type || data?.transaction?.type || "",
        additionalPaymentDetails: getAdditionalPaymentDetails(),
        hallName: hallData?.name || "",
        dateOfEvent: dayjs(editedData?.from || data?.from).format("DD-MM-YYYY"),
        slotTime: `${convert_IST_TimeString_To12HourFormat(
          startTime
        )} - ${convert_IST_TimeString_To12HourFormat(endTime)}`,
        purposeOfBooking: editedData?.purpose || data?.purpose || "",
        hallCharges: priceEntry?.price || 0,
        additionalFacilities: totalFeatureCharges,
        discountPercent: editedData?.baseDiscount || data?.baseDiscount || 0,
        sgst:
          data?.booking_type === "SVKM INSTITUTE"
            ? 0
            : 0.09 *
              ((priceEntry?.price || 0) +
                totalFeatureCharges -
                0.01 *
                  (editedData?.baseDiscount || data?.baseDiscount || 0) *
                  ((priceEntry?.price || 0) + totalFeatureCharges)),
        cgst:
          data?.booking_type === "SVKM INSTITUTE"
            ? 0
            : 0.09 *
              ((priceEntry?.price || 0) +
                totalFeatureCharges -
                0.01 *
                  (editedData?.baseDiscount || data?.baseDiscount || 0) *
                  ((priceEntry?.price || 0) + totalFeatureCharges)),
        hallDeposit: hallDeposit,
        depositDiscount:
          editedData?.depositDiscount || data?.depositDiscount || 0,
        totalPayable: calculateTotalPayable(),
        email: editedData?.user.email || data?.user.email || "",
        hallContact: "Email to be entered",
      })
      .then(async (response) => {
        await axiosManagerInstance.post(`/sendEmail`, {
          to: editedData?.user.email || data?.user.email || "",
          subject: `SVKM Hall Booking for ${dayjs(
            editedData?.from || data?.from
          ).format("DD-MM-YYYY")}`,
          text: "Your booking has been confirmed. Please find the attachments below.",
          filename: `${editedData?.user.username || data?.user.username}_${
            editedData?.enquiryNumber || data?.enquiryNumber || ""
          }_confirmation`,
          path: "",
        });

        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error("Error in generate confirmation or send email:", error);
      });
  };
  // Function   to calculate final payable amount of each bookings for multiple payments
  const calculateBookingPrice = (booking: { _id?: string; date?: string | undefined; user?: CustomerType; features: any; status?: bookingStatusType; price: any; transaction?: bookingTransactionType; baseDiscount: any; deposit: any; isDeposit: any; depositDiscount: any; hallId?: string; session_id?: string; booking_type: any; from?: string; to?: string; time?: { from: string; to: string; }; purpose?: string; cancellationReason?: string | undefined; enquiryNumber?: string | undefined; }) => {
    const priceEntry = booking.price || 0;
    alert("price is"+ priceEntry)
    const totalFeatureCharges = booking.features.reduce((total: any, feature: { price: any; }) => total + feature.price, 0);
    const basePrice = priceEntry + totalFeatureCharges;
    const baseDiscount = 0;
    
    let totalPrice = basePrice - baseDiscount;

    if (booking.booking_type !== "SVKM INSTITUTE") {
      // Add 18% tax for non-SVKM bookings
      totalPrice += 0.18 * totalPrice;
    }

    if (booking.isDeposit) {
      const depositAmount = booking.deposit - 0.01 * booking.depositDiscount * booking.deposit;
      totalPrice += depositAmount;
    }

    return totalPrice;
  };
  // Helper function to get additional payment details
  const getAdditionalPaymentDetails = () => {
    const transactionType =
      editedData?.transaction?.type || data?.transaction?.type;
    if (transactionType === "cheque") {
      return `Cheque No: ${
        editedData?.transaction?.chequeNo || data?.transaction?.chequeNo
      }, Bank: ${
        editedData?.transaction?.bank || data?.transaction?.bank
      }, Payee: ${
        editedData?.transaction?.payeeName || data?.transaction?.payeeName
      }`;
    } else if (transactionType === "upi") {
      return `Transaction ID: ${
        editedData?.transaction?.transactionID ||
        data?.transaction?.transactionID
      }`;
    } else if (transactionType === "neft/rtgs") {
      return `UTR No: ${
        editedData?.transaction?.utrNo || data?.transaction?.utrNo
      }`;
    }
    return "";
  };

  // Helper function to calculate total payable amount
  const calculateTotalPayable = () => {
    const basePrice = (priceEntry?.price || 0) + totalFeatureCharges;
    const discountedPrice =
      basePrice -
      0.01 * (editedData?.baseDiscount || data?.baseDiscount || 0) * basePrice;
    const gst =
      data?.booking_type === "SVKM INSTITUTE" ? 0 : 0.18 * discountedPrice;
    const depositAmount =
      editedData?.isDeposit || data?.isDeposit
        ? (editedData?.deposit || data?.deposit || 0) -
          0.01 *
            (editedData?.depositDiscount || data?.depositDiscount || 0) *
            (editedData?.deposit || data?.deposit || 0)
        : 0;
    return discountedPrice + gst + depositAmount;
  };

  // useEffect(() => {
  //   if (editingMode && editedData) {
  //     const newTotalFeatureCharges = editedData.features.reduce(
  //       (acc, feature) => acc + (feature.price || 0),
  //       0
  //     );
  //     setTotalFeatureCharges(newTotalFeatureCharges);
  //   } else if (data) {
  //     const newTotalFeatureCharges = data.features.reduce(
  //       (acc, feature) => acc + (feature.price || 0),
  //       0
  //     );
  //     setTotalFeatureCharges(newTotalFeatureCharges);
  //   }
  // }, [editingMode, editedData, data]);

  useEffect(() => {
    const calculateTotalFeatureCharges = (features: any) => {
      if (Array.isArray(features)) {
        return features.reduce((acc, feature) => acc + (feature.price || 0), 0);
      }
      return 0; // Default if `features` is not an array
    };

    if (editingMode && editedData) {
      setTotalFeatureCharges(calculateTotalFeatureCharges(editedData.features));
    } else if (data) {
      setTotalFeatureCharges(calculateTotalFeatureCharges(data.features));
    }
  }, [editingMode, editedData, data]);
  useEffect(() => {
    console.log(
      "the data of all bookings of this user of same hall is:",
      allBookingsOfUser
    );
  }, [allBookingsOfUser]);

  const editBookingStatus = useMutation({
    mutationFn: async (newStatus: bookingStatusType) => {
      console.log(hallData);
      const responsePromise = axiosManagerInstance.post(
        `/editBooking/${bookingId}`,
        {
          ...data,
          status: newStatus,
          cancellationReason: showCancellationReason
            ? cancellationReason
            : undefined,
        }
      );
      toast.promise(responsePromise, {
        pending: "Updating...",
        success: "Booking Status Edited!",
        error: "Failed to Booking Hall. Please Reload and try again.",
      });
      const response = await responsePromise;
      console.log(response.data);
    },
    onSuccess: async () => {
      setEditingMode(false);
      console.log("REVALIDATING");
      await queryClient.refetchQueries({
        queryKey: [`booking/${bookingId}`],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const editTransactionType = useMutation({
    mutationFn: async (newTransaction: transactionType) => {
      const clearedFields = clearFieldsForTransactionType(newTransaction);

      const responsePromise = axiosManagerInstance.post(
        `/editBooking/${bookingId}`,
        {
          ...data,
          transaction: {
            ...data?.transaction,
            type: newTransaction,
            ...clearedFields,
            // date: editedData?.transaction?.date || data?.transaction?.date,
          },
        }
      );
      toast.promise(responsePromise, {
        pending: "Updating...",
        success: "Booking Status Edited!",
        error: "Failed to Booking Hall. Please Reload and try again.",
      });
      const response = await responsePromise;
      console.log(response.data);
    },
    onSuccess: async () => {
      console.log("REVALIDATING");
      await queryClient.refetchQueries({
        queryKey: [`booking/${bookingId}`],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Edit deposit when multiple payment
  const editIsDepositApplicableInMultiple = useMutation({
    mutationFn: async (newDeposit: boolean) => {
      const responsePromise = axiosManagerInstance.post(
        `/editBooking/${selectedBookingData?._id}`,
        {
          ...selectedBookingData,
          isDeposit: newDeposit,
        }
      );
      toast.promise(responsePromise, {
        pending: "Updating...",
        success: "Booking Status Edited!",
        error: "Failed to Booking Hall. Please Reload and try again.",
      });
      const response = await responsePromise;
      console.log(response.data);
    },
    onSuccess: async () => {
      console.log("REVALIDATING");
      await queryClient.refetchQueries({
        queryKey: [`booking/${selectedBookingData?._id}`],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const editIsDepositApplicable = useMutation({
    mutationFn: async (newDeposit: boolean) => {
      const responsePromise = axiosManagerInstance.post(
        `/editBooking/${bookingId}`,
        {
          ...data,
          isDeposit: newDeposit,
        }
      );
      toast.promise(responsePromise, {
        pending: "Updating...",
        success: "Booking Status Edited!",
        error: "Failed to Booking Hall. Please Reload and try again.",
      });
      const response = await responsePromise;
      console.log(response.data);
    },
    onSuccess: async () => {
      console.log("REVALIDATING");
      await queryClient.refetchQueries({
        queryKey: [`booking/${bookingId}`],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleEdit = () => {
    setEditingMode(true);
    if (!editedData) {
      setEditedData(data);
    }
  };
  useEffect(() => {
    if (data !== null) {
      setEditedData(data);
    }
  }, [data]);

  const handleSave = async () => {
    const clearedFields = clearFieldsForTransactionType(
      editedData?.transaction?.type || ""
    );

    const dataToSend = {
      ...editedData,
      ...clearedFields,
      features: Array.isArray(editedData?.features)
        ? editedData.features
        : [editedData?.features],
    };

    const responsePromise = axiosManagerInstance.post(
      `/editBooking/${bookingId}`,
      dataToSend
    );
    console.log("new ", await responsePromise);
    console.log("new ", await responsePromise);
    toast.promise(responsePromise, {
      pending: "Updating...",
      success: "Booking Status Edited!",
      error: "Failed to Booking Hall. Please Reload and try again.",
    });
    await responsePromise;
    console.log("post results ", responsePromise);

    setEditingMode(false);
    await queryClient.refetchQueries({
      queryKey: [`booking/${bookingId}`],
    });

    if (addAdditional) {
      setAdditional(!addAdditional);
    }

    // try {
    //   // Assuming the mutation is triggered on saving
    //   await editTransactionType.mutateAsync(dataToSend.transaction.type);

    //   // Here you could also clear other parts of editedData if needed
    //   setEditedData((prev) => {
    //     if (!prev) return undefined;
    //     return {
    //       ...prev,
    //       features: [], // Assuming you want to clear features too
    //       // Reset other fields if needed
    //     };
    //   });
    // } catch (error) {
    //   console.error("Failed to save data:", error);
    // }
  };

  const clearFieldsForTransactionType = (transactionType: string) => {
    switch (transactionType) {
      case "cheque":
        return {
          transactionID: "",
          utrNo: "",
          upiId: "",
        };
      case "upi":
        return {
          chequeNo: "",
          utrNo: "",
          bank: "",
          payeeName: "",
        };
      case "neft/rtgs":
        return {
          chequeNo: "",
          transactionID: "",
          upiId: "",
          bank: "",
          payeeName: "",
        };
      case "svkminstitute":
        return {
          chequeNo: "",
          utrNo: "",
          transactionID: "",
          upiId: "", // Add any other UPI related fields
          bank: "",
          payeeName: "",
        };
      default:
        return {};
    }
  };

  const handleBookingSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    const selectedBooking = allBookingsOfUser.find(
      (booking) => booking._id === selected
    );
    setSelectedBookingData(selectedBooking || null);
  };

  // Function to get booking name by ID
  const getBookingName = (bookingId: string): string => {
    const booking = allBookingsOfUser.find((b) => b._id === bookingId);
    console.log("this is the booking fetched by it's ID", booking);
    let date = dayjs(booking?.from).format("h:mm A, MMMM D, YYYY") || "-";
    let bookingName = `${date} `;
    return booking ? bookingName : "Unknown Booking";
  };
  //Use Effect for selected booking
  useEffect(() => {
    if (selectedBookings.length === 1) {
      handleBookingSelect({
        target: { value: selectedBookings[0] },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
  }, [selectedBookings]);
  useEffect(() => {
    const calculateTotalSelectedBookings = () => {
      let total = 0;

      selectedBookings.forEach(selectedBookingId => {
        const booking = allBookingsOfUser.find(booking => booking._id === selectedBookingId);
        if (booking) {
          total += calculateBookingPrice(booking);
        }
      });

      setGrandTotal(total);
    };

    calculateTotalSelectedBookings();
  }, [selectedBookings, allBookingsOfUser]);
  const handleSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedOption(selected);
    if (selected === "multiple") {
      // Hit API route to fetch all bookings of same HALL Id and same user
      try {
        const allBookingResponsePromise = axiosManagerInstance.get(
          `/getBookingByHallAndUser/${data?.user.mobile}/${hallData?._id}`
        );
        const response = await allBookingResponsePromise;
        setAllBookingsOfUser(response.data);
      } catch (error) {
        toast.error(
          "Failed to fetch other bookings of same hall for this user. Please try again."
        );
      }
      // Hitting API route to check if already is in  a multiple booking payment
      try {
        const multipleBookingResponsePromise = axiosManagerInstance.get(
          `/checkBookingInMultiple/${bookingId}`
        );
        const response = await multipleBookingResponsePromise;
        if (!response.data.exists) {
          toast.success(
            "This booking payment is not associated with other bookings "
          );
        }
      } catch (error) {
        toast.error("Failed to check booking status. Please try again.");
      }
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedBookings((prevSelectedBookings) => {
      let updatedBookings;
      if (checked) {
        updatedBookings = [...prevSelectedBookings, value];
        console.log("Selected bookings after addition:", updatedBookings); // Log after updating
      } else {
        updatedBookings = prevSelectedBookings.filter((id) => id !== value);
        console.log("Selected bookings after removal:", updatedBookings); // Log after updating
      }
      return updatedBookings;
    });
  };

  const session = hallData?.sessions.find(
    (session) => session._id === data?.session_id
  );

  const sessionForMultiple = hallData?.sessions.find(
    (session) => session._id === selectedBookingData?.session_id
  );

  const priceEntry = session?.price.find(
    (price) => price.categoryName === data?.booking_type
  );
  // When Payment Type is set to multiple
  const multiplePriceEntry = sessionForMultiple?.price.find(
    (price) => price.categoryName === selectedBookingData?.booking_type
  );

  const handleCancellation = async () => {
    editBookingStatus.mutate("CANCELLED");
    setShowCancellationReason(false);
  };

  const handleAllEdit = () => {
    setAdditional(!addAdditional);
    // setEditingMode(!editingMode);
  };
  const handleSaveCancellationReason = async () => {
    const updatedData = {
      ...data,
      cancellationReason: cancellationReason,
    };

    const responsePromise = axiosManagerInstance.post(
      `/editBooking/${bookingId}`,
      updatedData
    );
    toast.promise(responsePromise, {
      pending: "Saving Cancellation Reason...",
      success: "Cancellation Reason Saved!",
      error: "Failed to save Cancellation Reason. Please try again.",
    });
    await responsePromise;
    setShowCancellationReason(false);
    await queryClient.refetchQueries({
      queryKey: [`booking/${bookingId}`],
    });
  };

  const paymentDetails = () => {
    if (["cheque"].includes(data?.transaction?.type || "")) {
      if (
        editedData?.transaction.date &&
        editedData?.transaction.chequeNo &&
        editedData?.transaction.bank &&
        editedData?.transaction.payeeName
      ) {
        return true;
      }
    }
    if (["upi"].includes(data?.transaction?.type || "")) {
      if (
        editedData?.transaction.date &&
        editedData?.transaction.transactionID
      ) {
        return true;
      }
    }
    if (["neft/rtgs"].includes(data?.transaction?.type || "")) {
      if (editedData?.transaction.date && editedData?.transaction.utrNo) {
        return true;
      }
    }
    if (["svkminstitute"].includes(data?.transaction?.type || "")) {
      return true;
    }
    toast.error("Please enter the payment details");
    return false;
  };

  const confirmExists = () => {
    // Iterate through each booking in the array
    for (let booking of allBookingData) {
      // Check if the status of the current booking is "CONFIRMED"
      if (booking.status === "CONFIRMED") {
        toast.error("There is already a confirmed hall in this session");
        return true;
      }
    }
    // If no booking with status "CONFIRMED" is found, return false
    return false;
  };

  if (isFetching) return <h1>Loading</h1>;

  return (
    <div className="flex flex-col items-center my-10 w-11/12 sm:w-3/4 lg:w-1/2 mx-auto">
      <div className="w-64 mx-auto mt-5 mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="options"
        >
          Select Booking Type
        </label>
        <select
          id="options"
          value={selectedOption}
          onChange={handleSelect}
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="single">Single</option>
          <option value="multiple">Multiple</option>
        </select>
      </div>
      {editingMode ? (
        <></>
      ) : (
        <button
          onClick={handleEdit}
          className=" mb-2 bg-blue-600 px-4 text-white py-1 rounded-lg"
        >
          Edit Details
        </button>
      )}

      <span className=" text-lg font-medium">Customer Details</span>

      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Name</span>
          <input
            type="text"
            value={editedData?.user?.username}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  user: {
                    ...prev.user,
                    username: e.target.value,
                  },
                };
              })
            }
            placeholder="Enter Name"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Name</span>
          <span className="w-full text-right">{data?.user.username}</span>
        </div>
      )}

      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Mobile Number</span>
          <input
            type="text"
            value={editedData?.user?.mobile}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  user: {
                    ...prev.user,
                    mobile: e.target.value,
                  },
                };
              })
            }
            placeholder="Enter Mobile Number"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Mobile Number</span>
          <span className="w-full text-right">{data?.user.mobile}</span>
        </div>
      )}

      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Contact Person</span>
          <input
            type="text"
            value={editedData?.user?.contact}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,

                  user: {
                    ...prev.user,
                    contact: e.target.value,
                  },
                };
              })
            }
            placeholder="Enter Contact Person"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Contact Person</span>
          <span className="w-full text-right">{data?.user?.contact}</span>
        </div>
      )}

      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Email Id</span>
          <input
            type="text"
            value={editedData?.user?.email}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  user: {
                    ...prev.user,
                    email: e.target.value,
                  },
                };
              })
            }
            placeholder="Enter GST Number"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Email Id</span>
          <span className="w-full text-right">{data?.user.email || "-"}</span>
        </div>
      )}

      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">GST No</span>
          <input
            type="text"
            value={editedData?.user?.gstNo}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  user: {
                    ...prev.user,
                    gstNo: e.target.value,
                  },
                };
              })
            }
            placeholder="Enter GST Number"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">GST No</span>
          <span className="w-full text-right">{data?.user.gstNo || "-"}</span>
        </div>
      )}

      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Pan No.</span>
          <input
            type="text"
            value={editedData?.user?.panNo}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  user: {
                    ...prev.user,
                    panNo: e.target.value,
                  },
                };
              })
            }
            placeholder="Enter PAN Number"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Pan No.</span>
          <span className="w-full text-right">{data?.user.panNo || "-"}</span>
        </div>
      )}

      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Address</span>
          <input
            type="text"
            value={editedData?.user?.address}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  user: {
                    ...prev.user,
                    address: e.target.value,
                  },
                };
              })
            }
            placeholder="Enter Address"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Address</span>
          <span className="w-full text-right">{data?.user.address || "-"}</span>
        </div>
      )}

      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Remark</span>
          <input
            type="text"
            value={editedData?.user?.remark}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  user: {
                    ...prev.user,
                    remark: e.target.value,
                  },
                };
              })
            }
            placeholder="Enter Remark"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-orange-600 rounded-sm px-2 py-1 border border-blue-600">
          {/* just to highlight it's laal hai */}
          <span className="w-full text-left">Remark</span>
          <span className="w-full text-right">{data?.user.remark || "-"}</span>
        </div>
      )}
      {selectedOption === "multiple" && (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              margin: "20px",
            }}
          >
            {allBookingsOfUser.map((booking) => (
              <div
                key={booking._id}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  value={booking._id}
                  checked={selectedBookings.includes(booking._id)}
                  onChange={handleCheckboxChange}
                />
                <label style={{ marginLeft: "5px" }}>
                  {dayjs(booking.from).format("h:mm A, MMMM D, YYYY") || "-"}
                </label>
              </div>
            ))}
          </div>
          {selectedBookings.length > 0 && (
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="selected-bookings"
              >
                Selected Bookings:
              </label>
              <select
                id="selected-bookings"
                onChange={handleBookingSelect}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="" disabled>
                  Select a booking
                </option>
                {selectedBookings.map((bookingId) => (
                  <option key={bookingId} value={bookingId}>
                    {getBookingName(bookingId)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      {/* When payment menthod is set to  multiple */}

      {selectedBookingData ? (
        <>
          <span className=" text-lg font-medium">Slot</span>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Hall Name</span>
            <span className="w-full text-right">{hallData?.name || "-"}</span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">From</span>
            <span className="w-full text-right">
              {dayjs(selectedBookingData.from).format("h:mm A, MMMM D, YYYY") ||
                "-"}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">To</span>
            <span className="w-full text-right">
              {dayjs(selectedBookingData.to).format("h:mm A, MMMM D, YYYY") ||
                "-"}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Hall Charges</span>
            <span className="w-full text-right">
              {multiplePriceEntry?.price || "-"}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Status</span>
            <span className="w-full text-right">
              {selectedBookingData.status || "-"}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Customer Type</span>
            <span className="w-full text-right">
              {selectedBookingData.booking_type || "-"}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Purpose of the Event</span>
            <span className="w-full text-right">
              {selectedBookingData.purpose || "-"}
            </span>
          </div>
          <span className=" text-lg font-medium m-1">Additional Features</span>

          {!selectedBookingData?.features.length ? (
            <>
              <p className="text-lg font-medium m-2">
                No Additional Features Selected
              </p>
            </>
          ) : (
            selectedBookingData?.features.map((eachFeature, index) => (
              <div key={index} className="flex flex-col w-full mb-2">
                <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                  <span>Name</span>
                  <span>{eachFeature.heading || "-"}</span>
                </div>
                <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                  <span>Description</span>
                  <span>{eachFeature.desc || "-"}</span>
                </div>
                <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                  <span>Additional Feature Charges</span>
                  <span>
                    {selectedBookingData?.booking_type === "SVKM Institute"
                      ? 0
                      : eachFeature.price || "-"}
                  </span>
                </div>
              </div>
            ))
          )}
          {/* Billing When  multiple Payment Selected */}
          <span className=" text-lg font-medium">Billing</span>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Total Hall Charges</span>
            <span className="w-full text-right">
              {(multiplePriceEntry?.price || 0) + totalFeatureCharges}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Hall Discount %</span>
            <span className="w-full text-right">
              {selectedBookingData?.baseDiscount || 0}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Hall Discount Amount</span>
            <span className="w-full text-right">
              {0.01 *
                selectedBookingData!.baseDiscount *
                ((multiplePriceEntry?.price || 0) + totalFeatureCharges)}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Hall Discounted Price</span>
            <span className="w-full text-right">
              {(multiplePriceEntry?.price || 0) +
                totalFeatureCharges -
                0.01 *
                  selectedBookingData!.baseDiscount *
                  ((multiplePriceEntry?.price || 0) + totalFeatureCharges)}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">CGST 9%</span>
            <span className="w-full text-right">
              {data?.booking_type == "SVKM INSTITUTE" ? (
                <div>0</div>
              ) : (
                <div>
                  {0.09 *
                    ((multiplePriceEntry?.price || 0) +
                      totalFeatureCharges -
                      0.01 *
                        selectedBookingData!.baseDiscount *
                        ((multiplePriceEntry?.price || 0) +
                          totalFeatureCharges))}
                </div>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">SGST 9%</span>
            <span className="w-full text-right">
              {data?.booking_type == "SVKM INSTITUTE" ? (
                <div>0</div>
              ) : (
                <div>
                  {0.09 *
                    ((multiplePriceEntry?.price || 0) +
                      totalFeatureCharges -
                      0.01 *
                        selectedBookingData!.baseDiscount *
                        ((multiplePriceEntry?.price || 0) +
                          totalFeatureCharges))}
                </div>
              )}
            </span>
          </div>
          <span>
            <label htmlFor="isDeposit">Security Deposit Applicable </label>
            <select
              id="isDeposit"
              value={
                selectedBookingData?.isDeposit === true ? "yes" : "no" || false
              }
              className="px-2 py-1 rounded-md border border-gray-400 my-1"
              onChange={(e) => {
                if (e.target.value === "yes") {
                  editIsDepositApplicableInMultiple.mutate(true);
                  setEditedData((prev) => {
                    if (!prev) return undefined;
                    return {
                      ...prev,
                      isDeposit: true,
                    };
                  });
                }
                if (e.target.value === "no") {
                  editIsDepositApplicableInMultiple.mutate(false);
                  setEditedData((prev) => {
                    if (!prev) return undefined;
                    return {
                      ...prev,
                      isDeposit: false,
                    };
                  });
                }
              }}
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </span>

          {
            <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
              <span className="w-full text-left">Security Deposit Amount</span>
              <span className="w-full text-right">
                {selectedBookingData?.isDeposit === false ||
                editedData?.isDeposit === false
                  ? 0
                  : editedData?.deposit ?? selectedBookingData?.deposit}
              </span>
            </div>
          }

          {
            <>
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Deposit Discount %</span>
                <span className="w-full text-right">
                  {selectedBookingData?.isDeposit === false ||
                  editedData?.isDeposit === false
                    ? 0
                    : selectedBookingData?.depositDiscount || 0}
                </span>
              </div>
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">
                  Deposit Discount Amount
                </span>
                <span className="w-full text-right">
                  {selectedBookingData?.isDeposit === false ||
                  editedData?.isDeposit === false
                    ? 0
                    : selectedBookingData?.deposit
                    ? 0.01 *
                      selectedBookingData?.depositDiscount *
                      selectedBookingData?.deposit
                    : "-"}
                </span>
              </div>
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">
                  Deposit Discounted Price
                </span>
                <span className="w-full text-right">
                  {selectedBookingData?.isDeposit === false ||
                  editedData?.isDeposit === false
                    ? 0
                    : selectedBookingData?.deposit
                    ? selectedBookingData?.deposit -
                      0.01 *
                        selectedBookingData?.depositDiscount *
                        selectedBookingData?.deposit
                    : "-"}
                </span>
              </div>
            </>
          }

          {
            <>
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Total Payable Amount</span>
                <span className="w-full text-right">
                  <span className="w-full text-right">
                    {selectedBookingData?.booking_type == "SVKM INSTITUTE" ? (
                      <div>
                        {selectedBookingData
                          ? (multiplePriceEntry?.price || 0) +
                            totalFeatureCharges -
                            0.01 *
                              data!.baseDiscount *
                              ((multiplePriceEntry?.price || 0) +
                                totalFeatureCharges) +
                            (selectedBookingData.isDeposit
                              ? selectedBookingData.deposit -
                                0.01 *
                                  selectedBookingData.depositDiscount *
                                  selectedBookingData.deposit
                              : 0)
                          : 0}
                      </div>
                    ) : (
                      <div>
                        {selectedBookingData
                          ? (multiplePriceEntry?.price || 0) +
                            totalFeatureCharges -
                            0.01 *
                              selectedBookingData!.baseDiscount *
                              ((multiplePriceEntry?.price || 0) +
                                totalFeatureCharges) +
                            0.18 *
                              ((multiplePriceEntry?.price || 0) +
                                totalFeatureCharges -
                                0.01 *
                                  selectedBookingData!.baseDiscount *
                                  ((multiplePriceEntry?.price || 0) +
                                    totalFeatureCharges)) +
                            (selectedBookingData.isDeposit
                              ? selectedBookingData.deposit -
                                0.01 *
                                  selectedBookingData.depositDiscount *
                                  selectedBookingData.deposit
                              : 0)
                          : 0}
                      </div>
                    )}
                  </span>
                </span>
              </div>
            </>
          }
          <div className="flex mt-5 items-center w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Grand Total Amount</span>
            <span className="w-full text-right">
              <span className="w-full text-right"> {grandTotal.toFixed(2)}</span>
            </span>
          </div>
        </>
      ) : (
        // Render single booking data
        <>
          <span className=" text-lg font-medium">Slot</span>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Hall Name</span>
            <span className="w-full text-right">{hallData?.name || "-"}</span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Session Type</span>
            <span className="w-full text-right">{session?.name || "-"}</span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">From</span>
            <span className="w-full text-right">
              {dayjs(data?.from).format("h:mm A, MMMM D, YYYY") || "-"}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">To</span>
            <span className="w-full text-right">
              {dayjs(data?.to).format("h:mm A, MMMM D, YYYY") || "-"}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Hall Charges</span>
            <span className="w-full text-right">
              {priceEntry?.price || "-"}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Status</span>
            <span className="w-full text-right">{data?.status || "-"}</span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Customer Type</span>
            <span className="w-full text-right">
              {data?.booking_type || "-"}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Purpose of the Event</span>
            <span className="w-full text-right">{data?.purpose || "-"}</span>
          </div>

          {/* Additional Features */}
          <span className=" text-lg font-medium m-1">Additional Features</span>

          {!data?.features.length ? (
            <>
              <p className="text-lg font-medium m-2">
                No Additional Features Selected
              </p>
              <button
                // onClick={() => {
                //   setAdditional(!addAdditional);

                // }}
                onClick={handleAllEdit}
                className=" mb-2 bg-blue-600 px-4 text-white py-1 rounded-lg m-1"
              >
                Add Additonal Features
              </button>

              {addAdditional || editingMode ? (
                <div className="flex flex-col w-full mb-2">
                  <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                    <span>Name</span>
                    {editingMode || addAdditional ? (
                      <input
                        type="text"
                        // value={editedData?.features[0]?.heading || ''}
                        onChange={(e) =>
                          setEditedData((prev) => {
                            if (!prev) return undefined;
                            return {
                              ...prev,
                              features: {
                                ...prev.features,
                                heading: e.target.value,
                              },
                            };
                          })
                        }
                        placeholder="Enter Name"
                        className="px-2"
                      />
                    ) : (
                      <>{data?.features[0]?.heading || "-"}</>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                    <span>Description</span>
                    {/* {editingMode ? ( */}
                    <input
                      type="text"
                      onChange={(e) =>
                        setEditedData((prev) => {
                          if (!prev) return undefined;
                          return {
                            ...prev,
                            features: {
                              ...prev.features,
                              desc: e.target.value,
                            },
                          };
                        })
                      }
                      placeholder="Enter Description"
                      className="px-2"
                    />
                    {/* ) : ( */}
                    {/* <span>{data?.features[0]?.desc || "-"}</span> */}
                    {/* )} */}
                  </div>
                  <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                    <span>Additional Feature Charges</span>
                    {/* {editingMode ? ( */}
                    <input
                      type="number"
                      // value={editedData?.features[2]?.price || ""}
                      onChange={(e) =>
                        setEditedData((prev) => {
                          if (!prev) return undefined;

                          return {
                            ...prev,
                            features: {
                              ...prev.features,
                              price: parseInt(e.target.value),
                            },
                          };
                        })
                      }
                      placeholder="Enter Charges"
                      className="px-2"
                    />
                    {/* ) : ( */}
                    {/* <span>
              {datas?.booking_type === 'SVKM Institute'
                ? 0
                : data?.features[2]?.price || '-'}
            </span> */}
                    {/* )} */}
                  </div>
                </div>
              ) : (
                // )

                <></>
              )}
            </>
          ) : (
            data?.features.map((eachFeature, index) => (
              <div key={index} className="flex flex-col w-full mb-2">
                <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                  <span>Name</span>
                  {editingMode || addAdditional ? (
                    <input
                      type="text"
                      value={editedData?.features[index]?.heading}
                      onChange={(e) =>
                        setEditedData((prev) => {
                          if (!prev) return undefined;
                          return {
                            ...prev,
                            features: prev.features.map((feature, i) =>
                              i === index
                                ? { ...feature, heading: e.target.value }
                                : feature
                            ),
                          };
                        })
                      }
                      placeholder="Enter Name"
                      className="px-2"
                    />
                  ) : (
                    <span>{eachFeature.heading || "-"}</span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                  <span>Description</span>
                  {editingMode || addAdditional ? (
                    <input
                      type="text"
                      value={editedData?.features[index]?.desc}
                      onChange={(e) =>
                        setEditedData((prev) => {
                          if (!prev) return undefined;
                          return {
                            ...prev,
                            features: prev.features.map((feature, i) =>
                              i === index
                                ? { ...feature, desc: e.target.value }
                                : feature
                            ),
                          };
                        })
                      }
                      placeholder="Enter Description"
                      className="px-2"
                    />
                  ) : (
                    <span>{eachFeature.desc || "-"}</span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                  <span>Additional Feature Charges</span>
                  {editingMode || addAdditional ? (
                    <input
                      type="number"
                      value={editedData?.features[index]?.price || ""}
                      onChange={(e) =>
                        setEditedData((prev) => {
                          if (!prev) return prev;
                          const updatedFeatures = prev.features.map(
                            (feature, i) =>
                              i === index
                                ? {
                                    ...feature,
                                    price: parseInt(e.target.value) || 0,
                                  }
                                : feature
                          );
                          const newTotalFeatureCharges = updatedFeatures.reduce(
                            (acc, feature) => acc + (feature.price || 0),
                            0
                          );
                          setTotalFeatureCharges(newTotalFeatureCharges);
                          return {
                            ...prev,
                            features: updatedFeatures,
                          };
                        })
                      }
                      placeholder="Enter Charges"
                      className="px-2"
                    />
                  ) : (
                    <span>
                      {data?.booking_type === "SVKM Institute"
                        ? 0
                        : eachFeature.price || "-"}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          {/* Billing when Single Payment Selected*/}
          <span className=" text-lg font-medium">Billing</span>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Total Hall Charges</span>
            <span className="w-full text-right">
              {editingMode
                ? (priceEntry?.price || 0) + totalFeatureCharges
                : (priceEntry?.price || 0) + totalFeatureCharges}
            </span>
          </div>

          {editingMode ? (
            <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
              <span className="w-full text-left">Discount %</span>
              <input
                type="text"
                value={editedData?.baseDiscount}
                onChange={(e) => {
                  setEditedData((prev) => {
                    if (!prev) return undefined;
                    return {
                      ...prev,
                      baseDiscount: Number(e.target.value),
                    };
                  });
                }}
                placeholder="Enter Discount %"
                className="px-2"
                maxLength={2}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
              <span className="w-full text-left">Hall Discount %</span>
              <span className="w-full text-right">
                {data?.baseDiscount || 0}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Hall Discount Amount</span>
            <span className="w-full text-right">
              {editingMode
                ? 0.01 *
                  editedData!.baseDiscount *
                  ((priceEntry?.price || 0) + totalFeatureCharges)
                : 0.01 *
                  data!.baseDiscount *
                  ((priceEntry?.price || 0) + totalFeatureCharges)}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Hall Discounted Price</span>
            <span className="w-full text-right">
              {editingMode
                ? (priceEntry?.price || 0) +
                  totalFeatureCharges -
                  0.01 *
                    editedData!.baseDiscount *
                    ((priceEntry?.price || 0) + totalFeatureCharges)
                : (priceEntry?.price || 0) +
                  totalFeatureCharges -
                  0.01 *
                    data!.baseDiscount *
                    ((priceEntry?.price || 0) + totalFeatureCharges)}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">CGST 9%</span>
            <span className="w-full text-right">
              {data?.booking_type == "SVKM INSTITUTE" ? (
                <div>0</div>
              ) : (
                <div>
                  {editingMode
                    ? 0.09 *
                      ((priceEntry?.price || 0) +
                        totalFeatureCharges -
                        0.01 *
                          editedData!.baseDiscount *
                          ((priceEntry?.price || 0) + totalFeatureCharges))
                    : 0.09 *
                      ((priceEntry?.price || 0) +
                        totalFeatureCharges -
                        0.01 *
                          data!.baseDiscount *
                          ((priceEntry?.price || 0) + totalFeatureCharges))}
                </div>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">SGST 9%</span>
            <span className="w-full text-right">
              {data?.booking_type == "SVKM INSTITUTE" ? (
                <div>0</div>
              ) : (
                <div>
                  {editingMode
                    ? 0.09 *
                      ((priceEntry?.price || 0) +
                        totalFeatureCharges -
                        0.01 *
                          editedData!.baseDiscount *
                          ((priceEntry?.price || 0) + totalFeatureCharges))
                    : 0.09 *
                      ((priceEntry?.price || 0) +
                        totalFeatureCharges -
                        0.01 *
                          data!.baseDiscount *
                          ((priceEntry?.price || 0) + totalFeatureCharges))}
                </div>
              )}
            </span>
          </div>
          <span>
            <label htmlFor="isDeposit">Security Deposit Applicable </label>
            <select
              id="isDeposit"
              value={data?.isDeposit === true ? "yes" : "no" || false}
              className="px-2 py-1 rounded-md border border-gray-400 my-1"
              onChange={(e) => {
                if (e.target.value === "yes") {
                  editIsDepositApplicable.mutate(true);
                  setEditedData((prev) => {
                    if (!prev) return undefined;
                    return {
                      ...prev,
                      isDeposit: true,
                    };
                  });
                }
                if (e.target.value === "no") {
                  editIsDepositApplicable.mutate(false);
                  setEditedData((prev) => {
                    if (!prev) return undefined;
                    return {
                      ...prev,
                      isDeposit: false,
                    };
                  });
                }
              }}
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </span>

          {editingMode ? (
            <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
              <span className="w-full text-left">
                Enter Security Deposit{" "}
                {data?.isDeposit === false || editedData?.isDeposit === false
                  ? 0
                  : editedData?.deposit}
              </span>
              <input
                type="text"
                value={
                  data?.isDeposit === false || editedData?.isDeposit === false
                    ? 0
                    : editedData?.deposit
                }
                onChange={(e) => {
                  setEditedData((prev) => {
                    if (!prev) return undefined;
                    return {
                      ...prev,
                      deposit: Number(e.target.value),
                    };
                  });

                  // data?.deposit=editedData?.deposit
                }}
                placeholder="Enter Security Deposit"
                className="px-2"
                disabled={
                  data?.isDeposit === false || editedData?.isDeposit === false
                }
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
              <span className="w-full text-left">Security Deposit Amount</span>
              <span className="w-full text-right">
                {data?.isDeposit === false || editedData?.isDeposit === false
                  ? 0
                  : editedData?.deposit ?? data?.deposit}
              </span>
            </div>
          )}

          {editingMode ? (
            <>
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Deposit Discount %</span>
                <input
                  type="text"
                  value={
                    data?.isDeposit === false || editedData?.isDeposit === false
                      ? 0
                      : editedData?.depositDiscount
                  }
                  onChange={(e) =>
                    setEditedData((prev) => {
                      if (!prev) return undefined;
                      return {
                        ...prev,
                        depositDiscount: Number(e.target.value),
                      };
                    })
                  }
                  placeholder="Enter Security Deposit Discount %"
                  className="px-2"
                  disabled={
                    data?.isDeposit === false || editedData?.isDeposit === false
                  }
                />
              </div>
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">
                  Deposit Discount Amount
                </span>
                <span className="w-full text-right">
                  {data?.isDeposit === false || editedData?.isDeposit === false
                    ? 0
                    : editedData?.deposit
                    ? 0.01 * editedData?.depositDiscount * editedData?.deposit
                    : "-"}
                </span>
              </div>
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">
                  Deposit Discounted Price
                </span>
                <span className="w-full text-right">
                  {data?.isDeposit === false || editedData?.isDeposit === false
                    ? 0
                    : editedData?.deposit
                    ? editedData?.deposit -
                      0.01 * editedData?.depositDiscount * editedData?.deposit
                    : "-"}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Deposit Discount %</span>
                <span className="w-full text-right">
                  {data?.isDeposit === false || editedData?.isDeposit === false
                    ? 0
                    : data?.depositDiscount || 0}
                </span>
              </div>
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">
                  Deposit Discount Amount
                </span>
                <span className="w-full text-right">
                  {data?.isDeposit === false || editedData?.isDeposit === false
                    ? 0
                    : data?.deposit
                    ? 0.01 * data?.depositDiscount * data?.deposit
                    : "-"}
                </span>
              </div>
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">
                  Deposit Discounted Price
                </span>
                <span className="w-full text-right">
                  {data?.isDeposit === false || editedData?.isDeposit === false
                    ? 0
                    : data?.deposit
                    ? data?.deposit -
                      0.01 * data?.depositDiscount * data?.deposit
                    : "-"}
                </span>
              </div>
            </>
          )}

          {editedData ? (
            <>
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Total Payable Amount</span>

                <span className="w-full text-right">
                  {editedData?.booking_type == "SVKM INSTITUTE" ? (
                    <div>
                      {editedData
                        ? (priceEntry?.price || 0) +
                          totalFeatureCharges -
                          0.01 *
                            editedData!.baseDiscount *
                            ((priceEntry?.price || 0) + totalFeatureCharges) +
                          (editedData.isDeposit
                            ? editedData?.deposit -
                              0.01 *
                                editedData?.depositDiscount *
                                editedData?.deposit
                            : 0)
                        : 0}
                    </div>
                  ) : (
                    <div>
                      {editedData
                        ? (priceEntry?.price || 0) +
                          totalFeatureCharges -
                          0.01 *
                            editedData!.baseDiscount *
                            ((priceEntry?.price || 0) + totalFeatureCharges) +
                          0.18 *
                            ((priceEntry?.price || 0) +
                              totalFeatureCharges -
                              0.01 *
                                editedData!.baseDiscount *
                                ((priceEntry?.price || 0) +
                                  totalFeatureCharges)) +
                          (editedData.isDeposit
                            ? editedData?.deposit -
                              0.01 *
                                editedData?.depositDiscount *
                                editedData?.deposit
                            : 0)
                        : 0}
                    </div>
                  )}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Total Payable Amount</span>
                <span className="w-full text-right">
                  <span className="w-full text-right">
                    {data?.booking_type == "SVKM INSTITUTE" ? (
                      <div>
                        {data
                          ? (priceEntry?.price || 0) +
                            totalFeatureCharges -
                            0.01 *
                              data!.baseDiscount *
                              ((priceEntry?.price || 0) + totalFeatureCharges) +
                            (data.isDeposit
                              ? data.deposit -
                                0.01 * data.depositDiscount * data.deposit
                              : 0)
                          : 0}
                      </div>
                    ) : (
                      <div>
                        {data
                          ? (priceEntry?.price || 0) +
                            totalFeatureCharges -
                            0.01 *
                              data!.baseDiscount *
                              ((priceEntry?.price || 0) + totalFeatureCharges) +
                            0.18 *
                              ((priceEntry?.price || 0) +
                                totalFeatureCharges -
                                0.01 *
                                  data!.baseDiscount *
                                  ((priceEntry?.price || 0) +
                                    totalFeatureCharges)) +
                            (data.isDeposit
                              ? data.deposit -
                                0.01 * data.depositDiscount * data.deposit
                              : 0)
                          : 0}
                      </div>
                    )}
                  </span>
                </span>
              </div>
            </>
          )}
          {editingMode || addAdditional ? (
            <button
              onClick={handleSave}
              className="mb-2 bg-blue-600 px-4 text-white py-1 rounded-lg mt-4"
            >
              Save Details
            </button>
          ) : (
            <></>
          )}
        </>
      )}

      <span className="text-lg font-medium">Transaction Details</span>
      {editingMode ? (
        <span>
          <label htmlFor="transaction">Choose a Transaction Type </label>
          <select
            id="transaction"
            value={data?.transaction?.type || ""}
            className="px-2 py-1 rounded-md border border-gray-400 my-2"
            onChange={(e) =>
              editTransactionType.mutate(e.target.value as transactionType)
            }
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="cheque">Cheque</option>
            <option value="upi">UPI</option>
            <option value="neft/rtgs">NEFT/RTGS</option>
            <option value="svkminstitute">SVKM Institute</option>
          </select>
        </span>
      ) : (
        <></>
      )}
      {["cheque", "upi", "neft/rtgs"].includes(data?.transaction?.type || "") &&
        (editingMode ? (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Date</span>
            <input
              type="text"
              value={editedData?.transaction?.date}
              onChange={(e) =>
                setEditedData((prev) => {
                  if (!prev) return undefined;
                  return {
                    ...prev,
                    transaction: {
                      ...prev.transaction,
                      date: e.target.value,
                    },
                  };
                })
              }
              placeholder="Enter Date of Transaction"
              className="px-2"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Date</span>
            <span className="w-full text-right">
              {data?.transaction?.date || "-"}
            </span>
          </div>
        ))}
      {["upi"].includes(data?.transaction?.type || "") &&
        (editingMode ? (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Transaction ID</span>
            <input
              type="text"
              value={editedData?.transaction?.transactionID}
              onChange={(e) =>
                setEditedData((prev) => {
                  if (!prev) return undefined;
                  return {
                    ...prev,
                    transaction: {
                      ...prev.transaction,
                      transactionID: e.target.value,
                    },
                  };
                })
              }
              placeholder="Enter Transaction ID"
              className="px-2"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Transaction ID</span>
            <span className="w-full text-right">
              {data?.transaction?.transactionID || "-"}
            </span>
          </div>
        ))}
      {["neft/rtgs"].includes(data?.transaction?.type || "") &&
        (editingMode ? (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">UTR No.</span>
            <input
              type="text"
              value={editedData?.transaction?.utrNo}
              onChange={(e) =>
                setEditedData((prev) => {
                  if (!prev) return undefined;
                  return {
                    ...prev,
                    transaction: {
                      ...prev.transaction,
                      utrNo: e.target.value,
                    },
                  };
                })
              }
              placeholder="Enter UTR Number"
              className="px-2"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">UTR No.</span>
            <span className="w-full text-right">
              {data?.transaction?.utrNo || "-"}
            </span>
          </div>
        ))}
      {["cheque"].includes(data?.transaction?.type || "") &&
        (editingMode ? (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Cheque No.</span>
            <input
              type="text"
              value={editedData?.transaction?.chequeNo}
              onChange={(e) =>
                setEditedData((prev) => {
                  if (!prev) return undefined;
                  return {
                    ...prev,
                    transaction: {
                      ...prev.transaction,
                      chequeNo: e.target.value,
                    },
                  };
                })
              }
              placeholder="Enter Cheque Number"
              className="px-2"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Cheque No.</span>
            <span className="w-full text-right">
              {data?.transaction?.chequeNo || "-"}
            </span>
          </div>
        ))}
      {["cheque"].includes(data?.transaction?.type || "") &&
        (editingMode ? (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Bank</span>
            <input
              type="text"
              value={editedData?.transaction?.bank}
              onChange={(e) =>
                setEditedData((prev) => {
                  if (!prev) return undefined;
                  return {
                    ...prev,
                    transaction: {
                      ...prev.transaction,
                      bank: e.target.value,
                    },
                  };
                })
              }
              placeholder="Enter Bank Name"
              className="px-2"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Bank</span>
            <span className="w-full text-right">
              {data?.transaction?.bank || "-"}
            </span>
          </div>
        ))}

      {["cheque"].includes(data?.transaction?.type || "") &&
        (editingMode ? (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Payee Name</span>
            <input
              type="text"
              value={editedData?.transaction?.payeeName}
              onChange={(e) =>
                setEditedData((prev) => {
                  if (!prev) return undefined;
                  return {
                    ...prev,
                    transaction: {
                      ...prev.transaction,
                      payeeName: e.target.value,
                    },
                  };
                })
              }
              placeholder="Enter Payee Name"
              className="px-2"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Payee Name</span>
            <span className="w-full text-right">
              {data?.transaction?.payeeName || "-"}
            </span>
          </div>
        ))}

      {showCancellationReason ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600 my-5">
          <span className="w-full text-left">Cancellation Reason</span>
          <input
            type="text"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Enter Cancellation Reason"
            className="px-2"
          />
          <button
            onClick={async () => {
              await handleSaveCancellationReason();
              handleCancellation();
            }}
            className="bg-green-500 px-4 text-white py-1 rounded-lg"
          >
            Confirm Cancellation
          </button>
        </div>
      ) : (
        <></>
      )}

      {data?.cancellationReason && (
        <div className="w-full flex justify-between my-2 bg-red-400 rounded-sm px-2 py-1 border text-white">
          <span className="text-lg font-medium">Cancellation Reason</span>
          <span>{data?.cancellationReason}</span>
        </div>
      )}

      {editingMode ? (
        <>
          <h1 className="text-lg font-medium">Set Booking Status</h1>
          <span className="space-x-4 space-y-4">
            <button
              onClick={() => {
                setShowCancellationReason(true);
              }}
              className="mb-2 bg-red-600 px-4 text-white py-1 rounded-lg"
            >
              Cancelled
            </button>
            <button
              onClick={() => {
                editBookingStatus.mutate("ENQUIRY" as bookingStatusType);
              }}
              className="mb-2 bg-blue-600 px-4 text-white py-1 rounded-lg"
            >
              Enquiry
            </button>
            {/* Confirmed button with saving the edits */}
            <button
              onClick={async () => {
                if (!confirmExists() && paymentDetails()) {
                  await confirmAndSaveBooking.mutateAsync();
                  generateConfirmationAndEmail();
                }
              }}
              className="mb-2 bg-green-600 px-4 text-white py-1 rounded-lg"
            >
              Confirmed
            </button>
          </span>
        </>
      ) : (
        <></>
      )}

      {/* {!showCancellationReason && (
        <button
          onClick={() => {
            setShowCancellationReason(true);
          }}
          className="bg-blue-600 px-4 mb-2 text-white py-1 rounded-lg"
        >
          Handle Cancellation
        </button>
      )} */}
    </div>
  );
}

export default Booking;
