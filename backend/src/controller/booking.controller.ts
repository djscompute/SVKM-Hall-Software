import { Request, Response } from "express";
import { BookingModel, HallBookingType } from "../models/booking.model";
import { getSessionZodSchema } from "../schema/booking.schema";

export async function addBookingHandler(req: Request, res: Response) {
  try {
    const {
      user,
      features,
      status,
      price,
      hallId,
      session_id,
      from,
      to,
      time
    } = req.body as HallBookingType;

    const newBooking = new BookingModel({
      user,
      features,
      status,
      price,
      hallId,
      session_id,
      from,
      to,
      time
    });
    await newBooking.save();

    return res.status(200).json(newBooking);
  } catch (error: any) {
    res.status(400).json({ name: error.name, message: error.message });
  }
}

//Handler to get Session details during a range including user info
export async function getSessionHandler(req: Request, res: Response) {
  try {
    const { from, to } = req.query;
    const bookings = await BookingModel.find({ from: { $gte: from }, to: { $lte: to } });
    if (bookings.length === 0) {
      return res.status(200).json({ message: "No bookings found for the specified range." });
    }
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getSessionHandler:", error);
    res.status(500).json({  message: "Internal server error", error:error});
  }
}

//Handler to get session details during a range excluding the user info
export async function getSessionHandlerWithoutUser(req: Request, res: Response) {
  try {
    const { from, to } = req.query;
    const bookings = await BookingModel.find({ from: { $gte: from }, to: { $lte: to } });
    if (bookings.length === 0) {
      return res.status(200).json({ message: "No bookings found for the specified range." });
    }
    // Remove the user object from the response
    const bookingsWithoutUser = bookings.map(booking => {
      const { user, ...bookingWithoutUser } = booking.toObject();
      return bookingWithoutUser;
    });

    return res.status(200).json(bookingsWithoutUser);
  } catch (error) {
    console.error("Error in getSessionHandlerWithUserRemoved:", error);
    res.status(500).json({ message: "Internal server error", error:error});
  }
}

//Handler to get session by ID
export async function getSessionByIdHandler(req: Request, res: Response) {
  try {
    const { _id } = req.query;
    const booking = await BookingModel.findById(_id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error("Error in getSessionByIdHandler:", error);
    res.status(500).json({ message: "Internal server error", error:error});
  }
}
