import React, { useState, useEffect } from 'react'
import { fetchAppointments } from '../services/appointmentService'
import AppointmentTable from '../components/AppointmentTable'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import FilterSelect from '../components/FilterSelect'
import { toast } from 'react-toastify'

const Appointments = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [deptFilter, setDeptFilter] = useState("All Departments")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAppointments()
        setAppointments(data)
      } catch (error) {
        setError("Failed to load appointments")
        toast.error("Failed to load appointments")
      } finally {
        setLoading(false)
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

  if (loading) return <LoadingSpinner message="Loading appointments..." />
  if (error) return <p className="text-red">{error}</p>

  return (
    <div className='w-full px-4 lg:px-12 py-6 lg:py-8 h-screen overflow-y-auto bg-gray-50/50'>
      <div className='mb-6 lg:mb-8'>
        <h1 className='text-3xl lg:text-4xl font-black'>Appointments</h1>
        <p className='text-sm text-gray-400'>Manage and track all scheduled medical visits</p>
      </div>

      <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-6'>
        <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Filter By:</span>

        <div className='flex flex-col sm:flex-row gap-3 flex-1'>
          <div className='w-full md:w-40'>
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={["All Statuses", "Confirmed", "Cancelled", "Pending"]}
            />
          </div>
          <div className='w-full md:w-50'>
            <FilterSelect
              value={deptFilter}
              onChange={setDeptFilter}
              options={["All Departments", "General Practice", "Pediatrics", "Cardiology", "Obstetrics & Gynecology", "Neurology", "Orthopedics"]}
            />
          </div>
        </div>

        <button onClick={() => { setStatusFilter("All Statuses"); setDeptFilter("All Departments") }} className='ml-auto text-sm font-bold text-primary hover:underline lg:ml-auto'>
          Clear all filters
        </button>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
        {filteredAppointments.length > 0 ? (
          <AppointmentTable appointments={currentItems} showActions />
        ) : (
          <p className='text-gray-400 italic text-center py-4'>No appointments found matching your filters.</p>
        )}


        <div className='px-4 lg:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/30'>
          <p className='text-sm text-gray-500'>
            Showing <span className='font-bold text-gray-700'>
              {filteredAppointments.length === 0 ? '0' : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAppointments.length)}
            </span> of {filteredAppointments.length} appointments
          </p>

          <div className='flex gap-4 items-center'>
            <Button
              label="<"
              variant={currentPage === 1 ? "disabled" : "secondary"}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            />
            <span className='text-sm text-gray-500 font-medium'>
              {currentPage} / {totalPages}
            </span>
            <Button
              label=">"
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