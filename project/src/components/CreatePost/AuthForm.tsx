import React from 'react';
import { Mail, Lock, User, Calendar, Eye, EyeOff } from 'lucide-react';
import { FormField } from './FormField';

interface AuthFormProps {
  isLogin: boolean;
  formData: {
    email: string;
    password: string;
    name?: string;
    username?: string;
    dob?: string;
  };
  showPassword: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onToggleMode: () => void;
  isSubmitting?: boolean;
}

export function AuthForm({
  isLogin,
  formData,
  showPassword,
  onSubmit,
  onChange,
  onTogglePassword,
  onToggleMode,
  isSubmitting = false
}: AuthFormProps) {
  return (
    <div className="max-w-md w-full mx-auto">
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          id="email"
          label="Email"
          type="email"
          icon={<Mail />}
          value={formData.email}
          onChange={onChange}
          placeholder="your@email.com"
          required
        />

        <FormField
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          icon={<Lock />}
          value={formData.password}
          onChange={onChange}
          placeholder="••••••••"
          required
          endIcon={
            <button
              type="button"
              onClick={onTogglePassword}
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
              icon={<User />}
              value={formData.name || ''}
              onChange={onChange}
              placeholder="John Doe"
              required
            />

            <FormField
              id="username"
              label="Username"
              type="text"
              icon={<User />}
              value={formData.username || ''}
              onChange={onChange}
              placeholder="johndoe"
              required
            />

            <FormField
              id="dob"
              label="Date of Birth"
              type="date"
              icon={<Calendar />}
              value={formData.dob || ''}
              onChange={onChange}
              required
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

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </form>
    </div>
  );
}