import { BookingModel, HallBookingType } from "../../models/booking.model";
import { getHallNameById } from "../getHallName";
import { getManagerNamesByHallId } from "../getManagerName";

interface BookingInformationReportRequest {
    displayPeriod: string;
    fromDate?: string;
    toDate?: string;
    displayHall: string;
    displayCustomerCategory: string;
    displaySession: string;
    displayHallCharges: boolean;
}

function parseDateTime(dateString: string) {
    const dateRegex = /(\d{4}-\d{2}-\d{2})T(\d{1,2}:\d{2}:\d{2})/;
    const matchResult = dateString.match(dateRegex);
    if (matchResult === null) {
        throw new Error("Invalid date format");
    }
    const [, datePart, timePart] = matchResult;
    return { date: datePart, time: timePart };
}

const calculateAmountPaid = (data: any): number => {
    const price = data?.price || 0;
    const discount = data?.discount || 0;
    const deposit = data?.deposit || 0;

    return Math.round(price - 0.01 * discount * price + 0.18 * (price - 0.01 * discount * price) + deposit);
};

export async function getBookingInformationReport(params: BookingInformationReportRequest) {
    try {
        let fromDate: Date | undefined;
        let toDate: Date | undefined;
        let bookings: HallBookingType[] = [];[] = [];
        const offsetInMilliseconds = 5.5 * 60 * 60 * 1000;
        const today = new Date();

        // Determine fromDate and toDate based on Display Period
        switch (params.displayPeriod) {
            case "Select":
                const findQuery: any = {
                    from: { $gte: params.fromDate },
                    to: { $lte: params.toDate },
                    status: "CONFIRMED"
                };
                const bookingsInRange = await BookingModel.find(findQuery).exec();
                bookings.push(...bookingsInRange);
                break;
            case "Today":
                const istToday = new Date(today.getTime() + offsetInMilliseconds);

                // Start of the day in IST
                istToday.setUTCHours(0, 0, 0, 0);
                const startOfDay = istToday.toISOString();

                // End of the day in IST
                istToday.setUTCHours(23, 59, 59, 999);
                const endOfDay = istToday.toISOString();

                const findQueryToday = {
                    from: { $gte: startOfDay },
                    to: { $lte: endOfDay },
                    status: "CONFIRMED"
                };
                const bookingsToday = await BookingModel.find(findQueryToday).exec();
                bookings.push(...bookingsToday);
                break;
            case "Tomorrow":
                const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000); // Add 1 day to today's date

                // Convert to IST
                const istTomorrow = new Date(tomorrow.getTime() + offsetInMilliseconds);

                // Start of the day in IST
                istTomorrow.setUTCHours(0, 0, 0, 0);
                const startOfTomorrow = istTomorrow.toISOString();

                // End of the day in IST
                istTomorrow.setUTCHours(23, 59, 59, 999);
                const endOfTomorrow = istTomorrow.toISOString();

                const findQueryTomorrow = {
                    from: { $gte: startOfTomorrow },
                    to: { $lte: endOfTomorrow },
                    status: "CONFIRMED"
                };
                const bookingsTomorrow = await BookingModel.find(findQueryTomorrow).exec();
                bookings.push(...bookingsTomorrow);
                break;
            case "This week":
                const istWeek = new Date(today.getTime() + offsetInMilliseconds);

                // Start of today in IST
                const startOfToday = new Date(istWeek);
                startOfToday.setUTCHours(0, 0, 0, 0);
                const startOfWeek = startOfToday.toISOString();

                // End of the week (7 days from today)
                const endOfThisWeek = new Date(istWeek);
                endOfThisWeek.setDate(istWeek.getDate() + 6); // Add 6 days to get the end of the week
                endOfThisWeek.setUTCHours(23, 59, 59, 999);
                const endOfWeek = endOfThisWeek.toISOString();

                const findQueryThisWeek = {
                    from: { $gte: startOfWeek },
                    to: { $lte: endOfWeek },
                    status: "CONFIRMED"
                };
                const bookingsThisWeek = await BookingModel.find(findQueryThisWeek).exec();
                bookings.push(...bookingsThisWeek);
                break;
            case "Month":
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString();

                const findQueryThisMonth = {
                    from: { $gte: startOfMonth },
                    to: { $lte: endOfMonth },
                    status: "CONFIRMED"
                };
                const bookingsThisMonth = await BookingModel.find(findQueryThisMonth).exec();
                bookings.push(...bookingsThisMonth);
                break;
            case "Year":
                const startOfYear = new Date(today.getFullYear(), 0, 1).toISOString();
                const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59).toISOString();

                const findQueryThisYear = {
                    from: { $gte: startOfYear },
                    to: { $lte: endOfYear },
                    status: "CONFIRMED"
                };
                const bookingsThisYear = await BookingModel.find(findQueryThisYear).exec();
                bookings.push(...bookingsThisYear);
                break;
            default:
                throw new Error("Invalid display period");
        }

        if (params.displayHall.toLowerCase() !== "all") {
            bookings = bookings.filter(booking => booking.hallId === params.displayHall);
        }
        if (params.displayCustomerCategory.toLowerCase() != "all") {
            bookings = bookings.filter(booking => booking.booking_type === params.displayCustomerCategory)
        }
        if (params.displaySession.toLowerCase() != "all") {
            bookings = bookings.filter(booking => booking.session_id === params.displaySession)
        }
        const formattedBookings = await Promise.all(bookings.map(async booking => ({
            "Date": parseDateTime(booking.from).date,
            "Hall Name": await getHallNameById(booking.hallId),
            "Session": booking.session_id,
            "Additional Facility": booking.features.map(feature => feature.heading).join(", "),
            "Manager Name": await getManagerNamesByHallId(booking.hallId),
            "Customer Category": booking.booking_type,
            "Customer Name": booking.user.username,
            "Contact Person": booking.user.contact,
            "Contact No.": booking.user.mobile,
            "Booking Amount": params.displayHallCharges ? booking.price : "Cannot Display",
            "Amount Paid": params.displayHallCharges ? calculateAmountPaid(booking) : "Cannot Display"
        })));

        return formattedBookings;
    } catch (error) {
        console.error("Error fetching report data:", error);
        throw error;
    }
}