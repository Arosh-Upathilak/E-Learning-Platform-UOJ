import React from 'react';
import { X } from "lucide-react";

function deleteFiles({setOpenDeleteFileBox}) {
  return (
    <div className='fixed z-10 w-full h-full bg-[#00000090] grid'>
      <form className="
        place-self-center
        w-full sm:w-[max(23vw,600px)]
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
          <h1 className="text-2xl">Delete File</h1>

          {/* close button - wrapped for better hit area on mobile */}
          <button
            type="button"
            onClick={() => setOpenDeleteFileBox(false)}
            className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close create subject"
          >
            <X className="cursor-pointer" />
          </button>
        </div>

        <div>
         
         <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
            Are you sure you want to delete <span className='text-black dark:text-white'>"Introduction to Python - Lecture 1"</span>? 
            <br/>This action cannot be undone.
         </div>

          {/* Actions -> stacked buttons on mobile */}
          <div className="flex flex-col sm:flex-row mt-4 gap-2">
            <button className="w-full sm:flex-1 border rounded-lg px-2 py-1.5 bg-black dark:bg-red-500 text-white dark:text-white font-bold hover:bg-red-500/80 dark:hover:bg-red-500/80 transition-all duration-200 border-none">Delete File</button>

            <button
              type="button"
              onClick={() => setOpenDeleteFileBox(false)}
              className="w-full sm:flex-1 border rounded-lg px-2 py-1.5 bg-black dark:bg-[#1b1f27] text-black dark:text-white font-bold hover:bg-white/50 dark:hover:bg-black/20 transition-all duration-200 border-none"
            >
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default deleteFiles