import { Request, Response } from "express";
import { BookingModel, HallBookingType } from "../models/booking.model";
import { getBookingZodSchema } from "../schema/booking.schema";
import { sendEmail } from "../utils/email";
import { generateConfirmation } from "../utils/confirmation";
import { generateInquiry } from "../utils/inquiry";


export async function addBookingHandler(req: Request, res: Response) {
  try {
    const {
      user,
      features,
      status,
      price,
      transaction,
      baseDiscount,
      deposit,
      isDeposit,
      depositDiscount,
      hallId,
      session_id,
      booking_type,
      from,
      to,
      time,
      purpose,
      enquiryNumber
    } = req.body as HallBookingType;

    if (from >= to) {
      return res.status(400).json({
        message: "'from' time must be less than 'to' time.",
      });
    }

    // Check for existing bookings within the specified time range
    const existingBookings = await BookingModel.find({
      hallId,
      $or: [
        { $and: [{ from: { $lte: from } }, { to: { $gte: from } }] }, // Overlapping at the start
        { $and: [{ from: { $lte: to } }, { to: { $gte: to } }] }, // Overlapping at the end
        { $and: [{ from: { $gte: from } }, { to: { $lte: to } }] }, // Fully contained within the range
      ],
    });

    // Check for overlapping time slots with non-empty or non-enquiry statuses
    const overlappingBooking = existingBookings.find(
      (booking) => booking.status == "CONFIRMED"
    );

    if (overlappingBooking) {
      return res.status(400).json({
        message: "Booking cannot be added due to overlapping time slot.",
      });
    }

    const newBooking = new BookingModel({
      user,
      features,
      status,
      price,
      transaction,
      baseDiscount,
      deposit,
      isDeposit,
      depositDiscount,
      hallId,
      session_id,
      booking_type,
      from,
      to,
      time,
      purpose,
      enquiryNumber
    });
    await newBooking.save();
    console.log("added new booking");
    return res.status(200).json(newBooking);
  } catch (error: any) {
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function editBookingHandler(req: Request, res: Response) {
  try {
    const {
      date,
      user,
      features,
      status,
      price,
      transaction,
      baseDiscount,
      deposit,
      isDeposit,
      depositDiscount,
      hallId,
      session_id,
      booking_type,
      from,
      to,
      time,
      purpose,
      cancellationReason,
      enquiryNumber,
      managerEmail,
      managerName
    } = req.body as HallBookingType; // Ensure this matches your schema type

    const bookingId: string = req.params.id;

    const updatedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      {
        date,
        user,
        features,
        status,
        price,
        transaction,
        baseDiscount,
        deposit,
        isDeposit,
        depositDiscount,
        hallId,
        session_id,
        booking_type,
        from,
        to,
        time,
        purpose,
        cancellationReason,
        enquiryNumber,
        managerEmail,
        managerName,
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .send({ name: "Booking Not Found", message: "Booking not found" });
    }

    return res.status(200).json(updatedBooking);
  } catch (error: any) {
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function removeBookingHandler(req: Request, res: Response) {
  try {
    const bookingId: string = req.params.id;

    const removedBooking = await BookingModel.findByIdAndDelete(bookingId);
    if (!removedBooking) {
      return res.status(404).send("Booking not found");
    }

    return res.status(200).json(removedBooking);
  } catch (error: any) {
    res.status(400).json({ name: error.name, message: error.message });
  }
}

//Handler to get Session details during a range including user info
export async function getBookingHandler(req: Request, res: Response) {
  try {
    const { from, to, hallId } = req.query;
    const bookings = await BookingModel.find({
      hallId: hallId,
      from: { $gte: from },
      to: { $lte: to },
    });
    if (bookings.length === 0) {
      return res
        .status(200)
        .json({ message: "No bookings found for the specified range." });
    }
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getSessionHandler:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

//Handler to get session details during a range excluding the user info
export async function getBookingHandlerWithoutUser(
  req: Request,
  res: Response
) {
  try {
    const { from, to } = req.query;
    const bookings = await BookingModel.find({
      from: { $gte: from },
      to: { $lte: to },
    });
    if (bookings.length === 0) {
      return res
        .status(200)
        .json({ message: "No bookings found for the specified range." });
    }
    // Remove the user object from the response
    const bookingsWithoutUser = bookings.map((booking) => {
      const { user, ...bookingWithoutUser } = booking.toObject();
      return bookingWithoutUser;
    });

    return res.status(200).json(bookingsWithoutUser);
  } catch (error) {
    console.error("Error in getSessionHandlerWithUserRemoved:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

//Handler to get session by ID
export async function getBookingByIdHandler(req: Request, res: Response) {
  try {
    const { _id } = req.query;
    const booking = await BookingModel.findById(_id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error("Error in getSessionByIdHandler:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function generateInquiryHandler(req: Request, res: Response) {
  try {
    const { 
      date, 
      customerName, 
      contactPerson, 
      contactNo, 
      enquiryNumber, 
      hallName, 
      hallLocation,
      dateOfEvent, 
      slotTime,
      sessionName, 
      purposeOfBooking, 
      hallCharges, 
      additionalFacilities, 
      hallDeposit, 
      totalPayable,
      managerEmail,
      managerName, 
    } = req.body;

    const pdfPath = await generateInquiry({
      date,
      customerName,
      contactPerson,
      contactNo,
      enquiryNumber,
      hallName,
      hallLocation,
      dateOfEvent,
      slotTime,
      sessionName,
      purposeOfBooking,
      hallCharges,
      additionalFacilities,
      hallDeposit,
      totalPayable,
      managerEmail,
      managerName
    });
    res.json(pdfPath);
  } catch (error) {
    console.error("Error in generating inquiry:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}

export async function generateConfirmationHandler(req: Request, res: Response) {
  try {
    const { 
      date, 
      customerName, 
      contactPerson, 
      contactNo, 
      enquiryNumber, 
      gstNo, 
      pan, 
      modeOfPayment, 
      additionalPaymentDetails, 
      hallName, 
      hallLocation,
      dateOfEvent, 
      slotTime, 
      sessionType,
      purposeOfBooking, 
      hallCharges, 
      additionalFacilities, 
      discountPercent,
      sgst, 
      cgst, 
      hallDeposit, 
      depositDiscount, 
      totalPayable,
      email,
      managerEmail,
      managerName 
    } = req.body;
    
    const pdfUrl = await generateConfirmation({
      date, 
      customerName, 
      contactPerson, 
      contactNo, 
      enquiryNumber, 
      gstNo, 
      pan, 
      modeOfPayment, 
      additionalPaymentDetails, 
      hallName, 
      hallLocation,
      dateOfEvent, 
      slotTime, 
      sessionType,
      purposeOfBooking, 
      hallCharges, 
      additionalFacilities, 
      discountPercent,
      sgst, 
      cgst, 
      hallDeposit, 
      depositDiscount, 
      totalPayable,
      email,
      managerEmail,
      managerName 
    });
    res.json({ pdfUrl });
  } catch (error) {
    console.error("Error in generating confirmation:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
export async function sendEmailHandler(req: Request, res: Response) {
  try {    
    const { to, subject, text, filename, path } = req.body;
    await sendEmail({to, subject, text, filename, path});
    return res.status(200).json({message:"email sent"})
  } catch (error) {
    console.error("Error in sending email:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function getBookingsByHallHandler(req: Request, res: Response) {
  try {
    const { hallId } = req.params;
    const bookings = await BookingModel.find({ hallId });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
}
export async function getBookingsByUserandHallHandler(req: Request, res: Response) {
  try {
    const { userPhone, HallId } = req.params;
    const bookings = await BookingModel.find({ hallId: HallId, 'user.mobile': userPhone });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
}

