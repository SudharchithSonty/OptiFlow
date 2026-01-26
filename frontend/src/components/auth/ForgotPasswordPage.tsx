import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type Step = 'email' | 'otp' | 'reset' | 'success';

export function ForgotPasswordPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer countdown for OTP
  useState(() => {
    if (step === 'otp' && resendTimer > 0 && !canResend) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isOtpComplete = otp.every(digit => digit !== '');
  const isPasswordValid = newPassword.length >= 8;
  const doPasswordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) return;

    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if email exists (mock)
    const validEmails = ['owner@company.com', 'planner@company.com', 'supervisor@company.com'];
    
    if (validEmails.includes(email)) {
      setStep('otp');
      setResendTimer(60);
      setCanResend(false);
    } else {
      setError('No account found with this email address.');
    }

    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpComplete) return;

    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const enteredOtp = otp.join('');
    const validOtp = '123456';

    if (enteredOtp === validOtp) {
      setStep('reset');
    } else if (enteredOtp === '999999') {
      setError('This verification code has expired. Please request a new one.');
    } else {
      setError('Invalid verification code. Please try again.');
      setOtp(['', '', '', '', '', '']);
    }

    setIsLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid || !doPasswordsMatch) return;

    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Success
    setStep('success');
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    setError('');
    setOtp(['', '', '', '', '', '']);
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {step !== 'success' && (
          <button
            onClick={() => step === 'email' ? navigate('/auth/login') : setStep('email')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{step === 'email' ? 'Back to login' : 'Back'}</span>
          </button>
        )}

        {/* Step 1: Email */}
        {step === 'email' && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-gray-600">
                Enter your email and we'll send you a verification code
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <form onSubmit={handleEmailSubmit}>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      disabled={isLoading}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        error
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isEmailValid || isLoading}
                  className={`w-full py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    !isEmailValid || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>
              </form>
            </div>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-gray-900 mb-2">Verify Code</h1>
              <p className="text-gray-600">
                Enter the 6-digit code sent to<br />
                <span className="text-gray-900">{email}</span>
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <form onSubmit={handleOtpSubmit}>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value && !/^\d$/.test(value)) return;
                          const newOtp = [...otp];
                          newOtp[index] = value;
                          setOtp(newOtp);
                          setError('');
                          if (value && index < 5) {
                            const nextInput = e.target.parentElement?.children[index + 1] as HTMLInputElement;
                            nextInput?.focus();
                          }
                        }}
                        disabled={isLoading}
                        className={`w-12 h-14 lg:w-14 lg:h-16 text-center text-xl border-2 rounded-lg focus:outline-none focus:ring-2 ${
                          error
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        } ${isLoading ? 'bg-gray-50' : 'bg-white'}`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isOtpComplete || isLoading}
                  className={`w-full py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    !isOtpComplete || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify Code</span>
                  )}
                </button>

                <div className="mt-6 text-center">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Resend code
                    </button>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Resend code in <span className="text-gray-900">{resendTimer}s</span>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 'reset' && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-gray-900 mb-2">Set New Password</h1>
              <p className="text-gray-600">
                Choose a strong password for your account
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <form onSubmit={handlePasswordReset}>
                <div className="mb-4">
                  <label htmlFor="new-password" className="block text-sm text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {newPassword && !isPasswordValid && (
                    <p className="text-sm text-red-600 mt-1">Password must be at least 8 characters</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="confirm-password" className="block text-sm text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {confirmPassword && !doPasswordsMatch && (
                    <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isPasswordValid || !doPasswordsMatch || isLoading}
                  className={`w-full py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    !isPasswordValid || !doPasswordsMatch || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
              </form>
            </div>
          </>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-gray-900 mb-2">Password Reset Successful!</h1>
              <p className="text-gray-600">
                Your password has been reset successfully
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <button
                onClick={() => navigate('/auth/login')}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}