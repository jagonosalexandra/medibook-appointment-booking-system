import React from 'react'

const StatusBadge = ({ status }) => {
    const statusStyles = {
        pending: 'bg-yellow/30 text-yellow',
        confirmed: 'bg-success/30 text-success',
        cancelled: 'bg-red/30 text-red',
    }

    return (
        <span className={`${statusStyles[status]} px-4 py-1 text-xs font-bold uppercase rounded-full`}>
            {status}
        </span>
    )
}

export default StatusBadge