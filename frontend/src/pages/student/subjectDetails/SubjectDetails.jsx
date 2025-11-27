import { useParams, Link } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { ArrowLeft, FileText, Download, Calendar, HardDrive, User, Eye } from "lucide-react";
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import FilePreview from '../../../components/filePreview/FilePreview';

export default function SubjectDetails() {
  const { url } = useContext(AppContext);
  const { id } = useParams();

  const [loadingSubject, setLoadingSubject] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [subject, setSubject] = useState({});
  const [files, setFiles] = useState([]);

  const [downloadLoading, setDownloadLoading] = useState({});
  const [activeTab, setActiveTab] = useState("all");

  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    if (!url || !id) return;

    const fetchSubject = async () => {
      try {
        setLoadingSubject(true);
        const res = await axios.get(`${url}/subjects/getSubject/${id}`, { withCredentials: true });
        setSubject(res?.data?.subject ?? {});
      } catch (err) {
        console.error("Error fetching subject:", err);
        setSubject({});
      } finally {
        setLoadingSubject(false);
      }
    };

    const fetchFiles = async () => {
      try {
        setLoadingFiles(true);
        const res = await axios.get(`${url}/files/findFileBySubjectId/${id}`, { withCredentials: true });
        setFiles(res?.data?.files ?? []);
      } catch (err) {
        console.error("Error fetching files:", err);
        setFiles([]);
      } finally {
        setLoadingFiles(false);
      }
    };

    fetchSubject();
    fetchFiles();
  }, [url, id]);

  const downloadFile = async (file) => {
    if (!file?.fileUrl) {
      console.error("No fileUrl for download");
      return;
    }

    const key = file._id ?? file.id ?? file.fileUniqueName ?? file.fileName ?? Math.random().toString(36).slice(2);
    setDownloadLoading((p) => ({ ...p, [key]: true }));

    try {
      const res = await fetch(file.fileUrl, { mode: 'cors' });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const blob = await res.blob();
      const suggestedName = file.fileName ?? file.fileTitle ?? `download-${key}`;
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = suggestedName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloadLoading((p) => ({ ...p, [key]: false }));
    }
  };

  const fileMatches = (file, keyword) => {
    if (!file) return false;
    const k = (keyword || "").toString().toLowerCase();

    const candidates = [file.category, file.type, file.fileType, file.file_category, file.meta?.category];
    for (const c of candidates) {
      if (!c) continue;
      if (String(c).toLowerCase().includes(k)) return true;
    }

    const text = [
      file.fileTitle,
      file.fileName,
      file.title,
      file.name,
      file.description,
    ].filter(Boolean).join(" ").toLowerCase();

    return text.includes(k);
  };

  const filteredFiles = files.filter((f) => {
    if (activeTab === "all") return true;
    if (activeTab === "lecture") return fileMatches(f, "lecture");
    if (activeTab === "pass") return fileMatches(f, "pass") || fileMatches(f, "past paper");
    return true;
  });

  const formatDate = (iso) => {
    try {
      if (!iso) return "";
      return new Date(iso).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen w-full">
      {previewFile && <FilePreview previewFile={previewFile} setPreviewFile={setPreviewFile} />}

      <nav className="bg-white dark:bg-navbar-dark px-4 sm:px-8 py-5">
        <Link to="/home" className="text-black/50 hover:text-black flex flex-row gap-2 items-center dark:text-white/70 dark:hover:text-white">
          <ArrowLeft className="h-5" />
          <p>Back to Dashboard</p>
        </Link>

        <div className="mt-3 flex flex-col sm:flex-col md:flex-row items-center md:items-center justify-center sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl sm:text-3xl text-black dark:text-white">
              {subject.subjectCode ?? ""}{subject.subjectTitle ? ` - ${subject.subjectTitle}` : loadingSubject ? " Loading..." : ""}
            </h1>

            <h3 className="text-black/50 dark:text-white/80 text-sm sm:text-xl">
              {(subject.department ?? "") + (subject.department && subject.semester ? " - " : "") + (subject.semester ?? "")}
            </h3>

            <h4 className="text-black/50 dark:text-white/80 text-sm sm:text-base">
              {subject.instructorName ?? ""}
            </h4>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="bg-[#574cfb] rounded-lg flex flex-row items-start p-5 gap-3">
          <FileText className="size-10 text-white bg-[#807dff] rounded-lg p-1" />
          <div className="flex flex-col gap-2">
            <p className="text-white text-2xl">Course Description</p>
            <p className="text-white/50">{subject.description ?? ""}</p>
            <div className="text-white flex gap-3">
              <div className="p-2 bg-[#807dff] rounded-lg">Department: {subject.department ?? ""}</div>
              <div className="p-2 bg-[#807dff] rounded-lg">Total file: {files.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="m-6 flex flex-row">
        <div className="bg-white dark:bg-navbar-dark flex sm:flex-row flex-col p-2 gap-3 rounded-lg text-gray-500">
          <button
            className={`flex flex-row cursor-pointer p-1 rounded-lg items-center gap-2 ${activeTab === "all" ? "bg-[#eef2ff] text-black dark:bg-[#161c27] dark:text-white" : "hover:text-black hover:dark:text-white hover:dark:bg-[#161c27]"}`}
            onClick={() => setActiveTab("all")}
          >
            <FileText />
            <p>All</p>
          </button>

          <button
            className={`flex flex-row cursor-pointer p-1 rounded-lg items-center gap-2 ${activeTab === "lecture" ? "bg-[#eef2ff] text-black dark:bg-[#161c27] dark:text-white" : "hover:text-black hover:dark:text-white hover:dark:bg-[#161c27]"}`}
            onClick={() => setActiveTab("lecture")}
          >
            <FileText />
            <p>Lecture Note</p>
          </button>

          <button
            className={`flex flex-row cursor-pointer p-1 rounded-lg items-center gap-2 ${activeTab === "pass" ? "bg-[#eef2ff] text-black dark:bg-[#161c27] dark:text-white" : "hover:text-black hover:dark:text-white hover:dark:bg-[#161c27]"}`}
            onClick={() => setActiveTab("pass")}
          >
            <FileText />
            <p>Pass Paper</p>
          </button>
        </div>
      </div>

      {loadingFiles ? (
        <p className="px-6">Loading...</p>
      ) : filteredFiles.length === 0 ? (
        <div className="px-6">
          <div className="p-4 rounded-lg bg-white/6 dark:bg-[#0e1722]">
            <p className="text-gray-400">No files found for this category.</p>
          </div>
        </div>
      ) : (
        filteredFiles.map((file) => {
          const key = file._id ?? file.id ?? file.fileUniqueName ?? file.fileName;
          return (
            <div key={key} className="px-6">
              <div className="dark:bg-[#0f1720] bg-white border border-slate-700/40 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-red-700/100 flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-black dark:text-white text-lg font-medium">{file.fileTitle}</h3>

                  <div className="mt-3 flex items-center sm:flex-row flex-col gap-6 text-sm text-gray-400 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(file.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      <span>{file.fileSize}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{file.instructorName}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center sm:flex-row flex-col gap-3">
                    <button
                      onClick={() => setPreviewFile(file)}
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 border border-slate-600 text-gray-400 hover:text-gray-400/50 dark:text-slate-100 bg-transparent dark:hover:bg-white/5 transition"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadFile(file)}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 bg-white border border-slate-600 text-black font-medium hover:opacity-90 transition"
                      disabled={!!downloadLoading[key]}
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">{downloadLoading[key] ? "Downloading..." : "Download"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
