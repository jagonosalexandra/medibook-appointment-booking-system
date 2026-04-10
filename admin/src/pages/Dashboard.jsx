import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashData } from '../services/adminService'
import { fetchAllDoctors } from '../services/doctorService'
import StatsCard from '../components/StatsCard'
import AppointmentTable from '../components/AppointmentTable'
import LoadingSpinner from '../components/LoadingSpinner'
import calendarCheck from '../assets/icons/calendar-check.svg'
import pending from '../assets/icons/pending.svg'
import today from '../assets/icons/today.svg'
import users from '../assets/icons/users.svg'

const Dashboard = () => {
  const [dashData, setDashData] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    
    const loadData = async () => {
      try {
        const data = await getDashData()
        setDashData(data)
      } catch (error) {
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    fetchAllDoctors().then(data => {
      setDoctors(data);
    })
  }, [])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />
  if (error) return <p className="text-red">{error}</p>

  return dashData && (
    <div className='w-full flex flex-col gap-8 px-4 lg:px-12 py-8 h-screen overflow-y-auto'>
      <h1 className='text-4xl font-black'>Dashboard</h1>

      <div>
        <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
          <StatsCard
            name='Appointments Today'
            count={dashData.appointmentsToday}
            icon={today}
            color='#0D6E8A'
          />
          <StatsCard
            name='Pending Appointments'
            count={dashData.appointmentsPending}
            icon={pending}
            color='#DC2626'
          />
          <StatsCard
            name='Total Appointments'
            count={dashData.totalAppointments}
            icon={calendarCheck}
            color='#16A34A'
          />
          <StatsCard
            name='Total Doctors'
            count={dashData.doctors}
            icon={users}
            color='#D97706'
          />
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-8 my-8'>
          <div className='min-w-0'>
            <h2 className='flex items-center justify-between mb-2.5 text-lg font-semibold'>
              Latest Appointments
              <Link
                to='/appointments'
                className='text-sm text-primary-dark font-bold hover:underline cursor-pointer'
              >
                View All
              </Link>
            </h2>

            <AppointmentTable appointments={dashData.latestAppointments} />
          </div>

          <div className='bg-card rounded-xl xl:h-110 xl:overflow-auto px-3 py-2.5 shadow-lg'>
            <h2 className='text-lg font-semibold border-b border-gray-200 pb-1.5 mb-2.5'>Doctors</h2>

            <ul>
              {doctors.map(doc => (
                <li key={doc._id} className='flex items-center gap-2.5 py-2'>
                  <img className='w-12 h-12 rounded-full object-cover object-top' src={doc.photoUrl} alt={doc.name} />
                  <p className='flex flex-col'>
                    <span className='font-medium'>{doc.name}</span>
                    <span className='bg-primary/15 px-2.5 py-0.5 w-fit rounded-full text-xs text-gray-600 font-bold uppercase'>{doc.department}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard