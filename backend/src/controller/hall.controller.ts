import { Request, Response, NextFunction } from "express";
import { HallModel, EachHallType } from "../models/hall.model";

export async function addHallHandler(req: Request, res: Response) {
  try {
    const {
      name,
      location,
      about,
      contactEmail,
      contactName,
      capacity,
      additionalFeatures,
      images,
      sessions,
      eventRestrictions,
      securityDeposit,
    } = req.body as EachHallType;

    const newHall = new HallModel({
      name,
      location,
      about,
      contactEmail,
      contactName,
      capacity,
      additionalFeatures,
      images,
      sessions,
      eventRestrictions,
      securityDeposit,
    });
    await newHall.save();

    return res.status(200).json(newHall);
  } catch (error: any) {
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function removeHallHandler(req: Request, res: Response) {
  try {
    const hallId: string = req.params.id;

    const removedHall = await HallModel.findByIdAndDelete(hallId);
    if (!removedHall) {
      return res.status(404).send("Hall not found");
    }

    return res.status(200).json(removedHall);
  } catch (error: any) {
    res.status(400).json({ name: error.name, message: error.message });
  }
}

// UPDATE the whole fucking document.
// THIS handler trusts that the frontend will never send a bad document data.
export async function editHallHandler(req: Request, res: Response) {
  try {
    const {
      name,
      location,
      about,
      contactEmail,
      contactName,
      capacity,
      additionalFeatures,
      images,
      sessions,
      eventRestrictions,
      securityDeposit,
    } = req.body as EachHallType;
    const hallId: string = req.params.id;

    const updatedHall = await HallModel.findByIdAndUpdate(
      hallId,
      {
        name,
        location,
        about,
        contactEmail,
        contactName,
        capacity,
        additionalFeatures,
        images,
        sessions,
        eventRestrictions,
        securityDeposit,
      },
      { new: true }
    );
    if (!updatedHall) {
      return res
        .status(404)
        .send({ name: "Hall Not Found", message: "Hall not found" });
    }

    return res.status(200).json(updatedHall);
  } catch (error: any) {
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function getAllHallsHandler(req: Request, res: Response) {
  try {
    const allHalls = await HallModel.find();
    return res.status(200).json(allHalls);
  } catch (error: any) {
    res.status(500).json({ name: error.name, message: error.message });
  }
}

export async function getHallByIdHandler(req: Request, res: Response) {
  try {
    const hallId: string = req.params.id;

    const hall = await HallModel.findById(hallId);
    if (!hall) {
      return res
        .status(404)
        .json({ name: "Hall Not Found", message: "Hall not found" });
    }

    return res.status(200).json(hall);
  } catch (error: any) {
    res.status(500).json({ name: error.name, message: error.message });
  }
}

export async function deleteHallHandler(req: Request, res: Response) {
  try {
    const hallId: string = req.params.id;

    const deletedHall = await HallModel.findByIdAndDelete(hallId);
    if (!deletedHall) {
      return res.status(404).json({ name: "Hall Not Found", message: "Hall not found" });
    }

    return res.status(200).json({ message: "Hall deleted successfully", hall: deletedHall });
  } catch (error: any) {
    return res.status(500).json({ name: error.name, message: error.message });
  }
}
