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
  EachHallSessionType,
} from "../../../../types/global";
import { useParams } from "react-router-dom";
import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat";
import { useEffect, useState } from "react";
import { queryClient } from "../App";
import useAuthStore from "../store/authStore";

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
  const [multipleTransactionData, setMultipleTransactionData] =
    useState<bookingTransactionType>({
      type: "svkminstitute",
      date: "",
      transactionID: "",
      payeeName: "",
      utrNo: "",
      chequeNo: "",
      bank: ""
    });
  const [showCancellationReason, setShowCancellationReason] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [grandTotal, setGrandTotal] = useState(0);
  const [isBookingInMultiple, setIsBookingInMultiple] = useState(false);
  const [allBookingsOfUser, setAllBookingsOfUser] = useState<HallBookingType[]>(
    []
  );
  const [cgstRate, setCgstRate] = useState(0.09); 
  const [sgstRate, setSgstRate] = useState(0.09); 
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [selectedBookingData, setSelectedBookingData] =
    useState<HallBookingType | null>(null);
  const [displayCount, setDisplayCount] = useState(6);
  const handleShowMore = () => {
    setDisplayCount(prev => prev + 6);
  };
  const handleShowLess = () => {
    setDisplayCount(6);
  };
  // let totalFeatureCharges = 0;
  const [datas, setData] = useState({
    features: [{ heading: "", desc: "", price: 0 }],
    booking_type: "",
  });

  const [user] = useAuthStore((store) => [store.user]);

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
          console.log("Hall data is ", result.data);
        }
        const updatedData: HallBookingType = {
          ...response.data,
          managerEmail: response.data.managerEmail
            ? response.data.managerEmail
            : user?.email,
          managerName: response.data.managerName
            ? response.data.managerName
            : "",
        };
        return updatedData as HallBookingType;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });
  // console.log("The data is ", data);

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

  // console.log(allBookingData);

  // Seperate mutation for confirm and save booking
  const confirmAndSaveBooking = useMutation({
    mutationFn: async () => {
      const responsePromise = axiosManagerInstance.post(
        `/editBooking/${bookingId}`,
        {
          ...editedData,
          date: dayjs().format("DD-MM-YYYY"),
          status: "CONFIRMED" as bookingStatusType,
          cancellationReason: "",
          cgstRate: cgstRate,
          sgstRate: sgstRate,
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

  // Mututation for confirm and save booking of Multiple payments
  const confirmAndSaveMultipleBooking = useMutation({
    mutationFn: async () => {
      console.log("json to", {
        booking_ids: selectedBookings,
        // date: multipleTransactionData?.date || dayjs().format("DD-MM-YYYY"),
        transaction: multipleTransactionData,
        totalPayable: grandTotal,
        status: "CONFIRMED",
        cgstRate: cgstRate,
        sgstRate: sgstRate,
      });
      const responsePromise = axiosManagerInstance.post(`/multipleBookings`, {
        booking_ids: selectedBookings,
        // date: multipleTransactionData?.date || dayjs().format("DD-MM-YYYY"),
        transaction: multipleTransactionData,
        totalPayable: grandTotal,
        status: "CONFIRMED",
      });
      toast.promise(responsePromise, {
        pending: "Updating and Confirming Multiple Bookings...",
        success: "Multiple Bookings Confirmed and Updated Successfully!",
        error:
          "Failed to Confirm and Update Multiple Bookings. Please try again.",
      });
      const response = await responsePromise;
      return response.data;
    },
    onSuccess: async () => {
      setEditingMode(false);
      await queryClient.refetchQueries({
        queryKey: [`booking/${bookingId}`], // This may need adjustment if you are dealing with multiple bookings
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  type BookingKeys = keyof HallBookingType;
  type UserKeys = keyof CustomerType;
  type TransactionKeys = keyof bookingTransactionType;
  
  const generateConfirmationAndEmail = async (booking?: HallBookingType) => {
    console.log("generating confirmation");
    
    // Type-safe helper functions
    const getData = (key: BookingKeys) => {
      if (booking) {
        return booking[key];
      }
      console.log(editedData?.[key] || data?.[key])
      return editedData?.[key] || data?.[key];
    };
  
    const getUserData = (key: UserKeys) => {
      if (booking) {
        return booking.user[key];
      }
      return editedData?.user[key] || data?.user[key];
    };
  
    const getTransactionData = (key: TransactionKeys) => {
      return editedData?.transaction?.[key] || data?.transaction?.[key];
    };
  
    // Ensure numeric values
    const getNumericValue = (value: any, defaultValue: number = 0): number => {
      const parsed = Number(value);
      return isNaN(parsed) ? defaultValue : parsed;
    };
  
    const hallDeposit =
      (booking ? booking.isDeposit : editedData?.isDeposit) === false
        ? 0
        : booking
        ? getNumericValue(booking.deposit)
        : getNumericValue(editedData?.deposit ?? (data?.isDeposit === false ? 0 : data?.deposit ?? 0));
  
    const fromDate = booking ? booking.from : (editedData?.from || data?.from);
    const startTime = dayjs(fromDate).format("HH:mm:ss");
    const endTime = dayjs(booking ? booking.to : (editedData?.to || data?.to)).format("HH:mm:ss");
  
    const baseDiscount = getNumericValue(getData('baseDiscount'));
    const hallCharges = getNumericValue(priceEntry?.price);
    const totalFeatureChargesNum = booking ? booking.features.reduce((acc, feature) => acc + feature.price, 0) : getNumericValue(totalFeatureCharges);  
    try {
      const request = {
        date: dayjs().format("DD-MM-YYYY"),
        customerName: getUserData('username'),
        contactPerson: getUserData('contact'),
        contactNo: getUserData('mobile'),
        enquiryNumber:  getData('enquiryNumber'),
        gstNo: getUserData('gstNo') || "",
        pan: getUserData('panNo') || "",
        modeOfPayment: getTransactionData('type') || "",
        additionalPaymentDetails: getAdditionalPaymentDetails(),
        hallName: hallData?.name || "",
        hallLocation: `${hallData?.location.desc1},${hallData?.location.desc2}`,
        hallRestrictions: hallData?.eventRestrictions,
        dateOfEvent: dayjs(fromDate).format("DD-MM-YYYY"),
        slotTime: `${convert_IST_TimeString_To12HourFormat(startTime)} - ${convert_IST_TimeString_To12HourFormat(endTime)}`,
        sessionType: session?.name,
        purposeOfBooking: getData('purpose') || "",
        additionalInfo: getData('additionalInfo') || "",
        hallCharges: hallCharges,
        additionalFacilities: totalFeatureChargesNum,
        discountPercent: baseDiscount,
        sgst: getData('booking_type') === "SVKM INSTITUTE"
          ? 0
          : sgstRate * (hallCharges + totalFeatureChargesNum - 
              0.01 * baseDiscount * (hallCharges + totalFeatureChargesNum)),
        cgst: getData('booking_type') === "SVKM INSTITUTE"
          ? 0
          : cgstRate * (hallCharges + totalFeatureChargesNum - 
              0.01 * baseDiscount * (hallCharges + totalFeatureChargesNum)),
        cgstRate: cgstRate*100,
        sgstRate: sgstRate*100,
        hallDeposit: hallDeposit,
        depositDiscount: getNumericValue(getData('depositDiscount')),
        totalPayable: booking ? calculateTotalPayableMultiple(booking) : (editedData ? calculateTotalPayableSingle(editedData) : calculateTotalPayableSingle(data!)),
        grandTotal: booking? grandTotal : calculateGrandTotal(),
        email: getUserData('email') || "",
        managerEmail: editedData?.managerEmail || data?.managerEmail,
        managerName: editedData?.managerName || data?.managerName,
      };
  
      const response = await axiosManagerInstance.post('/generateConfirmation', request);
      console.log(request);
      const pdfUrl = response.data.pdfUrl;
  
      await axiosManagerInstance.post('/sendEmail', {
        to: getUserData('email') || "",
        subject: `SVKM Hall Booking for ${dayjs(fromDate).format("DD-MM-YYYY")}`,
        text: "Your booking has been confirmed. Please find the attachments below.",
        filename: `${getUserData('username')}_${getData('enquiryNumber') || ""}_confirmation`,
        path: pdfUrl,
      });
  
      console.log("Email sent successfully");
      return pdfUrl;
    } catch (error) {
      console.error("Error in generate confirmation or send email:", error);
    }
  };
  const selectedBookingsArray = selectedBookings.map(
    (selectedBookingId) =>
      allBookingsOfUser.find((booking) => booking._id === selectedBookingId)
  );
  const generateConfirmationForMultiple = () => {
    console.log(
      "Selected bookings are ",
      selectedBookingsArray
    );
    selectedBookingsArray.forEach((booking) => {
      if (booking) {
        generateConfirmationAndEmail(booking);
      }
    });
  };
  const generateCancellationAndEmail = async () => {
    console.log("generating cancellation");

    const hallDeposit =
      editedData?.isDeposit === false
        ? 0
        : editedData?.deposit ??
          (data?.isDeposit === false ? 0 : data?.deposit ?? 0);

    console.log(data?.from);

    const startTime = dayjs(editedData?.from || data?.from).format("HH:mm:ss");
    const endTime = dayjs(editedData?.to || data?.to).format("HH:mm:ss");

    try {
      const response = await axiosManagerInstance.post(
        `/generateCancellation`,
        {
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
          hallLocation: `${hallData?.location.desc1},${hallData?.location.desc2}`,
          hallRestrictions: hallData?.eventRestrictions,
          dateOfEvent: dayjs(editedData?.from || data?.from).format(
            "DD-MM-YYYY"
          ),
          slotTime: `${convert_IST_TimeString_To12HourFormat(
            startTime
          )} - ${convert_IST_TimeString_To12HourFormat(endTime)}`,
          sessionType: session?.name,
          purposeOfBooking: editedData?.purpose || data?.purpose || "",
          additionalInfo: editedData?.additionalInfo || data?.additionalInfo || "",
          hallCharges: priceEntry?.price || 0,
          additionalFacilities: totalFeatureCharges,
          discountPercent: editedData?.baseDiscount || data?.baseDiscount || 0,
          sgst:
            data?.booking_type === "SVKM INSTITUTE"
              ? 0
              : sgstRate *
                ((priceEntry?.price || 0) +
                  totalFeatureCharges -
                  0.01 *
                    (editedData?.baseDiscount || data?.baseDiscount || 0) *
                    ((priceEntry?.price || 0) + totalFeatureCharges)),
          cgst:
            data?.booking_type === "SVKM INSTITUTE"
              ? 0
              : cgstRate *
                ((priceEntry?.price || 0) +
                  totalFeatureCharges -
                  0.01 *
                    (editedData?.baseDiscount || data?.baseDiscount || 0) *
                    ((priceEntry?.price || 0) + totalFeatureCharges)),
          cgstRate: cgstRate * 100,
          sgstRate: sgstRate * 100,
          hallDeposit: hallDeposit,
          depositDiscount:
            editedData?.depositDiscount || data?.depositDiscount || 0,
          totalPayable: editedData ? calculateTotalPayableSingle(editedData) : calculateTotalPayableSingle(data!),
          grandTotal: calculateGrandTotal(),
          email: editedData?.user.email || data?.user.email || "",
          managerEmail: editedData?.managerEmail || data?.managerEmail,
          managerName: editedData?.managerName || data?.managerName,
        }
      );

      const pdfUrl = response.data.pdfUrl; // Assuming the response has a pdfUrl field
      await axiosManagerInstance.post(`/sendEmail`, {
        to: editedData?.user.email || data?.user.email || "",
        subject: `SVKM Hall Booking Cancellation for ${dayjs(
          editedData?.from || data?.from
        ).format("DD-MM-YYYY")}`,
        text: "Your booking has been cancelled. Please find the attachments below.",
        filename: `${editedData?.user.username || data?.user.username}_${
          editedData?.enquiryNumber || data?.enquiryNumber || ""
        }_cancellation`,
        path: pdfUrl, // Use the pdfUrl here if needed
      });
      console.log("Email sent successfully");
      return pdfUrl;
    } catch (error) {
      console.error("Error in generate cancellation or send email:", error);
    }
  };

  // Function   to calculate final payable amount of each bookings for multiple payments
  const calculateBookingPrice = (booking: {
    _id?: string;
    date?: string | undefined;
    user?: CustomerType;
    features: any;
    status?: bookingStatusType;
    price: any;
    transaction?: bookingTransactionType;
    baseDiscount: any;
    deposit: any;
    isDeposit: any;
    depositDiscount: any;
    hallId?: string;
    session_id?: string;
    booking_type: any;
    from?: string;
    to?: string;
    time?: { from: string; to: string };
    purpose?: string;
    cancellationReason?: string | undefined;
    enquiryNumber?: string | undefined;
  }) => {

      // Find the session that matches the booking's session_id
      const session = hallData?.sessions.find(
        (session: EachHallSessionType) => session._id === booking.session_id
      );
      

  // Find the price entry within the found session that matches the booking's booking_type
  const priceEntryForThisBooking = session?.price.find(
    (price: { categoryName: any; }) => price.categoryName === booking.booking_type
  );

    const price = priceEntryForThisBooking?.price || 0;

    // alert("price is" + price);


    // if we want to keep feature charges 0 for svkm 

    // let totalFeatureChargesOfIndividual =0
    // if (booking.booking_type !== "SVKM INSTITUTE") {
    //    totalFeatureChargesOfIndividual = booking.features.reduce(
    //     (total: any, feature: { price: any }) => total + feature.price,
    //     0
    //   );
    // }

    // console.log("the booking object in multiple is this",booking)

    // alert("total hall charges are"+ price)

    // If we dont want to keep feature charges 0 in svkm 
    let totalFeatureChargesOfIndividual = booking.features.reduce(
      (total: any, feature: { price: any }) => total + feature.price,
      0
    );
    


    // alert("feature charges are"+totalFeatureChargesOfIndividual)

    const basePrice = price + totalFeatureChargesOfIndividual;

    // alert("total amount with features and hall charges"+basePrice)


    const discount =
    0.01 * (booking.baseDiscount || 0) * basePrice;

    let totalPrice = basePrice - discount;
    // alert("total price is with discount"+totalPrice)

    if (booking.booking_type !== "SVKM INSTITUTE") {
      // Add 18% tax for non-SVKM bookings
      totalPrice += (cgstRate + sgstRate) * totalPrice;
    }
    // alert("total price is with tax"+totalPrice)

    if (booking.isDeposit) {
      const depositAmount =
        booking.deposit - 0.01 * booking.depositDiscount * booking.deposit;
      totalPrice += depositAmount;
    }
    // alert("total price is with deposit"+totalPrice)
    // alert("total price of this one"+ totalPrice)
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

  
  const calculateTotalPayableMultiple = (selectedBookingData: HallBookingType) => {
    const totalFeatureCharges = selectedBookingData.features.reduce((acc, feature) => acc + feature.price, 0)
    if (selectedBookingData?.booking_type == "SVKM INSTITUTE") {

      // console.log(`${selectedBookingData.from} is ${selectedBookingData.booking_type} calculated as: 
      //   Total Payable Amount = (${multiplePriceEntry?.price || 0} + ${totalFeatureCharges}) - 
      //   (0.01 * ${selectedBookingData.baseDiscount} * (${multiplePriceEntry?.price || 0} + ${totalFeatureCharges})) + 
      //   (${selectedBookingData.isDeposit ? (selectedBookingData.deposit - (0.01 * selectedBookingData.depositDiscount * selectedBookingData.deposit)) : 0})`);

      return (
        (multiplePriceEntry?.price || 0) +
        totalFeatureCharges -
        0.01 *
          selectedBookingData!.baseDiscount *
          ((multiplePriceEntry?.price || 0) + totalFeatureCharges) +
        (selectedBookingData.isDeposit
          ? selectedBookingData.deposit -
            0.01 *
              selectedBookingData.depositDiscount *
              selectedBookingData.deposit
          : 0)
      );
    } else {

      // console.log(`${selectedBookingData.from} is ${selectedBookingData.booking_type} calculated as: 
      //   Total Payable Amount (non-SVKM) = ((${multiplePriceEntry?.price || 0} + ${totalFeatureCharges}) - 
      //   (0.01 * ${selectedBookingData.baseDiscount} * (${multiplePriceEntry?.price || 0} + ${totalFeatureCharges}))) + 
      //   ((cgstRate+sgstRate) * ((${multiplePriceEntry?.price || 0} + ${totalFeatureCharges}) - 
      //   (0.01 * ${selectedBookingData.baseDiscount} * (${multiplePriceEntry?.price || 0} + ${totalFeatureCharges})))) + 
      //   (${selectedBookingData.isDeposit ? (selectedBookingData.deposit - (0.01 * selectedBookingData.depositDiscount * selectedBookingData.deposit)) : 0})`);

      return (
        (multiplePriceEntry?.price || 0) +
        totalFeatureCharges -
        0.01 *
          selectedBookingData!.baseDiscount *
          ((multiplePriceEntry?.price || 0) + totalFeatureCharges) +
        (cgstRate + sgstRate) *
          ((multiplePriceEntry?.price || 0) +
            totalFeatureCharges -
            0.01 *
              selectedBookingData!.baseDiscount *
              ((multiplePriceEntry?.price || 0) + totalFeatureCharges)) +
        (selectedBookingData.isDeposit
          ? selectedBookingData.deposit -
            0.01 *
              selectedBookingData.depositDiscount *
              selectedBookingData.deposit
          : 0)
      );
    }
  };

  const calculateTotalPayableSingle = (data: any) => {
    if (data.booking_type == "SVKM INSTITUTE") {

      // console.log(`${data.from} is ${data.booking_type} calculated as: 
      //   Total Payable Amount = (${priceEntry?.price || 0} + ${totalFeatureCharges}) - 
      //   (0.01 * ${data.baseDiscount} * (${priceEntry?.price || 0} + ${totalFeatureCharges})) + 
      //   (${data.isDeposit ? (data.deposit - (0.01 * data.depositDiscount * data.deposit)) : 0})`);

      return (
        (priceEntry?.price || 0) +
        totalFeatureCharges -
        0.01 *
          data.baseDiscount *
          ((priceEntry?.price || 0) + totalFeatureCharges) +
        (data.isDeposit
          ? data.deposit -
            0.01 *
              data.depositDiscount *
              data.deposit
          : 0)
      );
    } else {

      // console.log(`${data.from} is ${data.booking_type} calculated as: 
      //   Total Payable Amount (non-SVKM) = ((${priceEntry?.price || 0} + ${totalFeatureCharges}) - 
      //   (0.01 * ${data.baseDiscount} * (${priceEntry?.price || 0} + ${totalFeatureCharges}))) + 
      //   ((cgstRate + sgstRate) * ((${priceEntry?.price || 0} + ${totalFeatureCharges}) - 
      //   (0.01 * ${data.baseDiscount} * (${priceEntry?.price || 0} + ${totalFeatureCharges})))) + 
      //   (${data.isDeposit ? (data.deposit - (0.01 * data.depositDiscount * data.deposit)) : 0})`);

      return (
        (priceEntry?.price || 0) +
        totalFeatureCharges -
        0.01 *
          data.baseDiscount *
          ((priceEntry?.price || 0) + totalFeatureCharges) +
        (cgstRate+sgstRate) *
          ((priceEntry?.price || 0) +
            totalFeatureCharges -
            0.01 *
              data.baseDiscount *
              ((priceEntry?.price || 0) + totalFeatureCharges)) +
        (data.isDeposit
          ? data.deposit -
            0.01 *
              data.depositDiscount *
              data.deposit
          : 0)
      );
    }
  };

  const calculateGrandTotal = () => {
    if (data?.booking_type === "SVKM INSTITUTE") {
      return (
        (priceEntry?.price || 0) +
        totalFeatureCharges -
        0.01 * data!.baseDiscount * ((priceEntry?.price || 0) + totalFeatureCharges) +
        (data.isDeposit
          ? data.deposit - 0.01 * data.depositDiscount * data.deposit
          : 0)
      );
    } else {
      return (
        (priceEntry?.price || 0) +
        totalFeatureCharges -
        0.01 * data!.baseDiscount * ((priceEntry?.price || 0) + totalFeatureCharges) +
        (cgstRate+sgstRate) * ((priceEntry?.price || 0) + totalFeatureCharges - 0.01 * data!.baseDiscount * ((priceEntry?.price || 0) + totalFeatureCharges)) +
        (data?.isDeposit
          ? data.deposit - 0.01 * data.depositDiscount * data.deposit
          : 0)
      );
    }
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

  // for cgst and sgst constants
// for cgst and sgst constants
useEffect(() => {
  const fetchConstants = async () => {
    try {
      // If booking is already CONFIRMED and has stored rates, use those instead
      if (data?.status === "CONFIRMED" && data?.cgstRate !== undefined && data?.sgstRate !== undefined) {
        setCgstRate(data.cgstRate);
        setSgstRate(data.sgstRate);
        console.log("Using stored GST rates from booking:", data.cgstRate, data.sgstRate);
        return;
      }
      
      // Otherwise fetch from constants
      const response = await axiosManagerInstance.get("getAllConstants");
      const cgst = response.data.find((item: any) => item.constantName === "CGSTRate");
      const sgst = response.data.find((item: any) => item.constantName === "SGSTRate");
      
      if (cgst) setCgstRate(cgst.value / 100);
      if (sgst) setSgstRate(sgst.value / 100);
    } catch (error) {
      console.error("Error fetching GST rates:", error);
      toast.error("Failed to fetch GST rates. Using default values.");
    }
  };

  fetchConstants();
}, [data]);

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
      const updatedDataWithTotalPayable = {
        ...data,
        totalPayable: calculateTotalPayableSingle(data),
      };
      const responsePromise = axiosManagerInstance.post(
        `/editBooking/${bookingId}`,
        {
          ...updatedDataWithTotalPayable,
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

  // Update Transaction Data in multiple
  const updateMultipleTransactionData = (
    field: keyof bookingTransactionType,
    value: string
  ) => {
    if (selectedBookingData) {
      // Add a null check for selectedBookingData
      if (field === "type") {
        const transactionValue = value as transactionType;

        if (
          !selectedBookingData.transaction ||
          selectedBookingData.transaction.type !== value
        ) {
          selectedBookingData.transaction = {
            ...selectedBookingData.transaction,
            type: transactionValue,
          };
          console.log("Transaction created/updated:", selectedBookingData);
        } else {
          console.log("Transaction already exists with the same type.");
        }
      }
    } else {
      console.error("selectedBookingData is null, cannot update transaction.");
    }

    setMultipleTransactionData((prevData) => {
      console.log("this is multiple transaction data", multipleTransactionData);
      if (!prevData) {
        return { [field]: value } as bookingTransactionType;
      }
      return { ...prevData, [field]: value };
    });
  };

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
    console.log("updated data is", data);
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

  useEffect(() => {
    // When displaying a specific booking in multiple selection mode
    if (selectedBookingData && selectedBookingData.status === "CONFIRMED" && 
        selectedBookingData.cgstRate !== undefined && selectedBookingData.sgstRate !== undefined) {
      setCgstRate(selectedBookingData.cgstRate);
      setSgstRate(selectedBookingData.sgstRate);
    }
  }, [selectedBookingData]);

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
      const updatedDataWithTotalPayable = {
        ...dataToSend,
        totalPayable: calculateTotalPayableSingle(dataToSend),
      };
      
    const responsePromise = axiosManagerInstance.post(
      `/editBooking/${bookingId}`,
      updatedDataWithTotalPayable
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

    try {
      // Assuming the mutation is triggered on saving
      if (dataToSend.transaction) {
        await editTransactionType.mutateAsync(dataToSend.transaction.type);
      }

      // Here you could also clear other parts of editedData if needed
      setEditedData((prev) => {
        if (!prev) return undefined;
        return {
          ...prev,
          features: [], // Assuming you want to clear features too
          // Reset other fields if needed
        };
      });
    } catch (error) {
      console.error("Failed to save data:", error);
    }
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
    const calculateTotalFeatureCharges = (features: any) => {
      if (Array.isArray(features)) {
        return features.reduce((acc, feature) => acc + (feature.price || 0), 0);
      }
      return 0; // Default if `features` is not an array
    };
    setTotalFeatureCharges(
      calculateTotalFeatureCharges(selectedBooking?.features)
    );
    // console.log(selectedBooking, "This is a selected booking");
  };

  // Function to get booking name by ID
  const getBookingName = (bookingId: string): string => {
    const booking = allBookingsOfUser.find((b) => b._id === bookingId);
    // console.log("this is the booking fetched by it's ID", booking);
    const date = dayjs(booking?.from).format("h:mm A, MMMM D, YYYY") || "-";
    const bookingName = `${date} `;
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

      selectedBookings.forEach((selectedBookingId) => {
        const booking = allBookingsOfUser.find(
          (booking) => booking._id === selectedBookingId
        );
        if (booking) {
          total += calculateBookingPrice(booking);
        }
      });

      setGrandTotal(total);
    };

    calculateTotalSelectedBookings();
  }, [selectedBookings, allBookingsOfUser, isBookingInMultiple]);
  const handleSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedOption(selected);
    if (selected === "multiple") {

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
          // don't do anything if booking is not in multiple and is not in enquiry which means already payment is not
          if(data?.status != "ENQUIRY"){
            setIsBookingInMultiple(false);
            toast.error("This booking is not in enquiry state, cannot be added to multiple payment with other bookings.Change booking status to ENQUIRY to add to multiple payment");
            return;
          }
          // Hit API route to fetch all bookings of same HALL Id and same user if the booking is not in multiple and is an enquiry booking, showing all other with enquiry as status
          try {
            const allBookingResponsePromise = axiosManagerInstance.get(
              `/getBookingByHallAndUser/${data?.user.mobile}/${hallData?._id}`
            );
            const response = await allBookingResponsePromise;
            const allEnquiryBookingsOfUser = response.data.filter((booking: HallBookingType) => booking.status == "ENQUIRY");
            setAllBookingsOfUser(allEnquiryBookingsOfUser);
          } catch (error) {
            toast.error(
              "Failed to fetch other bookings of same hall for this user. Please try again."
            );
          }
        } else {
          toast.error(
            "This booking payment is already associated with other bookings as a multiple payment, showing all other bookings in multiple with this "
          );
          console.log("All the bookings in multiple", response.data);
          if (
            response.data &&
            response.data.multipleBooking &&
            response.data.multipleBooking.booking_ids
          ) {
            const allBookingResponsePromise = axiosManagerInstance.get(
              `/getBookingByHallAndUser/${data?.user.mobile}/${hallData?._id}`
            );
            const allBookingResponse = await allBookingResponsePromise;
            const allMultipleBookingsOfUser = allBookingResponse.data.filter((booking: HallBookingType) => response.data.multipleBooking.booking_ids.includes(booking._id));
            setAllBookingsOfUser(allMultipleBookingsOfUser);
            console.log("All the bookings in multiple", allBookingsOfUser);
            setSelectedBookings(response.data.multipleBooking.booking_ids);
            setSelectedBookingData(data || null);
            const calculateTotalFeatureCharges = (features: any) => {
              if (Array.isArray(features)) {
                return features.reduce(
                  (acc, feature) => acc + (feature.price || 0),
                  0
                );
              }
              return 0; // Default if `features` is not an array
            };
            setTotalFeatureCharges(
              calculateTotalFeatureCharges(data?.features)
            );
          } else {
            setIsBookingInMultiple(false);
            console.error("booking_ids not found in response data");
          }
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
        console.log("Selected bookings after addition:", updatedBookings);
      } else {
        updatedBookings = prevSelectedBookings.filter((id) => id !== value);
        console.log("Selected bookings after removal:", updatedBookings);
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
    setShowCancellationReason(false);

    editBookingStatus.mutate("CANCELLED");
  };

  const handleAllEdit = () => {
    setAdditional(!addAdditional);
    // setEditingMode(!editingMode);
  };
  const handleSaveCancellationReason = async () => {
    if (!editedData?.managerName) {
      toast.error("Enter the Manager Name");
      return false;
    }
    const updatedData = {
      ...data,
      cancellationReason: cancellationReason,
    };

    const updatedDataWithTotalPayable = {
      ...updatedData,
      totalPayable: calculateTotalPayableSingle(updatedData),
    };

    const responsePromise = axiosManagerInstance.post(
      `/editBooking/${bookingId}`,
      updatedDataWithTotalPayable
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
    return true;
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

  const detailsExists = () => {
    let hasErrors = false;
    if (!editedData?.user.username) {
      hasErrors = true;
      toast.error("Enter the username");
    }
    if (!editedData?.user.mobile) {
      hasErrors = true;
      toast.error("Enter the Mobile Number");
    }
    if (!editedData?.user.contact) {
      hasErrors = true;
      toast.error("Enter the Contact Person");
    }
    if (!editedData?.user.email) {
      hasErrors = true;
      toast.error("Enter the Email");
    }
    if (!editedData?.managerEmail) {
      hasErrors = true;
      toast.error("Enter the Manager Email");
    }
    if (!editedData?.managerName) {
      hasErrors = true;
      toast.error("Enter the Manager Name");
    }

    return !hasErrors;
  };

  const confirmExists = async () => {

    // Check for existing confirmed bookings in the same hall during the same time
    for (const booking of allBookingData) {
      if (booking.status === "CONFIRMED" && booking._id !== bookingId) {
        toast.error("There is already a confirmed booking in this hall at this time");
        return true;
      }
    }
    
    // For multiple bookings, check if any selected booking overlaps with an existing confirmed booking
    if (selectedOption === "multiple" && selectedBookings.length > 0) {
      
      
      // Get all bookings from the same hall that overlap with any selected booking
      const selectedBookingsDetails = allBookingsOfUser.filter(booking => 
      selectedBookings.includes(booking._id));
      
      
      for (const selectedBooking of selectedBookingsDetails) {
        // For each selected booking, check if it overlaps with a confirmed booking
        try {
          const overlappingBookingsResponse = await axiosManagerInstance.get("getBooking", {
            params: {
              from: selectedBooking.from,
              to: selectedBooking.to,
              hallId: data?.hallId
            },
          });
          
          let overlappingBookings = [];
          
          // Check if we got an array of bookings or an error message
          if (Array.isArray(overlappingBookingsResponse.data)) {
            // Filter for CONFIRMED bookings only
            overlappingBookings = overlappingBookingsResponse.data.filter(
              booking => booking.status === "CONFIRMED" && booking._id !== selectedBooking._id
            );
          }
          
          
          
          // If we found any confirmed bookings that aren't the current booking, there's a conflict
          if (overlappingBookings.length > 0) {
            toast.error(`Booking for ${dayjs(selectedBooking.from).format("MMM D, YYYY h:mm A")} overlaps with an existing confirmed booking`);
            return true;
          }
      } catch (error) {
        console.error("Error checking for booking conflicts:", error);
        toast.error("Error checking for booking conflicts. Please try again.");
        return true; // Prevent confirmation on error
      }
      }
    }
    
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
          className="block  w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
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
            placeholder="Enter Email"
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
        <div className="w-full max-w-4xl mx-auto mt-5">
        {/* If nothing in user bookings */}
        {allBookingsOfUser.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No bookings with Enquiry status found for this hall.
            </div>
          ) : (

        <>
        {/* Grid for checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {allBookingsOfUser.slice(0, displayCount).map((booking) => (
            <div
              key={booking._id}
              className={`
                flex items-center p-3 rounded-lg border
                ${booking.status === 'CANCELLED' 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-gray-300 hover:border-blue-500'
                }
                transition-colors duration-200
              `}
            >
              <div className="flex items-center space-x-3 w-full">
                <input
                  type="checkbox"
                  id={`booking-${booking._id}`}
                  value={booking._id}
                  checked={selectedBookings.includes(booking._id)}
                  onChange={handleCheckboxChange}
                  disabled={booking.status === "CANCELLED"}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                />
                <label
                  htmlFor={`booking-${booking._id}`}
                  className={`flex-1 text-sm ${
                    booking.status === "CANCELLED" 
                      ? "text-gray-400" 
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{dayjs(booking.from).format("MMM D, YYYY")}</span>
                    <span className="text-xs font-medium">
                      {dayjs(booking.from).format("h:mm A")}
                    </span>
                  </div>
                  {booking.status === "CANCELLED" && (
                    <div className="flex items-center mt-1 text-red-500 text-xs">
                      {/* Simple X icon using Tailwind */}
                      <span className="mr-1 font-medium">&times;</span>
                      Cancelled
                    </div>
                  )}
                </label>
              </div>
            </div>
          ))}
        </div>
  
        {/* Show more/less button */}
        {allBookingsOfUser.length > 6 && (
          <div className="flex justify-center mb-6">
            <button
              onClick={displayCount < allBookingsOfUser.length ? handleShowMore : handleShowLess}
              className="flex items-center px-4 py-2 text-sm text-blue-800 font-semibold hover:text-blue-900 transition-colors duration-200"
            >
              {displayCount < allBookingsOfUser.length ? (
                <>
                  Show More 
                  {/* Down arrow using HTML entity */}
                  <span className="ml-1 text-xs">&#9662;</span>
                </>
              ) : (
                <>
                  Show Less
                  {/* Up arrow using HTML entity */}
                  <span className="ml-1 text-xs">&#9652;</span>
                </>
              )}
            </button>
          </div>
        )}
  
        {/* Selected bookings dropdown */}
        {selectedBookings.length > 0 && (
          <div className="mt-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="selected-bookings"
            >
              Selected Bookings ({selectedBookings.length})
            </label>
            <div className="relative">
              <select
                id="selected-bookings"
                onChange={handleBookingSelect}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              {/* Custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <span className="text-xs">&#9662;</span>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </div>
      )}

      {/* Manager Email */}
      <span className=" text-lg font-medium">Manager Details</span>
      {/* Manager Phone Number */}
      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Manager Name</span>
          <input
            type="text"
            value={editedData?.managerName}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  managerName: e.target.value,
                };
              })
            }
            placeholder="Manager Name"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Manager Name</span>
          <span className="w-full text-right">{data?.managerName}</span>
        </div>
      )}
      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Manager Email</span>
          <input
            type="email"
            value={editedData?.managerEmail}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  managerEmail: e.target.value,
                };
              })
            }
            placeholder="Manager Email"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Manager Email</span>
          <span className="w-full text-right">{data?.managerEmail}</span>
        </div>
      )}


      {/* When payment menthod is set to  multiple */}

      {selectedBookingData ? (
        <>
          <span className=" text-lg font-medium">Slots</span>
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
              {selectedBookingData?.price || "-"}
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
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Additional Information</span>
            <span className="w-full text-right">
              {selectedBookingData.additionalInfo || "-"}
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
            <span className="w-full text-left">CGST {(cgstRate * 100)}%</span>
            <span className="w-full text-right">
              {selectedBookingData?.booking_type == "SVKM INSTITUTE" ? (
                <div>0</div>
              ) : (
                <div>
                  {cgstRate *
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
            <span className="w-full text-left">SGST {(sgstRate * 100)}%</span>
            <span className="w-full text-right">
              {selectedBookingData?.booking_type == "SVKM INSTITUTE" ? (
                <div>0</div>
              ) : (
                <div>
                  {sgstRate *
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
            <span className=" text-lg font-medium">Security Deposit</span>
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
                  {calculateTotalPayableMultiple(selectedBookingData)}
                </span>
              </div>
            </>
          }
          <div className="flex mt-5 items-center w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Grand Total Amount</span>
            <span className="w-full text-right">
              <span className="w-full text-right">
                {" "}
                {grandTotal.toFixed(2)}
              </span>
            </span>
          </div>
          {/* Transaction Details for Multiple */}
          {["cheque", "upi", "neft/rtgs"].includes(
            selectedBookingData?.transaction?.type || ""
          ) ? (
            <span className="mt-4 text-lg font-medium">
              Transaction Details
            </span>
          ) : (
            <>
              <span className="mt-4 text-lg font-medium">
                Transaction Details
              </span>
              <span className="mt-2">Payment Method: SVKM Institute</span>
            </>
          )}
          {editingMode ? (
            <span>
              <label htmlFor="transaction">Choose a Transaction Type </label>
              <select
                id="transaction"
                value={selectedBookingData?.transaction?.type || ""}
                className="px-2 py-1 rounded-md border border-gray-400 my-2"
                onChange={(e) => {
                  updateMultipleTransactionData("type", e.target.value);
                }}
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
          {["cheque", "upi", "neft/rtgs"].includes(
            selectedBookingData?.transaction?.type || ""
          ) &&
            (editingMode ? (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Date</span>
                <input
                  type="text"
                  value={
                    multipleTransactionData?.date ||
                    selectedBookingData.transaction.date
                  }
                  onChange={(e) =>
                    updateMultipleTransactionData("date", e.target.value)
                  }
                  placeholder="DD-MM-YYYY"
                  className="px-2"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Date</span>
                <span className="w-full text-right">
                  {selectedBookingData?.transaction?.date || "-"}
                </span>
              </div>
            ))}
          {["upi"].includes(selectedBookingData?.transaction?.type || "") &&
            (editingMode ? (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Transaction ID</span>
                <input
                  type="text"
                  value={
                    multipleTransactionData?.transactionID ||
                    selectedBookingData.transaction.transactionID ||
                    ""
                  }
                  onChange={(e) =>
                    updateMultipleTransactionData(
                      "transactionID",
                      e.target.value
                    )
                  }
                  placeholder="Enter Transaction ID"
                  className="px-2"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Transaction ID</span>
                <span className="w-full text-right">
                  {selectedBookingData?.transaction?.transactionID || "-"}
                </span>
              </div>
            ))}
          {["neft/rtgs"].includes(
            selectedBookingData?.transaction?.type || ""
          ) &&
            (editingMode ? (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">UTR No.</span>
                <input
                  type="text"
                  value={
                    multipleTransactionData?.utrNo ||
                    selectedBookingData.transaction.utrNo ||
                    ""
                  }
                  onChange={(e) =>
                    updateMultipleTransactionData("utrNo", e.target.value)
                  }
                  placeholder="Enter UTR Number"
                  className="px-2"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">UTR No.</span>
                <span className="w-full text-right">
                  {selectedBookingData?.transaction?.utrNo || "-"}
                </span>
              </div>
            ))}
          {["cheque"].includes(selectedBookingData?.transaction?.type || "") &&
            (editingMode ? (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Cheque No.</span>
                <input
                  type="text"
                  value={
                    multipleTransactionData?.chequeNo ||
                    selectedBookingData.transaction.chequeNo ||
                    ""
                  }
                  onChange={(e) =>
                    updateMultipleTransactionData("chequeNo", e.target.value)
                  }
                  placeholder="Enter Cheque Number"
                  className="px-2"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Cheque No.</span>
                <span className="w-full text-right">
                  {selectedBookingData?.transaction?.chequeNo || "-"}
                </span>
              </div>
            ))}
          {["cheque"].includes(selectedBookingData?.transaction?.type || "") &&
            (editingMode ? (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Bank</span>
                <input
                  type="text"
                  value={
                    multipleTransactionData?.bank ||
                    selectedBookingData.transaction.bank ||
                    ""
                  }
                  onChange={(e) =>
                    updateMultipleTransactionData("bank", e.target.value)
                  }
                  placeholder="Enter Bank Name"
                  className="px-2"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Bank</span>
                <span className="w-full text-right">
                  {selectedBookingData?.transaction?.bank || "-"}
                </span>
              </div>
            ))}

          {["cheque"].includes(selectedBookingData?.transaction?.type || "") &&
            (editingMode ? (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Payee Name</span>
                <input
                  type="text"
                  value={
                    multipleTransactionData?.payeeName ||
                    selectedBookingData.transaction.payeeName ||
                    ""
                  }
                  onChange={(e) =>
                    updateMultipleTransactionData("payeeName", e.target.value)
                  }
                  placeholder="Enter Payee Name"
                  className="px-2"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Payee Name</span>
                <span className="w-full text-right">
                  {selectedBookingData?.transaction?.payeeName || "-"}
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
                  if (await handleSaveCancellationReason()) {
                    handleCancellation();
                    generateCancellationAndEmail();
                  }
                }}
                className="bg-green-500 px-4 text-white py-1 rounded-lg"
              >
                Confirm Cancellation
              </button>
            </div>
          ) : (
            <></>
          )}

          {selectedBookingData?.cancellationReason &&
            selectedBookingData?.status == "CANCELLED" && (
              <div className="w-full flex justify-between my-2 bg-red-400 rounded-sm px-2 py-1 border text-white">
                <span className="text-lg font-medium">Cancellation Reason</span>
                <span>{selectedBookingData?.cancellationReason}</span>
              </div>
            )}

          {editingMode ? (
            <>
              <h1 className="text-lg font-medium">Set Booking Status</h1>
              <span className="space-x-4 space-y-4">
                {/* <button
              onClick={() => {
                setShowCancellationReason(true);
              }}
              className="mb-2 bg-red-600 px-4 text-white py-1 rounded-lg"
            >
              Cancelled
            </button>
            <button
              onClick={() => {
                setShowCancellationReason(false);
                editBookingStatus.mutate("ENQUIRY" as bookingStatusType);
              }}
              className="mb-2 bg-blue-600 px-4 text-white py-1 rounded-lg"
            >
              Enquiry
            </button> */}
                {/* Confirmed button with saving the edits */}
                <button
                  onClick={async () => {
                    setShowCancellationReason(false);

                    const hasConflicts = await confirmExists();
                    if (
                      !hasConflicts &&
                      paymentDetails() &&
                      detailsExists()
                    ) {
                      await confirmAndSaveMultipleBooking.mutateAsync();
                      generateConfirmationForMultiple();
                    }
                  }}
                  className="mb-2 bg-green-600 px-4 text-white py-1 rounded-lg"
                >
                  Confirm
                </button>
              </span>
            </>
          ) : (
            <></>
          )}
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
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Additional Information</span>
            <span className="w-full text-right">{data?.additionalInfo || "-"}</span>
          </div>

          {/* Additional Features */}
          <span className="text-lg font-medium m-1">Additional Features</span>

{!data?.features.length ? (
  <>
    <p className="text-lg font-medium m-2">
      No Additional Features Selected
    </p>
    <button
      onClick={handleAllEdit}
      className="mb-2 bg-blue-600 px-4 text-white py-1 rounded-lg m-1"
    >
      Add Additional Features
    </button>

    {addAdditional || editingMode ? (
      <div className="flex flex-col w-full mb-2">
        <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span>Name</span>
          {editingMode || addAdditional ? (
            <select
              value={editedData?.features[0]?.heading || ''}
              onChange={(e) =>
                setEditedData((prev) => {
                  if (!prev) return undefined;
                  return {
                    ...prev,
                    features: [
                      {
                        ...prev.features[0],
                        heading: e.target.value,
                      },
                    ],
                  };
                })
              }
              className="px-2"
            >
              <option value="" disabled>Select an option</option>
              {hallData?.additionalFeatures?.map((feature, i) => (
                <option key={i} value={feature.heading}>
                  {feature.heading}
                </option>
              ))}
            </select>
          ) : (
            <>{data?.features[0]?.heading || "-"}</>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span>Description</span>
          <input
            type="text"
            value={editedData?.features[0]?.desc || ""}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  features: [
                    {
                      ...prev.features[0],
                      desc: e.target.value,
                    },
                  ],
                };
              })
            }
            placeholder="Enter Description"
            className="px-2"
          />
        </div>
        <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span>Additional Feature Charges</span>
          <input
            type="number"
            value={editedData?.features[0]?.price || ""}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  features: [
                    {
                      ...prev.features[0],
                      price: parseInt(e.target.value) || 0,
                    },
                  ],
                };
              })
            }
            placeholder="Enter Charges"
            className="px-2"
          />
        </div>
      </div>
    ) : (
      <></>
    )}
  </>
) : (
  data?.features.map((eachFeature, index) => (
    <div key={index} className="flex flex-col w-full mb-2">
      <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span>Name</span>
        {editingMode || addAdditional ? (
          <select
            value={editedData?.features[index]?.heading || ''}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  features: prev.features.map((feature, i) =>
                    i === index ? { ...feature, heading: e.target.value } : feature
                  ),
                };
              })
            }
            className="px-2"
          >
            <option value="" disabled>Select an option</option>
            {hallData?.additionalFeatures?.map((feature, i) => (
              <option key={i} value={feature.heading}>
                {feature.heading}
              </option>
            ))}
          </select>
        ) : (
          <span>{eachFeature.heading || "-"}</span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span>Description</span>
        {editingMode || addAdditional ? (
          <input
            type="text"
            value={editedData?.features[index]?.desc || ""}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  features: prev.features.map((feature, i) =>
                    i === index ? { ...feature, desc: e.target.value } : feature
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
                const updatedFeatures = prev.features.map((feature, i) =>
                  i === index ? { ...feature, price: parseInt(e.target.value) || 0 } : feature
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
            {data?.booking_type === "SVKM Institute" ? 0 : eachFeature.price || "-"}
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
                      baseDiscount: Number.isNaN(Number(e.target.value))
                        ? 0
                        : Number(e.target.value) > 100
                        ? 100
                        : Number(e.target.value),
                    };
                  });
                }}
                placeholder="Enter Discount %"
                className="px-2"
                maxLength={3}
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
            <span className="w-full text-left">CGST {(cgstRate * 100)}%</span>
            <span className="w-full text-right">
              {data?.booking_type == "SVKM INSTITUTE" ? (
                <div>0</div>
              ) : (
                <div>
                  {editingMode
                    ? cgstRate *
                      ((priceEntry?.price || 0) +
                        totalFeatureCharges -
                        0.01 *
                          editedData!.baseDiscount *
                          ((priceEntry?.price || 0) + totalFeatureCharges))
                    : cgstRate *
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
            <span className="w-full text-left">SGST {(sgstRate* 100)}%</span>
            <span className="w-full text-right">
              {data?.booking_type == "SVKM INSTITUTE" ? (
                <div>0</div>
              ) : (
                <div>
                  {editingMode
                    ? sgstRate *
                      ((priceEntry?.price || 0) +
                        totalFeatureCharges -
                        0.01 *
                          editedData!.baseDiscount *
                          ((priceEntry?.price || 0) + totalFeatureCharges))
                    : sgstRate *
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
              value={data?.isDeposit ? "yes" : "no"}
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
                        depositDiscount: Number.isNaN(Number(e.target.value))
                          ? 0
                          : Number(e.target.value) > 100
                          ? 100
                          : Number(e.target.value),
                      };
                    })
                  }
                  placeholder="Enter Security Deposit Discount %"
                  className="px-2"
                  disabled={
                    data?.isDeposit === false || editedData?.isDeposit === false
                  }
                  maxLength={3}
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

<div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
  <span className="w-full text-left">Total Payable Amount</span>
  <span className="w-full text-right">
    {editedData ? (
      calculateTotalPayableSingle(editedData)
    ) : (
      calculateTotalPayableSingle(data!)
    )}
  </span>
</div>
          <div className="flex mt-5 items-center w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Grand Total Amount</span>
            <span className="w-full text-right">
              <span className="w-full text-right"> {calculateGrandTotal()}</span>
            </span>
          </div>
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

          {["cheque", "upi", "neft/rtgs"].includes(
            data?.transaction?.type || ""
          ) ? (
            <span className="mt-4 text-lg font-medium">
              Transaction Details
            </span>
          ) : ["svkminstitute"].includes(data?.transaction?.type || "") ? (
            <>
              <span className="mt-4 text-lg font-medium">
                Transaction Details
              </span>
              <span className="mt-2">Payment Method: SVKM Institute</span>
            </>
          ) : null}

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
          {["cheque", "upi", "neft/rtgs"].includes(
            data?.transaction?.type || ""
          ) &&
            (editingMode ? (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
                <span className="w-full text-left">Date</span>
                <input
                  type="date"
                  value={
                    editedData?.transaction?.date
                      ? new Date(editedData.transaction.date).toISOString().split("T")[0]
                      : "" // Fallback to an empty string for an uncontrolled input
                  }
                  max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split("T")[0]}
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
                  placeholder="DD-MM-YYYY"
                  className="px-2"
                />

              </div>
            ) : (
              <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
  <span className="w-full text-left">Date</span>
  <span className="w-full text-right">
    {data?.transaction?.date
      ? new Date(data.transaction.date)
          .toLocaleDateString('en-GB')
          .replace(/\//g, "-") // Replace slashes with hyphens
      : "-"}
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
                  if (await handleSaveCancellationReason()) {
                    handleCancellation();
                    generateCancellationAndEmail();
                  }
                }}
                className="bg-green-500 px-4 text-white py-1 rounded-lg"
              >
                Confirm Cancellation
              </button>
            </div>
          ) : (
            <></>
          )}

          {data?.cancellationReason && data?.status == "CANCELLED" && (
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
                    setShowCancellationReason(false);
                    editBookingStatus.mutate("ENQUIRY" as bookingStatusType);
                  }}
                  className="mb-2 bg-blue-600 px-4 text-white py-1 rounded-lg"
                >
                  Enquiry
                </button>
                {/* Confirmed button with saving the edits */}
                <button
                  onClick={async () => {
                    setShowCancellationReason(false);
                    const hasConflicts = await confirmExists();
                    if (
                      !hasConflicts &&
                      paymentDetails() &&
                      detailsExists()
                    ) {
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

          {data?.status === "CONFIRMED" && !editingMode && (
            <span className="space-x-4 space-y-4">
              <button
                onClick={async () => {
                  if (paymentDetails() && detailsExists()) {
                    generateConfirmationAndEmail();
                  }
                }}
                className="my-4 bg-green-600 px-4 text-white py-1 rounded-lg"
              >
                Resend Email
              </button>
              <button
                onClick={async () =>
                  window.open(await generateConfirmationAndEmail())
                }
                className="mb-2 bg-blue-600 px-4 text-white py-1 rounded-lg"
              >
                Download Confirmation
              </button>
            </span>
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
        </>
      )}
    </div>
  );
}

export default Booking;