import React, { useContext, useEffect, useState } from "react";
import { ArrowLeft, Plus, Search } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import DeleteFiles from "../../../components/deleteFile/DeleteFiles";
import FileTable from "../../../components/fileTable/FileTable";
import FileUpload from "../../../components/fileUpload/FileUpload";
import { extractNumber } from "../../../util/util";


function UploadFile() {
  const { url, refreshToggleFile } = useContext(AppContext);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [openUploadBox, setOpenUploadBox] = useState(false);
  const [openDeleteFileBox, setOpenDeleteFileBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterSem, setFilterSem] = useState("");

  useEffect(() => {
    const getFiles = async () => {
      try {
        if (!url) return;
        setLoading(true);

        const  response = await axios.get(`${url}/files/findFilebyUserId`, { withCredentials: true });

        const fetchedFiles = response?.data?.files || response?.data?.file || [];
        const normalized = Array.isArray(fetchedFiles) ? fetchedFiles : [fetchedFiles];
        setFiles(normalized);
      } catch (err) {
        console.error("Failed to fetch files:", err);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    getFiles();
  }, [url, refreshToggleFile]);

  const totalSemesters = new Set(files.map((f) => f.semester).filter(Boolean)).size;
  const totalDepartments = new Set(files.map((f) => f.department).filter(Boolean)).size;

  const filteredRows = files.filter((f) => {
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      const hay = `${f.fileTitle || ""} ${f.instructorName || ""} ${f.subject || ""} ${f.fileName || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filterDept && (f.department || "") !== filterDept) return false;
    if (filterSem && (f.semester || "") !== filterSem) return false;
    return true;
  });



  return (
    <div className="w-full min-h-screen">
      {/* modals */}
      {openUploadBox && <FileUpload setOpenUploadBox={setOpenUploadBox} />}
      {openDeleteFileBox && <DeleteFiles id={selectedFileId} setOpenDeleteFileBox={setOpenDeleteFileBox} />}

      {/* NAVBAR AREA */}
      <nav className="bg-white dark:bg-navbar-dark px-4 sm:px-8 py-5">
        <Link to="/admin/home" className="text-black/50 hover:text-black flex flex-row gap-2 items-center dark:text-white/70 dark:hover:text-white">
          <ArrowLeft className="h-5" />
          <p>Back to Dashboard</p>
        </Link>

        <div className="mt-3 flex flex-col sm:flex-col md:flex-row items-center md:items-center justify-center sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl sm:text-3xl text-black dark:text-white font-bold">Upload Management</h1>
            <h3 className="text-black/50 dark:text-white/80 text-sm sm:text-base">Manage lecture notes and past papers</h3>
          </div>

          <button
            onClick={() => setOpenUploadBox(true)}
            className="bg-black dark:bg-white text-white dark:text-black px-3 py-2 rounded-lg flex flex-row gap-2 text-sm sm:text-base sm:self-auto items-center"
          >
            <Plus className="w-5 h-5" />
            <p>Upload File</p>
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <div className="mt-5 w-full">
        <div className="m-6 bg-white dark:bg-navbar-dark rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="flex items-center bg-input-light dark:bg-[#111B2A] rounded-lg px-3 py-2 border dark:border-white/60 border-black/60">
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Subjects, Title, Instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ml-2 w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
              />
            </div>

            {/* Department Dropdown */}
            <div>
              <select
                name="department"
                id="department"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full bg-input-light dark:bg-[#111B2A] text-black dark:text-white py-2 px-3 rounded-lg border dark:border-white/60 border-black/60 cursor-pointer"
              >
                <option value="">All Departments</option>
                {[...new Set(files.map(f => f.department).filter(Boolean))].map((d) => (
                  <option key={`f-${d}`} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Semester Dropdown */}
            <div>
              <select
                name="semester"
                id="semester"
                value={filterSem}
                onChange={(e) => setFilterSem(e.target.value)}
                className="w-full bg-input-light dark:bg-[#111B2A] text-black dark:text-white py-2 px-3 rounded-lg border dark:border-white/60 border-black/60 cursor-pointer"
              >
                <option value="">All Semesters</option>
                {[...new Set(files.map(f => f.semester).filter(Boolean))]
                  .sort((a, b) => extractNumber(a) - extractNumber(b))
                  .map((s) => (
                    <option key={`f-s-${s}`} value={s}>{s}</option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dashboard cards */}
        <div className="p-5 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-navbar-dark rounded-xl p-4 flex flex-col items-center">
            <p className="text-black/70 dark:text-white/70 text-xl">Total File</p>
            <p className="text-xl font-semibold text-black dark:text-white">{files.length}</p>
          </div>

          <div className="bg-white dark:bg-navbar-dark rounded-xl p-4 flex flex-col items-center">
            <p className="text-black/70 dark:text-white/70 text-xl">Semesters</p>
            <p className="text-xl font-semibold text-black dark:text-white">{totalSemesters}</p>
          </div>

          <div className="bg-white dark:bg-navbar-dark rounded-xl p-4 flex flex-col items-center">
            <p className="text-black/70 dark:text-white/70 text-xl">Departments</p>
            <p className="text-xl font-semibold text-black dark:text-white">{totalDepartments}</p>
          </div>
        </div>

        {/* File table */}
        <div className="mt-6">
          {loading ? (
            <div className="p-6 bg-white dark:bg-navbar-dark rounded-lg text-center">Loading files...</div>
          ) : (
            <FileTable sampleRows={filteredRows} 
            onDelete={(id) => {setSelectedFileId(id); setOpenDeleteFileBox(true);}}
             />
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadFile;
