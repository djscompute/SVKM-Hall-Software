import { Request, Response } from "express";
import * as multipleBookingService from "../service/multipleBooking";
import { IMultipleBooking } from "../models/multipleBooking.model";

export async function addMultipleBookingHandler(req: Request, res: Response) {
  try {
    const bookingData: IMultipleBooking = req.body;
    const newBooking = await multipleBookingService.createMultipleBooking(bookingData);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: "Failed to create multiple booking" });
  }
}

export async function getMultipleBookingHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const booking = await multipleBookingService.getMultipleBookingById(id);
    res.status(200).json(booking);
  } catch (error) {
    res.status(404).json({ message: "Multiple booking not found" });
  }
}

export async function checkBookingInMultipleHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
      const multipleBooking = await multipleBookingService.checkBookingInMultiple(id);
      
      if (multipleBooking) {
        res.status(200).json({ exists: true, multipleBooking });
      } else {
        res.status(404).json({ exists: false, message: "Booking not found in any MultipleBooking" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to check booking" });
    }
  }
