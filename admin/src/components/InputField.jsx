import React from 'react'

const InputField = ({ label, type, value, onChange, error, placeholder, required = false }) => {
  const inputId = label.toLowerCase().replace(/\s+/g, '-') 
  const errorId = `${inputId}-error`

  return (
    <div className='flex flex-col gap-0.5 w-full py-3.5'>
      <label htmlFor={inputId} className='font-medium'>{label}</label>
      <input
        id={inputId}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className={`outline-none border-b px-1.5 focus:border-b-2
          ${error ? 'border-error focus:outline-error' : 'border-border focus:border-primary'}`}
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