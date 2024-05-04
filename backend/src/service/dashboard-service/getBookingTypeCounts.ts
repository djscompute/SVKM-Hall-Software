import { BookingModel } from "../../models/booking.model";
import { HallModel } from "../../models/hall.model";

interface BookingCounts {
    hallName: string;
    bookingTypes: { type: string; count: number }[];
}

export async function getBookingTypeCounts(fromDate: Date, toDate: Date, hallName: string){
    try {
        let hallIds: string[] = [];
        if (hallName.toLowerCase() === "all") {
            const halls = await HallModel.find().exec();
            hallIds = halls.map(hall => hall._id.toString());
        } else {
            const hall = await HallModel.findOne({ name: hallName }).exec();
            if (!hall) {
                throw new Error("Hall not found");
            }
            hallIds.push(hall._id.toString());
        }
        const bookingCounts: BookingCounts[] = [];
        for (const hallId of hallIds) {
            const hall = await HallModel.findById(hallId).exec();
            if (!hall) {
                throw new Error("Hall not found");
            }
            const bookings = await BookingModel.find({
                hallId,
                from: { $gte: fromDate },
                to: { $lte: toDate },
                status: "CONFIRMED",
            }).exec();

            // Group bookings by booking type and calculate count for each type
            const bookingTypeMap = new Map<string, number>();
            bookings.forEach(booking => {
                const bookingType = booking.booking_type;
                if (bookingTypeMap.has(bookingType)) {
                    bookingTypeMap.set(bookingType, bookingTypeMap.get(bookingType)! + 1);
                } else {
                    bookingTypeMap.set(bookingType, 1);
                }
            });
            const bookingTypes: { type: string; count: number }[] = [];
            bookingTypeMap.forEach((count, type) => {
                bookingTypes.push({ type, count });
            });
            bookingCounts.push({ hallName: hall.name, bookingTypes });
        }

        return bookingCounts;
    } catch (error) {
        console.error("Error fetching booking type counts:", error);
        throw error;
    }
}