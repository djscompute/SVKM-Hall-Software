import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosMasterInstance from '../config/axiosMasterInstance';

interface Constant {
    _id: string;
    constantName: string;
    value: number;
}

const ConstantsManager: React.FC = () => {
    const [constants, setConstants] = useState<Constant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editedValue, setEditedValue] = useState<number | null>(null);
    const [editedName, setEditedName] = useState<string | null>(null);
    const [newConstantName, setNewConstantName] = useState<string>("");
    const [newConstantValue, setNewConstantValue] = useState<number | null>(null);
    const [showCreateConstantFields, setShowCreateConstantFields] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false); // State to track editing mode
    const [currentlyEditedConstant, setCurrentlyEditedConstant] = useState<string | null>(null);
    const [totalConstants, setTotalConstants] = useState<number | null>(null);
    const fetchConstants = async () => {
        try {
            const response = await axiosMasterInstance.get<Constant[]>('/getAllConstants');
            setConstants(response.data);
            setTotalConstants(response.data.length);
            setLoading(false);
        } catch (error: any) {
            toast.error("Unable to fetch all constants");
            setError("Unable to fetch all constants")
            console.log(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConstants();
    }, []);

    const createConstant = async () => {
        if (newConstantName !== "" && newConstantValue !== null) {
            const existingConstant = constants.find(constant => constant.constantName === newConstantName);
            if (existingConstant) {
                toast.error("Constant Name already exists");
                return;
            }
            try {
                await axiosMasterInstance.post("/createConstant", { constantName: newConstantName, value: newConstantValue });
                setNewConstantName("");
                setNewConstantValue(null);
                setShowCreateConstantFields(false);
                toast.success("Constant created successfully");
                fetchConstants();
            } catch (error: any) {
                toast.error("Error creating constant: " + error.message);
                console.log(error.message);
            }
        } else {
            toast.error("Constant Name and Value cannot be empty");
        }
    };

    const cancelCreateConstant = () => {
        setNewConstantName("");
        setNewConstantValue(null);
        setShowCreateConstantFields(false);
    };

    const updateConstant = async (name: string, value: number) => {
        setEditedName(name);
        setEditedValue(value);
        setIsEditing(true); // Set editing mode to true
        setCurrentlyEditedConstant(name);
    };

    const saveUpdatedValue = async () => {
        try {
            await axiosMasterInstance.post(`/updateConstant`, { constantName: editedName, value: editedValue });
            setEditedName(null);
            setEditedValue(null);
            toast.success("Constant Value Updated")
            fetchConstants();
            setIsEditing(false); // Set editing mode to false
            setCurrentlyEditedConstant(null);
        } catch (error: any) {
            toast.error("Error updating constant: " + error.message);
            console.log(error.message);
        }
    };

    const cancelEdit = () => {
        setEditedName(null);
        setEditedValue(null);
        setIsEditing(false); // Set editing mode to false
        setCurrentlyEditedConstant(null);
    };

    const deleteConstant = async (name: string) => {
        const confirmation = window.confirm("Are you sure you want to delete this constant?");
        if (confirmation) {
            try {
                await axiosMasterInstance.delete(`/deleteConstant`, { data: { constantName: name } });
                toast.success("Deleted Constant Successfully!");
                fetchConstants();
            } catch (error: any) {
                toast.error("Error deleting constant: " + error.message);
                console.log(error.message);
            }
        } else {
            toast.info("Deletion cancelled.");
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4">Error: {error}</div>;

    return (
        <div className="p-4">
            <div className="">

                <h2 className="text-2xl font-bold mb-4">Constants Manager</h2>
                
            </div>
            <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isEditing ? 'pointer-events-none opacity-50' : ''}`}
                onClick={() => setShowCreateConstantFields(true)}
                disabled={isEditing} // Disable button when editing
            >
                Create Constant
            </button>
            {
                    totalConstants ?
                        <p className=' text-sm italic mt-2'>Total number of constants: {totalConstants}</p>
                        :
                        null
                }
            {showCreateConstantFields && (
                <div className="mt-4">
                    <input
                        className="border rounded py-2 px-4 mr-2"
                        type="text"
                        placeholder="Enter Constant Name"
                        value={newConstantName}
                        onChange={(e) => setNewConstantName(e.target.value)}
                    />
                    <input
                        className="border rounded py-2 px-4 mr-2"
                        type="number"
                        placeholder="Enter Constant Value"
                        value={newConstantValue === null ? "" : newConstantValue}
                        onChange={(e) => setNewConstantValue(parseInt(e.target.value))}
                    />
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={createConstant}
                    >
                        Submit
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        onClick={cancelCreateConstant}
                    >
                        Cancel
                    </button>
                </div>
            )}
            {
                totalConstants ?
                    <ul className="mt-4 px-4 md:px-12">
                        {constants.map(constant => (
                            <li key={constant._id} className="flex items-center justify-between py-2 border-b">
                                <div className="w-[20%]">
                                    <span>{constant.constantName}</span>
                                </div>
                                {editedName === constant.constantName ? (
                                    <>
                                        <div className="w-[20%]">
                                            <input
                                                className="border rounded py-2 px-2 mr-2 box-border w-full"
                                                type="number"
                                                value={editedValue === null ? constant.value : editedValue}
                                                onChange={(e) => setEditedValue(parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="w-[20%]">
                                            <button
                                                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 ${currentlyEditedConstant === constant.constantName ? '' : 'pointer-events-none opacity-50'}`}
                                                onClick={saveUpdatedValue}
                                                disabled={currentlyEditedConstant !== constant.constantName} // Disable button when not editing the currently displayed field
                                            >
                                                Save
                                            </button>
                                        </div>
                                        <div className="w-[20%]">
                                            <button
                                                className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ${currentlyEditedConstant === constant.constantName ? '' : 'pointer-events-none opacity-50'}`}
                                                onClick={cancelEdit}
                                                disabled={currentlyEditedConstant !== constant.constantName} // Disable button when not editing the currently displayed field
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-[20%]">
                                            <span>{constant.value}</span>
                                        </div>
                                        <div className="w-[20%]">
                                            <button
                                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ${isEditing ? 'pointer-events-none opacity-50' : ''}`}
                                                onClick={() => updateConstant(constant.constantName, constant.value)}
                                                disabled={isEditing} // Disable button when editing
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <div className="w-[20%]">
                                            <button
                                                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${isEditing ? 'pointer-events-none opacity-50' : ''}`}
                                                onClick={() => deleteConstant(constant.constantName)}
                                                disabled={isEditing} // Disable button when editing
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                    :
                    <>
                    <div className="flex justify-center ">
                        <p className='italic py-16'>No Constants Present!</p>
                    </div>
                    </>
            }
        </div>
    );
};

export default ConstantsManager;
