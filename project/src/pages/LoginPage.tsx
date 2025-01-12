import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FormField } from '../components/CreatePost/FormField';

export function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: '',
    dob: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }
    if (!isLogin) {
      if (!formData.name || !formData.username || !formData.dob) {
        setError('All fields are required for signup');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id.toString());
        navigate('/feed');
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError(''); // Clear error when user types
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              id="email"
              label="Email"
              type="email"
              icon={<Mail />}
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />

            <FormField
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={<Lock />}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              }
            />

            {!isLogin && (
              <>
                <FormField
                  id="name"
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />

                <FormField
                  id="username"
                  label="Username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                />

                <FormField
                  id="dob"
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({
                  email: '',
                  password: '',
                  name: '',
                  username: '',
                  dob: ''
                });
                setError('');
              }}
              className="text-blue-400 hover:text-blue-300"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}