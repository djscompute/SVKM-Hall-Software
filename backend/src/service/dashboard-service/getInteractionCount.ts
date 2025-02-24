import { BookingModel } from "../../models/booking.model";
import { HallModel } from "../../models/hall.model";

interface InteractionCount {
    hallName: string;
    bookingCount: number;
}

export async function getInteractionCount(fromDate: Date, toDate: Date){
    try {
        const halls = await HallModel.find().exec();
        const hallSessionsCount: InteractionCount[] = [];

        for (const hall of halls) {
            const bookings = await BookingModel.find({
                hallId: hall._id,
                from: { $gte: fromDate },
                to: { $lte: toDate }
            }).exec();
            const bookingCount = bookings.length;
            hallSessionsCount.push({ hallName: hall.name, bookingCount });
        }
        return hallSessionsCount;
    } catch (error) {
        console.error("Error fetching hall sessions count:", error);
        throw error;
    }
}