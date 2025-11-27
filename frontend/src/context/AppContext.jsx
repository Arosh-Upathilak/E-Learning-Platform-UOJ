import React, { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const url = process.env.REACT_APP_API_URL;
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [refreshToggleFile, setRefreshToggleFile] = useState(false);

  const department = [
    "Computer Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
  ];

  const semester = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 5 extends",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ];

  const fileType = ["Lecture note", "Pass Paper"]
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${url}/users/logout`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Logged out successfully");
        setUserData(null);
        navigate("/");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Logout failed";
      toast.error(message);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/users/dashboard`, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data?.user) {
        setUserData(response.data.user);
      } else {
        setUserData(null);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch data";
      console.log(message);
      setUserData(null);
    }
  }, [url]);


  

  const value = {
    theme,
    toggleTheme,
    department,
    semester,
    url,
    handleLogout,
    fetchData,
    userData,
    fileType,
    refreshToggle, 
    setRefreshToggle,
    refreshToggleFile, 
    setRefreshToggleFile
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      </AppContext.Provider>
  );
};
