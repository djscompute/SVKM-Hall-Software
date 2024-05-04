import { HallModel } from "../models/hall.model";

// Helper Function to fetch the session name given the session ID
export async function getSessionName(session_id: string){
    try {
        const halls = await HallModel.find().exec();
        for (const hall of halls) {
            for (const session of hall.sessions) {
                if (session._id && session._id.toString() === session_id) {
                    return session.name;
                }
            }
        }
    } catch (error) {
        console.error("Error fetching session name:", error);
        throw error;
    }
}