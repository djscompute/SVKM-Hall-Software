import { Request, Response } from "express";
import { BookingModel, HallBookingType } from "../models/booking.model";

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
