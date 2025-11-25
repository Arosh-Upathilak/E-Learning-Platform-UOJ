import React, { useContext, useState } from "react";
import { Lock, EyeOff, Eye } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

function ForgotPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { url } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [data, setData] = useState({
    newpassword: "",
    reenternewpassword: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  // validation flags (live)
  const lengthValid = data.newpassword.length >= 6;
  const matchValid =
    data.reenternewpassword.length > 0 && data.newpassword === data.reenternewpassword;

  const canSubmit = lengthValid && matchValid && !loading;

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { newpassword, reenternewpassword } = data;

    if (!newpassword || !reenternewpassword) {
      setError("Please fill both password fields.");
      return;
    }

    if (!lengthValid) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!matchValid) {
      setError("Passwords do not match.");
      return;
    }

    if (!email) {
      setError("Missing user context (email or user id). Go back and retry the flow.");
      return;
    }

    try {
      setLoading(true);

      const payload = { password: newpassword };
      if (email) payload.email = email;

      const response = await axios.put(`${url}/users/forgotpassword`, payload, {
        withCredentials: true,
      });

      const message = response.data?.message || "Password reset successfully";
      toast.success(message);

      navigate("/"); // or navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
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
            Reset Password
          </p>
          <p className="mt-3 sm:mt-2 text-sm sm:text-base text-black/60 dark:text-white/30">
            Create a new password for{" "}
            <span className="text-form-link-light dark:text-form-link-dark text-sm sm:text-base break-all">
              {email || "your account"}
            </span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleOnSubmit} className="mt-6 w-full rounded-lg" noValidate>
          {/* Input fields */}
          <div className="flex flex-col space-y-4">
            {/* New Password */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="newpassword"
                className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold"
              >
                New Password
              </label>
              <div className="flex items-center bg-form-input-light rounded-lg px-3 py-2 dark:bg-form-input-dark">
                <Lock className="size-5 text-gray-400" />
                <input
                  id="newpassword"
                  name="newpassword"
                  className="ml-2 flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base"
                  placeholder="Enter the new password"
                  type={showPassword ? "text" : "password"}
                  value={data.newpassword}
                  onChange={onChangeHandler}
                  required
                  autoComplete="new-password"
                  aria-label="New password"
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="ml-2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-5 text-gray-400" /> : <Eye className="size-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="reenternewpassword"
                className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold"
              >
                Confirm Password
              </label>
              <div className="flex items-center bg-form-input-light rounded-lg px-3 py-2 dark:bg-form-input-dark">
                <Lock className="size-5 text-gray-400" />
                <input
                  id="reenternewpassword"
                  name="reenternewpassword"
                  className="ml-2 flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base"
                  placeholder="Confirm new password"
                  type={showPassword ? "text" : "password"}
                  value={data.reenternewpassword}
                  onChange={onChangeHandler}
                  required
                  autoComplete="new-password"
                  aria-label="Confirm new password"
                />
                <button type="button" onClick={handleTogglePassword} className="ml-2" aria-hidden>
                  {showPassword ? <EyeOff className="size-5 text-gray-400" /> : <Eye className="size-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="pt-1">
                <div className="flex items-center border border-red-500 rounded-lg bg-form-error-light dark:bg-form-error-dark p-3">
                  <p className="text-red-500 font-bold text-xs sm:text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* items turn light green when satisfied */}
          <div className="mt-5 flex flex-col bg-form-input-light rounded-lg dark:bg-form-input-dark p-3">
            <p className="text-gray-700 dark:text-gray-300">Password must:</p>
            <ul className="list-disc pl-7 mt-2">
              <li
                className={`${
                  lengthValid ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Be at least 6 characters long
              </li>
              <li
                className={`${
                  matchValid ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Match confirmation password
              </li>
            </ul>
          </div>

          {/* Reset button  */}
          <button
            type="submit"
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
            className={`mt-6 sm:mt-6 w-full transition-all duration-200 py-2 rounded-lg text-white text-sm sm:text-base ${
              !canSubmit
                ? "bg-black/20 dark:bg-white/20 text-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-black/80 dark:bg-white dark:hover:bg-white/80 dark:text-black"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
