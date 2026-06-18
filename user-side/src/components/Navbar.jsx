import React, { useState } from 'react'
import logo from '../assets/images/logo.svg'
import menu from '../assets/icons/menu.svg'
import { NavLink, useNavigate } from 'react-router-dom'
import Button from './Button'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Doctors', to: '/doctors' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
]

const navClass = ({ isActive }) =>
  `flex flex-col items-center gap-0.5 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
  }`

const Navbar = () => {

  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className='sticky top-0 z-50 bg-white border-b border-gray-200'>
      <div className='flex items-center justify-between px-6 lg:px-24 h-16'>
        <img onClick={() => navigate('/')} className='w-34 cursor-pointer' src={logo} alt='Medibook' />

        <ul className='hidden md:flex items-center gap-8'>
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <NavLink to={to} className={navClass}>
                <span className='py-1'>{label}</span>
                {({ isActive }) => isActive && (
                  <span className='block h-0.5 w-full bg-primary rounded-full' />
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className='flex items-center gap-4'>
          <Button
            label="Book Now"
            variant="primary"
            onClick={() => navigate('/booking')}
          />

          <button className='md:hidden flex flex-col gap-1.5 p-1 cursor-pointer' onClick={() => setIsOpen(prev => !prev)} aria-label='TOggle menu'>
            <img className='w-8' src={menu} alt='menu' />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className='md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-1'>
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `p-3 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav >
  )
}

export default Navbar