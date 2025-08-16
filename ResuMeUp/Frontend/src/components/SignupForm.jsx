import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Eye, EyeOff } from 'lucide-react';
import { authStyles } from '../assets/dummystyle';
import useAuthStore from '../store/authStore.js';

function SignupForm({ setCurrentPage }) {
  const navigate = useNavigate();
  const { signup, loading, error: storeError } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const success = await signup({
      name: fullName,
      email,
      password
    });
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className={authStyles.signupContainer}>
      {/* Header */}
      <div className={authStyles.headerWrapper}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 mb-2">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <h2 className={authStyles.signupTitle}>Claim Your Crown</h2>
        <p className={authStyles.signupSubtitle}>Begin your journey to greatness</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={authStyles.signupForm}>
        {(localError || storeError) && (
          <div className={authStyles.errorMessage}>
            {localError || storeError}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-600">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full p-4 bg-white border border-rose-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-slate-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full p-4 bg-white border border-rose-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-slate-600">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              className="w-full p-4 bg-white border border-rose-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-600">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              required
              className="w-full p-4 bg-white border border-rose-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={authStyles.signupSubmit}
        >
          {loading ? 'Creating your account...' : 'Create Account'}
        </button>

        <p className={authStyles.switchText}>
          Already a monarch?{' '}
          <button
            type="button"
            onClick={() => setCurrentPage('login')}
            className={authStyles.signupSwitchButton}
          >
            Return to your realm
          </button>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
