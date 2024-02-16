import { Request, Response, NextFunction } from "express";
import Admin, {Hall, hallType } from "../models/admin.model";

export async function addHallHandler(req: Request, res: Response) {
  try {
    const { name, location, capacity, facilities, cost } = req.body as Pick< hallType, "name" | "location" | "capacity" | "facilities" | "cost">;
    //@ts-ignore
    
    const newHall = new Hall({ name, location, capacity, facilities, cost });
    await newHall.save();
   
    return res.status(200).json(newHall);
  } catch (error: any) {
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function removeHallHandler(req: Request, res: Response) {
  try {
    //@ts-ignore
    const hallId: string = req.params.id;

    const removedHall = await Hall.findByIdAndDelete(hallId);
    if (!removedHall) {
      return res.status(404).send("Hall not found");
    }

    return res.status(200).json(removedHall);
  } catch (error: any) {
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function editHallHandler(req: Request, res: Response) {
  try {
    const { name, location, capacity, facilities, cost } = req.body as Pick<hallType, "name" | "location" | "capacity" | "facilities" | "cost">;
    const hallId: string = req.params.id;

    const updatedHall = await Hall.findByIdAndUpdate(hallId, { name, location, capacity, facilities, cost }, { new: true });
    if (!updatedHall) {
      return res.status(404).send("Hall not found");
    }

    return res.status(200).json(updatedHall);
  } catch (error: any) {
    res.status(400).json({ name: error.name, message: error.message });
  }
}

