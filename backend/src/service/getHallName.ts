import { HallModel } from "../models/hall.model"; 

// helper function to fetch the hall name given the hall id
export async function getHallNameById(hallId: string): Promise<string | null> {
    try {
        const hall = await HallModel.findById(hallId).exec();
        return hall ? hall.name : null;
    } catch (error) {
        console.error("Error fetching hall name:", error);
        throw error;
    }
}