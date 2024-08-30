import { MultipleBookingModel, IMultipleBooking } from "../models/multipleBooking.model";
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
export async function updateBookingsStatus(bookingIds: string[],status: string) {
  try {
    await BookingModel.updateMany(
      { _id: { $in: bookingIds } },
      { $set: { status: status} }
    );
  } catch (error) {
    throw error;
  }
}