import React from 'react'

const PageHeader = ({ title, subtitle }) => {
    return (
        <div className='bg-secondary p-8 rounded-lg'>
            <h1 className='text-xl font-bold tracking-wider text-primary-dark'>{title}</h1>
            <p className='max-w-lg leading-relaxed'>{subtitle}</p>
        </div>
    )
}

export default PageHeader