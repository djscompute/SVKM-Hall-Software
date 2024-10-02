import { BookingModel } from "../../models/booking.model";
import { HallModel } from "../../models/hall.model";

interface HallSessionsCount {
    hallName: string;
    bookingCount: number;
}

export async function getHallBookingsCount(fromDate: Date, toDate: Date){
    try {
        const halls = await HallModel.find().exec();
        const hallSessionsCount: HallSessionsCount[] = [];

        for (const hall of halls) {
            const bookings = await BookingModel.find({
                hallId: hall._id,
                from: { $gte: fromDate },
                to: { $lte: toDate },
                status: "CONFIRMED", 
            }).exec();

            const bookingCount = bookings.length;
            hallSessionsCount.push({ hallName: hall.name, bookingCount });
        }
        return hallSessionsCount;
    } catch (error) {
        console.error("Error fetching hall sessions count:", error);
        throw new Error("Failed to fetch hall sessions count");
    }
}
