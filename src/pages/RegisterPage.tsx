import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const result = await signUp(email, password, fullName);
    setLoading(false);
    
    if (result.success) {
      setSuccess('Account created successfully! Please check your email to verify your account.');
      // Clear form
      setEmail('');
      setPassword('');
      setFullName('');
    } else {
      setError(result.error || 'Sign up failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#D7A04D]" />
          <p className="text-sm text-gray-500">Creating account…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create GlideX Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the platform to start managing your car listings
          </p>
        </div>
        
        {success && (
          <div className="mb-4 flex items-start flex-shrink-0 space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div className="mt-0.5 text-sm text-green-600">{success}</div>
          </div>
        )}
        
        {error && (
          <div className="mb-4 flex items-start flex-shrink-0 space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="mt-0.5 text-sm text-red-600">{error}</div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 border-inset bg-gray-50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#D7A04D] sm:text-sm sm:leading-6"
            />
          </div>
          
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
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
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a
            href="#"
            className="font-medium text-[#D7A04D] hover:text-[#c59040]"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login', { replace: true });
            }}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}