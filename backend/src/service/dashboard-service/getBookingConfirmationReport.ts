import { BookingModel, HallBookingType } from "../../models/booking.model";
import { getHallNameById } from "../getHallName";
import { getManagerNamesByHallId } from "../getManagerName";

function parseDateTime(dateString: string) {
  const dateRegex = /(\d{4}-\d{2}-\d{2})T(\d{1,2}:\d{2}:\d{2})/;
  const matchResult = dateString.match(dateRegex);
  if (matchResult === null) {
    throw new Error("Invalid date format");
  }
  const [, datePart] = matchResult;

  const [year, month, day] = datePart.split("-");
  return { date: `${day}-${month}-${year}`, time: matchResult[2] };
}

function formatDateToDDMMYYYY(date: {
  getDate: () => any;
  getMonth: () => number;
  getFullYear: () => any;
}) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

interface BookingConfirmationReportRequest {
  displayPeriod: string;
  fromDate?: string;
  toDate?: string;
  displayHall: string;
  displayCustomerCategory: string;
  displaySession: string;
  displayHallCharges: boolean;
}

const calculateAmountPaid = (data: any): number => {
  const calculateTotalFeatureCharges = (features: any) => {
    if (Array.isArray(features)) {
      return features.reduce((acc, feature) => acc + (feature.price || 0), 0);
    }
    return 0;
  };
  const basePrice =
    (data?.price || 0) + calculateTotalFeatureCharges(data?.features);
  const discountedPrice =
    basePrice - 0.01 * (data?.baseDiscount || 0) * basePrice;
  const gst =
    data?.booking_type === "SVKM INSTITUTE" ? 0 : 0.18 * discountedPrice;
  const depositAmount = data?.isDeposit
    ? (data?.deposit || 0) -
      0.01 * (data?.depositDiscount || 0) * (data?.deposit || 0)
    : 0;
  console.log(`price1 of ${data.from}`, discountedPrice);
  console.log(`price2 of ${data.from}`, gst);
  console.log(`price3 of ${data.from}`, depositAmount);
  return discountedPrice + gst + depositAmount;
};

export async function getBookingConfirmationReport(
  params: BookingConfirmationReportRequest
) {
  try {
    let bookings: HallBookingType[] = [];
    const offsetInMilliseconds = 5.5 * 60 * 60 * 1000;
    const today = new Date();

    // Determine fromDate and toDate based on Display Period
    switch (params.displayPeriod) {
      case "Select":
        const findQuery: any = {
          date: { $gte: params.fromDate, $lte: params.toDate },
          status: "CONFIRMED",
        };
        bookings = await BookingModel.find(findQuery).exec();
        break;
      case "Today":
        const istToday = new Date(today.getTime() + offsetInMilliseconds);
        istToday.setUTCHours(0, 0, 0, 0);
        const todayDate = formatDateToDDMMYYYY(istToday);

        const findQueryToday = {
          date: todayDate,
          status: "CONFIRMED",
        };
        bookings = await BookingModel.find(findQueryToday).exec();
        break;
      case "Week":
        const istWeek = new Date(today.getTime() + offsetInMilliseconds);
        const startOfWeek = new Date(istWeek);
        startOfWeek.setUTCHours(0, 0, 0, 0);
        const endOfWeek = new Date(istWeek);
        endOfWeek.setDate(istWeek.getDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 999);

        // Format start and end of the week
        const formattedStartOfWeek = formatDateToDDMMYYYY(startOfWeek);
        const formattedEndOfWeek = formatDateToDDMMYYYY(endOfWeek);

        const findQueryThisWeek = {
          date: {
            $gte: formattedStartOfWeek,
            $lte: formattedEndOfWeek,
          },
          status: "CONFIRMED",
        };

        bookings = await BookingModel.find(findQueryThisWeek).exec();
        break;
      case "Month":
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );

        const formattedStartOfMonth = formatDateToDDMMYYYY(startOfMonth);
        const formattedEndOfMonth = formatDateToDDMMYYYY(endOfMonth);

        const findQueryThisMonth = {
          date: {
            $gte: formattedStartOfMonth,
            $lte: formattedEndOfMonth,
          },
          status: "CONFIRMED",
        };
        bookings = await BookingModel.find(findQueryThisMonth).exec();
        break;

      case "Year":
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31);

        const formattedStartOfYear = formatDateToDDMMYYYY(startOfYear);
        const formattedEndOfYear = formatDateToDDMMYYYY(endOfYear);

        const findQueryThisYear = {
          date: {
            $gte: formattedStartOfYear,
            $lte: formattedEndOfYear,
          },
          status: "CONFIRMED",
        };
        bookings = await BookingModel.find(findQueryThisYear).exec();
        break;

      case "Fin-Year":
        const currentYear = today.getFullYear();
        const fiscalYearStartMonth = 3; // April (0-indexed)

        let startOfFinYear, endOfFinYear;
        if (today.getMonth() < fiscalYearStartMonth) {
          startOfFinYear = new Date(currentYear - 1, fiscalYearStartMonth, 1);
          endOfFinYear = new Date(currentYear, fiscalYearStartMonth - 1, 31);
        } else {
          startOfFinYear = new Date(currentYear, fiscalYearStartMonth, 1);
          endOfFinYear = new Date(
            currentYear + 1,
            fiscalYearStartMonth - 1,
            31
          );
        }

        const formattedStartOfFinYear = formatDateToDDMMYYYY(startOfFinYear);
        const formattedEndOfFinYear = formatDateToDDMMYYYY(endOfFinYear);

        const findQueryThisFinYear = {
          date: {
            $gte: formattedStartOfFinYear,
            $lte: formattedEndOfFinYear,
          },
          status: "CONFIRMED",
        };
        bookings = await BookingModel.find(findQueryThisFinYear).exec();
        break;

      default:
        throw new Error("Invalid display period");
    }

    // Apply filters
    if (params.displayHall.toLowerCase() !== "all") {
      bookings = bookings.filter(
        (booking) => booking.hallId === params.displayHall
      );
    }
    if (params.displayCustomerCategory.toLowerCase() !== "all") {
      bookings = bookings.filter(
        (booking) => booking.booking_type === params.displayCustomerCategory
      );
    }
    if (params.displaySession.toLowerCase() !== "all") {
      bookings = bookings.filter(
        (booking) => booking.session_id === params.displaySession
      );
    }

    const formattedBookings = await Promise.all(
      bookings.map(async (booking) => ({
        confirmationDate: booking.date,
        eventDate: parseDateTime(booking.from).date,
        "Hall Name": await getHallNameById(booking.hallId),
        Session: booking.session_id,
        "Additional Facility": booking.features
          .map((feature) => feature.heading)
          .join(", "),
        "Manager Name": await getManagerNamesByHallId(booking.hallId),
        "Customer Category": booking.booking_type,
        "Customer Name": booking.user.username,
        "Contact Person": booking.user.contact,
        "Contact No.": booking.user.mobile,
        "Booking Amount": params.displayHallCharges
          ? booking.price
          : "Cannot Display",
        "Amount Paid": params.displayHallCharges
          ? calculateAmountPaid(booking)
          : "Cannot Display",
        transaction: booking.transaction,
      }))
    );

    return formattedBookings;
  } catch (error) {
    console.error("Error fetching report data:", error);
    throw error;
  }
}
