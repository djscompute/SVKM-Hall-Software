import { BookingModel, HallBookingType } from "../../models/booking.model";
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

export async function getAdditionalFeatureReport(fromDate: Date, toDate: Date, hallName: string, additionalFeatures: string[]) {
    try {
        if (!Array.isArray(additionalFeatures)) {
            throw new Error("additionalFeatures must be an array");
        }
        const hall = await HallModel.findOne({ name: hallName }).exec();
        if (!hall) {
            throw new Error("Hall not found");
        }
        const bookings = await BookingModel.find({
            hallId: hall._id,
            from: { $gte: fromDate },
            to: { $lte: toDate },
            status: "CONFIRMED",
            "features.heading": { $in: additionalFeatures }
        }).populate("session_id").exec();

        const formattedBookings = await Promise.all(bookings.map(async booking => ({
            "Date":parseDateTime(booking.from).date,
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
        return formattedBookings;
    } catch (error) {
        console.error("Error fetching report data:", error);
        throw error;
    }
}