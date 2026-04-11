import React from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import down_arrow from '../assets/icons/down_arrow.svg'

const FilterSelect = ({ value, onChange, options }) => {
  return (
    <Listbox value={value} onChange={onChange}>
        <div className='relative'>
            <ListboxButton className='flex justify-between items-center w-full bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 cursor-pointer'>
                {value}
                <img src={down_arrow} className='w-3 opacity-50' alt='' />
            </ListboxButton>
            <ListboxOptions className='absolute z-20 mt-1 w-full bg-white border border-border rounded-lg shadow-xl py-1 text-sm'>
                {options.map(opt => (
                    <ListboxOption 
                        key={opt}
                        value={opt}
                        className='px-4 py-2 hover:bg-primary/5 cursor-pointer'
                    >
                        {opt}
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </div>
    </Listbox>
  )
}

export default FilterSelect