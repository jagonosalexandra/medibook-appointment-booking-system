import React, { useState, useEffect } from 'react'
import { fetchAppointments } from '../services/appointmentService'
import { getAToken } from '../services/adminService'
import AppointmentTable from '../components/AppointmentTable'

const Appointments = () => {
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        const data = async () => {
          const aToken = getAToken()
          if (aToken) {
            const data = await fetchAppointments()
            setAppointments(data)
          }
        }
        data()
      }, [])

    return (
        <div className='w-full flex flex-col gap-8 px-12 py-8 h-screen overflow-y-auto'>
            <h1 className='text-4xl font-bold'>Appointments</h1>

            <AppointmentTable
                appointments={appointments}
                showActions
            />
        </div>
    )
}

export default Appointments