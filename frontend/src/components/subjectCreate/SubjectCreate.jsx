import { X } from "lucide-react";
import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "sonner";

function SubjectCreate({ setCreateBoxOpen }) {
  const { department = [], semester = [], url, setRefreshToggle } = useContext(AppContext);

  const [subjectData, setSubjectData] = useState({
    subjectCode: "",
    subjectTitle: "",
    description: "",
    department: "",
    semester: "",
    instructorName: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setSubjectData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    const {
      subjectCode,
      subjectTitle,
      department: dep,
      semester: sem,
      instructorName,
    } = subjectData;

    if (!subjectCode || !subjectTitle || !dep || !sem || !instructorName) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/subjects/createSubject`,
        subjectData,
        { withCredentials: true }
      );

      const message = response.data?.message || "Subject Created Successfully";
      toast.success(message);
      setError("");
      // optionally clear form or close modal
      setCreateBoxOpen(false);
      setRefreshToggle((prev)=>setRefreshToggle(!prev))
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to Create Subject. Please try again.";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-10 w-full h-full bg-[#00000090] grid">
      <form
        onSubmit={handleSubmit}
        className="
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
      "
      >
        <div className="flex justify-between items-center text-black dark:text-white">
          <h1 className="text-2xl">Create New Subject</h1>

          {/* close button - wrapped for better hit area on mobile */}
          <button
            type="button"
            onClick={() => setCreateBoxOpen(false)}
            className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close create subject"
          >
            <X className="cursor-pointer" />
          </button>
        </div>

        <div>
          {/* Title + Code => stack on mobile */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                Subject Title *
              </label>
              <input
                name="subjectTitle"
                value={subjectData.subjectTitle}
                onChange={onChangeHandle}
                required
                placeholder="Enter Subject Title"
                className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1"
              />
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                Subject Code *
              </label>
              <input
                name="subjectCode"
                value={subjectData.subjectCode}
                onChange={onChangeHandle}
                required
                placeholder="Enter Subject Code"
                className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col mt-3 gap-2">
            <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
              Description
            </label>
            <textarea
              name="description"
              value={subjectData.description}
              onChange={onChangeHandle}
              placeholder="Enter the Description"
              rows="4"
              className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1"
            />
          </div>

          {/* Department + Semester => stack on mobile */}
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                Department *
              </label>
              <select
                required
                name="department"
                id="department"
                value={subjectData.department}
                onChange={onChangeHandle}
                className="w-full bg-input-light dark:bg-[#111B2A] text-black dark:text-white p-2 rounded-lg border dark:border-white/60 border-black/60 cursor-pointer"
              >
                <option value="">Select Department</option>
                {Array.isArray(department) &&
                  department.map((dep) => (
                    <option
                      key={dep}
                      value={dep}
                      className="bg-form-input-light dark:bg-form-input-dark text-black dark:text-white"
                    >
                      {dep}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                Semester *
              </label>
              <select
                required
                name="semester"
                id="semester"
                value={subjectData.semester}
                onChange={onChangeHandle}
                className="w-full bg-input-light dark:bg-[#111B2A] text-black dark:text-white p-2 rounded-lg border dark:border-white/60 border-black/60 cursor-pointer"
              >
                <option value="">Select Semester</option>
                {Array.isArray(semester) &&
                  semester.map((sem) => (
                    <option
                      key={sem}
                      value={sem}
                      className="bg-form-input-light dark:bg-form-input-dark text-black dark:text-white"
                    >
                      {sem}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex flex-col gap-2 mt-3">
            <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
              Instructor Name *
            </label>
            <input
              name="instructorName"
              value={subjectData.instructorName}
              onChange={onChangeHandle}
              required
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

          {/* Actions -> stacked buttons on mobile */}
          <div className="flex flex-col sm:flex-row mt-4 gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 border rounded-lg px-2 py-1.5 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-black/50 dark:hover:bg-white/50 transition-all duration-200 border-none"
            >
              {loading ? "Creating..." : "Create Subject"}
            </button>

            <button
              type="button"
              onClick={() => setCreateBoxOpen(false)}
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

export default SubjectCreate;
