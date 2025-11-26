import React from "react";
import { BookOpen, Pencil, Trash2 } from "lucide-react";

export default function CourseTable({ courses = [], onEdit, onDelete, loading = false }) {
  const truncateText = (text, limit) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  // skeleton row renderer
  const SkeletonRow = ({ keyIndex }) => (
    <div key={`skeleton-${keyIndex}`} className="flex flex-col sm:grid sm:grid-cols-6 px-4 sm:px-6 py-4 sm:py-5 gap-3 sm:items-center">
      <div className="flex items-center gap-3">
        <div className="min-w-[40px] min-h-[40px] rounded-lg animate-pulse bg-gray-200 dark:bg-gray-700" />
        <div className="w-20 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>

      <div className="sm:col-span-1">
        <div className="w-40 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="mt-2 w-48 h-3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>

      <div className="hidden sm:block">
        <div className="w-28 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>

      <div className="hidden sm:block">
        <div className="w-20 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>

      <div>
        <div className="w-28 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>

      <div className="flex items-center justify-start sm:justify-center gap-3 mt-2 sm:mt-0 flex-col md:flex-row">
        <div className="w-20 h-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="w-20 h-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="m-6 sm:m-6 bg-white dark:bg-navbar-dark rounded-xl overflow-hidden shadow-sm">
      <div className="hidden sm:grid grid-cols-6 px-6 py-4 bg-input-light dark:bg-[#111B2A] text-black dark:text-white font-semibold text-sm border-b border-b-black/10 dark:border-b-white/10">
        <p>Code</p>
        <p className="px-8">Title</p>
        <p>Department</p>
        <p>Semester</p>
        <p>Instructor</p>
        <p className="text-center">Actions</p>
      </div>

      {loading ? (
        // show 5 skeleton rows while loading
        <div className="divide-y border-t border-white/10 dark:border-black/10">
          {[...Array(5)].map((_, i) => <SkeletonRow keyIndex={i} />)}
        </div>
      ) : courses.length > 0 ? (
        <div className="divide-y border-t border-white/10 dark:border-black/10">
          {courses.map((c, i) => (
            <div
              key={c._id || `${c.subjectCode}-${i}`}
              className="flex flex-col sm:grid sm:grid-cols-6 px-4 sm:px-6 py-4 sm:py-5 bg-white dark:bg-navbar-dark gap-3 sm:items-center"
              role="row"
            >
              <div className="flex items-center gap-3">
                <div className="min-w-[40px] min-h-[40px] flex items-center justify-center bg-[#312c85] text-white p-2 rounded-lg text-lg">
                  <BookOpen />
                </div>
                <p className="font-semibold text-black dark:text-white">{c.subjectCode}</p>
              </div>

              <div className="sm:col-span-1">
                <p className="font-medium text-black dark:text-white">{c.subjectTitle}</p>
                <p className="text-gray-500 dark:text-gray-300 text-sm">{truncateText(c.description, 50)}</p>
              </div>

              <p className="hidden sm:block text-black dark:text-white">{c.department}</p>
              <p className="hidden sm:block text-black dark:text-white">{c.semester}</p>
              <p className="text-black dark:text-white">{c.instructorName}</p>

              <div className="flex items-center justify-start sm:justify-center gap-3 mt-2 sm:mt-0 flex-col md:flex-row">
                <button
                  onClick={() => onEdit?.(c._id)}
                  className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                  aria-label={`Edit ${c.subjectCode}`}
                >
                  <Pencil className="size-6" />
                  <span className="text-sm">Edit</span>
                </button>

                <button
                   onClick={() => onDelete(c._id)}
                  className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-600 hover:bg-red-600/50 dark:hover:bg-red-600/50 transition-colors duration-150"
                  aria-label={`Delete ${c.subjectCode}`}
                >
                  <Trash2 />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y border-t border-white/10 dark:border-black/10">
          <div className="flex flex-col items-center p-5">
            <BookOpen className="mx-auto mt-10 text-gray-500" size={40} />
            <p className="mt-5 text-2xl text-gray-500 dark:text-gray-500 font-semibold ">No subjects found</p>
          </div>
        </div>
      )}
    </div>
  );
}
