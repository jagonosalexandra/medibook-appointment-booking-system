import React from 'react'

const InputField = ({ label, type, value, onChange, error, placeholder }) => {
    return (
        <label className='flex flex-col gap-1.5 w-full px-2 py-3.5'>
            {label}
            <input
                className='border border-border focus:outline-2 focus:outline-primary rounded-lg px-1.5 py-2.5'
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required
                placeholder={placeholder}
                required
            />
        </label>
    )
}

export default InputField