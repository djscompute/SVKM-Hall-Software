import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import axiosInstance from "../config/axiosInstance";
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
      try {
        const responsePromise = axiosInstance.get(
          `getBookingByID?_id=${bookingId}`
        );
        toast.promise(responsePromise, {
          pending: "Fetching Booking...",
          error: "Failed to fetch Booking. Please try again.",
        });
        const response = await responsePromise;
        if (response.data.hallId) {
          const result = await axiosInstance.get(
            `getHall/${response.data.hallId}`
          );
          setHallData(result.data);
        }
        return response.data as HallBookingType;
      } catch (error) {
        throw error;
      }
    },
  });

  const editBookingStatus = useMutation({
    mutationFn: async (newStatus: bookingStatusType) => {
      console.log(hallData);
      const responsePromise = axiosInstance.post(`/editBooking/${bookingId}`, {
        ...data,
        status: newStatus,
        cancellationReason: showCancellationReason
          ? cancellationReason
          : undefined,
      });
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

  const editTransactionType = useMutation({
    mutationFn: async (newTransaction: transactionType) => {
      const responsePromise = axiosInstance.post(`/editBooking/${bookingId}`, {
        ...data,
        transaction: {
          ...data?.transaction,
          type: newTransaction,
        },
      });
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

  const editDepositAmount = useMutation({
    mutationFn: async (newDeposit: number) => {
      console.log(hallData);
      const responsePromise = axiosInstance.post(`/editBooking/${bookingId}`, {
        ...data,
        deposit: newDeposit,
      });
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
    const responsePromise = axiosInstance.post(
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

    const responsePromise = axiosInstance.post(
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

  if (isFetching) return <h1>Loading</h1>;

  return (
    <div className="flex flex-col items-center my-10 w-11/12 sm:w-3/4 lg:w-1/2 mx-auto">
      <span className=" text-lg font-medium">User</span>

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
            placeholder="Enter Aadhar Number"
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
          <span className="w-full text-left">Aadhar No</span>
          <input
            type="text"
            value={editedData?.user?.aadharNo}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  user: {
                    ...prev.user,
                    aadharNo: e.target.value,
                  },
                };
              })
            }
            placeholder="Enter Aadhar Number"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Aadhar No</span>
          <span className="w-full text-right">
            {data?.user.aadharNo || "-"}
          </span>
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
        <span className="w-full text-left">Base Price</span>
        <span className="w-full text-right">{priceEntry?.price || "-"}</span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Status</span>
        <span className="w-full text-right">{data?.status || "-"}</span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Booking Type</span>
        <span className="w-full text-right">{data?.booking_type || "-"}</span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Purpose</span>
        <span className="w-full text-right">{data?.purpose || "-"}</span>
      </div>
      <span className=" text-lg font-medium">Additional Features</span>
      {data?.features.map((eachFeature, index) => (
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
            <span>Price</span>
            <span>{eachFeature.price || "-"}</span>
          </div>
        </div>
      ))}

      <span className=" text-lg font-medium">Billing</span>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Total Price</span>
        <span className="w-full text-right">{data?.price || "-"}</span>
      </div>

      {editingMode ? (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Discount %</span>
          <input
            type="text"
            value={editedData?.discount}
            onChange={(e) =>
              setEditedData((prev) => {
                if (!prev) return undefined;
                return {
                  ...prev,
                  discount: Number(e.target.value),
                };
              })
            }
            placeholder="Enter Discount %"
            className="px-2"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
          <span className="w-full text-left">Discount %</span>
          <span className="w-full text-right">{data?.discount || 0}</span>
        </div>
      )}

      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Discounted Price</span>
        <span className="w-full text-right">
          {data?.price
            ? data?.price - 0.01 * data?.discount * data?.price
            : "-"}
        </span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">CGST %</span>
        <span className="w-full text-right">
          {data?.price
            ? 0.09 * (data?.price - 0.01 * data?.discount * data?.price)
            : "-"}
        </span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">SGST %</span>
        <span className="w-full text-right">
          {data?.price
            ? 0.09 * (data?.price - 0.01 * data?.discount * data?.price)
            : "-"}
        </span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Existing Security Deposit</span>
        <span className="w-full text-right">{data?.deposit}</span>
      </div>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">New Security Deposit</span>
        <span className="w-full text-right">{hallData?.securityDeposit}</span>
      </div>
      <span>
        <label htmlFor="paidornot">Security Deposit Type </label>
        <select
          id="paidornot"
          className="px-2 py-1 rounded-md border border-gray-400 my-1"
          onChange={(e) => {
            if (e.target.value === "existing") {
              editDepositAmount.mutate(data?.deposit || 0);
            }
            if (e.target.value === "none") {
              editDepositAmount.mutate(0);
            }
            if (e.target.value === "new") {
              editDepositAmount.mutate(hallData?.securityDeposit || 0);
            }
          }}
        >
          <option value="existing">Existing</option>
          <option value="none">None</option>
          <option value="new">New</option>
        </select>
      </span>
      <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
        <span className="w-full text-left">Final Price</span>
        <span className="w-full text-right">
          {data
            ? data?.price -
              0.01 * data?.discount * data?.price +
              0.18 * (data?.price - 0.01 * data?.discount * data?.price) +
              data?.deposit
            : 0}
        </span>
      </div>

      <span className=" text-lg font-medium">Transaction Details</span>
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
          <option value="neft">NEFT</option>
          <option value="rtgs">RTGS</option>
        </select>
      </span>
      {["cheque", "neft", "rtgs"].includes(data?.transaction?.type || "") &&
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
      {["neft"].includes(data?.transaction?.type || "") &&
        (editingMode ? (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Transaction No.</span>
            <input
              type="text"
              value={editedData?.transaction?.transactionNo}
              onChange={(e) =>
                setEditedData((prev) => {
                  if (!prev) return undefined;
                  return {
                    ...prev,
                    transaction: {
                      ...prev.transaction,
                      transactionNo: e.target.value,
                    },
                  };
                })
              }
              placeholder="Enter Transaction Number"
              className="px-2"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full bg-blue-100 rounded-sm px-2 py-1 border border-blue-600">
            <span className="w-full text-left">Transaction No.</span>
            <span className="w-full text-right">
              {data?.transaction?.transactionNo || "-"}
            </span>
          </div>
        ))}
      {["rtgs"].includes(data?.transaction?.type || "") &&
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

      <span className=" mb-3">STATUS: {data?.status}</span>

      {editingMode ? (
        <button
          onClick={handleSave}
          className="mb-2 bg-blue-600 px-4 text-white py-1 rounded-lg"
        >
          Save Details
        </button>
      ) : (
        <button
          onClick={handleEdit}
          className=" mb-2 bg-blue-600 px-4 text-white py-1 rounded-lg"
        >
          Edit Details
        </button>
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

      <select
        value={data?.status}
        onChange={(e) => {
          console.log(e.target.value);
          if (e.target.value == "CANCELLED") {
            setShowCancellationReason(true);
          } else {
            editBookingStatus.mutate(e.target.value as bookingStatusType);
          }
        }}
        className="px-2 py-1 rounded-md border border-gray-400"
      >
        {possibleBookingTypes.map((eachBooktingType) => (
          <option value={eachBooktingType}>{eachBooktingType}</option>
        ))}
      </select>
    </div>
  );
}

export default Booking;
