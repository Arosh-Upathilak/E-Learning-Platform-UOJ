// DeleteFiles.jsx
import React, { useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from "sonner";
import { supabase } from '../../util/supabaseClient'; // adjust path if needed

function DeleteFiles({ id, setOpenDeleteFileBox }) {
  const { setRefreshToggleFile, url } = useContext(AppContext);
  const [fileTitle, setFileTitle] = useState("");
  const [filePath, setFilePath] = useState(""); // store path for supabase deletion
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id || !url) {
      setFileTitle("");
      setFilePath("");
      return;
    }

    let cancelled = false;
    const fetchFile = async () => {
      try {
        const res = await axios.get(`${url}/files/findFileByFileId/${id}`, { withCredentials: true });
        const payload = res.data.file || res.data || {};
        if (!cancelled && payload) {
          setFileTitle(payload.fileTitle || "");
          setFilePath(payload.filePath || "");
        }
      } catch (err) {
        console.warn("Could not load file info:", err);
        if (!cancelled) {
          setFileTitle("");
          setFilePath("");
        }
      }
    };

    fetchFile();
    return () => { cancelled = true; };
  }, [id, url]);

  const handleDelete = async () => {
    if (!id || !url) {
      toast.error("Invalid file id or server URL.");
      return;
    }
    if (loading) return;

    setLoading(true);

    try {
      if (filePath) {
        try {
          const bucket = "FilesUOJ"; 
          const { data, error } = await supabase.storage.from(bucket).remove([filePath]);
          if (error) {
            console.warn("Supabase remove error:", error);
            toast.warning("Failed to remove file from storage (check permissions). Will still attempt to delete DB record.");
          } else {
            console.log("Supabase remove result:", data);
          }
        } catch (supErr) {
          console.error("Supabase deletion failed:", supErr);
          toast.warning("Error removing file from storage. Will still attempt to delete DB record.");
        }
      } else {
        console.log("No filePath available; skipping storage deletion.");
      }

      try {
        const response = await axios.delete(`${url}/files/deletefile/${id}`, { withCredentials: true });
        if (response.status >= 200 && response.status < 300) {
          toast.success(response.data?.message || "File deleted successfully");
          setOpenDeleteFileBox(false);
          if (typeof setRefreshToggleFile === "function") setRefreshToggleFile(prev => !prev);
        } else {
          toast.error(response.data?.message || "Failed to delete file record");
        }
      } catch (apiErr) {
        console.error("API delete error:", apiErr);
        const msg = apiErr?.response?.data?.message || apiErr.message || "Failed to delete file record";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed z-10 w-full h-full bg-[#00000090] grid'>
      <form className="
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
          <h1 className="text-2xl">Delete File</h1>
          <button
            type="button"
            onClick={() => setOpenDeleteFileBox(false)}
            className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close create subject"
          >
            <X className="cursor-pointer" />
          </button>
        </div>

        <div>
          <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
            Are you sure you want to delete <span className='text-black dark:text-white'>"{fileTitle || "this file"}"</span>?
            <br />This action cannot be undone.
          </div>

          {/* Actions -> stacked buttons on mobile */}
          <div className="flex flex-col sm:flex-row mt-4 gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className={`w-full sm:flex-1  rounded-lg px-2 py-1.5 font-bold transition-all duration-200 ${loading ? "opacity-60 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}
            >
              {loading ? "Deleting..." : "Delete File"}
            </button>

            <button
              type="button"
              onClick={() => setOpenDeleteFileBox(false)}
              className="w-full sm:flex-1  rounded-lg px-2 py-1.5 bg-black dark:bg-[#1b1f27] text-black dark:text-white font-bold hover:bg-white/50 dark:hover:bg-black/20 transition-all duration-200 border-none"
            >
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default DeleteFiles;
