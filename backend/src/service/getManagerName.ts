import Admin from "../models/admin.model";

// helper function to fetch the manager name given the hall id
// incase of multiplr managers for a hall it will return a comma seperated string
export async function getManagerNamesByHallId(hallId: string) {
    try {
        const admins = await Admin.find({ managedHalls: hallId }).exec();
        const managerNames = admins.map(admin => admin.username).join(", ");
        return managerNames;
    } catch (error) {
        console.error("Error fetching manager names:", error);
        throw error;
    }
}
