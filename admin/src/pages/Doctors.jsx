import React, { useState, useEffect } from 'react'
import { getAToken } from '../services/adminService'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import down_arrow from '../assets/icons/down_arrow.svg'
import Button from '../components/Button'
import { fetchAllDoctors } from '../services/doctorService'
import { useNavigate } from 'react-router-dom'

const Doctors = () => {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [deptFilter, setDeptFilter] = useState("All Departments")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const loadData = async () => {
      const aToken = getAToken()
      if (aToken) {
        try {
          const data = await fetchAllDoctors()
          setDoctors(data)
        } catch (error) {
          console.error("Error fetching doctors:", error)
        }
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, deptFilter]);

  const filteredDoctors = doctors.filter(doc => {
    const statusString = doc.isAvailable ? "Available" : "Not Available"
    const matchesStatus = statusFilter === "All Statuses" || statusString === statusFilter
    const matchesDept = deptFilter === "All Departments" || doc.department === deptFilter
    return matchesStatus && matchesDept
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / itemsPerPage))

  const resetFilters = () => {
    setStatusFilter("All Statuses")
    setDeptFilter("All Departments")
    setCurrentPage(1)
  }

  return (
    <div className='w-full px-12 py-8 h-screen overflow-y-auto bg-gray-50/50'>
      <div className='mb-8 flex justify-between items-end'>
        <div>
          <h1 className='text-4xl font-black text-primary-dark'>Doctors</h1>
          <p className='text-sm text-gray-400'>Manage clinic medical staff and their availability.</p>
        </div>
        <Button
          label='+ Add New Doctor'
          variant='primary'
          onClick={() => navigate('/doctor/new')}
        />
      </div>

      {/* FILTER BAR */}
      <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-6 mb-6'>
        <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Filter By:</span>

        <div className='w-48'>
          <Listbox value={statusFilter} onChange={setStatusFilter}>
            <div className='relative'>
              <ListboxButton className='flex justify-between items-center w-full bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 cursor-pointer'>
                {statusFilter}
                <img src={down_arrow} className='w-3 opacity-50' alt='' />
              </ListboxButton>
              <ListboxOptions className='absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl py-1 text-sm outline-none'>
                {["All Statuses", "Available", "Not Available"].map((status) => (
                  <ListboxOption key={status} value={status} className='px-4 py-2 hover:bg-primary/10 cursor-pointer text-gray-700'>
                    {status}
                  </ListboxOption>
                ))}
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
              <ListboxOptions className='absolute z-20 mt-1 w-full max-h-60 overflow-auto bg-white border border-border rounded-lg shadow-xl py-1 text-sm outline-none'>
                {["All Departments", "General Practice", "Pediatrics", "Cardiology", "Obstetrics & Gynecology", "Neurology", "Orthopedics"].map((dept) => (
                  <ListboxOption key={dept} value={dept} className='px-4 py-2 hover:bg-primary/5 cursor-pointer text-gray-700'>
                    {dept}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        </div>

        <button onClick={resetFilters} className='ml-auto text-sm font-bold text-primary hover:underline cursor-pointer'>
          Clear all filters
        </button>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
        {filteredDoctors.length > 0 ? (
          <div className='w-full overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-4 text-xs font-bold text-gray-400 uppercase'>Doctor</th>
                  <th className='px-6 py-4 text-xs font-bold text-gray-400 uppercase'>Department</th>
                  <th className='px-6 py-4 text-xs font-bold text-gray-400 uppercase'>Location</th>
                  <th className='px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center'>Status</th>
                  <th className='px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {currentItems.map((doc) => (
                  <tr key={doc._id} className='hover:bg-gray-50/50 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <img
                          src={doc.photoUrl}
                          alt={doc.name}
                          className='w-14 h-14 rounded-full border border-gray-200 shadow-sm object-cover object-top bg-gray-100'
                        />
                        <span className='font-bold text-gray-800'>{doc.name}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-xs text-primary-dark bg-primary/10 px-3 py-1 rounded-full font-bold uppercase'>
                        {doc.department}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-700 font-medium'>
                      {doc.address ? (
                        <>
                          <span className='block text-gray-900'>{doc.address.line1}</span>
                          <span className='text-xs text-gray-400'>{doc.address.city}, {doc.address.state}</span>
                        </>
                      ) : "No address provided"}
                    </td>
                    <td className='px-6 py-4'>
                      <div className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full ${doc.isAvailable ? 'bg-success/15' : 'bg-red/15'}`}>
                        <div className={`w-2 h-2 rounded-full ${doc.isAvailable ? 'bg-success' : 'bg-red'}`}></div>
                        <span className={`text-sm font-bold uppercase ${doc.isAvailable ? 'text-success' : 'text-red'}`}>
                          {doc.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </td>
                    <td className='flex flex-col gap-2 align-middle px-6 py-4'>
                      <Button
                        label='See Profile'
                        variant='primary'
                        onClick={() => navigate(`/doctor/${doc._id}`)}
                        fullWidth
                      />
                      <Button
                        label='Set Schedule'
                        variant='muted'
                        onClick={() => navigate(`/doctors/schedule/${doc._id}`)}
                        fullWidth
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='flex flex-col items-center py-20 bg-gray-50/50'>
            <p className='text-gray-400 italic font-medium tracking-wide'>No doctors found matching your filters.</p>
          </div>
        )}

        {/* PAGINATION FOOTER */}
        <div className='px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30'>
          <p className='text-sm text-gray-500'>
            {filteredDoctors.length > 0 ? (
              <>
                Showing <span className='font-bold text-gray-700'>{indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDoctors.length)}</span> of {filteredDoctors.length} doctors
              </>
            ) : (
              "Result: 0 records found"
            )}
          </p>

          <div className='flex gap-4 items-center mb-6'>
            <Button
              label="<"
              variant={currentPage === 1 ? "disabled" : "secondary"}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            />
            <Button
              label=">"
              variant={(currentPage === totalPages || filteredDoctors.length === 0) ? "disabled" : "primary"}
              disabled={currentPage === totalPages || filteredDoctors.length === 0}
              onClick={() => setCurrentPage(p => p + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doctors