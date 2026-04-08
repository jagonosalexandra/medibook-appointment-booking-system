import React, { useState, useEffect } from 'react'
import { fetchAppointments } from '../services/appointmentService'
import { getAToken } from '../services/adminService'
import AppointmentTable from '../components/AppointmentTable'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import down_arrow from '../assets/icons/down_arrow.svg'
import Button from '../components/Button'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [deptFilter, setDeptFilter] = useState("All Departments")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const loadData = async () => {
      const aToken = getAToken()
      if (aToken) {
        const data = await fetchAppointments()
        setAppointments(data)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, deptFilter]);

  const filteredAppointments = appointments.filter(app => {
    const matchesStatus = statusFilter === "All Statuses" || app.status === statusFilter.toLowerCase()
    const matchesDept = deptFilter === "All Departments" || app.department === deptFilter
    return matchesStatus && matchesDept
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / itemsPerPage))
  const resetFilters = () => {
    setStatusFilter("All Statuses")
    setDeptFilter("All Departments")
    setCurrentPage(1)
  }

  return (
    <div className='w-full px-12 py-8 h-screen overflow-y-auto bg-gray-50/50'>
      <div className='mb-8 flex justify-between items-end'>
        <h1 className='text-4xl font-black'>Appointments</h1>
        <p className='text-sm text-gray-400'>Manage and track all scheduled medical visits</p>
      </div>

      <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-6 mb-6'>
        <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Filter By:</span>

        <div className='w-48'>
          <Listbox value={statusFilter} onChange={setStatusFilter}>
            <div className='relative'>
              <ListboxButton className='flex justify-between items-center w-full bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 cursor-pointer'>
                {statusFilter}
                <img src={down_arrow} className='w-3 opacity-50' alt='' />
              </ListboxButton>
              <ListboxOptions className='absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl py-1 text-sm'>
                <ListboxOption value="All Statuses" className='px-4 py-2 hover:bg-primary/10 cursor-pointer'>All Statuses</ListboxOption>
                <ListboxOption value="Confirmed" className='px-4 py-2 hover:bg-primary/10 cursor-pointer'>Confirmed</ListboxOption>
                <ListboxOption value="Pending" className='px-4 py-2 hover:bg-primary/10 cursor-pointer'>Pending</ListboxOption>
                <ListboxOption value="Cancelled" className='px-4 py-2 hover:bg-primary/10 cursor-pointer'>Cancelled</ListboxOption>
              </ListboxOptions>
            </div>
          </Listbox>
        </div>

        <div className='w-56'>
          <Listbox value={deptFilter} onChange={setDeptFilter}>
            <div className='relative'>
              <ListboxButton className='flex justify-between items-center w-full bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 cursor-pointer text-left'>
                <span>{deptFilter}</span>
                <img src={down_arrow} className='w-3 opacity-50' alt='' />
              </ListboxButton>
              <ListboxOptions className='absolute z-20 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-xl py-1 text-sm'>
                <ListboxOption value="All Departments" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>All Departments</ListboxOption>
                <ListboxOption value="General Practice" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>General Practice</ListboxOption>
                <ListboxOption value="Pediatrics" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>Pediatrics</ListboxOption>
                <ListboxOption value="Cardiology" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>Cardiology</ListboxOption>
                <ListboxOption value="Obstretics & Gynecology" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>Obstetrics & Gynecology</ListboxOption>
                <ListboxOption value="Neurology" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>Neurology</ListboxOption>
                <ListboxOption value="Orthopedics" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>Orthopedics</ListboxOption>
              </ListboxOptions>
            </div>
          </Listbox>
        </div>

        <button onClick={resetFilters} className='ml-auto text-sm font-bold text-primary hover:underline'>
          Clear all filters
        </button>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
        {filteredAppointments.length > 0 ? (
          <AppointmentTable appointments={currentItems} showActions />
        ) : (
          <p className='text-gray-400 italic text-center py-4'>No appointments found matching your filters.</p>
        )}


        <div className='px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30'>
          <p className='text-sm text-gray-500'>
            Showing <span className='font-bold text-gray-700'>
              {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAppointments.length)}
            </span> of {filteredAppointments.length} appointments
          </p>

          <div className='flex gap-4 items-center'>
            <Button
              label="Previous"
              variant={currentPage === 1 ? "disabled" : "secondary"}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            />

            <Button
              label="Next"
              variant={(currentPage === totalPages || filteredAppointments.length === 0) ? "disabled" : "primary"}
              disabled={currentPage === totalPages || filteredAppointments.length === 0}
              onClick={() => setCurrentPage(p => p + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointments