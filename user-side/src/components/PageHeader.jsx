import React from 'react'

const PageHeader = ({ title, subtitle }) => {
    return (
        <div className='bg-secondary px-8 md:py-16 py-8'>
            <h1 className='text-xl font-black tracking-wider text-primary-dark'>{title}</h1>
            <p className='leading-relaxed text-gray-500'>{subtitle}</p>
        </div>
    )
}

export default PageHeader