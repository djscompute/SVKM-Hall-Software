import { useState, ChangeEvent, FormEvent } from "react";
import axiosInstance from "../config/axiosInstance";
import { adminType } from "../../../../types/global";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddHalltoManager from "../components/createAdmin.tsx/addHalltoManager";

function CreateAdmin() {
    const [adminData, setAdminData] = useState<Partial<adminType>>({
        role: "",
        username: "",
        contact: "",
        email: "",
        password: "",
        managedHalls: []
    });

    const [selectedHallIds, setSelectedHallIds] = useState<string[]>([]);
    const [contactValid, setContactValid] = useState<boolean>(true);
    const [emailValid, setEmailValid] = useState<boolean>(true);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState<boolean>(false);

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        for (const key in adminData) {
            if (key !== "managedHalls" && !adminData[key as keyof adminType]) {
                console.error(`Field ${key} is empty`);
                toast.error(`Field ${key} is empty`)
                return;
            }            
        }
        if (adminData.role === "MANAGER") 
            {
                if(selectedHallIds.length===0){
                console.error("Manager must have atleast 1 hall");
                toast.error("Atleast one hall must be selected")
                return;
                }
                adminData.managedHalls= selectedHallIds    
            }
            
        else if(adminData.role==="MASTER")
            {
                adminData.managedHalls=[];
            }

        if (!emailValid) {
            console.error("Email is not valid");
            toast.error("Email is not valid")
            return;
        }
        if (!contactValid) {
            console.error("Contact is not valid");
            toast.error("Contact is not valid")
            return;
        }
        if (adminData.username?.length) {
            if (adminData.username.length < 5) {
                toast.error("Username must be of minimum 5 characters")
                return
            }
        }

        if (adminData.password !== confirmPassword) {
            console.error("password confirmation does not match");
            toast.error("Password Confirmation Doesn't Match")
            return;
        }
        try {
            const responsePromise = axiosInstance.post("/createAdmin", JSON.stringify(adminData));
            toast.promise(responsePromise, {
                pending: "Creating a new Admin...",
            });
            const response = await responsePromise;
            console.log(response)
            toast.success("Admin Added Successfully!", {
                autoClose: 3000,
                onClose: () => window.location.reload()
            });
        } catch (error: any) {
            if (error.response.status === 409) {
                console.log(error.response.data.error)
                toast.error(error.response.data.error);
            }
            else {
                console.error("Error adding admin:", error);
                toast.error("Failed to create new Admin")
            }
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name == "role") {
            adminData.role = value;
        }
        if (name === "contact") {
            const contactRegex = /^\d{10}$/;
            setContactValid(contactRegex.test(value));
        } else if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setEmailValid(emailRegex.test(value));
        } else if (name === "confirmPassword") {
            setConfirmPassword(value);
            setConfirmPasswordTouched(true);
        }


        if (name !== "confirmPassword") {
            setAdminData((prevData) => ({ ...prevData, [name]: value }));
        }
    };


    const handleHallSelect = (id: string) => {
        setSelectedHallIds([...selectedHallIds, id]);
    };

    const clearSelectedHallIds = () => {
        setSelectedHallIds([]);
    };

    const handleAddedHallsChange = (addedItems: string[]) => {
        setSelectedHallIds(addedItems);
    };

    return (
        <>
            <div className="md:max-w-xl mx-auto mt-8 p-4 bg-white rounded shadow-md mb-20">
                <h1 className="text-2xl font-bold mb-4">Create Admin Account</h1>
                <form onSubmit={handleFormSubmit}>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <p className="font-semibold">Select Role:</p>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="role"
                                    id="manager"
                                    value="MANAGER"
                                    onChange={handleInputChange}
                                    className="form-radio h-4 w-4 text-indigo-600"
                                />
                                <label htmlFor="manager" className="text-gray-700">Manager</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="role"
                                    id="master"
                                    value="MASTER"
                                    onChange={handleInputChange}
                                    className="form-radio h-4 w-4 text-indigo-600"
                                />
                                <label htmlFor="master" className="text-gray-700">Master</label>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="username" className="text-gray-700 text-lg">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={adminData.username}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-indigo-500"
                            />
                            <p className="text-sm text-gray-500">(Username must be of minimum 5 characters)</p>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="contact" className="text-gray-700 text-lg">Contact Number</label>
                            <input
                                type="tel"
                                id="contact"
                                name="contact"
                                value={adminData.contact}
                                onChange={handleInputChange}
                                maxLength={10}
                                className="border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-indigo-500"
                            />
                            {!contactValid && <p className="text-red-600 text-sm">Contact number must be of 10 digits</p>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-gray-700 text-lg">Email ID</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={adminData.email}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-indigo-500"
                            />
                            {!emailValid && <p className="text-red-600 text-sm">Email address is not valid</p>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password" className="text-gray-700 text-lg">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={adminData.password}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="confirmPassword" className="text-gray-700 text-lg">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-indigo-500"
                            />
                            {confirmPasswordTouched && confirmPassword && adminData.password !== confirmPassword && <p className="text-red-600 text-sm">Passwords do not match</p>}
                        </div>
                        <div className="">
                        {adminData.role === "MANAGER" && (
                            <div className="flex flex-col">
                                <h1 className="text-lg ">Add Halls to Manager</h1>
                                <AddHalltoManager
                                    selectedHallIds={selectedHallIds}
                                    onHallSelect={handleHallSelect}
                                    onClearSelectedHalls={clearSelectedHallIds}
                                    onAddedHallsChange={handleAddedHallsChange}
                                />
                            </div>
                        )}
                        </div>
                        <div className="flex justify-center">
                            <button type="submit" className="bg-indigo-500 text-white font-semibold px-4 py-2 rounded mt-4">Submit</button>
                        </div>
                    </div>
                </form>
            </div>

        </>
    );
}

export default CreateAdmin;
