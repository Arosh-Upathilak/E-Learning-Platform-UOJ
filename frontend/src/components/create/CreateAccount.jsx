import React, { useContext, useState } from "react";
import { Lock, Mail, EyeOff, Eye, UserPlus, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { validateEmail } from "../../util/util";
import axios from "axios";
import { toast } from "sonner";

function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    username: "",
    email: "",
    department: "",
    semester: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { department, semester, url } = useContext(AppContext);

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const handleConfirmTogglePassword = (e) => {
    e.preventDefault();
    setShowConfirmPassword((prev) => !prev);
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setError(""); 
  };

  
  const onCreateAccount = async (e) => {
    e.preventDefault();
    setError("");

    const { username, email, password, confirmPassword, department, semester } =
      data;

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !department ||
      !semester
    ) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password does not match");
      return;
    }

    try {
      const response = await axios.post(`${url}/users/register`, {
        username,
        email,
        password,
        department,
        semester,
      });
      
      const message = response.data?.message || "Account created successfully";
      toast.success(message);
      setError("");

      const user = response.data?.user;

      if (user?.IsAdmin) {
        navigate("/admin/home");
      } else {
        navigate("/home");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create account.";
      toast.error(message);
      setError("");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4 sm:px-6 mt-8">
      <div className="flex flex-col items-center bg-form-light dark:bg-form-dark rounded-2xl p-5 sm:p-6 w-full max-w-md sm:max-w-lg">
        {/* Icon */}
        <div className="mt-2 sm:mt-4 inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-form-icon-background-light rounded-full dark:bg-form-icon-background-dark">
          <UserPlus className="size-7 sm:size-8 text-form-icon-light dark:text-form-icon-dark" />
        </div>

        {/* Title */}
        <div className="flex flex-col justify-center items-center text-center gap-3">
          <p className="mt-5 sm:mt-6 text-xl sm:text-2xl font-semibold text-black dark:text-white">
            ELP-UOJ
          </p>
          <p className="mt-3 sm:mt-2 text-sm sm:text-base text-black/60 dark:text-white/30">
            Join the University of Jaffna E-Learning Platform
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 w-full rounded-lg" onSubmit={onCreateAccount}>
          <div className="flex flex-col space-y-4">
            {/* Username */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                User Name
              </label>
              <div className="flex items-center bg-form-input-light rounded-lg px-3 py-2 dark:bg-form-input-dark">
                <User className="size-5 text-gray-400" />
                <input
                  className="ml-2 flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base"
                  placeholder="Enter the User Name"
                  type="text"
                  name="username"
                  value={data.username}
                  onChange={onChangeHandler}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                Email
              </label>
              <div className="flex items-center bg-form-input-light rounded-lg px-3 py-2 dark:bg-form-input-dark">
                <Mail className="size-5 text-gray-400" />
                <input
                  className="ml-2 flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base"
                  placeholder="Enter the email"
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={onChangeHandler}
                />
              </div>
            </div>

            {/* Department and Semester */}
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              {/* Department */}
              <div className="flex-1 flex flex-col space-y-2">
                <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                  Department
                </label>
                <div className="bg-form-input-light rounded-lg px-3 py-2 dark:bg-form-input-dark">
                  <select
                    className={`w-full bg-transparent outline-none text-sm sm:text-base 
                      ${
                        data.department
                          ? "text-black dark:text-white"
                          : "text-gray-400 dark:text-gray-400"
                      }
                    `}
                    name="department"
                    value={data.department}
                    onChange={onChangeHandler}
                  >
                    <option
                      value=""
                      disabled
                      className="bg-form-input-light dark:bg-form-input-dark text-gray-400 dark:text-gray-400"
                    >
                      Select Department
                    </option>
                    {department.map((dep) => (
                      <option
                        key={dep}
                        value={dep}
                        className="bg-form-input-light dark:bg-form-input-dark text-black dark:text-white"
                      >
                        {dep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Semester */}
              <div className="flex-1 flex flex-col space-y-2">
                <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                  Semester
                </label>
                <div className="bg-form-input-light rounded-lg px-3 py-2 dark:bg-form-input-dark">
                  <select
                    className={`w-full bg-transparent text-sm sm:text-base 
                      ${
                        data.semester
                          ? "text-black dark:text-white"
                          : "text-gray-400 dark:text-gray-400"
                      }
                    `}
                    name="semester"
                    value={data.semester}
                    onChange={onChangeHandler}
                  >
                    <option
                      value=""
                      disabled
                      className="bg-form-input-light dark:bg-form-input-dark text-gray-400 dark:text-gray-400"
                    >
                      Select Semester
                    </option>
                    {semester.map((sem) => (
                      <option
                        key={sem}
                        value={sem}
                        className="bg-form-input-light dark:bg-form-input-dark text-black dark:text-white"
                      >
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                Password
              </label>
              <div className="flex items-center bg-form-input-light rounded-lg px-3 py-2 dark:bg-form-input-dark">
                <Lock className="size-5 text-gray-400" />
                <input
                  className="ml-2 flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base"
                  placeholder="Enter the password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={onChangeHandler}
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="ml-2"
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-gray-400" />
                  ) : (
                    <Eye className="size-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Re-enter Password */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                ReEnter Password
              </label>
              <div className="flex items-center bg-form-input-light rounded-lg px-3 py-2 dark:bg-form-input-dark">
                <Lock className="size-5 text-gray-400" />
                <input
                  className="ml-2 flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base"
                  placeholder="ReEnter the password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={onChangeHandler}
                />
                <button
                  type="button"
                  onClick={handleConfirmTogglePassword}
                  className="ml-2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5 text-gray-400" />
                  ) : (
                    <Eye className="size-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="pt-1">
                <div className="flex items-center border border-red-500 rounded-lg bg-form-error-light dark:bg-form-error-dark p-3">
                  <p className="text-red-500 font-bold text-xs sm:text-sm">
                    {error}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Create Account */}
          <button
            type="submit"
            className="mt-6 w-full bg-black hover:bg-black/80 transition-all duration-200 py-2 rounded-lg text-white text-sm sm:text-base dark:bg-white dark:hover:bg-white/80 dark:text-black"
          >
            Create Account
          </button>

          {/* Links */}
          <div className="mt-5 flex flex-col items-center gap-4 text-center">
            <p className="text-xs sm:text-[16px] text-black dark:text-white flex items-center gap-1">
              Already have an account?
              <Link
                to="/"
                className="text-form-link-light hover:text-form-link-light/70 dark:text-form-link-dark dark:hover:text-form-link-dark/70 font-medium transition-all duration-200"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
