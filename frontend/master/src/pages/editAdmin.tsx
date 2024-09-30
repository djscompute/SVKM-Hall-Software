// EditAdmin.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminType } from "../../../../types/global";
import EditableField from "../components/editAdmin/editableField";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosMasterInstance from "../config/axiosMasterInstance";
import AddHalltoManager from "../components/createAdmin.tsx/addHalltoManager";
import axios from "axios";


type UpdateAdminType = Pick<
  adminType,
  "_id" | "role" | "managedHalls" | "username" | "contact" | "email"
>;

export default function EditAdmin() {
  const { id: adminId } = useParams<{ id: string }>();
  const [admin, setAdmin] = useState<UpdateAdminType>({
    _id: "",
    role: "",
    username: "",
    contact: "",
    email: "",
    managedHalls: [],
  });
  const [editableField, setEditableField] = useState<
    keyof UpdateAdminType | null
  >(null);
  const [originalAdmin, setOriginalAdmin] = useState<UpdateAdminType | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [validInput, setValidInput] = useState<boolean>(true);
  const [selectedHallIds, setSelectedHallIds] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleFieldChange = (
    fieldName: keyof UpdateAdminType,
    value: string
  ) => {
    setValidInput(true);
    if (fieldName === "contact" && !/^\d{0,10}$/.test(value)) {
      setValidInput(false);
      return;
    }
    if (fieldName === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setValidInput(false);
    }
    if (fieldName === "username" && value.length < 5) {
      setValidInput(false);
    }
    setAdmin({ ...admin, [fieldName]: value });
  };

  const handleEdit = (field: keyof UpdateAdminType) => {
    if (!isEditing) {
      setEditableField(field);
      setOriginalAdmin({ ...admin });
      setIsEditing(true);
    }
  };
  
  const handleDeleteAdmin = async () => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      console.log(`Deleting admin with ID: ${adminId}`);
      try {
        const requestBody = { _id: adminId };
        const response = await axiosMasterInstance.post("/deleteAdmin", requestBody);
  
        if (response.status === 200) {
          navigate("/admins");
          toast.success("Admin deleted successfully", {
            autoClose: 2000,
          });
        } else {
          console.error(`Error deleting admin: ${response.status} - ${response.data.error}`);
          toast.error(`Failed to delete admin: ${response.data.error}`, {
            autoClose: 2000,
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error(`Error deleting admin: ${error.response.status} - ${error.response.data.error}`);
            toast.error(`Failed to delete admin: ${error.response.data.error}`, {
              autoClose: 2000,
            });
          } else {
            console.error("Error deleting admin:", error.message);
            toast.error("Failed to delete admin. Please try again.", {
              autoClose: 2000,
            });
          }
        } else {
          console.error("Unexpected error deleting admin:", error);
          toast.error("Failed to delete admin. Please try again.", {
            autoClose: 2000,
          });
        }
      }
    }
  };
  

  const handleSave = () => {
    if (!validInput) {
      toast.error("Invalid Input", {
        autoClose: 2000,
      });
      return;
    }
    if (editableField === "contact" && !/^\d{10}$/.test(admin.contact)) {
      toast.error("Invalid contact number");
      return;
    }

    setIsEditing(false);
    setEditableField(null);
    setOriginalAdmin(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (originalAdmin) {
      setAdmin(originalAdmin);
    }
    setOriginalAdmin(null);
    setEditableField(null);
  };

  const handleSubmitChanges = async () => {
    admin.managedHalls = selectedHallIds;
    console.log(`updating admin with ID: ${adminId}`);
    if (admin.role === "MASTER" && selectedHallIds.length != 0) {
      toast.info("Selected Halls will be removed for master");
      admin.managedHalls = [];
      setSelectedHallIds([]);
    }
    try {
      const responsePromise = axiosMasterInstance.post(
        "/updateAdmin",
        JSON.stringify(admin)
      );
      toast.promise(responsePromise, {
        pending: "Updating admin...",
      });
      const response = await responsePromise;
      console.log(response);
      toast.success("Admin Updated Successfully!", {
        autoClose: 3000,
        onClose: () => navigate("/"),
      });
    } catch (error: any) {
      if (error.response.status === 409) {
        console.log(error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        console.error("Error Updating admin:", error);
        toast.error("Failed to update admin");
      }
    }
  };

  //HALL SELECTION FUNCTIONS
  const handleHallSelect = (id: string) => {
    setSelectedHallIds([...selectedHallIds, id]);
  };

  const clearSelectedHallIds = () => {
    setSelectedHallIds([]);
  };

  const handleAddedHallsChange = (addedItems: string[]) => {
    setSelectedHallIds(addedItems);
  };

  //
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axiosMasterInstance.get(
          `/getAdmin/id/${adminId}`
        );
        const { _id, role, username, contact, email, managedHalls } =
          response.data;
        setAdmin({ _id, role, username, contact, email, managedHalls });
        setSelectedHallIds(response.data.managedHalls);
      } catch (error: any) {
        toast.error("Unable to fetch admin details");
        console.error("Error fetching admin details:", error.message);
      }
    };
    if (adminId) {
      const isValidObjectId = /^[a-f\d]{24}$/.test(adminId);
      if (!isValidObjectId) {
        toast.error("Invalid admin ID");
      } else {
        fetchAdmin();
      }
    }
  }, []);

  if (admin.role === "") return <>Loading...</>;
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Admin</h2>
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700">Role</label>
        <div className="mt-1">
          <input
            type="radio"
            id="master"
            name="role"
            value="MASTER"
            checked={admin.role === "MASTER"}
            onChange={() => handleFieldChange("role", "MASTER")}
            className="mr-2"
            disabled={isEditing}
          />
          <label htmlFor="master" className="mr-4">
            MASTER
          </label>
          <input
            type="radio"
            id="manager"
            name="role"
            value="MANAGER"
            checked={admin.role === "MANAGER"}
            onChange={() => handleFieldChange("role", "MANAGER")}
            className="mr-2"
            disabled={isEditing}
          />
          <label htmlFor="manager">MANAGER</label>
        </div>
      </div>
      <EditableField
        label="Username"
        value={admin.username || ""}
        fieldName="username"
        editableField={editableField}
        isEditing={isEditing}
        handleFieldChange={handleFieldChange}
        handleEdit={handleEdit}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
      <EditableField
        label="Contact"
        value={admin.contact || ""}
        fieldName="contact"
        editableField={editableField}
        isEditing={isEditing}
        handleFieldChange={handleFieldChange}
        handleEdit={handleEdit}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
      <EditableField
        label="Email"
        value={admin.email || ""}
        fieldName="email"
        editableField={editableField}
        isEditing={isEditing}
        handleFieldChange={handleFieldChange}
        handleEdit={handleEdit}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
      {admin.role === "MANAGER" && (
        <div className="">
          <h3 className="block text-lg font-medium text-gray-700">
            Manage Halls
          </h3>
          <p className="text-gray-600 text-sm">
            (Add or Remove from actions to change managed halls)
          </p>
          <AddHalltoManager
            selectedHallIds={selectedHallIds}
            onHallSelect={handleHallSelect}
            onClearSelectedHalls={clearSelectedHallIds}
            onAddedHallsChange={handleAddedHallsChange}
          />
        </div>
      )}
      <div className="w-full flex justify-center mt-8 md:justify-start">
        <button
          onClick={handleSubmitChanges}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Changes
        </button>
        <button
          onClick={handleDeleteAdmin}
          className="mx-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete Admin
        </button>
      </div>
    </div>
  );
}
