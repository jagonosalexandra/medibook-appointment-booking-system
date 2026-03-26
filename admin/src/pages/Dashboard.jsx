import React, { useEffect, useState } from 'react'
import { getAToken, getDashData } from '../services/adminService'
import { fetchAllDoctors } from '../services/doctorService'
import StatsCard from '../components/StatsCard'
import calendarCheck from '../assets/icons/calendar-check.svg'
import pending from '../assets/icons/pending.svg'
import today from '../assets/icons/today.svg'
import users from '../assets/icons/users.svg'

const Dashboard = () => {
  const [dashData, setDashData] = useState(null)
  const [doctors, setDoctors] = useState([])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

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
    <div className='flex flex-col gap-8 px-12 py-8'>
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
            <div>
              <h2 className='flex items-center justify-between mb-2.5 text-lg font-semibold'>Latest Appointments <a className='text-sm text-primary-dark font-bold' href='#'>View All</a></h2>

              <table className='w-full bg-card rounded-xl shadow-lg overflow-hidden'>
                <thead className='bg-gray-50/50 tracking-wider uppercase text-sm text-gray-500 text-center border-b border-gray-200'>
                  <th className='pt-3.5 pb-2.5'>Patient Name</th>
                  <th className='pt-3.5 pb-2.5'>Doctor</th>
                  <th className='pt-3.5 pb-2.5'>Date</th>
                  <th className='pt-3.5 pb-2.5'>Time</th>
                  <th className='pt-3.5 pb-2.5'>Department</th>
                  <th className='pt-3.5 pb-2.5'>Status</th>
                </thead>
                <tbody className='divide-y divide-gray-50'>
                  {dashData.latestAppointments.map(app => (
                    <tr className='text-center' key={app._id}>
                      <td className='py-2.5 font-semibold'>{app.name}</td>
                      <td className='py-2.5'>{app.doctor}</td>
                      <td className='py-2.5'>{formatDate(app.date)}</td>
                      <td className='py-2.5'>{app.time}</td>
                      <td className='py-2.5'>{app.department}</td>
                      <td className='text-sm '>
                        <span
                          className={`${app.status === 'pending' ? 'bg-yellow/30 text-yellow font-bold' : ''}
                                    ${app.status === 'cancelled' ? 'bg-red/30 text-red font-bold' : ''}
                                    ${app.status === 'confirmed' ? 'bg-success/30 text-success font-bold' : ''}
                                    px-5 py-1 uppercase rounded-full`}
                        >{app.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='bg-card rounded-xl h-135 overflow-auto px-3 py-2.5 shadow-lg'>
              <h2 className='text-lg font-semibold border-b border-gray-200 pb-1.5 mb-2.5'>Doctors</h2>

              <ul>
                {doctors.map(doc => (
                  <ol className='flex items-center gap-2.5 py-2'>
                    <img className='w-12 h-12 rounded-full object-cover object-top' src={doc.photoUrl} alt={doc.name} />
                    <p className='flex flex-col'>
                      <span>{doc.name}</span>
                      <span>{doc.department}</span>
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