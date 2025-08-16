import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { authStyles } from '../assets/dummystyle.js';
import useAuthStore from '../store/authStore';

function LoginForm({ setCurrentPage }) {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className={authStyles.container}>
      {/* Header */}
      <div className={authStyles.headerWrapper}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 mb-2">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h2 className={authStyles.title}>Welcome Back, Monarch</h2>
        <p className={authStyles.subtitle}>Enter your credentials to access your realm</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={authStyles.form}>
        {error && (
          <div className={authStyles.errorMessage}>
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-slate-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full p-4 bg-white border border-violet-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all outline-none"
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
              className="w-full p-4 bg-white border border-violet-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={authStyles.submitButton}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <p className={authStyles.switchText}>
          Not a monarch yet?{' '}
          <button
            type="button"
            onClick={() => setCurrentPage('signup')}
            className={authStyles.switchButton}
          >
            Create your legacy
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
