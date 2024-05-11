import { BookingModel } from "../../models/booking.model";
import { HallModel } from "../../models/hall.model";

const monthOrder: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
};

interface MonthlyCollectionDetails {
    month: string;
    year: number;
    collection: number;
}

export async function getMonthwiseCollectionDetails(fromDate: string, toDate: string, hallName: string | null) {
    try {
        const fromDateMonth = parseInt(fromDate.substring(5, 7));
        const toDateMonth = parseInt(toDate.substring(5, 7));
        const fromDateYear = parseInt(fromDate.substring(0, 4));
        const toDateYear = parseInt(toDate.substring(0, 4));

        const monthlyCollectionDetails: MonthlyCollectionDetails[] = [];
        for (let year = fromDateYear; year <= toDateYear; year++) {
            const startDate = (year === fromDateYear) ? fromDateMonth - 1 : 0;
            const endDate = (year === toDateYear) ? toDateMonth - 1 : 11;

            const fromDateObj = new Date(year, startDate).toISOString();
            const toDateObj = new Date(year, endDate, 31, 23, 59, 59).toISOString();

            const filter: any = {
                from: { $gte: fromDateObj },
                to: { $lte: toDateObj },
                status: "CONFIRMED",
            };

            if (hallName && hallName.toLowerCase() !== "all") {
                const hall = await HallModel.findOne({ name: hallName }).exec();
                if (!hall) {
                    throw new Error("Hall not found");
                }
                filter.hallId = hall._id.toString();
            }

            const bookings = await BookingModel.find(filter).exec();
            const monthlyCollectionMap = new Map<string, number>();
            for (let month = startDate; month <= endDate; month++) {
                const monthName = new Date(year, month).toLocaleString('default', { month: 'short' }).toLowerCase();
                monthlyCollectionMap.set(monthName, 0);
            }
            for (const booking of bookings) {
                const bookingDate = new Date(booking.from);
                const monthName = bookingDate.toLocaleString('default', { month: 'short' }).toLowerCase();
                if (monthlyCollectionMap.has(monthName)) {
                    monthlyCollectionMap.set(monthName, (monthlyCollectionMap.get(monthName) || 0) + booking.price);
                }
            }
            monthlyCollectionMap.forEach((collection, month) => {
                monthlyCollectionDetails.push({ month, year, collection });
            });
        }
        monthlyCollectionDetails.sort((a, b) => {
            const yearDiff = a.year - b.year;
            if (yearDiff !== 0) {
                return yearDiff;
            }
            return monthOrder[a.month] - monthOrder[b.month];
        });

        return monthlyCollectionDetails;
    } catch (error) {
        console.error("Error fetching monthly collection details:", error);
        throw error;
    }
}