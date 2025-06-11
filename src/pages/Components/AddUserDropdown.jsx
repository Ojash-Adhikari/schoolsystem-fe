import { Plus, ChevronDown } from "lucide-react";
import { useState } from "react";

const AddUserDropdown = ({ onAddStudent, onAddTeacher }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add New
                <ChevronDown className="w-4 h-4" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                        onClick={() => {
                            onAddStudent();
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                        Add Student
                    </button>
                    <button
                        onClick={() => {
                            onAddTeacher();
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                        Add Teacher
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddUserDropdown;