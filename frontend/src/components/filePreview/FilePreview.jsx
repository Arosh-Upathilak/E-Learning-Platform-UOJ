import React, { useState } from "react";
import { X, Download } from "lucide-react";

function FilePreview({ previewFile, setPreviewFile }) {
  const [downloadLoading, setDownloadLoading] = useState({});

  if (!previewFile) return null;

  const {
    fileTitle,
    fileUrl,
    fileSize,
    createdAt,
    instructorName,
    fileType,
    fileName,
    _id,
    id,
    fileUniqueName,
  } = previewFile;

  const key = _id ?? id ?? fileUniqueName ?? fileName ?? Math.random().toString(36).slice(2);

  const formattedDate = (iso) => {
    try {
      if (!iso) return "";
      return new Date(iso).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const humanFileSize = (s) => {
    if (!s) return "";
    if (typeof s === "string" && s.match(/[KMGT]?B$/i)) return s;
    const bytes = Number(s) || 0;
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const downloadFile = async (file) => {
    if (!file?.fileUrl) {
      console.error("No fileUrl for download");
      return;
    }

    const dlKey = file._id ?? file.id ?? file.fileUniqueName ?? file.fileName ?? Math.random().toString(36).slice(2);
    setDownloadLoading((p) => ({ ...p, [dlKey]: true }));

    try {
      const res = await fetch(file.fileUrl, { mode: "cors" });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const blob = await res.blob();
      const suggestedName = file.fileName ?? file.fileTitle ?? `download-${dlKey}`;
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = suggestedName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloadLoading((p) => ({ ...p, [dlKey]: false }));
    }
  };

  const urlLower = (fileUrl || "").toLowerCase();
  const ext = (fileName || fileTitle || fileUrl || "").split(".").pop()?.split(/\|\?/)[0] || "";
  const isPdf = urlLower.endsWith(".pdf") || ext === "pdf";
  const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext);
  const isWord = ["doc", "docx"].includes(ext);
  const isPpt = ["ppt", "pptx"].includes(ext);
  const officeViewer = (src) => `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}`;

  return (
    <div className="fixed z-10 w-full h-full bg-[#00000090] grid">
      <form
        onSubmit={(e) => e.preventDefault()}
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
          <h1 className="text-2xl">Preview FIle</h1>

          <button
            type="button"
            onClick={() => setPreviewFile(null)}
            className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close preview"
          >
            <X className="cursor-pointer" />
          </button>
        </div>

        <div className="flex justify-between">
          <div className="text-2xl">{fileTitle}</div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => downloadFile(previewFile)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 bg-white border border-slate-600 text-black font-medium hover:opacity-90 transition"
              disabled={!!downloadLoading[key]}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">{downloadLoading[key] ? "Downloading..." : "Download"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-white text-2xl">File Preview</div>

          <div className="flex flex-col gap-2">
            {!fileUrl ? (
              <div className="text-white/60">
                No preview available. <a href={fileUrl} className="underline">Download</a>
              </div>
            ) : isPdf ? (
              <object
                data={fileUrl}
                type="application/pdf"
                width="100%"
                height="500px"
                className="rounded-md overflow-hidden"
              >
                <p className="text-white/60">
                  Your browser doesn't support inline PDFs —{" "}
                  <a href={fileUrl} className="underline" target="_blank" rel="noreferrer">download the PDF</a>.
                </p>
              </object>
            ) : (isWord || isPpt) ? (
              <div className="h-[500px] w-full rounded-md overflow-hidden border border-white/6">
                <iframe
                  title={fileTitle || fileName || "Document preview"}
                  src={officeViewer(fileUrl)}
                  className="h-full w-full"
                />
              </div>
            ) : isImage ? (
              <img
                src={fileUrl}
                alt={fileTitle}
                className="w-full h-auto max-h-[500px] object-contain rounded-md"
              />
            ) : (
              <div className="rounded-md bg-[#0b1720] p-6 text-center text-white/70">
                <p className="mb-3">No inline preview available for this file type.</p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-md bg-white text-black px-4 py-2 font-medium"
                  download={fileName || ""}
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        </div>

        <hr />

        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div>
            <div className="flex gap-2">
              <div className="dark:text-white/50 text-black/50">File Type:</div>
              <div className="dark:text-white text-black ">{fileType}</div>
            </div>
            <div className="flex gap-2">
              <div className="dark:text-white/50 text-black/50">File Size:</div>
              <div className="dark:text-white text-black">{humanFileSize(fileSize)}</div>
            </div>
          </div>

          <div>
            <div className="flex gap-2">
              <div className="dark:text-white/50 text-black/50">Created At:</div>
              <div className="dark:text-white text-black">{formattedDate(createdAt)}</div>
            </div>
            <div className="flex gap-2">
              <div className="dark:text-white/50 text-black/50 ">Instructor Name:</div>
              <div className="dark:text-white text-black">{instructorName}</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FilePreview;
