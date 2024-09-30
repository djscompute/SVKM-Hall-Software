import { useLocation } from "react-router-dom";
import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat";
import { EachHallAdditonalFeaturesType } from "../types/Hall.types";

const BookingSuccessful = () => {
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;

  const extractTime = (dateTimeString: string) => {
    return dateTimeString.split("T")[1].split(".")[0];
  };

  const extractDate = (dateTimeString: string) => {
    const dateParts = dateTimeString.split("T")[0].split("-");
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Rearranged to DD-MM-YYYY
  };

  // const convert_IST_TimeString_To12HourFormat = (timeString: string) => {
  //   const [hours, minutes, seconds] = timeString.split(":");
  //   const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
  //   const formattedHours = ((parseInt(hours) % 12) || 12).toString().padStart(2, '0');
  //   return `${formattedHours}:${minutes}:${seconds} ${period}`;
  // };

  const from = convert_IST_TimeString_To12HourFormat(
    extractTime(bookingDetails.startTime)
  );
  const to = convert_IST_TimeString_To12HourFormat(
    extractTime(bookingDetails.endTime)
  );
  const date = extractDate(bookingDetails.startTime);

  const calculateAdditionalFeaturesTotal = (additionalFeatures: any) => {
    if (!additionalFeatures) return 0;
    return Object.values(additionalFeatures).reduce(
      (total: number, feature: any) => total + (feature.price || 0),
      0
    );
  };

  const additionalFeaturesTotal = calculateAdditionalFeaturesTotal(
    bookingDetails.additionalFeatures
  );
  let hallBaseCharges: number;
  if (bookingDetails.paymentType === "SVKM INSTITUTE") {
    hallBaseCharges = bookingDetails.estimatedPrice;
  } else {
    hallBaseCharges = bookingDetails.estimatedPrice - additionalFeaturesTotal;
  }

  console.log("HEREEE", bookingDetails);

  return (
    <div className="flex flex-col py-4 gap-6 md:w-2/3 lg:w-1/2 mx-auto">
      <h1 className="text-lg sm:text-3xl font-semibold text-center">
        Enquiry Successful for {bookingDetails.hallName}
      </h1>
      <p className="text-center">
        Thank you for your enquiry! For further details please check your inbox.
      </p>
      {bookingDetails && (
        <>
          <div className="self-center w-full max-w-[650px] px-4">
            <span className=" text-lg sm:text-3xl font-light text-gray-600">
              Hall Details
            </span>
            <div className="border-2 w-full mt-5"></div>
            <table className="mt-4 w-full text-sm sm:text-md md:text-xl">
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
                  <td className="font-medium py-2 w-1/2">Hall Charges</td>
                  <td className="w-1/2">₹{hallBaseCharges}</td>
                </tr>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">
                    Additional Facilities
                  </td>
                  <td className="w-1/2">
                    {bookingDetails.additionalFeatures
                      ? Object.values(bookingDetails.additionalFeatures)?.map(
                          (each: any) => (
                            <div className="flex flex-col items-start gap-2">
                              <span>{each.heading} </span>
                              <span>
                                Charge: ₹
                                {bookingDetails.paymentType === "SVKM INSTITUTE"
                                  ? 0
                                  : each.price}
                              </span>
                            </div>
                          )
                        )
                      : "None"}
                  </td>
                </tr>
                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">Security Deposit</td>
                  <td className="w-1/2">₹{bookingDetails.securityDeposit}</td>
                </tr>

                <tr className="border-b-2">
                  <td className="font-medium py-2 w-1/2">Total Payable</td>
                  {bookingDetails.paymentType == "SVKM INSTITUTE" ? (
                    <td className="w-1/2">
                      ₹{hallBaseCharges + bookingDetails.securityDeposit}{" "}
                    </td>
                  ) : (
                    <td className="w-1/2">
                      ₹{hallBaseCharges + additionalFeaturesTotal} + GST (if
                      applicable) +{bookingDetails.securityDeposit}
                    </td>
                  )}
                </tr>
                <tr>
                  <p className=" text-sm font-bold pt-1 text-red-400">
                    *GST is applicable as per prevailing rates.
                  </p>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="self-center w-full max-w-[650px] px-4">
            <span className="text-lg sm:text-3xl font-light text-gray-600">
              User Details
            </span>
            <div className="border-2 w-full mt-5"></div>
            <table className="mt-4 w-full text-sm sm:text-md md:text-xl">
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
