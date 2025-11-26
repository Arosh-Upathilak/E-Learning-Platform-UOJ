import React, { useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { AppContext } from "../../context/AppContext";

function Footer() {
  const { theme, toggleTheme } = useContext(AppContext);

  return (
    <footer className="bg-footer-light dark:bg-footer-dark w-full mt-5">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-14 py-4 sm:py-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-center sm:text-left text-sm sm:text-base text-footer-text-light dark:text-footer-text-dark">
            © 2025 ELP-UOJ. University of Jaffna. All rights reserved.
          </p>

          <button
            onClick={toggleTheme}
            className="
              flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg 
              border border-footer-text-light text-footer-text-light bg-footer-button-light
              hover:bg-footer-text-light/20
              dark:border-footer-text-dark dark:text-footer-text-dark dark:bg-footer-button-dark
              dark:hover:bg-footer-text-dark/20
              transition-all duration-200
            "
          >
            {theme === "light" ? (
              <>
                <Moon className="size-4 sm:size-5" />
                <span className="text-sm sm:text-base">Dark mode</span>
              </>
            ) : (
              <>
                <Sun className="size-4 sm:size-5" />
                <span className="text-sm sm:text-base">Light mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
