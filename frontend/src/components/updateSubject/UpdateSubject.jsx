import { X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "sonner";

function UpdateSubject({ id, setUpdateBoxOpen }) {
  const { department = [], semester = [], url, setRefreshToggle } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    subjectCode: "",
    subjectTitle: "",
    description: "",
    department: "",
    semester: "",
    instructorName: ""
  });

  // load subject when id changes
  useEffect(() => {
    if (!id || !url) return;

    const loadSubject = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/subjects/getSubject/${id}`, {
          withCredentials: true
        });

        const s = response.data.subject || response.data;
        if (s) {
          setData({
            subjectCode: s.subjectCode || "",
            subjectTitle: s.subjectTitle || "",
            description: s.description || "",
            department: s.department || "",
            semester: s.semester || "",
            instructorName: s.instructorName || ""
          });
        } else {
          toast.error("Subject not found");
        }
      } catch (err) {
        console.error("Failed to load subject:", err);
        toast.error(err?.response?.data?.message || "Failed to load subject");
      } finally {
        setLoading(false);
      }
    };

    loadSubject();
  }, [id, url]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // basic validation
    if (!data.subjectCode || !data.subjectTitle || !data.department || !data.semester || !data.instructorName) {
      setError("All required fields must be filled");
      toast.error("All required fields must be filled");
      return;
    }

    setLoading(true);
    try {
      // send PUT to update
      await axios.put(`${url}/subjects/updateSubject/${id}`, data, { withCredentials: true });

      setError("");
      toast.success("Subject Updated Successfully");

      // trigger global refresh if available
      if (typeof setRefreshToggle === "function") setRefreshToggle((prev) => !prev);

      // close modal
      setUpdateBoxOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
      const message = err?.response?.data?.message || "Failed to update subject. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-10 w-full h-full bg-[#00000090] grid">
      <form onSubmit={handleSubmit} className="
            place-self-center
            w-full sm:w-[max(23vw,600px)]
            text-[#808080]
            bg-navbar-light
            dark:bg-navbar-dark
            flex flex-col
            gap-[25px]
            px-[30px] py-[25px]
            rounded-[8px]
            text-[14px]
            animate-fadeIn
          ">
        <div className='flex justify-between items-center text-black dark:text-white'>
          <h1 className="text-2xl">Edit Subject</h1>

          <button
            type="button"
            onClick={() => setUpdateBoxOpen(false)}
            className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <X className="cursor-pointer" />
          </button>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Subject Title *</label>
              <input
                name="subjectTitle"
                value={data.subjectTitle}
                onChange={onChange}
                placeholder="Enter Subject Title"
                className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1"
              />
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Subject Code *</label>
              <input
                name="subjectCode"
                value={data.subjectCode}
                onChange={onChange}
                placeholder="Enter Subject Code"
                className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1"
              />
            </div>
          </div>

          <div className="flex flex-col mt-3 gap-2">
            <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Description</label>
            <textarea
              name="description"
              value={data.description}
              onChange={onChange}
              placeholder="Enter the Description"
              rows="4"
              className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Department *</label>
              <select
                name="department"
                value={data.department}
                onChange={onChange}
                className="w-full bg-input-light dark:bg-[#111B2A] text-black dark:text-white p-2 rounded-lg border dark:border-white/60 border-black/60 cursor-pointer"
              >
                <option value="">Select Department</option>
                {department.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Semester *</label>
              <select
                name="semester"
                value={data.semester}
                onChange={onChange}
                className="w-full bg-input-light dark:bg-[#111B2A] text-black dark:text-white p-2 rounded-lg border dark:border-white/60 border-black/60 cursor-pointer"
              >
                <option value="">Select Semester</option>
                {semester.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Instructor Name *</label>
            <input
              name="instructorName"
              value={data.instructorName}
              onChange={onChange}
              placeholder="Enter the Instructor Name"
              className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1"
            />
          </div>

          {error && (
            <div className="pt-3">
              <div className="flex items-center border border-red-500 rounded-lg bg-form-error-light dark:bg-form-error-dark p-3">
                <p className="text-red-500 font-bold text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row mt-4 gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 border rounded-lg px-2 py-1.5 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-black/50 dark:hover:bg-white/50 transition-all duration-200 border-none"
            >
              {loading ? "Updating..." : "Update Subject"}
            </button>

            <button
              type="button"
              onClick={() => setUpdateBoxOpen(false)}
              className="w-full sm:flex-1 border rounded-lg px-2 py-1.5 bg-black dark:bg-[#1b1f27] text-black dark:text-white font-bold hover:bg-white/50 dark:hover:bg-black/20 transition-all duration-200 border-none"
            >
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdateSubject;
