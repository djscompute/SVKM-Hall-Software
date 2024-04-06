import { useLocation } from "react-router-dom";
import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat";

const BookingSuccessful = () => {
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;
  const extractTime = (dateTimeString:string) => {
    return dateTimeString.split("T")[1].split(".")[0]; 
  };
  const from = convert_IST_TimeString_To12HourFormat(extractTime(bookingDetails.startTime));
  const to = convert_IST_TimeString_To12HourFormat(extractTime(bookingDetails.endTime));

  return (
    <div className="flex flex-col items-center py-10 gap-6 md:w-2/3 lg:w-1/2 mx-auto">
      <h1 className="text-3xl font-semibold text-center">Enquiry Successful for {bookingDetails.hallName}</h1>
      <p className="text-center">Thank you for your enquiry! Keep an eye on your email inbox to get further details.</p>
      {bookingDetails && (
        <>
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Hall Details:</h2>
            <p><span className="font-semibold">Name:</span> {bookingDetails.hallName}</p>
            <p><span className="font-semibold">Session Name:</span> {bookingDetails.sessionName}</p>
            <p><span className="font-semibold">Time:</span> {from} - {to}</p>
            <p><span className="font-semibold">Estimated Cost:</span> ₹{bookingDetails.estimatedPrice}</p>
            <p><span className="font-semibold">Additional Features:</span> {bookingDetails.selectedFeatures ?? "None"}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded mt-4">
            <h2 className="text-lg font-semibold mb-2">User Details:</h2>
            <p><span className="font-semibold">Name:</span> {bookingDetails.username}</p>
            <p><span className="font-semibold">Contact Person:</span> {bookingDetails.contact}</p>
            <p><span className="font-semibold">Email:</span> {bookingDetails.email}</p>
            <p><span className="font-semibold">Mobile Number:</span> {bookingDetails.mobile}</p>
            <p><span className="font-semibold">Current Status:</span> {bookingDetails.status}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingSuccessful;
