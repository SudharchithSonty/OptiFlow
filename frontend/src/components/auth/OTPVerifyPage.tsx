import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, AlertCircle, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

export function OTPVerifyPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  
  // CRITICAL: Store email and role in component state on mount to prevent loss on re-renders
  const [userEmail] = useState(() => {
    const email = location.state?.email || 'user@company.com';
    console.log('📧 OTPVerifyPage initialized with email:', email);
    return email;
  });
  
  const [userRole] = useState<'owner' | 'planner' | 'supervisor'>(() => {
    const role = location.state?.role || 'planner';
    console.log('👤 OTPVerifyPage initialized with role:', role);
    return role;
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (resendTimer > 0 && !canResend) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, canResend]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    setIsExpired(false);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle paste
    if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('');
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        const lastFilledIndex = Math.min(digits.length, 5);
        inputRefs.current[lastFilledIndex]?.focus();
      });
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpComplete) return;

    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const enteredOtp = otp.join('');
    
    // Role-specific OTP codes
    const validOtpCodes: Record<string, string> = {
      'owner': '111111',
      'planner': '222222',
      'supervisor': '333333',
    };
    
    const validOtp = validOtpCodes[userRole] || '123456';
    
    console.log('🔐 Validating OTP:', enteredOtp, 'Expected for', userRole, ':', validOtp);

    if (enteredOtp === validOtp) {
      // Success
      setSuccessMessage('Verification successful!');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🚀 OTP verified! Navigating to /app with role:', userRole);
      
      // Navigate to main app - don't use replace to ensure state is passed
      navigate('/app', { state: { role: userRole } });
    } else if (enteredOtp === '999999') {
      // Simulate expired OTP
      setIsExpired(true);
      setError('This verification code has expired. Please request a new one.');
    } else {
      // Invalid OTP
      setError('Invalid verification code. Please try again.');
      // Clear OTP
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }

    setIsLoading(false);
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    setError('');
    setIsExpired(false);
    setOtp(['', '', '', '', '', '']);
    
    // Simulate resend API call
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // Show success message
    setSuccessMessage('Verification code resent successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    inputRefs.current[0]?.focus();
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/auth/login')}
          className={`flex items-center gap-2 mb-6 transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to login</span>
        </button>

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className={isDarkMode ? 'text-white mb-2' : 'text-gray-900 mb-2'}>Verify Your Email</h1>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            We've sent a 6-digit code to<br />
            <span className={isDarkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'}>{userEmail}</span>
          </p>
        </div>

        {/* OTP Card */}
        <div className={`rounded-2xl shadow-xl p-6 lg:p-8 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          <form onSubmit={handleSubmit}>
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800">{error}</p>
                  {isExpired && (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-sm text-red-700 hover:text-red-800 mt-2 underline"
                    >
                      Request a new code
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* OTP Input */}
            <div className="mb-6">
              <label className={`block text-sm mb-3 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Enter verification code
              </label>
              <div className="flex gap-2 justify-center">
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
                    disabled={isLoading}
                    className={`w-12 h-14 lg:w-14 lg:h-16 text-center text-2xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } ${
                      error || isExpired
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : digit
                        ? `border-blue-500 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`
                        : `${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} focus:ring-blue-500 focus:border-blue-500`
                    } ${isLoading ? `${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} cursor-not-allowed opacity-60` : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isOtpComplete || isLoading}
              className={`w-full py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                !isOtpComplete || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
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

            {/* Resend Timer */}
            <div className="mt-6 text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  Resend verification code
                </button>
              ) : (
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Resend code in{' '}
                  <span className={isDarkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'}>
                    {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                  </span>
                </p>
              )}
            </div>
          </form>

          {/* Demo Info */}
          <div className={`mt-6 p-4 rounded-lg border ${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
              Demo OTP Code for {userRole.charAt(0).toUpperCase() + userRole.slice(1)}:
            </p>
            <div className={`space-y-1 text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              <p className="font-mono text-lg font-bold">
                {userRole === 'owner' && '111111 👨‍💼'}
                {userRole === 'planner' && '222222 👨‍💻'}
                {userRole === 'supervisor' && '333333 👷‍♀️'}
              </p>
              <div className="text-xs mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                <p>Other codes:</p>
                <p className="font-mono">Expired: 999999</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Didn't receive the code?{' '}
            <button
              onClick={() => navigate('/auth/login')}
              className="text-blue-600 hover:text-blue-700"
            >
              Try a different email
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}