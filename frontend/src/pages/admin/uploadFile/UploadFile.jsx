import React, { useContext, useState } from 'react';
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from '../../../context/AppContext';
import DeleteFiles from '../../../components/deleteFile/DeleteFiles';
import FileTable from '../../../components/fileTable/FileTable';
import FileUpload from '../../../components/fileUpload/FileUpload';

function UploadFile() {
   const { department, semester, userData } = useContext(AppContext);
    const [openUploadBox, setOpenUploadBox] = useState(false);
    const [openDeleteFileBox, setOpenDeleteFileBox] = useState(false)

   const sampleRows = [
    {
      title: "Introduction to Python - Lecture 1",
      subtitle: "Dr. Ravi Kumar",
      type: "Lecture Note",
      subject: "CS101",
      format: "PDF",
      size: "2.4 MB",
      date: "1/15/2025",
    },
    {
      title: "Variables and Data Types",
      subtitle: "Dr. Ravi Kumar",
      type: "Lecture Note",
      subject: "CS101",
      format: "PDF",
      size: "1.8 MB",
      date: "1/20/2025",
    },
    {
      title: "CS101 Final Exam 2024",
      subtitle: "Admin",
      type: "Past Paper",
      subject: "CS101",
      format: "PDF",
      size: "850 KB",
      date: "12/1/2024",
    },
    {
      title: "Arrays and Linked Lists",
      subtitle: "Dr. Priya Sharma",
      type: "Lecture Note",
      subject: "CS102",
      format: "PPT",
      size: "3.2 MB",
      date: "2/5/2025",
    },
    {
      title: "Trees and Graphs",
      subtitle: "Dr. Priya Sharma",
      type: "Lecture Note",
      subject: "CS102",
      format: "PDF",
      size: "2.1 MB",
      date: "2/12/2025",
    },
  ];

  return (
    <div className='w-full min-h-screen'>
      {openUploadBox && <FileUpload  setOpenUploadBox={setOpenUploadBox}/>} 
      {openDeleteFileBox && <DeleteFiles  setOpenDeleteFileBox={setOpenDeleteFileBox}/>}

      {/* NAVBAR AREA */}
      <nav className="bg-white dark:bg-navbar-dark px-4 sm:px-8 py-5">

        {/* Back Button */}
        <Link to='/admin/home' className='text-black/50 hover:text-black flex flex-row gap-2 items-center dark:text-white/70 dark:hover:text-white'>
          <ArrowLeft className='h-5' />
          <p>Back to Dashboard</p>
        </Link>

        {/* HEADER AREA */}
        <div className='mt-3 flex flex-col sm:flex-col md:flex-row 
                        items-center md:items-center justify-center 
                        sm:items-center sm:justify-between gap-4'>

          {/* Title Block */}
          <div className='flex flex-col gap-3'>
            <h1 className='text-xl sm:text-3xl text-black dark:text-white font-bold'>
              Upload Management
            </h1>
            <h3 className='text-black/50 dark:text-white/80 text-sm sm:text-base'>
              Manage lecture notes and past papers
            </h3>
          </div>

          {/* Create Button */}
          <button
            onClick={()=>setOpenUploadBox(true)}
            className='bg-black dark:bg-white text-white dark:text-black 
                       px-3 py-2 rounded-lg flex flex-row gap-2
                       text-sm sm:text-base sm:self-auto items-center'
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
            <div className="flex items-center bg-input-light dark:bg-[#111B2A] 
                            rounded-lg px-3 py-2 border dark:border-white/60 border-black/60 ">
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Subjects..."
                className="ml-2 w-full bg-transparent text-gray-900 dark:text-gray-100 
                           placeholder-gray-400 outline-none"
              />
            </div>

            {/* Department Dropdown */}
            <div>
              <select
                name="department"
                id="department"
                className="w-full bg-input-light dark:bg-[#111B2A] 
                           text-black dark:text-white py-2 px-3 rounded-lg border dark:border-white/60 border-black/60 cursor-pointer"
              >
                <option
                  value=""
                  className="bg-form-input-light dark:bg-form-input-dark text-black dark:text-white"
                >
                  Select Department
                </option>

                {department.map((dep) => (
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

            {/* Semester Dropdown */}
            <div>
              <select
                name="semester"
                id="semester"
                className="w-full bg-input-light dark:bg-[#111B2A] 
                           text-black dark:text-white py-2 px-3 rounded-lg border dark:border-white/60 border-black/60  cursor-pointer"
              >
                <option
                  value=""
                  className="bg-form-input-light dark:bg-form-input-dark text-black dark:text-white"
                >
                  Select Semester
                </option>

                {semester.map((sem) => (
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


        </div>


        <div className="p-5 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white dark:bg-navbar-dark rounded-xl p-4 flex flex-col items-center">
            <p className="text-black/70 dark:text-white/70 text-xl">Total Subjects</p>
            <p className="text-xl font-semibold text-black dark:text-white">0</p>
          </div>

          <div className="bg-white dark:bg-navbar-dark rounded-xl p-4 flex flex-col items-center">
            <p className="text-black/70 dark:text-white/70 text-xl">Semester</p>
            <p className="text-xl font-semibold text-black dark:text-white">0</p>
          </div>

          <div className="bg-white dark:bg-navbar-dark rounded-xl p-4 flex flex-col items-center">
            <p className="text-black/70 dark:text-white/70 text-xl">Department</p>
            <p className="text-xl font-semibold text-black dark:text-white">0</p>
          </div>

        </div>

        <FileTable sampleRows={sampleRows}  setOpenDeleteFileBox={setOpenDeleteFileBox}/>

        {userData._id}
        <h1>ManageSubject</h1>
      </div>
    </div>
  )
}

export default UploadFile