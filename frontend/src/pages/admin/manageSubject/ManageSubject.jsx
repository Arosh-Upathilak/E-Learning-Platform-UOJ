import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from '../../../context/AppContext';
import CourseTable from "../../../components/courseTable/CourseTable";
import SubjectCreate from '../../../components/subjectCreate/SubjectCreate';
import UpdateSubject from '../../../components/updateSubject/UpdateSubject';
import DeleteSubject from '../../../components/deleteSubject/DeleteSubject';
import axios from 'axios';

function ManageSubject() {
  const { department: ctxDepartments = [], semester: ctxSemesters = [], url, refreshToggle } = useContext(AppContext);

  const [createBoxOpen, setCreateBoxOpen] = useState(false);
  const [upadateBoxOpen , setUpdateBoxOpen] = useState(false);
  const [deleteBoxOpen, setDeleteBoxOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterSemester, setFilterSemester] = useState("");

  useEffect(() => {
    const listSubjectRelatedUser = async () => {
      if (!url) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${url}/subjects/listSubjects`,
          { withCredentials: true }
        );

        const subjects = response.data.subjects || [];
        setSubjects(subjects);
      } catch (error) {
        console.log("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    listSubjectRelatedUser();
  }, [url, refreshToggle]);

  const distinctDepartments = useMemo(() => {
    const set = new Set();
    subjects.forEach(s => {
      if (s.department) set.add(s.department);
    });
    return Array.from(set).sort();
  }, [subjects]);

  const distinctSemesters = useMemo(() => {
    const set = new Set();
    subjects.forEach(s => {
      if (s.semester) set.add(s.semester);
    });
    return Array.from(set).sort();
  }, [subjects]);

  // Filter + search logic
  const filteredSubjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return subjects.filter((s) => {
      if (filterDepartment && s.department !== filterDepartment) return false;
      if (filterSemester && s.semester !== filterSemester) return false;

      if (!q) return true;
      const haystack = [
        s.subjectCode,
        s.subjectTitle,
        s.description,
        s.instructorName,
        s.department,
        s.semester
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [subjects, searchQuery, filterDepartment, filterSemester]);

  const totalSubjectsCount = subjects.length;
  const uniqueSemesterCount = distinctSemesters.length;
  const uniqueDepartmentCount = distinctDepartments.length;

  return (
    <div className='w-full min-h-screen'>
      {createBoxOpen && <SubjectCreate  setCreateBoxOpen={setCreateBoxOpen}/>} 
      {upadateBoxOpen && <UpdateSubject id={selectedSubjectId} setUpdateBoxOpen={setUpdateBoxOpen}/>}
      {deleteBoxOpen && <DeleteSubject id={selectedSubjectId} setDeleteBoxOpen={setDeleteBoxOpen} />}

      {/* NAVBAR AREA */}
      <nav className="bg-white dark:bg-navbar-dark px-4 sm:px-8 py-5">
        <Link to='/admin/home' className='text-black/50 hover:text-black flex flex-row gap-2 items-center dark:text-white/70 dark:hover:text-white'>
          <ArrowLeft className='h-5' />
          <p>Back to Dashboard</p>
        </Link>

        <div className='mt-3 flex flex-col sm:flex-col md:flex-row items-center md:items-center justify-center sm:items-center sm:justify-between gap-4'>
          <div className='flex flex-col gap-3'>
            <h1 className='text-xl sm:text-3xl text-black dark:text-white font-bold'>Subject Management</h1>
            <h3 className='text-black/50 dark:text-white/80 text-sm sm:text-base'>Manage all subjects and courses</h3>
          </div>

          {/* Create Button disabled while loading */}
          <button
            onClick={()=>setCreateBoxOpen(true)}
            disabled={loading}
            className={`px-3 py-2 rounded-lg flex flex-row gap-2 text-sm sm:text-base sm:self-auto items-center
              ${loading ? "opacity-60 cursor-not-allowed" : "bg-black dark:bg-white text-white dark:text-black"}`}
          >
            <Plus className="w-5 h-5" />
            <p>{loading ? "Loading..." : "Create Subject"}</p>
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <div className="mt-5 w-full">
        {/* Filters */}
        <div className="m-6 bg-white dark:bg-navbar-dark rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="flex items-center bg-input-light dark:bg-[#111B2A] rounded-lg px-3 py-2 border dark:border-white/60 border-black/60 ">
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Subjects (title, code, description, instructor)..."
                className="ml-2 w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
              />
            </div>

            {/* Department Dropdown */}
            <div>
              <select
                name="department"
                id="department"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full bg-input-light dark:bg-[#111B2A] text-black dark:text-white py-2 px-3 rounded-lg border dark:border-white/60 border-black/60 cursor-pointer"
              >
                <option value="">All Departments</option>

                {/* prefer list from fetched subjects, fallback to context list */}
                {distinctDepartments.length > 0
                  ? distinctDepartments.map((dep) => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))
                  : ctxDepartments.map((dep) => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))
                }
              </select>
            </div>

            {/* Semester Dropdown */}
            <div>
              <select
                name="semester"
                id="semester"
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="w-full bg-input-light dark:bg-[#111B2A] text-black dark:text-white py-2 px-3 rounded-lg border dark:border-white/60 border-black/60  cursor-pointer"
              >
                <option value="">All Semesters</option>

                {distinctSemesters.length > 0
                  ? distinctSemesters.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))
                  : ctxSemesters.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))
                }
              </select>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="p-5 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-navbar-dark rounded-xl p-4 flex flex-col items-center">
            <p className="text-black/70 dark:text-white/70 text-xl">Total Subjects</p>
            <p className="text-xl font-semibold text-black dark:text-white">{totalSubjectsCount}</p>
          </div>

          <div className="bg-white dark:bg-navbar-dark rounded-xl p-4 flex flex-col items-center">
            <p className="text-black/70 dark:text-white/70 text-xl">Semesters</p>
            <p className="text-xl font-semibold text-black dark:text-white">{uniqueSemesterCount}</p>
          </div>

          <div className="bg-white dark:bg-navbar-dark rounded-xl p-4 flex flex-col items-center">
            <p className="text-black/70 dark:text-white/70 text-xl">Departments</p>
            <p className="text-xl font-semibold text-black dark:text-white">{uniqueDepartmentCount}</p>
          </div>
        </div>

        {/* Table */}
        <CourseTable
          courses={filteredSubjects}
          onEdit={(id) => { setSelectedSubjectId(id); setUpdateBoxOpen(true); }}
          onDelete={(id) => {setSelectedSubjectId(id); setDeleteBoxOpen(true);}}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default ManageSubject;
