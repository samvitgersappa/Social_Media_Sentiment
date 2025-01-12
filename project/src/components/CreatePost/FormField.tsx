import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function FormField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  endIcon,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-gray-300 block">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
          </span>
        )}
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={`w-full bg-gray-700 text-white rounded-lg ${icon ? 'pl-10' : 'pl-4'
            } ${endIcon ? 'pr-12' : 'pr-4'} py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder={placeholder}
          required
        />
        {endIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {endIcon}
          </span>
        )}
      </div>
    </div>
  );
}