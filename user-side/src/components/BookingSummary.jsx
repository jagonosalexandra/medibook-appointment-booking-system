import React from "react"
import info from '../assets/icons/info.svg'
import user from '../assets/icons/user.svg'
import department from '../assets/icons/department.svg'

const BookingSummary = ({ selectedDoctor, formData, formatDisplayDate }) => (
    <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-md h-fit'>
        <span className='font-bold'>Booking Summary</span>
        <div className='flex flex-col gap-4 pt-2.5'>
            <div className='flex items-center gap-2.5 py-1.5'>
                <img className='w-10 px-2.5 py-3 bg-primary/20 rounded-lg shrink-0' src={user} alt='' />
                <p className='text-sm text-gray-500 font-bold'>
                    DOCTOR
                    <span className='block text-md font-medium text-black'>{selectedDoctor?.name}</span>
                </p>
            </div>
            <div className='flex items-center gap-2.5 py-1.5'>
                <img className='w-10 px-2.5 py-3 bg-primary/20 rounded-lg shrink-0' src={department} alt='' />
                <p className='text-sm text-gray-500 font-bold'>
                    DEPARTMENT
                    <span className='block text-md font-medium text-black'>{selectedDoctor?.department}</span>
                </p>
            </div>
            {formData.date && formData.time && (
                <div className='flex items-center gap-2.5 py-1.5'>
                    <img className='w-10 px-2.5 py-3 bg-primary/20 rounded-lg shrink-0' src={clock} alt='' />
                    <p className='text-sm text-gray-500 font-bold'>
                        DATE & TIME
                        <span className='block text-md font-medium text-black'>
                            {formatDisplayDate(formData.date)}, {formData.time}
                        </span>
                    </p>
                </div>
            )}

            <hr className='border-none h-px bg-gray-200 my-2' />

            <ul className='space-y-1 text-sm text-gray-600'>
                <li className='flex justify-between'>
                    <span className='text-gray-500'>Consultation Fee:</span>
                    <span className='font-semibold text-black'>${selectedDoctor?.fee || '0'}</span>
                </li>
                <li className='flex justify-between'>
                    <span className='text-gray-500'>Service Fee:</span>
                    <span className='font-semibold text-black'>$5.00</span>
                </li>
            </ul>

            <hr className='border-none h-px bg-gray-200 my-2' />

            <p className='flex justify-between text-md font-bold'>
                Total <span className='text-primary'>${formData.fee}</span>
            </p>

            <div className='bg-primary/10 border border-primary/30 rounded-lg px-2.5 py-3.5 text-xs'>
                <span className='flex items-center gap-1.5 text-sm text-black font-semibold'>
                    <img className='w-5' src={info} alt='' />Cancellations
                </span>
                <p className='pl-6 py-1.5 text-gray-500'>
                    Cancel at least 24 hours in advance for a full refund. Appointments booked within 24 hours are non-refundable.
                </p>
            </div>
        </div>
    </div>
)

export default BookingSummary