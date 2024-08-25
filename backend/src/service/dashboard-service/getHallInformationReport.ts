import { BookingModel } from "../../models/booking.model";
import { HallModel } from "../../models/hall.model";
import { getManagerNamesByHallId } from "../getManagerName";
import { getSessionName } from "../getSessionName";

function parseDateTime(dateString: string) {
    const dateRegex = /(\d{4}-\d{2}-\d{2})T(\d{1,2}:\d{2}:\d{2})/;
    const matchResult = dateString.match(dateRegex);
    if (matchResult === null) {
        throw new Error("Invalid date format");
    }
    const [, datePart, timePart] = matchResult;
    return { date: datePart, time: timePart };
}

export async function getHallReport(fromDate: Date, toDate: Date, hallName: string) {
    try {
        // Fetch hall details by name
        const hall = await HallModel.findOne({ name: hallName }).exec();
        if (!hall) {
            throw new Error("Hall not found");
        }

        // Fetch all confirmed bookings for the selected hall within the specified date range
        const bookings = await BookingModel.find({
            hallId: hall._id,
            from: { $gte: fromDate },
            to: { $lte: toDate },
            status: "CONFIRMED"
        }).populate("session_id").exec();

        // Format the bookings data
        const formattedBookings = await Promise.all(bookings.map(async booking => ({
            "Date": parseDateTime(booking.from).date,
            "From": parseDateTime(booking.from).time,
            "To": parseDateTime(booking.to).time,
            "Hall Name": hall.name,
            "Session": await getSessionName(booking.session_id),
            "Additional Facility Name": booking.features.length > 0 ? booking.features[0].heading : "N/A",
            "Manager Name": await getManagerNamesByHallId(booking.hallId),
            "Customer Category": booking.booking_type,
            "Customer Name": booking.user.username,
            "Contact Person": booking.user.contact,
            "Contact Details": booking.user.mobile
        })));

        // Return all hall details including bookings
        return {
            "Hall Name": hall.name,
            "Location": hall.location,
            "About": hall.about,
            "Capacity": hall.capacity,
            "Additional Features": hall.additionalFeatures,
            "Images": hall.images,
            "Sessions": hall.sessions,
            "Event Restrictions": hall.eventRestrictions,
            "Security Deposit": hall.securityDeposit,
            "Bookings": formattedBookings
        };
    } catch (error) {
        console.error("Error fetching hall report data:", error);
        throw error;
    }
}
