// Footer.jsx
import React from 'react'
import logo from '../assets/images/logo.svg'
import phone from '../assets/icons/phone.svg'
import address from '../assets/icons/address.svg'
import email from '../assets/icons/email.svg'
import { Link } from 'react-router-dom'
import SERVICES from '../constants/services'

const Footer = () => {
  return (
    <footer className='bg-white px-6 lg:px-24 py-12 text-gray-600 text-sm'>
      <div className='flex flex-col gap-10 lg:flex-row justify-between pb-12'>

        <div className='lg:w-1/3 space-y-4'>
          <img className='w-30' src={logo} alt='MediBook Logo' />
          <p className='xl:max-w-sm leading-relaxed'>
            Empowering patients with modern healthcare solutions. Connecting you
            with world-class medical expertise anytime, anywhere.
          </p>
        </div>

        <div className='flex flex-col gap-4'>
          <p className='text-black font-bold tracking-wider'>Quick Links</p>
          <ul className='space-y-2.5'>
            <li><Link to='/doctors' className='hover:text-primary transition-colors'>Find a Doctor</Link></li>
            <li><Link to='/booking' className='hover:text-primary transition-colors'>Book Appointment</Link></li>
          </ul>
        </div>

        <div className='flex flex-col gap-4'>
          <p className='text-black font-bold tracking-wider'>Services</p>
          <ul className='space-y-2.5'>
            {SERVICES.map(({ title }) => (
              <li key={title}>
                <Link to='/booking' className='hover:text-primary transition-colors'>{title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='flex flex-col gap-4'>
          <p className='text-black font-bold tracking-wider'>Contact Us</p>
          <ul className='space-y-2.5'>
            <li className='flex items-center gap-2.5'><img className='w-4' src={phone} alt='' /> +1 (555) 123-4567</li>
            <li className='flex items-center gap-2.5'><img className='w-4' src={email} alt='' /> contact@medibook.com</li>
            <li className='flex items-center gap-2.5'><img className='w-4' src={address} alt='' /> 123 Healthcare Ave, NY</li>
          </ul>
        </div>
      </div>

      <hr className='border-none h-px bg-gray-200 mb-8' />

      <div className='flex flex-col md:flex-row gap-4 justify-between items-center text-xs text-gray-400'>
        <p>© 2025 MediBook. All rights reserved.</p>
        <ul className='flex items-center gap-6 cursor-pointer'>
          <li className='hover:text-primary transition-colors'>Privacy Policy</li>
          <li className='hover:text-primary transition-colors'>Terms of Service</li>
          <li className='hover:text-primary transition-colors'>Cookie Policy</li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer