import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Sword, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { login, register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (success) navigate('/dashboard');
    } else {
      const success = await register(formData.name, formData.email, formData.password);
      if (success) navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Sword className="w-12 h-12 text-solo-purple" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? 'Welcome Back, Hunter' : 'Join the Guild'}
          </h2>
          <p className="text-gray-400 mt-2">
            {isLogin ? 'Enter your credentials to continue' : 'Create your hunter account'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-solo-gray/30 backdrop-blur-sm border border-solo-purple/30 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hunter Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-solo-dark border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-solo-purple focus:outline-none transition-colors"
                    placeholder="Enter your name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-solo-dark border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-solo-purple focus:outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-solo-dark border border-gray-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:border-solo-purple focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-solo-purple to-solo-blue hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Enter Guild' : 'Join Guild')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-solo-purple hover:text-purple-400 transition-colors"
            >
              {isLogin ? "Don't have an account? Join the Guild" : "Already a member? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;