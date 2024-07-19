import { useLocation } from "react-router-dom";
import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat";

const BookingSuccessful = () => {
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;
  const extractTime = (dateTimeString: string) => {
    return dateTimeString.split("T")[1].split(".")[0];
  };
  const extractDate = (dateTimeString: string): string => {
    // for date format (DD. MM. YYYY)
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };
  const from = convert_IST_TimeString_To12HourFormat(
    extractTime(bookingDetails.startTime)
  );
  const to = convert_IST_TimeString_To12HourFormat(
    extractTime(bookingDetails.endTime)
  );
  const date = extractDate(bookingDetails.startTime);
  
  // Total price of all additional features
  const calculateAdditionalFeaturesTotal = (additionalFeatures: any) => {
    if (!additionalFeatures) return 0;
    return Object.values(additionalFeatures).reduce((total: number, feature: any) => total + (feature.price || 0), 0);
  };

  const additionalFeaturesTotal = calculateAdditionalFeaturesTotal(bookingDetails.additionalFeatures);
  const hallBaseCharges = bookingDetails.estimatedPrice-additionalFeaturesTotal

  const totalPayable = hallBaseCharges + bookingDetails.securityDeposit + additionalFeaturesTotal;


  console.log("HEREEE", bookingDetails.additionalFeatures);

  return (
    <div className="flex flex-col py-4 gap-6 md:w-2/3 lg:w-1/2 mx-auto">
      <h1 className="text-lg sm:text-3xl font-semibold text-center">
        Enquiry Successful for {bookingDetails.hallName}
      </h1>
      <p className="text-center">
        Thank you for your enquiry! For further details please check your inbox
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
                              <span>Charge: ₹{each.price}</span>
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
                  <td className="w-1/2">₹ {totalPayable} + GST (if applicable)</td>
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
