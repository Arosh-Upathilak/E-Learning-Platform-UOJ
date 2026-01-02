import { useState } from 'react';
import axios from 'axios'
import React, { useEffect, useContext } from 'react';
import { AppContext } from "../../context/AppContext";
import { subjects, files } from './Data.js'


const Test = () => {
    const { url } = useContext(AppContext);
    const [subject, setSubject] = useState(subjects);
    const [file, setFile] = useState(files);
    const [time,setTime] = useState(60);
    const [reset, setReset] = useState(false);

    const uniqueDepartment = [...new Set(subject.map(s => s.department))]


    useEffect(() => {
  if (!reset) return;

  const timer = setInterval(() => {
    setTime(prev => {
      if (prev === 55) {
        clearInterval(timer);
        setReset(false);
        return prev;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [reset]);

    return (
        <div className='min-h-screen w-full text-white'>
<h1>
  {Math.floor(time / 60)}.
  {(time % 60).toString().padStart(2, "0")}
</h1>
            <button onClick={()=>setReset(true)}>Reset</button>
            <h1>Subject</h1>
            <div>uniqure departments are: {uniqueDepartment}</div>
            {subject.map((sub, i) => {
                return (
                    <div className="p-4 border rounded-lg space-y-1">
                        <h1><b>Subject Code:</b> {sub.subjectCode}</h1>
                        <h1><b>Subject Title:</b> {sub.subjectTitle}</h1>
                        <h1><b>Description:</b> {sub.description || "No description"}</h1>
                        <h1><b>Department:</b> {sub.department}</h1>
                        <h1><b>Semester:</b> {sub.semester}</h1>
                        <h1><b>Instructor:</b> {sub.instructorName}</h1>
                    </div>
                )
            })
            }
        </div>
    )
}

export default Test