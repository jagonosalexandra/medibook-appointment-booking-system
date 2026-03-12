import React, { Fragment } from 'react'
import check from '../assets/icons/check.svg'

const StepIndicator = ({ steps, currentStep }) => {
    return (
        <div className='flex items-center justify-center mt-2 mb-12'>
            {steps.map((label, index) => {
                const stepNum = index + 1
                const isCompleted = currentStep > stepNum
                const isActive = currentStep === stepNum

                return (
                    <Fragment key={label}>
                        <div className='flex flex-col items-center relative'>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                    ? 'bg-primary border-primary text-white'
                                    : isActive
                                        ? 'border-primary text-primary font-bold bg-white'
                                        : 'border-gray-300 text-gray-400 bg-white'
                                    }`}
                            >
                                {isCompleted ? <img className='w-6 fill-secondary' src={check} alt='' /> : stepNum}
                            </div>

                            <span className={`absolute -bottom-7 text-xs whitespace-nowrap font-medium ${isActive ? 'text-primary text-md font-semibold' : 'text-gray-400'
                                }`}>
                                {label}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <div className={`w-48 h-0.5 mx-2 transition-colors duration-300 ${isCompleted ? 'bg-primary' : 'bg-gray-200'
                                }`} />
                        )}
                    </Fragment>
                )
            })}
        </div>
    )
}

export default StepIndicator