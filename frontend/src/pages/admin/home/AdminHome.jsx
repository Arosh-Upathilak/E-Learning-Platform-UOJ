import React from 'react';
import Navbar from '../../../components/navbar/Navbar';
import { BookOpen, FileText, Upload, File } from "lucide-react";
import { Link} from "react-router-dom";

function AdminHome() {

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen">
        <div className="flex flex-col items-center">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 w-full mt-8">

            {/* Total Subjects */}
            <Link
              to="/admin/subjects"
              className="group bg-total-subject hover:bg-total-subject/80 rounded-xl p-6 flex flex-col items-center
                         justify-center transform transition-all duration-300 hover:scale-105 cursor-pointer text-center"
            >
              <BookOpen className="w-8 h-8 text-white" />
              <p className="text-white text-lg font-semibold mt-3">Total Subjects</p>
            </Link>

            {/* Total Files */}
            <Link
              to="/admin/files"
              className="group bg-total-file hover:bg-total-file/80 rounded-xl p-6 flex flex-col items-center
                         justify-center transform transition-all duration-300 hover:scale-105 cursor-pointer text-center"
            >
              <FileText className="w-8 h-8 text-white" />
              <p className="text-white text-lg font-semibold mt-3">Total Files</p>
            </Link>

            {/* Lecture Notes */}
            <Link
              to="/admin/notes"
              className="group bg-lecture-note hover:bg-lecture-note/80 rounded-xl p-6 flex flex-col items-center
                         justify-center transform transition-all duration-300 hover:scale-105 cursor-pointer text-center"
            >
              <Upload className="w-8 h-8 text-white" />
              <p className="text-white text-lg font-semibold mt-3">Lecture Notes</p>
            </Link>

            {/* Past Papers */}
            <Link
              to="/admin/papers"
              className="group bg-pass-paper hover:bg-pass-paper/80 rounded-xl p-6 flex flex-col items-center
                         justify-center transform transition-all duration-300 hover:scale-105 cursor-pointer text-center"
            >
              <File className="w-8 h-8 text-white" />
              <p className="text-white text-lg font-semibold mt-3">Past Papers</p>
            </Link>

          </div>

          <div className="w-full px-6 mt-6">
            <div className="mx-auto p-6
                 bg-quick-action-light dark:bg-quick-action-dark rounded-xl">

              {/* Section Title */}
              <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
                Quick Actions
              </h2>

              {/* Cards Grid */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 "
              >
                {/* Manage Subjects */}
                <Link
                  to="/admin/subjects"
                  className="flex flex-col sm:flex-row gap-3 items-center justify-center p-6 rounded-xl
                   bg-black dark:bg-white text-white dark:text-black
                   transform transition-transform duration-300 hover:scale-105 cursor-pointer text-center"
                >
                  <BookOpen className="w-6 h-6" />
                  <span className="font-medium">Manage Subjects</span>
                </Link>

                {/* Upload Files */}
                <Link
                  to="/admin/upload"
                  className="flex flex-col sm:flex-row gap-3 items-center justify-center p-6 rounded-xl
                   bg-black dark:bg-white text-white dark:text-black
                   transform transition-transform duration-300 hover:scale-105 cursor-pointer text-center"
                >
                  <Upload className="w-6 h-6" />
                  <span className="font-medium">Upload Files</span>
                </Link>

                {/* View All Files */}
                <Link
                  to="/admin/files"
                  className="flex flex-col sm:flex-row gap-3 items-center justify-center p-6 rounded-xl
                   bg-black dark:bg-white text-white dark:text-black
                   transform transition-transform duration-300 hover:scale-105 cursor-pointer text-center"
                >
                  <FileText className="w-6 h-6" />
                  <span className="font-medium">View All Files</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default AdminHome;
