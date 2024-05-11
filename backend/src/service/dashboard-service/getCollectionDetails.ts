import { BookingModel } from "../../models/booking.model";
import { HallModel } from "../../models/hall.model";

interface CollectionDetails {
    hallName: string;
    collection: number;
}

export async function getCollectionDetails(fromDate: Date, toDate: Date, hallName: string | null) {
    try {
        let filter: any = {
            from: { $gte: fromDate },
            to: { $lte: toDate },
            status: "CONFIRMED",
        };
        if (hallName && hallName.toLowerCase() !== "all") {
            const hall = await HallModel.findOne({ name: hallName }).exec();
            if (!hall) {
                throw new Error("Hall not found");
            }
            filter.hallId = hall._id.toString();
        }
        const hallsQuery = hallName && hallName.toLowerCase() === "all" ? HallModel.find() : HallModel.find({ name: hallName });
        const halls = await hallsQuery.exec();
        const collectionMap = new Map<string, number>();

        for (const hall of halls) {
            const hallId = hall._id.toString();
            const bookings = await BookingModel.find({
                hallId,
                from: { $gte: fromDate },
                to: { $lte: toDate },
                status: "CONFIRMED",
            }).exec();

            let totalCollection = 0;
            for (const booking of bookings) {
                totalCollection += booking.price;
            }
            collectionMap.set(hall.name, totalCollection);
        }

        const collectionDetails: CollectionDetails[] = [];
        collectionMap.forEach((collection, hallName) => {
            collectionDetails.push({ hallName, collection });
        });
        return collectionDetails;
    } catch (error) {
        console.error("Error fetching collection details:", error);
        throw error;
    }
}
