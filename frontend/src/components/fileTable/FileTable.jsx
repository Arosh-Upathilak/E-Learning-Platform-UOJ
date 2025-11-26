// FileTable.jsx
import React from "react";
import { FileText, Trash2, UploadIcon } from "lucide-react";

export default function FileTable({
  sampleRows = [],
  setOpenDeleteFileBox = () => {}
}) {

  const rows = sampleRows;

  const TypePill = ({ text }) => {
    const map = {
      "Lecture Note": "dark:bg-[#12305a] text-[#9fd0ff] px-3 py-2 rounded-md bg-[#dbeafe]",
      "Past Paper": "dark:bg-[#2b133e] text-[#cda6ff] px-3 py-2 rounded-md bg-[#f3e8ff]",
      default: "dark:bg-[#1f2b3a] text-[#98b9e6] px-3 py-2 rounded-md bg-[#ffe2e2]",
    };
    const cls = map[text] ?? map.default;
    return (
      <span className={`${cls} inline-block text-sm px-3 py-1 rounded-md font-medium`}>
        {text}
      </span>
    );
  };

  const FormatPill = ({ text }) => {
    const map = {
      PDF: "dark:bg-[#4b0f12] text-[#ffb3b6] px-3 py-2 rounded-md bg-[#ffe2e2]",
      PPT: "dark:bg-[#3b1b07] text-[#ffbf9e] px-3 py-2 rounded-md bg-[#ffedd4]",
      DOC: "dark:bg-[#1f2b3a] text-[#9fd0ff] px-3 py-2 rounded-md bg-[#dbeafe]",
    };
    const cls = map[text] ?? "bg-[#1f2b3a] text-[#cbd5e1]";
    return (
      <span className={`${cls} inline-block text-sm px-2 py-1 rounded-md font-semibold`}>
        {text}
      </span>
    );
  };

  return (
    <div className="m-6 bg-white dark:bg-[#0f1724] rounded-lg overflow-hidden shadow-sm">

      {/* Header (HIDDEN on mobile) */}
      <div className="hidden md:grid w-full md:grid-cols-7 px-6 py-4 text-black dark:text-[#cbd5e1] font-semibold text-sm border-b border-white/6">
        <div>File</div>
        <div className="pl-12">Type</div>
        <div>Subject</div>
        <div>Format</div>
        <div className="px-5">Size</div>
        <div>Upload Date</div>
        <div className="text-center">Action</div>
      </div>

      {/* Rows */}
      {rows.length > 0 ? (
        <div className="divide-y divide-white/6">
          {rows.map((r, idx) => (
            <div
              key={`${r.title}-${idx}`}
              className="px-4 py-4 grid md:grid-cols-7 gap-3 
                         items-start md:items-center   /* FIXED HERE */
                         text-black dark:text-[#e6eef8]"
            >
              {/* File */}
              <div className="flex items-start gap-3 md:col-span-1">
                <div className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md dark:bg-[#1b2430] px-3 py-2 rounded-md bg-[#ffe2e2]">
                  <FileText className="w-5 h-5 text-[#ff6467]" />
                </div>
                <div>
                  <span className="font-semibold text-black dark:text-[#e6eef8]">{r.title}</span>
                  <span className="dark:text-[#93a4bd] text-black/80 text-sm block">{r.subtitle}</span>

                  {/* Mobile pills */}
                  <div className="md:hidden flex gap-2 mt-2">
                    <TypePill text={r.type} />
                    <FormatPill text={r.format} />
                  </div>
                </div>
              </div>

              {/* Type */}
              <div className="hidden md:flex md:col-span-1 items-center pl-4">
                <TypePill text={r.type} />
              </div>

              {/* Subject */}
              <div className="md:col-span-1 flex items-center">
                <span className="text-black dark:text-[#e6eef8] font-medium">{r.subject}</span>
              </div>

              {/* Format */}
              <div className="hidden md:flex md:col-span-1 items-center">
                <FormatPill text={r.format} />
              </div>

              {/* Size */}
              <div className="md:col-span-1 flex items-center">
                <span className="text-black dark:text-[#e6eef8]">{r.size}</span>
              </div>

              {/* Upload Date */}
              <div className="hidden md:flex md:col-span-1 items-center">
                <span className="text-black dark:text-[#e6eef8]">{r.date}</span>
              </div>

              {/* Actions */}
              <div className="md:col-span-1 flex md:items-center md:justify-center">
                <div className="hidden md:flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setOpenDeleteFileBox(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-600
                     hover:bg-red-600/50  dark:hover:bg-red-600/50 transition-colors duration-150"
                  >
                    <Trash2 className="w-4 h-4 " />
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </div>

                {/* Mobile actions */}
                <div className="md:hidden w-full mt-2">
                  <div className="flex items-center justify-center text-sm text-[#93a4bd] mb-2">
                    <div>Upload: <span className="text-[#e6eef8]">{r.date}</span></div>

                    <button
                      type="button"
                      onClick={() => setOpenDeleteFileBox(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-600 hover:bg-red-600/50 dark:hover:bg-red-600/50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Delete</span>
                    </button>

                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y border-t border-white/10 dark:border-black/10">
          <div className="flex flex-col items-center p-5">
            <UploadIcon className="mx-auto mt-10 text-gray-500" size={40} />
            <p className="mt-5 text-2xl text-gray-500 dark:text-gray-500 font-semibold">No Files found</p>
          </div>
        </div>
      )}
    </div>
  );
}
