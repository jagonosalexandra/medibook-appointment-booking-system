import React, { useState, useEffect } from 'react'
import { toggleDoctorActive } from '../services/adminService'
import { fetchAllDoctors } from '../services/doctorService'
import { toast } from 'react-toastify'
import DoctorCard from '../components/DoctorCard'
import FilterSelect from '../components/FilterSelect'
import LoadingSpinner from '../components/LoadingSpinner'
import { DEPARTMENT_FILTER, DOC_STATUS } from '../constants/constants'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [deptFilter, setDeptFilter] = useState("All Departments")

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllDoctors()
        setDoctors(data)
      } catch (error) {
        setError("Failed to load doctors")
        toast.error("Failed to load doctors")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleToggleActive = async (id) => {
    try {
      const response = await toggleDoctorActive(id)
      if (response.success) {
        toast.success(response.message)
        setDoctors(prev => prev.map(doc =>
          doc._id === id ? { ...doc, isActive: response.isActive } : doc
        ))
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status")
    }
  }

  const filteredDoctors = doctors.filter(doc => {
    const statusString = doc.isActive ? "Active" : "Inactive"
    const matchesStatus = statusFilter === "All Statuses" || statusString === statusFilter
    const matchesDept = deptFilter === "All Departments" || doc.department === deptFilter
    return matchesStatus && matchesDept
  })

  if (loading) return <LoadingSpinner message='Loading doctors...' />
  if (error) return <p className="text-center text-red mt-12">{error}</p>

  return (
    <div className='w-full px-4 lg:px-12 py-8 h-screen overflow-y-auto bg-gray-50/50'>
      <div className='mb-8'>
        <h1 className='text-3xl lg:text-4xl font-black'>Doctors</h1>
        <p className='text-sm text-gray-400'>Manage clinic medical staff and profile status.</p>
      </div>

      {/* FILTER BAR */}
      <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-6'>
        <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Filter By:</span>

        <div className='flex flex-col sm:flex-row gap-3 flex-1'>
          <div className='w-full md:w-40'>
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={DOC_STATUS}
            />
          </div>
          <div className='w-full md:w-50'>
            <FilterSelect
              value={deptFilter}
              onChange={setDeptFilter}
              options={DEPARTMENT_FILTER}
            />
          </div>
        </div>

        <button onClick={() => { setStatusFilter("All Statuses"); setDeptFilter("All Departments") }} className='ml-auto text-sm font-bold text-primary hover:underline lg:ml-auto'>
          Clear all filters
        </button>
      </div>

      {filteredDoctors.length > 0 ? (
        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4'>
          {filteredDoctors.map(doc => (
            <DoctorCard
              key={doc._id}
              docId={doc._id}
              name={doc.name}
              photoUrl={doc.photoUrl}
              department={doc.department}
              isActive={doc.isActive}
              onToggleStatus={handleToggleActive}
            />
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-400 italic mt-12'>No doctors found matching your filters.</p>
      )}


    </div>
  )
}

export default Doctors