import React from 'react'
import { NavLink } from 'react-router-dom'
import appointments from '../assets/icons/appointments.svg'
import dashboard from '../assets/icons/dashboard.svg'
import doctors from '../assets/icons/doctors.svg'
import add_doctor from '../assets/icons/add_doctor.svg'
import schedule from '../assets/icons/schedule.svg'

const Sidebar = () => {
    const navclass = ({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 md:px-9 lg:min-w-72 cursor-pointer 
            ${isActive ? "bg-gray-100/50 border-r-4 border-primary font-bold text-md text-primary" : ""
        }`

    return (
        <div className='min-h-screen bg-card border-r border-gray-200'>
            <ul className='mt-5'>
                <NavLink
                    className={navclass}
                    to='/dashboard'
                >
                    <img className='w-8' src={dashboard} alt='dashboard' />
                    <span className='hidden lg:block'>Dashboard</span>
                </NavLink>

                <NavLink
                    className={navclass}
                    to='/appointments'
                >
                    <img className='w-8' src={appointments} alt='appointments' />
                    <span className='hidden lg:block'>Appointments</span>
                </NavLink>

                <NavLink
                    className={navclass}
                    to='/doctor/new'
                >
                    <img className='w-8' src={add_doctor} alt='add doctor' />
                    <span className='hidden lg:block'>Add Doctor</span>
                </NavLink>

                <NavLink
                    className={navclass}
                    to='/doctors'
                >
                    <img className='w-8' src={doctors} alt='doctors' />
                    <span className='hidden lg:block'>Doctors</span>
                </NavLink>

                <NavLink
                    className={navclass}
                    to='/time-slots'
                >
                    <img className='w-8' src={schedule} alt='doctore scheduler' />
                    <span className='hidden lg:block'>Doctor Scheduler</span>
                </NavLink>
            </ul>
        </div>
    )
}

export default Sidebar