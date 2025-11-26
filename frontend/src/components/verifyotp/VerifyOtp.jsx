import React, { useState, useRef, useEffect, useContext } from "react";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

function VerifyOtp() {
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const userId = location.state?.userId;
  const { url } = useContext(AppContext);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError("");

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
        return;
      }
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (timeLeft > 0) return;
    if (!email && !userId) {
      setError("Email or user id missing — go back and enter your email.");
      return;
    }

    try {
      setResendLoading(true);
      setError("");
      await axios.post(
        `${url}/users/sendotp`,
        { email },
        { withCredentials: true }
      );
      toast.success("OTP resent");
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(60);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend OTP";
      setError(msg);
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    if (!email && !userId) {
      setError("Email or user id missing — go back and enter your email.");
      return;
    }

    try {
      setLoading(true);
      const payload = { otp: code };
      if (email) payload.email = email;
      if (userId) payload.userId = userId;

      const res = await axios.post(`${url}/users/verifyotp`, payload, { withCredentials: true });
      const message = res.data?.message || "OTP verified";
      toast.success(message);

      navigate(`/forgot-password/${userId || "guest"}`, { state: { email } });
    } catch (err) {
      const msg = err.response?.data?.message || "OTP verification failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4 sm:px-6">
      <div className="flex flex-col items-center bg-form-light dark:bg-form-dark rounded-2xl p-5 sm:p-6 w-full max-w-md sm:max-w-lg">
        {/* Back button */}
        <Link
          to={userId ? `/send-otp/${userId}` : "/send-otp"}
          className="w-full self-start text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-all duration-200 flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="size-5" /> Back
        </Link>

        {/* Title */}
        <div className="flex flex-col justify-center items-center text-center gap-2">
          <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-semibold text-black dark:text-white">
            Enter OTP
          </p>
          <p className="text-sm sm:text-base text-black/60 dark:text-white/30">
            We've sent a 6-digit code to
          </p>
          <p className="text-form-link-light dark:text-form-link-dark text-sm sm:text-base break-all">
            {email || (userId ? `user id: ${userId}` : "unknown")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 rounded-lg no-validate">
          <div className="flex flex-col gap-4">
            {/* OTP boxes */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                OTP
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-10 sm:w-12 sm:h-12 text-center rounded-lg bg-form-input-light dark:bg-form-input-dark text-lg sm:text-xl text-gray-900 dark:text-gray-100 outline-none border border-transparent focus:border-form-link-light dark:focus:border-form-link-dark"
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
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

            {/* Resend OTP */}
            <button
              onClick={handleResend}
              type="button"
              className="mt-3 flex flex-row justify-center items-center gap-3 text-sm sm:text-base disabled:opacity-50"
              disabled={timeLeft > 0 || resendLoading}
            >
              <RefreshCw className="size-5 text-form-link-light dark:text-form-link-dark" />
              <span className="text-form-link-light dark:text-form-link-dark">
                {timeLeft > 0 ? "Resend OTP in" : resendLoading ? "Resending..." : "Resend OTP"}
              </span>
              {timeLeft > 0 && (
                <span className="text-form-link-light dark:text-form-link-dark">{timeLeft}s</span>
              )}
            </button>

            {/* Verify OTP */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-black hover:bg-black/80 transition-all duration-200 py-2 rounded-lg text-white text-sm sm:text-base dark:bg-white dark:hover:bg-white/80 dark:text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
