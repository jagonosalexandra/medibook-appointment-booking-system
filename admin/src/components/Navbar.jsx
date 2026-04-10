import React from 'react'
import logo from '../assets/images/admin_logo.svg'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from './Button'
import { adminLogout } from '../services/authService'

const Navbar = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        adminLogout()
        toast.success("Logout successful")
        navigate('/login')
    }

    return (
        <div className='flex items-center justify-between px-8 h-16 text-sm md:text-base sticky top-0 z-50 bg-white border-b border-gray-300'>
            <img onClick={() => navigate('/')} className='w-34 cursor-pointer transition-all' src={logo} alt='' />
            
            <Button
                label='Logout'
                variant='primary'
                onClick={handleLogout}
            />
    </div>
    )
}

export default Navbar