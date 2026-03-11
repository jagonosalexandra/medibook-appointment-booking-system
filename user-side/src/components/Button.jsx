import React from 'react'

const Button = ({ label, variant, onClick, fullWidth = false, type = "button" }) => {
  
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-dark",
        secondary: "bg-white border border-primary text-primary hover:bg-gray-50"
    }

    const selectedVariant = variants[variant]

    const isFullWidth = fullWidth ? "w-full" : "w-auto"
  
    return (
        <button
            type={type}
            className={`${selectedVariant} ${isFullWidth} px-6 py-2 cursor-pointer rounded-xl font-semibold shadow-md transition-all duration-300`}
            onClick={onClick}
        >
            {label}
        </button>
  )
}

export default Button