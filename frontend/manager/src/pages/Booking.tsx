import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import axiosManagerInstance from "../config/axiosManagerInstance";
import { toast } from "react-toastify";
import {
  EachHallType,
  HallBookingType,
  bookingStatusType,
  transactionType,
} from "../../../../types/global";
import { useParams } from "react-router-dom";
// import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat";
import { useState } from "react";
import { queryClient } from "../App";

const possibleBookingTypes: bookingStatusType[] = [
  "CONFIRMED",
  //"TENTATIVE",
  "CANCELLED",
  "ENQUIRY",
];

function Booking() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [hallData, setHallData] = useState<EachHallType>();
  const [editingMode, setEditingMode] = useState(false);
  const [editedData, setEditedData] = useState<HallBookingType>();
  const [showCancellationReason, setShowCancellationReason] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

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
  console.log("The data is ",data)

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
          hallId:data?.hallId
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
      const responsePromise = axiosManagerInstance.post(
        `/editBooking/${bookingId}`,
        {
          ...data,
          transaction: {
            ...data?.transaction,
            type: newTransaction,
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

  const handleSave = async () => {
    const responsePromise = axiosManagerInstance.post(
      `/editBooking/${bookingId}`,
      editedData
    );
    toast.promise(responsePromise, {
      pending: "Updating...",
      success: "Booking Status Edited!",
      error: "Failed to Booking Hall. Please Reload and try again.",
    });
    await responsePromise;
    setEditingMode(false);
    await queryClient.refetchQueries({
      queryKey: [`booking/${bookingId}`],
    });
  };

  const session = hallData?.sessions.find(
    (session) => session._id === data?.session_id
  );

  const priceEntry = session?.price.find(
    (price) => price.categoryName === data?.booking_type
  );

  const handleCancellation = async () => {
    editBookingStatus.mutate("CANCELLED");
    setShowCancellationReason(false);
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
        toast.error("There is already a confirmed hall in this session")
        return true;
      }
    }
    // If no booking with status "CONFIRMED" is found, return false
    return false;
  }

  if (isFetching) return <h1>Loading</h1>;

  return (
    <div className="flex flex-col items-center my-10 w-11/12 sm:w-3/4 lg:w-1/2 mx-auto">
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
        <span className="w-full text-right">{priceEntry?.price || "-"}</span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Status</span>
        <span className="w-full text-right">{data?.status || "-"}</span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Customer Type</span>
        <span className="w-full text-right">{data?.booking_type || "-"}</span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Purpose of the Event</span>
        <span className="w-full text-right">{data?.purpose || "-"}</span>
      </div>
      <span className=" text-lg font-medium">Additional Features</span>

      {!data?.features.length ? (
        <p className="text-lg font-medium">No Additional Features Selected</p>
      ) : (
        data?.features.map((eachFeature, index) => (
          <div key={index} className="flex flex-col w-full mb-2">
            <div className="flex items-center justify-between gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
              <span>Name</span>
              {editingMode ? (
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
              {editingMode ? (
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
              {editingMode ? (
                <input
                  type="number"
                  value={editedData?.features[index]?.price || ""}
                  onChange={(e) =>
                    setEditedData((prev) => {
                      if (!prev) return prev; // Return previous state if undefined
                      const updatedFeatures = prev.features.map((feature, i) =>
                        i === index
                          ? { ...feature, price: parseInt(e.target.value) }
                          : feature
                      );
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

      <span className=" text-lg font-medium">Billing</span>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Total Hall Charges</span>
        <span className="w-full text-right">{data?.price || "-"}</span>
      </div>

      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Discount %</span>
          <input
            type="text"
            value={editedData?.baseDiscount}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  baseDiscount: Number(e.target.value),
                };
              })
            }
            placeholder="Enter Discount %"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Hall Discount %</span>
          <span className="w-full text-right">{data?.baseDiscount || 0}</span>
        </div>
      )}

      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Hall Discount Amount</span>
        <span className="w-full text-right">
          {data?.price ? 0.01 * data?.baseDiscount * data?.price : "-"}
        </span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Hall Discounted Price</span>
        <span className="w-full text-right">
          {data?.price
            ? data?.price - 0.01 * data?.baseDiscount * data?.price
            : "-"}
        </span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">CGST %</span>
        <span className="w-full text-right">
          {data?.booking_type == "SVKM INSTITUTE" ? (
            <div>0</div>
          ) : (
            <div>
              {data?.price
                ? 0.09 * (data?.price - 0.01 * data?.baseDiscount * data?.price)
                : "-"}
            </div>
          )}
        </span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">SGST %</span>
        <span className="w-full text-right">
          {data?.booking_type == "SVKM INSTITUTE" ? (
            <div>0</div>
          ) : (
            <div>
              {data?.price
                ? 0.09 * (data?.price - 0.01 * data?.baseDiscount * data?.price)
                : "-"}
            </div>
          )}
        </span>
      </div>
      <span>
        <label htmlFor="isDeposit">Security Deposit Applicable </label>
        <select
          id="isDeposit"
          value={data?.isDeposit === true ? "yes" : "no" || ""}
          className="px-2 py-1 rounded-md border border-gray-400 my-1"
          onChange={(e) => {
            if (e.target.value === "yes") {
              editIsDepositApplicable.mutate(true);
            }
            if (e.target.value === "no") {
              editIsDepositApplicable.mutate(false);
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
          <span className="w-full text-left">Enter Security Deposit</span>
          <input
            type="text"
            value={editedData?.deposit}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  deposit: Number(e.target.value),
                };
              })
            }
            placeholder="Enter Security Deposit"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Security Deposit Amount</span>
          <span className="w-full text-right">{data?.deposit}</span>
        </div>
      )}
      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Deposit Discount %</span>
          <input
            type="text"
            value={editedData?.depositDiscount}
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
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Deposit Discount %</span>
          <span className="w-full text-right">
            {data?.depositDiscount || 0}
          </span>
        </div>
      )}
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Deposit Discount Amount</span>
        <span className="w-full text-right">
          {data?.deposit ? 0.01 * data?.depositDiscount * data?.deposit : "-"}
        </span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Deposit Discounted Price</span>
        <span className="w-full text-right">
          {data?.deposit
            ? data?.deposit - 0.01 * data?.depositDiscount * data?.deposit
            : "-"}
        </span>
      </div>

      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Total Payable Amount</span>
        <span className="w-full text-right">
          <span className="w-full text-right">
            {data?.booking_type == "SVKM INSTITUTE" ? (
              <div>
                {data
                  ? data?.price -
                    0.01 * data?.baseDiscount * data?.price +
                    (data.isDeposit
                      ? data?.deposit -
                        0.01 * data?.depositDiscount * data?.deposit
                      : 0)
                  : 0}
              </div>
            ) : (
              <div>
                {data
                  ? data?.price -
                    0.01 * data?.baseDiscount * data?.price +
                    0.18 *
                      (data?.price - 0.01 * data?.baseDiscount * data?.price) +
                    (data.isDeposit
                      ? data?.deposit -
                        0.01 * data?.depositDiscount * data?.deposit
                      : 0)
                  : 0}
              </div>
            )}
          </span>
        </span>
      </div>

      {editingMode ? (
        <button
          onClick={handleSave}
          className="mb-2 bg-blue-600 px-4 text-white py-1 rounded-lg mt-4"
        >
          Save Details
        </button>
      ) : (
        <></>
      )}

      <span className="text-lg font-medium">Transaction Details</span>
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
            <button
              onClick={async () => {
                !confirmExists() && paymentDetails() &&
                  editBookingStatus.mutate("CONFIRMED" as bookingStatusType);
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
