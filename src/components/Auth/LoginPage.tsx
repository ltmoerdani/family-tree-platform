import React, { useState } from 'react';
import { Eye, EyeOff, TreePine, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

const ForgotPasswordForm: React.FC<{
  formData: LoginFormData;
  errors: LoginErrors;
  isLoading: boolean;
  successMessage: string;
  updateFormData: (field: keyof LoginFormData, value: string) => void;
  handleForgotPassword: (e: React.FormEvent) => void;
  onBack: () => void;
}> = ({ formData, errors, isLoading, successMessage, updateFormData, handleForgotPassword, onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <TreePine className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password</h1>
          <p className="text-gray-600">Masukkan email untuk reset password</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Masukkan email Anda"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Kirim Link Reset</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full text-gray-600 hover:text-gray-800 transition-colors"
            >
              Kembali ke Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSignUp) {
      // Handle sign up
      setSuccessMessage('Akun berhasil dibuat! Silakan login.');
      setIsSignUp(false);
      setFormData({ email: '', password: '' });
    } else {
      // Handle login
      await login(formData.email, formData.password);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      setErrors({ email: 'Masukkan email untuk reset password' });
      return;
    }

    // Simulate forgot password
    setSuccessMessage('Link reset password telah dikirim ke email Anda.');
    setShowForgotPassword(false);
    setFormData({ email: '', password: '' });
  };

  const updateFormData = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm
        formData={formData}
        errors={errors}
        isLoading={isLoading}
        successMessage={successMessage}
        updateFormData={updateFormData}
        handleForgotPassword={handleForgotPassword}
        onBack={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <TreePine className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Buat Akun Baru' : 'Masuk ke Pohon Keluarga'}
            </h1>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Daftar untuk mulai membangun pohon keluarga Anda' 
                : 'Kelola dan jelajahi pohon keluarga Anda'
              }
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {(errors.general || error) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{errors.general ?? error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="nama@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Lupa password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Daftar' : 'Masuk'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up / Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                  setSuccessMessage('');
                  setFormData({ email: '', password: '' });
                }}
                className="ml-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                {isSignUp ? 'Masuk di sini' : 'Daftar sekarang'}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Email:</strong> demo@familytree.com</p>
              <p><strong>Password:</strong> demo123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 Family Tree App. Kelola pohon keluarga dengan mudah dan aman.
          </p>
        </div>
      </div>
    </div>
  );
};