import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import { BookOpen, FileText, Upload, File } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import RecentUpdateFile from "../../../components/recentUpdateFile/RecentUpdateFile";

function AdminHome() {
  const { url, refreshToggle, refreshToggleFile } = useContext(AppContext);

  const [subjects, setSubjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        // fetch subjects and files in parallel
        const [subRes, fileRes] = await Promise.allSettled([
          axios.get(`${url}/subjects/listSubjects`, { withCredentials: true }),
          axios.get(`${url}/files/findFilebyUserId`, { withCredentials: true }),
        ]);

        // subjects
        if (subRes.status === "fulfilled") {
          const subs = subRes.value?.data?.subjects || [];
          setSubjects(Array.isArray(subs) ? subs : []);
        } else {
          console.warn("Failed to fetch subjects:", subRes.reason);
          setSubjects([]);
        }

        // files
        if (fileRes.status === "fulfilled") {
          const fetched = fileRes.value?.data?.files || fileRes.value?.data?.file || [];
          const normalized = Array.isArray(fetched) ? fetched : [fetched];
          setFiles(normalized);
        } else {
          console.warn("Failed to fetch files:", fileRes.reason);
          setFiles([]);
        }
      } catch (err) {
        console.error("Fetch all error:", err);
        setSubjects([]);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [url, refreshToggle, refreshToggleFile]);

  const totalSubjects = subjects.length;
  const totalFiles = files.length;

  const departmentsFromSubjects = [...new Set(subjects.map((s) => (s.department || "").toString().trim()).filter(Boolean))];
  const semestersFromSubjects = [...new Set(subjects.map((s) => (s.semester || "").toString().trim()).filter(Boolean))];

  const totalDepartments = departmentsFromSubjects.length;
  const totalSemesters = semestersFromSubjects.length;

  const departmentsFromFiles = [...new Set(files.map((f) => (f.department || "").toString().trim()).filter(Boolean))];
  const semestersFromFiles = [...new Set(files.map((f) => (f.semester || "").toString().trim()).filter(Boolean))];

  const displayedDepartments = totalDepartments || departmentsFromFiles.length;
  const displayedSemesters = totalSemesters || semestersFromFiles.length;

  const lectureCount = files.filter((f) => {
    const t = (f.fileType || f.type || "").toString().toLowerCase();
    return t.includes("lecture") || t.includes("note") || t.includes("lecture note");
  }).length;

  const pastPaperCount = files.filter((f) => {
    const t = (f.fileType || f.type || "").toString().toLowerCase();
    return t.includes("past") || t.includes("paper") || t.includes("past paper");
  }).length;

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen">
        <div className="flex flex-col items-center">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 w-full mt-8">
            {/* Total Subjects */}
            <div
              className="group bg-total-subject hover:bg-total-subject/80 rounded-xl p-6 flex flex-col items-center
                         justify-center transform transition-all duration-300 hover:scale-105 text-center"
            >
              <BookOpen className="w-8 h-8 text-white" />
              <p className="text-white text-lg font-semibold mt-3">Total Subjects</p>
              <p className="text-white text-lg font-semibold mt-3">{loading ? "..." : totalSubjects}</p>
            </div>

            {/* Total Files */}
            <div
              className="group bg-total-file hover:bg-total-file/80 rounded-xl p-6 flex flex-col items-center
                         justify-center transform transition-all duration-300 hover:scale-105  text-center"
            >
              <FileText className="w-8 h-8 text-white" />
              <p className="text-white text-lg font-semibold mt-3">Total Files</p>
              <p className="text-white text-lg font-semibold mt-3">{loading ? "..." : totalFiles}</p>
            </div>

            {/* Departments */}
            <div
              className="group bg-lecture-note hover:bg-lecture-note/80 rounded-xl p-6 flex flex-col items-center
                         justify-center transform transition-all duration-300 hover:scale-105 text-center"
            >
              <Upload className="w-8 h-8 text-white" />
              <p className="text-white text-lg font-semibold mt-3">Departments</p>
              <p className="text-white text-lg font-semibold mt-3">{loading ? "..." : displayedDepartments}</p>
            </div>

            {/* Semesters */}
            <div
              className="group bg-pass-paper hover:bg-pass-paper/80 rounded-xl p-6 flex flex-col items-center
                         justify-center transform transition-all duration-300 hover:scale-105  text-center"
            >
              <File className="w-8 h-8 text-white" />
              <p className="text-white text-lg font-semibold mt-3">Semesters</p>
              <p className="text-white text-lg font-semibold mt-3">{loading ? "..." : displayedSemesters}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="w-full px-6 mt-6">
            <div className="mx-auto p-6 bg-quick-action-light dark:bg-quick-action-dark rounded-xl">
              <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Quick Actions</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                <Link
                  to="/admin/subjects"
                  className="flex flex-col sm:flex-row gap-3 items-center justify-center p-6 rounded-xl
                   bg-black dark:bg-white text-white dark:text-black transform transition-transform duration-300 hover:scale-105 cursor-pointer text-center"
                >
                  <BookOpen className="w-6 h-6" />
                  <span className="font-medium">Manage Subjects</span>
                </Link>

                <Link
                  to="/admin/upload"
                  className="flex flex-col sm:flex-row gap-3 items-center justify-center p-6 rounded-xl
                   bg-black dark:bg-white text-white dark:text-black transform transition-transform duration-300 hover:scale-105 cursor-pointer text-center"
                >
                  <Upload className="w-6 h-6" />
                  <span className="font-medium">Upload Files</span>
                </Link>

                <Link
                  to="/admin/upload"
                  className="flex flex-col sm:flex-row gap-3 items-center justify-center p-6 rounded-xl
                   bg-black dark:bg-white text-white dark:text-black transform transition-transform duration-300 hover:scale-105 cursor-pointer text-center"
                >
                  <FileText className="w-6 h-6" />
                  <span className="font-medium">View All Files</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Small breakdown counts for Lecture Notes & Past Papers */}
          <div className="w-full px-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-navbar-dark rounded-xl p-4 flex flex-col items-center">
                <p className="text-black/70 dark:text-white/70">Lecture Notes</p>
                <p className="text-xl font-semibold text-black dark:text-white">{lectureCount}</p>
              </div>
              <div className="bg-white dark:bg-navbar-dark rounded-xl p-4 flex flex-col items-center">
                <p className="text-black/70 dark:text-white/70">Past Papers</p>
                <p className="text-xl font-semibold text-black dark:text-white">{pastPaperCount}</p>
              </div>
            </div>
          </div>

          <RecentUpdateFile rows={files} showViewAll />;
        </div>
      </div>
    </>
  );
}

export default AdminHome;
