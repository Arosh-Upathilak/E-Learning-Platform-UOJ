import axios from "axios";
import { toast } from "sonner";
import React, { useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import { AppContext } from '../../context/AppContext';

function DeleteSubject({ id, setDeleteBoxOpen }) {
  const { setRefreshToggle, url } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [subjectTitle, setSubjectTitle] = useState("");


  useEffect(() => {
    if (!id || !url) {
      setSubjectTitle("");
      return;
    }

    let cancelled = false;
    const fetchTitle = async () => {
      try {
        const res = await axios.get(`${url}/subjects/getSubject/${id}`, { withCredentials: true });
        const s = res.data.subject || res.data;
        if (!cancelled && s) {
          setSubjectTitle(s.subjectTitle || s.title || "");
        }
      } catch (err) {
        console.warn("Could not load subject title:", err);
        if (!cancelled) setSubjectTitle("");
      }
    };

    fetchTitle();
    return () => { cancelled = true; };
  }, [id, url]);

  const handleDelete = async () => {
    if (!id || !url) {
      toast.error("Invalid subject id");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.delete(`${url}/subjects/deleteSubject/${id}`, {
        withCredentials: true,
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data?.message || "Subject deleted successfully");
        setDeleteBoxOpen(false);
        if (typeof setRefreshToggle === "function") setRefreshToggle(prev => !prev);
      } else {
        toast.error(response.data?.message || "Failed to delete subject");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to delete subject";
      toast.error(message);
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed z-10 w-full h-full bg-[#00000090] grid'>
      {/* used form for layout; prevent default submit and call handleDelete */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete();
        }}
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
        <div className='flex justify-between items-center text-black dark:text-white'>
          <h1 className="text-2xl">Delete Subject</h1>

          <button
            type="button"
            onClick={() => setDeleteBoxOpen(false)}
            className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close delete dialog"
          >
            <X className="cursor-pointer" />
          </button>
        </div>

        <div>
          <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
            Are you sure you want to delete{" "}
            <span className='text-black dark:text-white'>" {subjectTitle || "this subject"} "</span>?
            <br />
            This action cannot be undone.
          </div>

          {/* Actions -> stacked buttons on mobile */}
          <div className="flex flex-col sm:flex-row mt-4 gap-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:flex-1 border rounded-lg px-2 py-1.5 text-white font-bold transition-all duration-200 border-none
                ${loading ? 'bg-red-500/60 cursor-not-allowed' : 'bg-black dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-600/90'}`}
            >
              {loading ? "Deleting..." : "Delete Subject"}
            </button>

            <button
              type="button"
              onClick={() => setDeleteBoxOpen(false)}
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

export default DeleteSubject;
