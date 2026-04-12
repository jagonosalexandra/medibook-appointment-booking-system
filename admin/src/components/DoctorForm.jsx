import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import close from '../assets/icons/close.svg'
import user from '../assets/icons/user.svg'
import educationImg from '../assets/icons/education.svg'
import edit from '../assets/icons/edit.svg'
import doctorImgPlaceholder from '../assets/images/doctorImg_placeholder.png'
import InputField from './InputField'
import Button from './Button'
import FilterSelect from './FilterSelect'
import { DEPARTMENTS } from '../constants/constants'

const DoctorForm = ({ initialData, onSubmit, isAddMode = false, onDiscard }) => {
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

    const TagInput = ({ label, fieldKey, value, setValue }) => (
        <div className='flex flex-col gap-0.5'>
            <label className='font-medium'>{label}</label>
            <div className='flex gap-4 pb-1.5'>
                <input
                    type='text'
                    className='flex-1 border-b border-border outline-none text-sm focus:border-primary transition-all'
                    placeholder={`Add ${label.toLowerCase()}...`}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(fieldKey, value, setValue))}
                />
                <Button label='Add' variant='primary' onClick={() => addTag(fieldKey, value, setValue)} />
            </div>
            <div className='flex flex-wrap gap-2 mt-2'>
                {formData[fieldKey]?.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg text-primary-dark font-bold text-sm'>
                        {item}
                        <button
                            type="button"
                            onClick={() => removeTag(fieldKey, index)}
                            className='text-primary-dark/50 hover:text-red transition-colors font-bold text-xs leading-none'
                            aria-label={`Remove ${item}`}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className='w-full flex flex-col gap-8 px-4 lg:px-12 py-8 h-screen overflow-y-auto bg-gray-50/30 pb-20'>
            <div className='flex justify-between items-start gap-4 relative'>
                <div>
                    <h1 className='text-3xl lg:text-4xl font-black'>{isAddMode ? 'Add New Doctor' : 'Edit Doctor Profile'}</h1>
                    <p className='text-sm text-gray-400'>
                        {isAddMode
                            ? 'Fill in details to add a new doctor.'
                            : 'Update clinical expertise, education, and other details.'
                        }
                    </p>
                </div>
                <button onClick={() => navigate(-1)} className={`${isAddMode ? 'hidden' : ''} p-2 hover:bg-gray-100 rounded-full transition-all absolute right-0 shrink-0`}>
                    <img className='w-7 lg:w-8' src={close} alt='close' />
                </button>
            </div>

            <div className='flex flex-col gap-8'>
                {/* BASIC INFORMATION */}
                <div className='bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden'>
                    <h2 className='flex items-center gap-2.5 px-4 py-3 border-b border-gray-200 text-primary-dark font-bold bg-gray-50/50'>
                        <img className='w-6' src={user} alt='' /> Basic Information
                    </h2>
                    <div className='flex flex-col md:flex-row gap-8 lg:gap-16 p-6'>
                        <div className='flex flex-col items-center gap-3 shrink-0'>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className='hidden' />
                            <div className='relative group'>
                                <img className='w-36 h-36 lg:w-44 lg:h-44 rounded-full object-cover object-top border-4 border-primary/10 shadow-md bg-gray-100 transition-all' src={formData.photoUrl || doctorImgPlaceholder} alt='' />
                                <div onClick={() => fileInputRef.current.click()} className='absolute bottom-1 right-1 w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-xl'>
                                    <img src={edit} alt='Edit' className='w-5 lg:w-6 invert' />
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-4 flex-1'>
                            <InputField label='Full Name' value={formData.name} onChange={v => handleChange('name', v)} required />
                            <div className='flex w-full py-3.5 flex-col gap-0.5'>
                                <label className='font-medium'>Department</label>
                                {isAddMode ? (
                                    <FilterSelect
                                        value={formData.department || "Select Department"}
                                        onChange={v => handleChange('department', v)}
                                        options={DEPARTMENTS}
                                    />
                                ) : (
                                    <div>
                                        <p className='outline-none border-b border-border px-1.5'>{formData.department}</p>
                                    </div>
                                )}
                            </div>
                            <InputField type='number' label='Years of Experience' value={formData.experience} onChange={v => handleChange('experience', v)} required />
                            <InputField type='number' label='Consultation Fee ($)' value={formData.fee} onChange={v => handleChange('fee', Number(v))} required />

                            <div className='col-span-1 md:col-span-2'>
                                <label className='font-medium block mb-0.5'>Address</label>
                                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                    <InputField label='Street' labelBottom value={formData.address.street} onChange={v => handleAddressChange('street', v)} placeholder='123 Heart Lane' />
                                    <InputField label='City' labelBottom value={formData.address.city} onChange={v => handleAddressChange('city', v)} placeholder='New York City' />
                                    <InputField label='State' labelBottom value={formData.address.state} onChange={v => handleAddressChange('state', v)} placeholder='NY' />
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
                        <TagInput label="Specialties" fieldKey="specialties" value={newSpecialty} setValue={setNewSpecialty} />
                        <TagInput label="Certifications" fieldKey="certifications" value={newCert} setValue={setNewCert} />
                    </div>
                </div>

                <div className='flex flex-col-reverse sm:flex-row gap-3 sm:justify-end mt-4'>
                    {(!isAddMode) && (
                        <Button label='Discard Changes' variant='muted' onClick={onDiscard} />
                    )}
                    <Button label={isAddMode ? 'Add Doctor' : 'Save & Update Profile'} variant='primary' onClick={() => onSubmit(formData, image)} />
                </div>
            </div>
        </div>
    )
}

export default DoctorForm