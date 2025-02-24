import { MultipleBookingModel, IMultipleBooking, ITransaction } from "../models/multipleBooking.model";
import { BookingModel } from "../models/booking.model";

export async function createMultipleBooking(bookingData: IMultipleBooking) {
  try {
    const newMultipleBooking = new MultipleBookingModel(bookingData);
    await newMultipleBooking.save();
    return newMultipleBooking;
  } catch (error) {
    throw error;
  }
}

export async function getMultipleBookingById(id: string) {
  try {
    const booking = await MultipleBookingModel.findById(id);
    if (!booking) {
      throw new Error('Multiple booking not found');
    }
    return booking;
  } catch (error) {
    throw error;
  }
}

export async function checkBookingInMultiple(id: string): Promise<IMultipleBooking | null> {
  try {
    const multipleBooking = await MultipleBookingModel.findOne({ booking_ids: id });
    return multipleBooking;
  } catch (error) {
    throw error;
  }
}

// Function to update the booking statuses of all the bookings 
export async function updateBookingsStatus(bookingIds: string[],status: string,transaction:ITransaction) {
  try {
    await BookingModel.updateMany(
      { _id: { $in: bookingIds } },
      { $set: { status: status,transaction:transaction} }
    );
  } catch (error) {
    throw error;
  }
}

// Function to remove booking from multiple booking and reduce total payable
export async function removeBookingFromMultiple(id: string, totalPayable: number) {
  try {
    // remove booking from multiple booking
    const multipleBooking = await MultipleBookingModel.findOneAndUpdate(
      { booking_ids: id },
      { $pull: { booking_ids: id } },
      { new: true }
    );
    // If booking is not found in any multiple booking
    if (!multipleBooking) {
      return null;
    }
    // reduce total payable
    await MultipleBookingModel.updateOne(
      { _id: multipleBooking._id },
      { $inc: { totalPayable: -totalPayable } }
    );
    return multipleBooking;
  } catch (error) {
    throw error;
  }
}