import React, { useEffect, useState } from 'react';
import axiosMasterInstance from '../../config/axiosMasterInstance';
import { EachHallType } from '../../types/Hall.types';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddHalltoManagerProps {
  selectedHallIds: string[];
  onHallSelect: (id: string) => void;
  onClearSelectedHalls: () => void;
  onAddedHallsChange: (addedItems: string[]) => void;
}

const AddHalltoManager: React.FC<AddHalltoManagerProps> = ({
  selectedHallIds,
  onHallSelect,
  onClearSelectedHalls,
  onAddedHallsChange,
}) => {
  const [halls, setHalls] = useState<EachHallType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const responsePromise = axiosMasterInstance.get<EachHallType[]>('/getAllHalls/');
        const response = await responsePromise
        setHalls(response.data);
        setLoading(false);
      } catch (error: any) {
        toast.error("Unable to fetch all halls")
        setError(error.message);
        setLoading(false);
      }
    };

    fetchHalls();
  }, []);

  const handleAddHall = (id: string) => {
    onHallSelect(id);
  };

  const handleRemoveHall = (id: string) => {

    const updatedSelectedHallIds = selectedHallIds.filter((hallId) => hallId !== id);
    onAddedHallsChange(updatedSelectedHallIds);
  };

  if (loading) return <div>Fetching all Halls...</div>;
  if (error) return <div>There was some error fetching all halls. Please refresh</div>;

  return (
    <div className="max-w-full mx-auto mt-8 p-4 bg-white rounded shadow-md mb-12 overflow-x-auto">
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Capacity</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {halls.map((hall: EachHallType) => (
              <tr key={hall._id} className={selectedHallIds.includes(hall._id || '') ? 'bg-blue-200' : ''}>
                <td className="border px-4 py-2">{hall.name}</td>
                <td className="border px-4 py-2">{hall.capacity}</td>
                <td className="border px-4 py-2">{hall.location.desc1}</td>
                <td className="border px-4 py-2">
                  {selectedHallIds.includes(hall._id || '') ? (
                    <button type="button" onClick={() => handleRemoveHall(hall._id || '')} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                      Remove
                    </button>
                  ) : (
                    <button type="button" onClick={() => handleAddHall(hall._id || '')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 rounded">
                      Add
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={onClearSelectedHalls} className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
        Clear Selected Halls
      </button>
    </div>
  );
};

export default AddHalltoManager;
