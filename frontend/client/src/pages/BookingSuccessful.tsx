import { useLocation } from "react-router-dom";
import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat";

const BookingSuccessful = () => {
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;
  const extractTime = (dateTimeString: string) => {
    return dateTimeString.split("T")[1].split(".")[0];
  };
  const extractDate = (dateTimeString: string) => {
    return dateTimeString.split("T")[0];
  };
  const from = convert_IST_TimeString_To12HourFormat(
    extractTime(bookingDetails.startTime)
  );
  const to = convert_IST_TimeString_To12HourFormat(
    extractTime(bookingDetails.endTime)
  );
  const date = extractDate(bookingDetails.startTime);

  return (
    <div className="flex flex-col py-4 gap-6 md:w-2/3 lg:w-1/2 mx-auto">
      <h1 className="text-3xl font-semibold text-center">
        Enquiry Successful for {bookingDetails.hallName}
      </h1>
      <p className="text-center">
        Thank you for your enquiry! Keep an eye on your email inbox to get
        further details.
      </p>
      {bookingDetails && (
        <>
          <div className="self-center w-full max-w-[650px] px-4">
            <span className="text-3xl font-light text-gray-600">
              Hall Details
            </span>
            <div className="border-2 w-full mt-5"></div>
            <table className="mt-4 w-full text-xl">
              <tbody>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">Hall Name</td>
                  <td className="w-1/2">{bookingDetails.hallName}</td>
                </tr>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">Session Name</td>
                  <td className="w-1/2">{bookingDetails.sessionName}</td>
                </tr>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">Date</td>
                  <td className="w-1/2">{date}</td>
                </tr>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">Time</td>
                  <td className="w-1/2">
                    {from} - {to}
                  </td>
                </tr>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">Estimated Cost</td>
                  <td className="w-1/2">₹{bookingDetails.estimatedPrice}</td>
                </tr>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">
                    Additional Features
                  </td>
                  <td className="w-1/2">
                    {bookingDetails.selectedFeatures ?? "None"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="self-center w-full max-w-[650px] px-4">
            <span className="text-3xl font-light text-gray-600">
              User Details
            </span>
            <div className="border-2 w-full mt-5"></div>
            <table className="mt-4 w-full text-xl">
              <tbody>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">Name</td>
                  <td className="w-1/2">{bookingDetails.username}</td>
                </tr>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">Contact Person</td>
                  <td className="w-1/2">{bookingDetails.contact}</td>
                </tr>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">Email</td>
                  <td className="w-1/2">{bookingDetails.email}</td>
                </tr>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">Mobile Number</td>
                  <td className="w-1/2">{bookingDetails.mobile}</td>
                </tr>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">
                    Event Type (Purpose)
                  </td>
                  <td className="w-1/2">{bookingDetails.eventPurpose}</td>
                </tr>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">Current Status</td>
                  <td className="w-1/2">{bookingDetails.status}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </>
      )}
    </div>
  );
};

export default BookingSuccessful;
