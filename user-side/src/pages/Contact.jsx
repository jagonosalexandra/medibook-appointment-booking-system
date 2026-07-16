import React from 'react'
import PageHeader from '../components/PageHeader'
import InputField from '../components/InputField'
import Button from '../components/Button'
import location from '../assets/icons/location.svg'
import clock from '../assets/icons/clock.svg'
import building from '../assets/icons/building.svg'
import mail from '../assets/icons/mail.svg'
import phone from '../assets/icons/phone.svg'

const DEPARTMENTS = [
  { name: 'Patient Services', email: 'support@medibook.com', phone: '+1 (555) 123-4567' },
  { name: 'Medical Records', email: 'records@medibook.com', phone: '+1 (555) 123-4568' },
  { name: 'Billing & Insurance', email: 'billing@medibook.com', phone: '+1 (555) 123-4569' },
  { name: 'Partnerships', email: 'partners@medibook.com', phone: '+1 (555) 123-4570' },
]

const Contact = () => {
  return (
    <div>
      <PageHeader
        title='Get in Touch'
        subtitle='Have questions about our services or need help booking an appointment? Our team is here to support your healthcare journey.'
      />

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-10 lg:gap-16 px-6 lg:px-24 py-12 lg:py-16'>
        <form
          action="https://formspree.io/f/xyklwlnl"
          method="POST"
          className='bg-white px-4 pt-4 pb-10 rounded-lg border-2 border-border shadow-sm'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2'>
            <InputField
              label='Full Name'
              type='text'
              name='name'
              placeholder='John Doe'
              required
            />
            <InputField
              label='Email'
              type='email'
              name='email'
              placeholder='john@example.com'
              required
            />
          </div>

          <label className='flex flex-col gap-1.5 w-full px-2 pt-3.5 mb-6 font-medium'>
            Message

            <textarea
              className='font-normal border rounded-lg px-1.5 py-2.5 h-52 focus:outline-2 border-border focus:outline-primary resize-none'
              name='message'
              placeholder='How can we help you?'
              required
            />
          </label>

          <Button
            label='Send Message'
            variant='primary'
            type='submit'
            fullWidth
          />
        </form>

        <div className='flex flex-col gap-10'>
          <div>
            <p className='flex items-center gap-2 font-bold text-lg uppercase text-primary-dark mb-4'>
              <img className='w-8' src={building} alt='' />
              Our Departments
            </p>

            <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
              {DEPARTMENTS.map(({ name, email, phone: tel }) => (
                <div key={name} className='p-4 rounded-lg bg-primary/10 border-2 border-primary'>
                  <p className='font-bold text-primary-dark mb-2.5'>{name}</p>
                  <p className='flex items-center gap-2 text-gray-600 text-sm tracking-wide'>
                    <img className='w-4 opacity-50 shrink-0' src={mail} alt='' />
                    {email}
                  </p>
                  <p className='flex items-center gap-2 text-gray-600 text-sm tracking-wide mt-1'>
                    <img className='w-4 opacity-50 shrink-0' src={phone} alt='' />
                    {tel}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
            <div>
              <p className='flex items-center gap-2 font-bold text-lg uppercase text-primary-dark mb-4'>
                <img className='w-8' src={location} alt='' />
                Location
              </p>

              <p className='text-gray-600 text-sm leading-relaxed'>
                <span className='font-bold'>Medibook Health Center</span> <br />
                123 Wellness Way, Suite 500 <br />
                San Francisco, CA 94105
              </p>
            </div>

            <div>
              <p className='flex items-center gap-2 font-bold text-lg uppercase text-primary-dark mb-4'>
                <img className='w-8' src={clock} alt='' />
                Office Hours
              </p>

              <p className='text-gray-600 text-sm leading-relaxed'>
                Mon - Fri: 8:00 AM - 5:00 PM <br />
                Sat: 9:00 AM - 2:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact