import { BookingModel, HallBookingType } from "../../models/booking.model";
import { HallModel } from "../../models/hall.model";
import  ConstantsModel from "../../models/constants.model";
import { getManagerNamesByHallId } from "../getManagerName";
import { getSessionName } from "../getSessionName";

export async function getAllConstants() {
  try {
    const constants = await ConstantsModel.find({
      constantName: { $regex: /^(CGST|SGST)Rate$/, $options: "i" }
    }).lean();

    const rates: Record<string, number> = {};
    constants.forEach(constant => {
      const key = constant.constantName.toLowerCase();
      rates[key] = constant.value;
    });
    return rates;
  } catch (error: any) {
    console.error("Error fetching constants:", error);
    return { error: 'Internal server error' };
  }
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

let gst: number;

const calculateAmountPaid = async (data: any): Promise<number> => {
  const basePrice = data?.price || 0;
  const discountedPrice = basePrice - 0.01 * (data?.baseDiscount || 0) * basePrice;

  const rates = await getAllConstants();

  let cgstRate = 0;
  let sgstRate = 0;

  if ('cgstrate' in rates && 'sgstrate' in rates) {
    cgstRate = rates['cgstrate'];
    sgstRate = rates['sgstrate'];
  }

  if (data?.booking_type === "SVKM INSTITUTE") {
    gst = 0;
  } else {
    gst = (cgstRate + sgstRate) / 100 * discountedPrice;
  }

  const depositAmount = data?.isDeposit
    ? (data?.deposit || 0) - 0.01 * (data?.depositDiscount || 0) * (data?.deposit || 0)
    : 0;

  return discountedPrice + gst + depositAmount;
};


export async function getAdditionalFeatureReport(
  fromDate: Date,
  toDate: Date,
  hallName: string,
  additionalFeatures: string[]
) {
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
      "features.heading": { $in: additionalFeatures },
    })
      .populate("session_id")
      .exec();

    const formattedBookings = await Promise.all(
      bookings.map(async (booking) => ({
        bookingDate: formatDateToDDMMYYYY(booking.createdAt),
        confirmationDate: booking.date,
        eventDate: formatDateToDDMMYYYY(new Date(parseDateTime(booking.from).date)),
        From: parseDateTime(booking.from).time,
        To: parseDateTime(booking.to).time,
        "Hall Name": hall.name,
        Session: await getSessionName(booking.session_id),
        "Manager Name": await getManagerNamesByHallId(booking.hallId),
        "Remark": booking.user.remark,
        "Customer Category": booking.booking_type,
        "Customer Name": booking.user.username,
        "Contact Person": booking.user.contact,
        "Contact Details": booking.user.mobile,
        "Booking Amount": booking.price,
        "Amount Paid": await calculateAmountPaid(booking),
        "Security Deposit": booking.deposit,
        GST: gst,
        transaction: booking.transaction,
        "Additional Facility": booking.features
          .map((feature) => feature.heading)
          .join(", "),
        "Description":booking.features.map((feature) => feature.desc).join(", "),
      }))
    );
    return formattedBookings;
  } catch (error) {
    console.error("Error fetching report data:", error);
    throw error;
  }
}
