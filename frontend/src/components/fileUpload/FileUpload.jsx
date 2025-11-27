import { Upload, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { supabase } from "../../util/supabaseClient";
import { humanFileSize, shortName } from "../../util/util";
import { toast } from "sonner";

function FileUpload({ setOpenUploadBox }) {
  const { fileType: fileTypeOptions, url, refreshToggleFile } = useContext(AppContext);

  const [fileData, setFileData] = useState({
    fileUniqueName: "",
    fileTitle: "",
    fileName: "",
    fileType: "",
    filePath: "",
    fileUrl: "",
    fileSize: "",
    fileSizeBytes: 0,
    description: "",
    instructorName: "",
    department: "",
    semester: "",
    subject: "",
  });

  const [error, setError] = useState("");
  const [combinedArray, setCombinedArray] = useState([]); 
  const [subjectsList, setSubjectsList] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const getSubject = async () => {
      try {
        if (!url) return;
        const response = await axios.get(`${url}/subjects/listSubjects`, { withCredentials: true });
        const subjects = response.data.subjects || [];
        setSubjectsList(subjects);
        const combined = subjects.map((sub) => `${sub.subjectCode} - ${sub.subjectTitle}`);
        setCombinedArray(combined);
      } catch (err) {
        console.log("Failed to fetch subjects:", err);
      }
    };
    getSubject();
  }, [url, refreshToggleFile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "subject") {
      const selectedCombined = value;
      const matched = subjectsList.find(
        (s) => `${s.subjectCode} - ${s.subjectTitle}` === selectedCombined
      );

      if (matched) {
        setFileData((prev) => ({
          ...prev,
          subject: selectedCombined,
          department: matched.department || "",
          semester: matched.semester || "",
        }));
      } else {
        setFileData((prev) => ({
          ...prev,
          subject: selectedCombined,
          department: "",
          semester: "",
        }));
      }

      setError("");
      return;
    }

    setFileData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleFileSelect = (e) => {
    setError("");
    const f = e.target.files?.[0];
    if (!f) return;

    const maxBytes = 50 * 1024 * 1024;
    const allowed = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];
    const ext = f.name.slice(((f.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();

    if (!allowed.includes(`.${ext}`)) {
      setError("Only PDF, DOCX, PPTX (.doc/.ppt) are allowed.");
      return;
    }
    if (f.size > maxBytes) {
      setError("File exceeds the 50MB limit.");
      return;
    }

    setSelectedFile(f);

    setFileData((prev) => ({
      ...prev,
      fileName: f.name,
      fileSizeBytes: f.size,
      fileSize: f.size,
    }));
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFileData((prev) => ({ ...prev, fileName: "", fileSize: "", fileUrl: "", fileSizeBytes: 0 }));
    setError("");
    const input = document.getElementById("uploadFile");
    if (input) input.value = "";
  };

  const validatePayload = (payload) => {
    const required = [
      "fileUniqueName",
      "fileName",
      "fileTitle",
      "fileType",
      "fileUrl",
      "filePath",
      "fileSize",
      "subject",
      "instructorName",
      "department",
      "semester",
    ];
    const missing = required.filter((k) => {
      const v = payload[k];
      return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
    });
    return missing;
  };

  const handleUploadToSupabase = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bucket = "FilesUOJ";
      const timestamp = Date.now();
      const rand = Math.floor(Math.random() * 1e6);
      const safeName = selectedFile.name.replace(/\s+/g, "_");
      const folder = "subjects";
      const storagePath = `${folder}/${timestamp}-${rand}-${safeName}`;

      const ext = selectedFile.name.slice(((selectedFile.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
      const extMap = { pdf: "PDF", doc: "DOC", docx: "DOC", ppt: "PPT", pptx: "PPT" };
      const normalizedFileType = extMap[ext] || (fileData.fileType || "OTHER");

      const fileUniqueName = `${timestamp}`;

      const { data: uploadData, error: uploadErr } = await supabase
        .storage
        .from(bucket)
        .upload(storagePath, selectedFile, { cacheControl: "3600", upsert: false });

      if (uploadErr) throw uploadErr;
      if (!uploadData?.path) throw new Error("Upload failed, no path returned");

      const { data: publicData, error: publicErr } = await supabase
        .storage
        .from(bucket)
        .getPublicUrl(uploadData.path);

      console.log("uploadData:", uploadData);
      console.log("getPublicUrl result:", publicData, publicErr);

      let publicUrl = "";
      if (publicData) {
        publicUrl = publicData.publicUrl || publicData.publicURL || "";
      }

      if (!publicUrl) {
        throw new Error("Public URL not returned. Check that the bucket 'FilesUOJ' is public and the path is correct.");
      }

      const readableSize = humanFileSize(selectedFile.size);
      const sizeBytes = selectedFile.size;

      let department = fileData.department;
      let semester = fileData.semester;
      if ((!department || !semester) && fileData.subject) {
        const matched = subjectsList.find((s) => `${s.subjectCode} - ${s.subjectTitle}` === fileData.subject);
        if (matched) {
          department = matched.department || "";
          semester = matched.semester || "";
        }
      }

      const payload = {
        fileUniqueName,
        fileName: selectedFile.name,
        fileTitle: (fileData.fileTitle || "").trim(),
        fileType: fileData.fileType && fileData.fileType.trim() !== "" ? fileData.fileType : normalizedFileType,
        fileUrl: publicUrl,
        filePath: uploadData.path,
        fileSize: readableSize,
        fileSizeBytes: sizeBytes,
        subject: (fileData.subject || "").trim(),
        instructorName: (fileData.instructorName || "").trim(),
        description: (fileData.description || "").trim(),
        department: department || "",
        semester: semester || "",
      };

      const missing = validatePayload(payload);
      if (missing.length) {
        const msg = `Missing required fields: ${missing.join(", ")}`;
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      if (url) {
        try {
          const response = await axios.post(`${url}/files/createfile`, payload, { withCredentials: true });
          const message = response.data?.message || "File metadata saved";
          toast.success(message);
          setError("");
        } catch (err) {
          const message = err.response?.data?.message || err.message || "Failed to save file metadata.";
          toast.error(message);
          setError(message);
          setLoading(false);
          return;
        }
      }

      setFileData((prev) => ({
        ...prev,
        fileUrl: publicUrl,
        fileName: selectedFile.name,
        fileSize: readableSize,
        fileSizeBytes: sizeBytes,
        fileType: payload.fileType,
        filePath: uploadData.path,
        fileUniqueName,
        department: payload.department,
        semester: payload.semester,
      }));

      setSelectedFile(null);
      const input = document.getElementById("uploadFile");
      if (input) input.value = "";
      setError("");
      setOpenUploadBox(false);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err?.message || "Upload failed");
      toast.error(err?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e?.preventDefault?.();

    if (selectedFile) {
      await handleUploadToSupabase();
      return;
    }

    if (fileData.fileUrl && !selectedFile) {
      let department = fileData.department;
      let semester = fileData.semester;
      if ((!department || !semester) && fileData.subject) {
        const matched = subjectsList.find((s) => `${s.subjectCode} - ${s.subjectTitle}` === fileData.subject);
        if (matched) {
          department = matched.department || "";
          semester = matched.semester || "";
        }
      }

      const payload = {
        fileUniqueName: fileData.fileUniqueName || `${Date.now()}`,
        fileName: fileData.fileName,
        fileTitle: fileData.fileTitle,
        fileType: fileData.fileType,
        fileUrl: fileData.fileUrl,
        filePath: fileData.filePath,
        fileSize: fileData.fileSize,
        fileSizeBytes: fileData.fileSizeBytes || 0,
        subject: fileData.subject,
        instructorName: fileData.instructorName,
        description: fileData.description,
        department: department || "",
        semester: semester || "",
      };

      const missing = validatePayload(payload);
      if (missing.length) {
        const msg = `Missing required fields: ${missing.join(", ")}`;
        setError(msg);
        toast.error(msg);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(`${url}/files/createfile`, payload, { withCredentials: true });
        const message = response.data?.message || "File Created successfully.";
        toast.success(message);
        setOpenUploadBox(false);
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Failed to create a file.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
      return;
    }
    setError("Please select a file and fill all required fields.");
  };

  return (
    <div className="fixed z-10 w-full h-full bg-[#00000090] grid">
      <form
        onSubmit={onSubmit}
        className="
        place-self-center
        w-full sm:w-[max(23vw,600px)]
        max-h-[90vh]
        overflow-y-auto
        scrollbar-hide
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
          <h1 className="text-2xl">Upload New File</h1>
          <button type="button" onClick={() => setOpenUploadBox(false)} className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5" aria-label="Close upload dialog">
            <X className="cursor-pointer" />
          </button>
        </div>

        <div className="flex flex-col flex-1 gap-2 mt-3">
          <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">File Title *</label>
          <input name="fileTitle" value={fileData.fileTitle} onChange={handleInputChange} required placeholder="Enter File Title" className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1" />
        </div>

        <div>
          <div className="w-full">
            <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Upload *</label>

            <label htmlFor="uploadFile" className="mt-2 flex flex-col items-start gap-2 border-2 border-dashed border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-[#111B2A] rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition w-full">
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center gap-3">
                  <Upload className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                  <div className="text-gray-700 dark:text-gray-300 font-medium">Click to upload or drag and drop</div>
                </div>

                {selectedFile ? (
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{shortName(selectedFile.name, 30)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{humanFileSize(selectedFile.size)}</div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeSelectedFile(); }} className="ml-2 px-2 py-1 rounded bg-red-50 dark:bg-red-700/10 text-red-600 dark:text-red-300 text-xs">Remove</button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">PDF, DOCX or PPT (MAX 50MB)</div>
                )}
              </div>

              <input id="uploadFile" type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFileSelect} />
            </label>
          </div>

          {fileData.fileUrl ? (
            <div className="mt-3 text-sm">
              Uploaded URL: <a href={fileData.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 break-all">{fileData.fileUrl}</a>
            </div>
          ) : selectedFile ? (
            <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">Selected: <span className="font-medium">{selectedFile.name}</span> • {humanFileSize(selectedFile.size)}</div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">File type *</label>
              <select required name="fileType" id="fileType" value={fileData.fileType} onChange={handleInputChange} aria-label="Select file type" disabled={!Array.isArray(fileTypeOptions) || fileTypeOptions.length === 0} className={`w-full bg-input-light dark:bg-[#111B2A] text-black dark:text-white p-2 rounded-lg border dark:border-white/60 border-black/60 cursor-pointer ${(!Array.isArray(fileTypeOptions) || fileTypeOptions.length === 0) ? "opacity-60 cursor-not-allowed" : ""}`}>
                <option value="" disabled>Select File type</option>
                {Array.isArray(fileTypeOptions) && fileTypeOptions.map((ft) => (<option key={ft} value={ft}>{ft}</option>))}
              </select>
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Subject *</label>
              <select required name="subject" id="subject" value={fileData.subject} onChange={handleInputChange} className="w-full bg-input-light dark:bg-[#111B2A] text-black dark:text-white p-2 rounded-lg border dark:border-white/60 border-black/60 cursor-pointer">
                <option value="" disabled>Select Subject</option>
                {Array.isArray(combinedArray) && combinedArray.map((sem) => <option key={sem} value={sem}>{sem}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col mt-3 gap-2">
            <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Description</label>
            <textarea name="description" value={fileData.description} onChange={handleInputChange} placeholder="Enter the Description" rows="4" className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1" />
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Instructor Name *</label>
            <input required name="instructorName" value={fileData.instructorName} onChange={handleInputChange} placeholder="Enter the Instructor Name" className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1" />
          </div>

          {error && (
            <div className="pt-3">
              <div className="flex items-center border border-red-500 rounded-lg bg-form-error-light dark:bg-form-error-dark p-3">
                <p className="text-red-500 font-bold text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row mt-4 gap-2">
            <button type="submit" disabled={loading} className="w-full sm:flex-1 border rounded-lg px-2 py-1.5 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-black/50 dark:hover:bg-white/50 transition-all duration-200 border-none">
              {loading ? "Uploading..." : fileData.fileUrl ? "Uploaded — Close" : "Upload file"}
            </button>

            <button type="button" onClick={() => setOpenUploadBox(false)} className="w-full sm:flex-1 border rounded-lg px-2 py-1.5 bg-black dark:bg-[#1b1f27] text-white dark:text-white font-bold hover:bg-black/50 dark:hover:bg-black/50 transition-all duration-200 border-none">
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FileUpload;
