import React, { useContext, useState } from "react";
import { Lock, Mail, EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { validateEmail } from "../../util/util";
import axios from "axios";
import { toast } from "sonner";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { url } = useContext(AppContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = data;
    if (!validateEmail(email)) {
          setError("Please enter a valid email");
          return;
        }

    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    console.log(url)

    try {
      const response = await axios.post(
        `${url}/users/login`,
        { email, password },
        { withCredentials: true }
      );

      const message = response.data?.message || "Login successful";
      toast.success(message);
      setError("");

      const user = response.data?.userExists;
      console.log(user)
      console.log(user.IsAdmin)

      if (user?.IsAdmin) {
        navigate("/admin/home");
      } else {
        navigate("/home");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to login. Please try again.";
      toast.error(message);
      setError(message);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4 sm:px-6">
      <div className="flex flex-col items-center bg-form-light dark:bg-form-dark rounded-2xl p-5 sm:p-6 w-full max-w-md sm:max-w-lg">
        {/* Icon */}
        <div className="mt-2 sm:mt-4 inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-form-icon-background-light rounded-full dark:bg-form-icon-background-dark">
          <Lock className="size-7 sm:size-8 text-form-icon-light dark:text-form-icon-dark" />
        </div>

        {/* Title */}
        <div className="flex flex-col justify-center items-center text-center gap-3">
          <p className="mt-5 sm:mt-6 text-xl sm:text-2xl font-semibold text-black dark:text-white">
            ELP-UOJ
          </p>
          <p className="mt-3 sm:mt-2 text-sm sm:text-base text-black/60 dark:text-white/30">
            University of Jaffna E-Learning Platform
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 w-full rounded-lg" onSubmit={onLogin}>
          {/* Input fields */}
          <div className="flex flex-col space-y-4">
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

          {/* Login button */}
          <button
            type="submit"
            className="mt-6 sm:mt-6 w-full bg-black hover:bg-black/80 transition-all duration-200 py-2 rounded-lg text-white text-sm sm:text-base dark:bg-white dark:hover:bg-white/80 dark:text-black"
          >
            Login
          </button>

          {/* Links */}
          <div className="mt-5 flex flex-col items-center gap-4 text-center">
            <Link
              to="/send-otp"
              className="text-xs font-medium sm:text-[16px] text-form-link-light hover:text-form-link-light/70 dark:text-form-link-dark dark:hover:text-form-link-dark/70 transition-all duration-200"
            >
              Forgot Password?
            </Link>

            <p className="text-xs sm:text-[16px] text-black dark:text-white flex items-center gap-1">
              Don&apos;t have an account? &nbsp;&nbsp;&nbsp;
              <Link
                to="/register"
                className="text-form-link-light hover:text-form-link-light/70 dark:text-form-link-dark dark:hover:text-form-link-dark/70 font-medium transition-all duration-200"
              >
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
