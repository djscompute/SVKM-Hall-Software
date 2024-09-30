import { log } from "console";
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

// Helper Function to fetch the session time given the session ID

export async function getSessionTime(session_id: string){
    try {
        const halls = await HallModel.find().exec();
        
        for (const hall of halls) {
            for (const session of hall.sessions) {
                if (session._id && session._id.toString() === session_id) {
        // console.log("backend get name here see all sessions",session);
        let sendingTimeResp={
            "from":session.from,
            "to":session.to
        };

                    return sendingTimeResp;
                }
            }
        }
    } catch (error) {
        console.error("Error fetching session time:", error);
        throw error;
    }
}
