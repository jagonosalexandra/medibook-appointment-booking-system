import React from 'react'
import logo from '../assets/images/logo.svg'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate()

  return (
    <div className='flex items-center justify-between text-sm px-8 sticky top-0 bg-white border-b border-gray-300'>
      <img onClick={() => navigate('/')} className='w-34 cursor-pointer transition-all' src={logo} alt='' />

      <ul className='flex items-center gap-8'>
        <NavLink to='/'>
          <li className='py-1'>Home</li>
          <hr className='border-none outline-none h-0.5 m-auto bg-primary hidden' />
        </NavLink>
        <NavLink to='/doctors'>
          <li className='py-1'>Doctors</li>
          <hr className='border-none outline-none h-0.5 m-auto bg-primary hidden' />
        </NavLink>
        <NavLink to='/services'>
          <li className='py-1'>Services</li>
          <hr className='border-none outline-none h-0.5 m-auto bg-primary hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1'>About</li>
          <hr className='border-none outline-none h-0.5 m-auto bg-primary hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1'>Contact</li>
          <hr className='border-none outline-none h-0.5 m-auto bg-primary hidden' />
        </NavLink>
      </ul>

      <button className='px-6 py-2 bg-primary hover:bg-primary-dark rounded-xl font-semibold text-white transition-all duration-300'>Book Now</button>
    </div>
  )
}

export default Navbar