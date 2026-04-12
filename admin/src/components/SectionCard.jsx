import React from 'react'

const SectionCard = ({ title, icon, action, children }) => {
    return (
        <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50'>
                <span className='flex items-center gap-2 text-sm font-semibold text-primary-dark'>
                    {icon && <img src={icon} className='w-4 opacity-60' alt='' />}
                    {title}
                </span>
                {action}
            </div>
            <div className='p-5'>{children}</div>
        </div>
    )
}

export default SectionCard