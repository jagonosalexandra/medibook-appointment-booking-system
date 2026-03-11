import React, { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { fetchAllDoctors } from '../services/doctorService'
import DoctorCard from '../components/DoctorCard'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import down_arrow from '../assets/icons/down_arrow.svg'

const Doctors = () => {

  const [doctors, setDoctors] = useState([])
  const [filter, setFilter] = useState('Filter by department')

  useEffect(() => {
    fetchAllDoctors().then(data => {
      setDoctors(data);
    })
  }, [])

  const filteredDocs = filter === 'Filter by department'
    ? doctors
    : doctors.filter(doc => doc.department === filter)

  return (
    <div className='px-8 py-10 pb-16'>

      <PageHeader
        title="Doctors"
        subtitle="Connect with world-class healthcare professionals. Schedule your next appointment in minutes with MediBook's verified experts."
      />

      <Listbox className='mt-16 my-4 ml-auto max-w-xs' value={filter} onChange={setFilter}>
        <div className='relative mt-2'>
          <ListboxButton className='flex justify-between gap-8 w-full cursor-pointer grid-cols-1 rounded-lg py-1.5 pr-2 pl-3 text-left text-gray-600 outline-1 -outline-offset-2 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-3 focus-visible:outline-primary/40 sm:text-sm/6'>
            <span>{filter}</span>
            <img className='text-gray-600' src={down_arrow} alt='' />
          </ListboxButton>

          <ListboxOptions
            transition
            className='w-full absolute z-10 mt-1 overflow-auto rounded-lg bg-background px-3 py-1.5 text-sm outline-1 outline-gray-300 shadow-md'
          >
            <ListboxOption value="Filter by department" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>Filter by department</ListboxOption>
            <ListboxOption value="General Practice" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>General Practice</ListboxOption>
            <ListboxOption value="Pediatrics" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>Pediatrics</ListboxOption>
            <ListboxOption value="Cardiology" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>Cardiology</ListboxOption>
            <ListboxOption value="Obstretics & Gynecology" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>Obstetrics & Gynecology</ListboxOption>
            <ListboxOption value="Neurology" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>Neurology</ListboxOption>
            <ListboxOption value="Orthopedics" className='pl-2 py-1 rounded-lg hover:bg-primary/20 cursor-pointer'>Orthopedics</ListboxOption>
          </ListboxOptions>
        </div>
      </Listbox>

      <div className='grid grid-cols-3 gap-4'>
        {filteredDocs.map(doc => (
          <DoctorCard
            key={doc._id}
            name={doc.name}
            photoUrl={doc.photoUrl}
            department={doc.department}
          />
        ))}
      </div>
    </div>
  )
}

export default Doctors