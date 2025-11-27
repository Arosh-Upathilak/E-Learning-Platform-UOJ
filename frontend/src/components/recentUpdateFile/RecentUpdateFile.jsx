import { Clock, FileText } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function RecentUpdateFile({ rows = [], showViewAll = true }) {
  const MAX = 3;
  const visible = (rows || []).slice(0, MAX);

  const getFormat = (fileName) => {
    if (!fileName) return "";
    const parts = fileName.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString("en-US");
  };

  return (
    <div className="w-full p-6 mx-auto">
      <div className="bg-white dark:bg-navbar-dark rounded-xl p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-black/70 dark:text-white/70">
            <Clock className="w-8 h-8 text-indigo-300 bg-indigo-600/20 p-1.5 rounded-full" />
            Recent Uploads
          </h3>
        </div>

        <div className="block sm:hidden">
          {visible.length === 0 ? (
            <div className="py-6 text-center text-black/70 dark:text-white/70">No recent uploads</div>
          ) : (
            <ul className="space-y-3">
              {visible.map((r, idx) => {
                const format = getFormat(r.fileName);
                return (
                  <li key={r._id ?? idx} className="bg-white dark:bg-navbar-dark rounded-lg p-3 flex items-start gap-3">
                    <div className="min-w-[44px] min-h-[44px] rounded-md bg-[#e0e7ff] dark:bg-[#1b2740] flex items-center justify-center text-indigo-300">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="text-black/70 dark:text-white/70 font-semibold text-sm leading-tight">
                        {r.fileTitle}
                      </div>

                      <div className="text-xs text-black/70 dark:text-white/70 mt-1">
                        {r.subject} • {format} • {r.fileSize}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="hidden sm:block">
          {visible.length === 0 ? (
            <div className="py-6 text-center text-black/70 dark:text-white/70">No recent uploads</div>
          ) : (
            <ul className="space-y-3">
              {visible.map((r, idx) => {
                const format = getFormat(r.fileName);
                const onlyDate = formatDate(r.createdAt);
                return (
                  <li key={r._id ?? idx} className="bg-white dark:bg-navbar-dark rounded-lg p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-md bg-[#e0e7ff] dark:bg-[#1b2740] flex items-center justify-center text-indigo-300">
                        <FileText className="w-6 h-6" />
                      </div>

                      <div>
                        <div className="text-black/70 dark:text-white/70 font-semibold">{r.fileTitle}</div>

                        <div className="text-sm text-black/70 dark:text-white/70 mt-1">
                          {r.subject} • {format} • {r.fileSize}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-black/70 dark:text-white/70 text-sm">{onlyDate}</div>
                      <div className="text-xs text-black/70 dark:text-white/70 mt-1">{r.instructorName}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {rows.length > MAX && (
          <div className="mt-4 text-center">
            <Link
              to="/admin/upload"
              className="text-lg inline-block  px-4 py-2 border dark:border-white/40 border-black/40 text-black/70 dark:text-white/70  rounded-lg hover:bg-gray-300 hover:dark:bg-black/20"
            >
              View more files
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
