import React from 'react'
import logo from '../assets/images/logo.svg'
import phone from '../assets/icons/phone.svg'
import address from '../assets/icons/address.svg'
import email from '../assets/icons/email.svg'

const Footer = () => {
  return (
    <div className='bg-white px-8 py-12 text-gray-600 text-sm'>
      <div className='flex justify-between pb-12'>

        <div className='md:w-1/3 space-y-4'>
          <img className='w-30' src={logo} alt='MediBook Logo' />
          <p className='max-w-sm leading-relaxed'>
            Empowering patients with modern 
            healthcare solutions. Connecting you 
            with world-class medical expertise 
            anytime, anywhere.</p>
        </div>

        <div className='flex flex-col gap-4'>
          <p className='text-black font-bold tracking-wider'>Quick Links</p>
          <ul className='space-y-2.5'>
            <li className='hover:text-primary cursor-pointer transition-colors'>Find a Doctor</li>
            <li className='hover:text-primary cursor-pointer transition-colors'>Book Appointment</li>
          </ul>
        </div>

        <div className='flex flex-col gap-4'>
          <p className='text-black font-bold tracking-wider'>Services</p>
          <ul className='space-y-2.5'>
            <li className='hover:text-primary cursor-pointer transition-colors'>General Checkup</li>
            <li className='hover:text-primary cursor-pointer transition-colors'>Follow-Up</li>
            <li className='hover:text-primary cursor-pointer transition-colors'>New Patient</li>
            <li className='hover:text-primary cursor-pointer transition-colors'>Specialist Visit</li>
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


      <div className='flex flex-col justify-center gap-8'>
        <hr className='border-none outline-none h-px bg-gray-600/50' />
        <div className='flex justify-between items-center text-xs text-gray-600/50'>
          <p>© 2024 MediBook. All rights reserved.</p>
          <ul className='flex justify-between items-end w-72 cursor-pointer'>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Footer