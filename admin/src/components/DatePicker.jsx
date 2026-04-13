import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useRef } from 'react'

const DatePicker = ({ label, value, onChange, minDate }) => {
    const wrapperRef = useRef(null)

    const selected = value ? new Date(value + 'T00:00:00') : null
    const min = minDate ? new Date(minDate + 'T00:00:00') : null

    const handleChange = (date) => {
        if (!date) return
        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate()).padStart(2, '0')
        onChange(`${yyyy}-${mm}-${dd}`)
    }

    return (
        <div ref={wrapperRef} className='flex flex-col gap-1.5'>
            <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                {label}
            </label>
            <ReactDatePicker
                selected={selected}
                onChange={handleChange}
                minDate={min}
                dateFormat="MMM d, yyyy"
                placeholderText="Select a date"
                wrapperClassName="w-full"
                className='w-full bg-white border border-border text-gray-700 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer'
                showPopperArrow={false}
                popperPlacement="bottom-end"
            />
        </div>
    )
}

export default DatePicker