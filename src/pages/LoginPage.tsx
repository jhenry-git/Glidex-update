import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const result = await signIn(email, password);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error || 'Sign in failed');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const result = await resetPassword(resetEmail);
    setLoading(false);
    
    if (result.success) {
      setShowPasswordReset(false);
      setResetEmail('');
      alert('Password reset email sent!');
    } else {
      setError(result.error || 'Password reset failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#D7A04D]" />
          <p className="text-sm text-gray-500">Signing in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to GlideX
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your dashboard and manage your car listings
          </p>
        </div>
        
        {showPasswordReset ? (
          <div className="mt-8 space-y-6">
            <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 border-inset bg-gray-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#D7A04D] sm:text-sm sm:leading-6"
                />
              </div>
              
              <div className="flex items-center justify-between">
                 <button
                   type="button"
                   onClick={() => setShowPasswordReset(false)}
                   className="text-sm font-medium text-gray-500 hover:text-gray-700"
                 >
                   Back to sign in
                 </button>
                 <button
                   type="submit"
                   disabled={loading}
                   className="px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-[#D7A04D] hover:bg-[#c59040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 focus:ring-[#D7A04D] disabled:opacity-50 disabled:pointer-events-none"
                 >
                   {loading ? 'Sending...' : 'Send Email'}
                 </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 flex items-start flex-shrink-0 space-x-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="mt-0.5 text-sm text-red-600">{error}</div>
              </div>
            )}
            
            <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 border-inset bg-gray-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#D7A04D] sm:text-sm sm:leading-6"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-[#D7A04D] hover:text-[#c59040]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPasswordReset(true);
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 border-inset bg-gray-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#D7A04D] sm:text-sm sm:leading-6"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-[#D7A04D] hover:bg-[#c59040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 focus:ring-[#D7A04D] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
            
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <a
                href="#"
                className="font-medium text-[#D7A04D] hover:text-[#c59040]"
              >
                Sign up
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}