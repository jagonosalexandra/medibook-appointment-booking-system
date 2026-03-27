import React, { useEffect, useState } from 'react'
import { getAToken, getDashData } from '../services/adminService'
import { fetchAllDoctors } from '../services/doctorService'
import StatsCard from '../components/StatsCard'
import calendarCheck from '../assets/icons/calendar-check.svg'
import pending from '../assets/icons/pending.svg'
import today from '../assets/icons/today.svg'
import users from '../assets/icons/users.svg'
import AppointmentTable from '../components/AppointmentTable'

const Dashboard = () => {
  const [dashData, setDashData] = useState(null)
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const aToken = getAToken
      if (aToken) {
        const data = await getDashData()
        setDashData(data)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    fetchAllDoctors().then(data => {
      setDoctors(data);
    })
  }, [])

  return (
    <div className='w-full flex flex-col gap-8 px-12 py-8 h-screen overflow-y-auto'>
      <h1 className='text-4xl font-bold'>Dashboard</h1>

      {dashData ? (
        <div>
          <div className='flex items-center justify-between'>
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

          <div className='grid grid-cols-[3fr_1fr] gap-8 my-8'>
            <div className='min-w-0'>
              <h2 className='flex items-center justify-between mb-2.5 text-lg font-semibold'>Latest Appointments <a className='text-sm text-primary-dark font-bold' href='#'>View All</a></h2>

              <AppointmentTable appointments={dashData.latestAppointments} />
            </div>

            <div className='bg-card rounded-xl h-110 overflow-auto px-3 py-2.5 shadow-lg'>
              <h2 className='text-lg font-semibold border-b border-gray-200 pb-1.5 mb-2.5'>Doctors</h2>

              <ul>
                {doctors.map(doc => (
                  <ol className='flex items-center gap-2.5 py-2'>
                    <img className='w-12 h-12 rounded-full object-cover object-top' src={doc.photoUrl} alt={doc.name} />
                    <p className='flex flex-col'>
                      <span className='font-medium'>{doc.name}</span>
                      <span className='bg-primary/15 px-2.5 py-0.5 w-fit rounded-full text-xs text-gray-600 font-bold uppercase'>{doc.department}</span>
                    </p>
                  </ol>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading stats</p>
      )}
    </div>
  )
}

export default Dashboard