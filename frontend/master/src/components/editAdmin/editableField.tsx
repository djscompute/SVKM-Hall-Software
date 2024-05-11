// EditableField.tsx
import React from 'react';
import { adminType } from '../../../../../types/global';
type UpdateAdminType = Pick<adminType, '_id' | 'role'| 'managedHalls'| 'username' | 'contact' | 'email'>;

interface EditableFieldProps {
  label: string;
  value: string;
  fieldName: keyof UpdateAdminType;
  editableField: keyof UpdateAdminType | null;
  isEditing: boolean;
  handleFieldChange: (fieldName: keyof UpdateAdminType, value: string) => void;
  handleEdit: (field: keyof UpdateAdminType) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  fieldName,
  editableField,
  isEditing,
  handleFieldChange,
  handleEdit,
  handleSave,
  handleCancel,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">{label}</label>
      <div className="flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          className="bg-slate-200 mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={editableField !== fieldName || !isEditing}
        />
        {!isEditing && editableField !== fieldName && (
          <button
            onClick={() => handleEdit(fieldName)}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Change
          </button>
        )}
        {isEditing && editableField === fieldName && (
          <>
            <button
              onClick={handleSave}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </>
        )}
      </div>
      {
        fieldName==='username'&&
        <p className='text-sm text-gray-600'>(Username must be of atleast 5 characters)</p>
      }
    </div>
  );
};

export default EditableField;
