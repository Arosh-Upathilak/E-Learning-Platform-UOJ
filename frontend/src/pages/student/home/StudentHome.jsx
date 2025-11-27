import React, { useContext, useEffect, useState, useCallback } from 'react'
import Navbar from '../../../components/navbar/Navbar';
import { ChevronDown, ChevronRight, Folder, Search, BookOpen } from 'lucide-react';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

function StudentHome() {
  const { department = [], semester = [], url = "" } = useContext(AppContext) || {};
  const [openMap, setOpenMap] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState("");
  const [query, setQuery] = useState("");             
  const [appliedQuery, setAppliedQuery] = useState(""); 

  useEffect(() => {
    const fetchSubject = async () => {
      if (!url) return;
      try {
        setLoading(true);
        const response = await axios.get(`${url}/subjects/listAllSubjects`, { withCredentials: true });
        const subs = Array.isArray(response?.data?.subjects) ? response.data.subjects : [];
        setSubjects(subs);
      } catch (e) {
        console.log(e);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSubject()
  }, [url])

  const toggle = (s) =>
    setOpenMap((prev) => ({ ...prev, [s]: !prev[s] }));

  const getSemesterFromSubject = (sub) =>
    (sub?.semester ?? sub?.semesterName ?? sub?.sem ?? sub?.term ?? "").toString();

  useEffect(() => {
    const handler = setTimeout(() => {
      setAppliedQuery(query.trim());
    }, 300); 

    return () => clearTimeout(handler);
  }, [query]);

  const subjectMatchesFilters = useCallback((sub) => {
    if (selectedDepartment) {
      const subDept = (sub.department ?? sub.dept ?? "").toString();
      if (!subDept) return false;
      if (subDept.toLowerCase() !== selectedDepartment.toString().toLowerCase()) return false;
    }

    if (selectedSemesterFilter) {
      const subSem = getSemesterFromSubject(sub).toLowerCase();
      const filterSem = selectedSemesterFilter.toString().toLowerCase();
      if (!(subSem === filterSem || subSem.includes(filterSem))) return false;
    }

    if (appliedQuery) {
      const q = appliedQuery.toLowerCase();
      const title = (sub.subjectTitle ?? sub.title ?? sub.name ?? sub.subjectName ?? "").toString().toLowerCase();
      const code = (sub.subjectCode ?? sub.code ?? "").toString().toLowerCase();
      const instr = (sub.instructorName ?? sub.teacher ?? sub.instructor ?? sub.lecturer ?? "").toString().toLowerCase();
      const desc = (sub.description ?? sub.desc ?? sub.summary ?? "").toString().toLowerCase();

      if (!(title.includes(q) || code.includes(q) || instr.includes(q) || desc.includes(q))) {
        return false;
      }
    }

    return true;
  }, [selectedDepartment, selectedSemesterFilter, appliedQuery]);

  return (
    <div>
      <Navbar />

      <div className='p-5'>
        <div className='w-full bg-white dark:bg-navbar-dark rounded-xl flex flex-col'>
          <h1 className='p-4 text-2xl text-black/75 dark:text-white/75 '>Browse Courses</h1>

          <div className='w-full p-3'>
            <div className='flex flex-col gap-3 sm:flex-row' >
              <div className='flex flex-1 items-center flex-row justify-center bg-[#eff3ff] dark:bg-[#111B2A] rounded-lg px-3 py-2 '>
                <Search className="text-gray-400 w-5 h-5" />
                <input
                  placeholder='Search Subject...'
                  className='ml-2 w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className='flex-1 '>
                <select
                  name="department"
                  id="department"
                  className="w-full bg-[#eff3ff] dark:bg-[#111B2A] text-black dark:text-white py-2 px-3 outline-none rounded-lg cursor-pointer"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {department.map((department) => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>

              <div className='flex-1 '>
                <select
                  name="department"
                  id="department"
                  className="w-full bg-[#eff3ff] dark:bg-[#111B2A] text-black dark:text-white py-2 px-3 outline-none rounded-lg cursor-pointer"
                  value={selectedSemesterFilter}
                  onChange={(e) => setSelectedSemesterFilter(e.target.value)}
                >
                  <option value="">All Semester</option>
                  {semester.map((semester) => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {semester.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No semesters available
            </div>
          ) : (
            semester.map((s) => {
              const subsForS = subjects.filter(sub => {
                const subSem = getSemesterFromSubject(sub).toLowerCase();
                const semesterMatch = subSem === s.toString().toLowerCase() || subSem.includes(s.toString().toLowerCase());
                if (!semesterMatch) return false;
                return subjectMatchesFilters(sub);
              });

              return (
                <div
                  key={s}
                  className="bg-white dark:bg-navbar-dark rounded-xl text-black  hover:bg-white/60 hover:dark:bg-navbar-dark/60 transition p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-md dark:bg-[#171d2a] bg-[#eff3ff]">
                        <Folder className="w-5 h-5 text-[#646fcd]" />
                      </div>

                      <div>
                        <h2 className="text-lg  text-black font-semibold dark:text-white">
                          {s}
                        </h2>
                        <p className="text-sm text-black/50 dark:text-gray-300 mt-1">{subsForS.length} course{subsForS.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggle(s)}
                      aria-label={`toggle-${s}`}
                      className="p-2 rounded-md hover:bg-white/5"
                    >
                      {openMap[s] ? (
                        <ChevronDown className="w-5 h-5 dark:text-white text-black" />
                      ) : (
                        <ChevronRight className="w-5 h-5 dark:text-white text-black" />
                      )}
                    </button>
                  </div>

                  <div
                    className={`mt-4 space-y-3 overflow-hidden transition-all duration-200 ${openMap[s] ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    {loading ? (
                      <div className="text-gray-400">Loading courses...</div>
                    ) : subsForS.length === 0 ? (
                      <div className="p-4 rounded-lg bg-white/6 dark:bg-navbar-dark hover:bg-white/60 hover:dark:bg-navbar-dark/60">
                        <p className="text-gray-400">No courses in this semester.</p>
                      </div>
                    ) : (
                      subsForS.map((c, i) => (
                        <div key={c.id ?? i} className='flex justify-between items-center bg-white/10 dark:bg-navbar-dark border border-black/50 dark:border-white/10 rounded-lg p-4 sm:flex-row flex-col'>
                          <div className="flex gap-4 items-start ">
                            <div className="flex items-center justify-center w-12 h-12 rounded-md dark:bg-[#2a2f42] bg-[#eff3ff]">
                              <BookOpen className="w-5 h-5 text-[#8b7af6] " />
                            </div>

                            <div className="flex-1">
                              <h3 className="text-xl font-semibold dark:text-white text-black">
                                {c.subjectTitle ?? c.title ?? c.name ?? c.subjectName ?? 'Untitled Subject'}
                              </h3>
                              <p className="text-sm text-gray-300 mt-1">
                                <span className="font-medium text-lg dark:text-white text-black">
                                  {c.subjectCode ?? c.code ?? ''}
                                </span>
                                {(c.instructorName ?? c.teacher ?? c.instructor) ? (
                                  <span className="dark:text-gray-300  text-gray-500 ml-2">{c.instructorName ?? c.teacher ?? c.instructor}</span>
                                ) : null}
                              </p>
                              <p className="text-lg text-[#8b7af6] font-bold mt-2">{c.department ?? ''}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400  mt-2">{c.description ?? c.desc ?? c.summary ?? ''}</p>
                            </div>
                          </div>

                          <Link to={`/home/subject/${c._id ?? ''}`} className='px-2 py-1 bg-black dark:bg-white hover:dark:bg-white/80 hover:bg-black/80 font-bold text-white dark:text-black rounded-lg'>Open Subject</Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  )
}

export default StudentHome
