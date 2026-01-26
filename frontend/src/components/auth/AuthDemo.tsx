import { useNavigate } from 'react-router';
import { LogIn, Mail, Key, ArrowRight } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

export function AuthDemo() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const authPages = [
    {
      id: 'login',
      title: 'Login Page',
      description: 'Email + password authentication',
      icon: LogIn,
      route: '/auth/login',
      features: ['Email validation', 'Password visibility toggle', 'Remember me', 'Invalid credentials state'],
    },
    {
      id: 'otp',
      title: 'OTP Verification',
      description: '6-digit verification code',
      icon: Mail,
      route: '/auth/otp',
      features: ['Auto-advance inputs', 'Paste support', 'Resend timer (60s)', 'Expired code handling'],
    },
    {
      id: 'forgot',
      title: 'Forgot Password',
      description: 'Multi-step password reset',
      icon: Key,
      route: '/auth/forgot-password',
      features: ['Email verification', 'OTP confirmation', 'Password reset', 'Success confirmation'],
    },
  ];

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Authentication Screens Demo</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Tablet-first (1024×768) and desktop-responsive (1440×900) authentication flows
          </p>
        </div>

        {/* Auth Pages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {authPages.map((page) => {
            const Icon = page.icon;
            return (
              <div
                key={page.id}
                className={`rounded-lg border p-6 hover:shadow-lg transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className={`mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{page.title}</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{page.description}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {page.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="text-blue-600 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate(page.route)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>View Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Demo Credentials */}
        <div className={`rounded-lg border p-6 mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Demo Credentials & Test Cases</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h3 className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Login Credentials</h3>
              <div className={`space-y-1 text-xs font-mono p-3 rounded ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>owner@company.com / owner123</p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>planner@company.com / planner123</p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>supervisor@company.com / supervisor123</p>
              </div>
            </div>

            <div>
              <h3 className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>OTP Test Codes</h3>
              <div className={`space-y-1 text-xs font-mono p-3 rounded ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <p className="text-green-700">Valid: 123456</p>
                <p className="text-orange-700">Expired: 999999</p>
                <p className="text-red-700">Invalid: Any other code</p>
              </div>
            </div>

            <div>
              <h3 className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>States to Test</h3>
              <ul className={`space-y-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                <li>• Loading states</li>
                <li>• Invalid credentials</li>
                <li>• OTP expired</li>
                <li>• Password mismatch</li>
                <li>• Resend timer</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className={`rounded-lg border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Key Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h3 className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Visual States</h3>
              <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>✓ Default state (empty form)</li>
                <li>✓ Loading state (spinner + disabled)</li>
                <li>✓ Error state (red banner + borders)</li>
                <li>✓ Success state (green confirmation)</li>
                <li>✓ Disabled state (gray, not clickable)</li>
              </ul>
            </div>

            <div>
              <h3 className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Interactions</h3>
              <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>✓ Form validation (real-time)</li>
                <li>✓ Password show/hide toggle</li>
                <li>✓ OTP auto-advance</li>
                <li>✓ Clipboard paste support</li>
                <li>✓ Countdown timers (60s)</li>
              </ul>
            </div>

            <div>
              <h3 className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Responsive Design</h3>
              <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>✓ Tablet-optimized (1024×768)</li>
                <li>✓ Desktop-friendly (1440×900)</li>
                <li>✓ Touch targets (48px min)</li>
                <li>✓ Mobile support (320px+)</li>
              </ul>
            </div>

            <div>
              <h3 className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Accessibility</h3>
              <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>✓ Keyboard navigation</li>
                <li>✓ Screen reader support</li>
                <li>✓ High contrast (WCAG AA)</li>
                <li>✓ Focus indicators</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to App */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Main App
          </button>
        </div>
      </div>
    </div>
  );
}