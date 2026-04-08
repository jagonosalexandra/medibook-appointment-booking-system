import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import close from '../assets/icons/close.svg'
import deleteIcon from '../assets/icons/close.svg'
import user from '../assets/icons/user.svg'
import educationImg from '../assets/icons/education.svg'
import edit from '../assets/icons/edit.svg'
import down_arrow from '../assets/icons/down_arrow.svg'
import doctorImgPlaceholder from '../assets/images/doctorImg_placeholder.png'
import InputField from './InputField'
import Button from './Button'

const DEPARTMENTS = [
    'General Practice', 'Pediatrics', 'Cardiology',
    'Obstetrics & Gynecology', 'Neurology', 'Orthopedics',
]

const DoctorForm = ({ initialData, onSubmit, isAddMode, onDiscard }) => {
    const navigate = useNavigate()
    const bioRef = useRef(null)
    const fileInputRef = useRef(null)

    const [formData, setFormData] = useState(initialData)
    const [image, setImage] = useState(null)
    const [newSpecialty, setNewSpecialty] = useState('')
    const [newCert, setNewCert] = useState('')

    useEffect(() => {
        setFormData(initialData)
    }, [initialData])

    useEffect(() => {
        if (bioRef.current) {
            bioRef.current.style.height = 'auto'
            bioRef.current.style.height = bioRef.current.scrollHeight + 'px'
        }
    }, [formData.bio])

    const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }))
    const handleAddressChange = (field, value) => setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }))

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (!file || !file.type.startsWith('image/')) return
        setImage(file)
        handleChange('photoUrl', URL.createObjectURL(file))
    }

    const addTag = (key, value, setter) => {
        if (!value.trim()) return
        const current = formData[key] || []
        if (!current.includes(value.trim())) {
            setFormData(prev => ({ ...prev, [key]: [...current, value.trim()] }))
        }
        setter('')
    }

    const removeTag = (key, index) => setFormData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }))

    return (
        <div className='w-full flex flex-col gap-8 h-screen overflow-y-auto bg-gray-50/30 pb-20'>
            <div className='flex justify-between items-center px-12 py-4 bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>{isAddMode ? 'Add New Doctor' : 'Edit Doctor Profile'}</h1>
                    <p className='text-sm text-gray-400'>
                        {isAddMode 
                            ? 'Fill in details to add a new doctor.' 
                            : 'Update clinical expertise, education, and other details.'
                        }
                    </p>
                </div>
                <div className='flex items-center gap-3'>
                    <button onClick={() => navigate(-1)} className='p-2 hover:bg-gray-100 rounded-full transition-all'>
                        <img className='w-7' src={close} alt='close' />
                    </button>
                </div>
            </div>

            <div className='flex flex-col gap-8 px-12'>
                {/* BASIC INFORMATION */}
                <div className='bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden'>
                    <h2 className='flex items-center gap-2.5 px-4 py-3 border-b border-gray-200 text-primary-dark font-bold bg-gray-50/50'>
                        <img className='w-6' src={user} alt='' /> Basic Information
                    </h2>
                    <div className='flex flex-col md:flex-row gap-16 p-6'>
                        <div className='flex flex-col items-center gap-3'>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className='hidden' />
                            <div className='relative group'>
                                <img className='w-44 h-44 rounded-full object-cover object-top border-4 border-primary/10 shadow-md bg-gray-100 transition-all' src={formData.photoUrl || doctorImgPlaceholder} alt='' />
                                <div onClick={() => fileInputRef.current.click()} className='absolute bottom-1 right-1 w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-xl'>
                                    <img src={edit} alt='Edit' className='w-6 invert' />
                                </div>
                            </div>
                            {!isAddMode && <span className='px-4 py-1.5 bg-primary/10 text-primary-dark text-sm font-semibold rounded-full border border-primary/20'>{formData.department}</span>}
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-4 flex-1'>
                            <InputField label='Full Name' value={formData.name} onChange={v => handleChange('name', v)} required />
                            <InputField label='Years of Experience' value={formData.experience} onChange={v => handleChange('experience', v)} required />
                            <InputField label='Consultation Fee ($)' type='number' value={formData.fee} onChange={v => handleChange('fee', Number(v))} required />
                            
                            {isAddMode && (
                                <div className='w-full'>
                                    <label className='font-medium block mb-1.5 text-sm'>Department</label>
                                    <Listbox value={formData.department} onChange={v => handleChange('department', v)}>
                                        <div className='relative'>
                                            <ListboxButton className='flex justify-between items-center w-full border border-border px-4 py-2 rounded-lg text-sm font-medium text-left'>
                                                <span className={formData.department ? 'text-gray-800' : 'text-gray-400'}>{formData.department || 'Select department'}</span>
                                                <img src={down_arrow} className='w-3 opacity-50' alt='' />
                                            </ListboxButton>
                                            <ListboxOptions className='absolute z-20 mt-1 w-full max-h-60 overflow-auto bg-white border border-border rounded-lg shadow-xl py-1 outline-none'>
                                                {DEPARTMENTS.map(dept => <ListboxOption key={dept} value={dept} className={({ selected }) => `px-4 py-2 cursor-pointer transition-colors ${selected ? 'bg-primary/15 text-primary font-semibold' : 'hover:bg-primary/5'}`}>{dept}</ListboxOption>)}
                                            </ListboxOptions>
                                        </div>
                                    </Listbox>
                                </div>
                            )}

                            <div className={isAddMode ? 'col-span-2' : ''}>
                                <label className='font-medium block mb-0.5'>Clinic Address</label>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    <InputField label='Street / Line 1' labelBottom value={formData.address.line1} onChange={v => handleAddressChange('line1', v)} placeholder='123 Heart Lane' />
                                    <InputField label='City' labelBottom value={formData.address.city} onChange={v => handleAddressChange('city', v)} placeholder='New York City' />
                                    <InputField label='State / Province' labelBottom value={formData.address.state} onChange={v => handleAddressChange('state', v)} placeholder='NY' />
                                </div>
                            </div>

                            <div className='col-span-1 md:col-span-2 flex flex-col gap-0.5'>
                                <label className='font-medium'>About</label>
                                <textarea ref={bioRef} className='w-full border border-border rounded-xl p-4 outline-none resize-none leading-relaxed focus:border-primary transition-all' placeholder='Describe background...' value={formData.bio} onChange={e => handleChange('bio', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* EDUCATION & QUALIFICATIONS */}
                <div className='bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden'>
                    <h2 className='flex items-center gap-2.5 px-4 py-3 border-b border-gray-200 text-primary-dark font-bold bg-gray-50/50'>
                        <img className='w-6' src={educationImg} alt='' /> Education and Qualifications
                    </h2>
                    <div className='p-6 flex flex-col gap-8'>
                        <InputField label='Educational Background' value={formData.education} onChange={v => handleChange('education', v)} />
                        
                        <div className='flex flex-col gap-0.5'>
                            <label className='font-medium'>Specialties</label>
                            <div>
                                <div className='flex gap-8 pb-1.5'>
                                    <input type="text" className='flex-1 border-b border-border outline-none text-sm focus:border-primary transition-all' placeholder='Add specialty...' value={newSpecialty} onChange={e => setNewSpecialty(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('specialties', newSpecialty, setNewSpecialty))} />
                                    <Button label='Add' variant='primary' onClick={() => addTag('specialties', newSpecialty, setNewSpecialty)} />
                                </div>
                                <div className='flex flex-wrap gap-2 mt-2'>
                                    {formData.specialties?.map((item, index) => (
                                        <div key={index} className='flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg text-primary-dark font-bold text-sm'>
                                            {item}
                                            <img src={deleteIcon} onClick={() => removeTag('specialties', index)} className='w-3 cursor-pointer' alt='' />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-0.5'>
                            <label className='font-medium'>Certifications</label>
                            <div>
                                <div className='flex gap-8 pb-1.5'>
                                    <input type="text" className='flex-1 border-b border-border outline-none text-sm focus:border-primary transition-all' placeholder='Add certification...' value={newCert} onChange={e => setNewCert(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('certifications', newCert, setNewCert))} />
                                    <Button label='Add' variant='primary' onClick={() => addTag('certifications', newCert, setNewCert)} />
                                </div>
                                <div className='flex flex-wrap gap-2 mt-2'>
                                    {formData.certifications?.map((item, index) => (
                                        <div key={index} className='flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg text-primary-dark font-bold text-sm'>
                                            {item}
                                            <img src={deleteIcon} onClick={() => removeTag('certifications', index)} className='w-3 cursor-pointer' alt='' />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex gap-4 items-center justify-end mt-4'>
                    <Button label='Discard Changes' variant='muted' onClick={onDiscard} />
                    <Button label={isAddMode ? 'Add Doctor' : 'Save & Update Profile'} variant='primary' onClick={() => onSubmit(formData, image)} />
                </div>
            </div>
        </div>
    )
}

export default DoctorForm