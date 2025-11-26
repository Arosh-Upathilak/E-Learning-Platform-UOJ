import { Upload, X } from "lucide-react";
import React, { useContext } from 'react'
import { AppContext } from "../../context/AppContext";

function FileUpload({ setOpenUploadBox }) {
    const { semester, fileType } = useContext(AppContext)

    return (
        <div className='fixed z-10 w-full h-full bg-[#00000090] grid'>
            <form className="
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
      ">
                <div className='flex justify-between items-center text-black dark:text-white'>
                    <h1 className="text-2xl">Upload New File</h1>
                    <button
                        type="button"
                        onClick={() => setOpenUploadBox(false)}
                        className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                        aria-label="Close upload dialog"
                    >
                        <X className="cursor-pointer" />
                    </button>
                </div>

                <div>
                    <div className="w-full">
                        <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                            Upload *
                        </label>

                        <label
                            htmlFor="uploadFile"
                            className="mt-2 flex flex-col items-center justify-center gap-2 
               border-2 border-dashed border-gray-400 dark:border-gray-600 
               bg-gray-50 dark:bg-[#111B2A]
               rounded-lg p-6 cursor-pointer 
               hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <Upload className="w-8 h-8 text-gray-600 dark:text-gray-300" />

                            <p className="text-gray-700 dark:text-gray-300 font-medium">
                                Click to upload or drag and drop
                            </p>

                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                PDF, DOCX or PPT (MAX 50MB)
                            </p>

                            <input
                                required
                                id="uploadFile"
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.ppt,.pptx"
                                onChange={(e) => console.log(e.target.files[0])}
                            />
                        </label>
                    </div>

                    <div className="flex flex-col flex-1 gap-2 mt-3">
                        <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">File Title *</label>
                        <input required placeholder="Enter File Title" className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1" />
                    </div>

                    {/* File type + Semester => stack on mobile */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
                        <div className="flex flex-col flex-1 gap-2">
                            <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">File type *</label>

                            <select
                                required
                                name="fileType"
                                id="fileType"
                                defaultValue=""
                                aria-label="Select file type"
                                disabled={!Array.isArray(fileType) || fileType.length === 0}
                                aria-disabled={!Array.isArray(fileType) || fileType.length === 0}
                                className={`w-full bg-input-light dark:bg-[#111B2A] text-black dark:text-white p-2 rounded-lg border dark:border-white/60 border-black/60 cursor-pointer
                  ${(!Array.isArray(fileType) || fileType.length === 0) ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                <option value="" disabled>
                                    Select File type
                                </option>

                                {Array.isArray(fileType) && fileType.map((ft) => (
                                    <option key={ft} value={ft} className="bg-form-input-light dark:bg-form-input-dark text-black dark:text-white">
                                        {ft}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col flex-1 gap-2">
                            <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Subject *</label>
                            <select
                                name="subject"
                                id="subject"
                                className="w-full bg-input-light dark:bg-[#111B2A] text-black dark:text-white p-2 rounded-lg border dark:border-white/60 border-black/60 cursor-pointer"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Select Subject
                                </option>
                                {Array.isArray(semester) && semester.map((sem) => (
                                    <option key={sem} value={sem} className="bg-form-input-light dark:bg-form-input-dark text-black dark:text-white">{sem}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col mt-3 gap-2">
                        <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Description</label>
                        <textarea placeholder="Enter the Description" rows="4" className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1" />
                    </div>

                    {/* Instructor */}
                    <div className="flex flex-col gap-2 mt-3">
                        <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">Instructor Name *</label>
                        <input placeholder="Enter the Instructor Name" className="bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base border rounded-md border-black/50 dark:border-white/50 px-2 py-1" />
                    </div>

                    {/* Actions -> stacked buttons on mobile */}
                    <div className="flex flex-col sm:flex-row mt-4 gap-2">
                        <button className="w-full sm:flex-1 border rounded-lg px-2 py-1.5 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-black/50 dark:hover:bg-white/50 transition-all duration-200 border-none">Upload file</button>

                        <button
                            type="button"
                            onClick={() => setOpenUploadBox(false)}
                            className="w-full sm:flex-1 border rounded-lg px-2 py-1.5 bg-black dark:bg-[#1b1f27] text-white dark:text-white font-bold hover:bg-black/50 dark:hover:bg-black/50 transition-all duration-200 border-none"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default FileUpload;
