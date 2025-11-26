import React, { useContext, useState } from 'react';
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../util/util";

import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from "sonner";

function SendOtp() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { url } = useContext(AppContext);

  const onSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${url}/users/sendotp`,
        { email },
        { withCredentials: true }
      );

      const message = response.data?.message || "OTP sent successfully";
      toast.success(message);

      const userId = response.data?.id || undefined;

      navigate(`/verify-otp/${userId}`, { state: { email, userId } });
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4 sm:px-6">
      <div className="flex flex-col items-center bg-form-light dark:bg-form-dark rounded-2xl p-5 sm:p-6 w-full max-w-md sm:max-w-lg">

        <Link
          to="/"
          className="w-full self-start text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-all duration-200 flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="size-5" /> Back to Login
        </Link>

        <div className="mt-2 sm:mt-4 inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-form-icon-background-light rounded-full dark:bg-form-icon-background-dark">
          <Lock className="size-7 sm:size-8 text-form-icon-light dark:text-form-icon-dark" />
        </div>

        <div className="flex flex-col justify-center items-center text-center gap-3">
          <p className="mt-5 sm:mt-6 text-xl sm:text-2xl font-semibold text-black dark:text-white">
            ELP-UOJ
          </p>
          <p className="mt-2 sm:mt-2 text-sm sm:text-base text-black/60 dark:text-white/30">
            Enter your email address and we'll send you an OTP to reset your password
          </p>
        </div>

        <form onSubmit={onSendOtp} className="mt-6 w-full rounded-lg" noValidate>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                Email
              </label>
              <div className="flex items-center bg-form-input-light rounded-lg px-3 py-2 dark:bg-form-input-dark">
                <Mail className="size-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  className="ml-2 flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm sm:text-base"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  aria-label="Email address"
                />
              </div>
            </div>

            {error && (
              <div className="pt-1">
                <div className="flex items-center border border-red-500 rounded-lg bg-form-error-light dark:bg-form-error-dark p-3">
                  <p className="text-red-500 font-bold text-xs sm:text-sm">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full transition-all duration-200 py-2 rounded-lg text-white text-sm sm:text-base ${
                loading
                  ? 'bg-black/50 cursor-not-allowed dark:bg-white/50 dark:text-black/50'
                  : 'bg-black hover:bg-black/80 dark:bg-white dark:hover:bg-white/80 dark:text-black'
              }`}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SendOtp;
