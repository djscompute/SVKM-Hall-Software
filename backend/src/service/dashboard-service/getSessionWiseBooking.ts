import { BookingModel } from "../../models/booking.model";
import { HallModel } from "../../models/hall.model";
import { getSessionName } from "../getSessionName";

interface SessionWiseBooking {
    session_id: string;
    sessionName: string,
    bookingCount: number;
    hallName: string;
}

async function calculateSessionWiseBookings(hallId: string, fromDate: Date, toDate: Date, hallName: string){
    const bookings = await BookingModel.find({
        hallId,
        from: { $gte: fromDate },
        to: { $lte: toDate },
        status: "CONFIRMED",
    }).exec();

    const sessionWiseBookingsMap = new Map<string, number>();
    bookings.forEach((booking) => {
        const session_id = booking.session_id;
        sessionWiseBookingsMap.set(session_id, (sessionWiseBookingsMap.get(session_id) || 0) + 1);
    });

    const sessionWiseBookings: SessionWiseBooking[] = [];
    for (const [session_id, bookingCount] of sessionWiseBookingsMap.entries()) {
        const sessionName = await getSessionName(session_id);
        if (sessionName) {
            sessionWiseBookings.push({ session_id, sessionName, bookingCount, hallName });
        }
    }

    return sessionWiseBookings;
}

export async function getSessionWiseBooking(fromDate: Date, toDate: Date, hallName: string){
    try {
        if (hallName.toLowerCase() === "all") {
            const halls = await HallModel.find().exec();
            const sessionWiseBookings: SessionWiseBooking[] = [];
            for (const hall of halls) {
                const hallBookings = await calculateSessionWiseBookings(hall._id, fromDate, toDate, hall.name);
                sessionWiseBookings.push(...hallBookings);
            }
            return sessionWiseBookings;
        } else {
            const hall = await HallModel.findOne({ name: hallName }).exec();
            if (!hall) {
                throw new Error("Hall not found");
            }
            return calculateSessionWiseBookings(hall._id, fromDate, toDate, hall.name);
        }
    } catch (error) {
        console.error("Error fetching session-wise booking information:", error);
        throw error;
    }
}
