import React from 'react'

const InputField = ({ label, type, value, onChange, error, placeholder, required = false }) => {
  const inputId = label.toLowerCase().replace(/\s+/g, '-') 
  const errorId = `${inputId}-error`

  return (
    <div className='flex flex-col gap-1.5 w-full px-2 py-3.5'>
      <label htmlFor={inputId} className='font-medium'>
        {label}{required && <span className='text-error ml-0.5'>*</span>}
      </label>
      <input
        id={inputId}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className={`border rounded-lg px-1.5 py-2.5 focus:outline-2 
          ${error ? 'border-error focus:outline-error' : 'border-border focus:outline-primary'}`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
      {error && <span id={errorId} className="text-error text-xs mt-1">{error}</span>}
    </div>
  )
}

export default InputField