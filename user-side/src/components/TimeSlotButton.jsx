import React from 'react'

const TimeSlotButton = ({ slot, isSelected, onClick }) => {

    const { time, isAvailable } = slot
    return (
        <button
            type="button"
            disabled={!isAvailable}
            onClick={() => onClick(time)}
            className={`py-3 rounded-lg transition-all border-2 text-sm
        ${!isAvailable
                    ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                    : isSelected
                        ? 'bg-primary/20 border-primary text-primary font-semibold'
                        : 'border-gray-200 hover:border-primary hover:text-primary'
                }`}
        >
            {time}
        </button>
    )
}

export default TimeSlotButton