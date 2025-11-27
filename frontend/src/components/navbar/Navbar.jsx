import React, { useContext } from "react";
import { LogOut } from "lucide-react";
import { AppContext } from "../../context/AppContext";

function Navbar() {
  const { handleLogout, userData } = useContext(AppContext);

  return (
    <nav className="bg-white dark:bg-navbar-dark px-4 py-5">
      <div
        className="
          mx-auto 
          flex flex-col gap-3 
          items-center 
          sm:flex-row sm:justify-between sm:items-center
        "
      >
        {userData.IsAdmin ?
          <div className="flex flex-col ">
            <h1 className="text-xl font-bold text-black dark:text-white text-center sm:text-left">
              Admin Dashboard
            </h1>
            <h3 className="font-bold text-gray-900 dark:text-white/50 text-center sm:text-left">
              ELP-UOJ Administration Panel
            </h3>
          </div>
          :
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
            E-Learning Platform UOJ
            <br />
            <p className="text-gray-500 dark:text-white/50 text-lg">Welcome back, <span className="text-gray-900 dark:text-white">{userData.username}</span></p>
          </h1>
          
        }

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2 
            px-3 py-2 rounded-lg border 
            text-sm font-medium
            text-black dark:text-white 
            border-gray-300 dark:border-gray-600
            hover:bg-white/70 dark:hover:bg-navbar-dark/60
            transition-all duration-200
          "
        >
          <LogOut className="size-5" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
