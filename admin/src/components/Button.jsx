import React from 'react'

const Button = ({ label, variant, onClick, fullWidth = false, type = "button", disabled = false }) => {

    const variants = {
        primary: "bg-primary text-white hover:bg-primary-dark",
        secondary: "bg-white border border-primary text-primary hover:bg-gray-50",
        muted: "bg-primary/10 text-primary-dark hover:bg-primary-dark/30",
        disabled: "bg-gray-200 text-gray-500 cursor-not-allowed"
    }

    const isDisabled = disabled || variant === 'disabled'
    const isFullWidth = fullWidth ? "w-full" : "w-auto"
    const selectedVariant = variants[variant]

    return (
        <button
            type={type}
            className={`${selectedVariant} ${isFullWidth} px-6 py-2 cursor-pointer rounded-xl font-semibold shadow-md transition-all duration-300
                        disabled:cursor-not-allowed disabled:pointer-events-none`}
            onClick={isDisabled ? undefined : onClick}
            disabled={isDisabled}
        >
            {label}
        </button>
    )
}

export default Button