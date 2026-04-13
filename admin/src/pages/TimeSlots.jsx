import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { fetchAllDoctors } from '../services/doctorService'
import { addDoctorSlots, getDoctorSlots, toggleSlot } from '../services/adminService'
import LoadingSpinner from '../components/LoadingSpinner'
import SectionCard from '../components/SectionCard'
import DatePicker from '../components/DatePicker'
import down_arrow from '../assets/icons/down_arrow.svg'
import clock from '../assets/icons/clock.svg'
import { DAYS_OF_WEEK, DAY_SHORT, TIME_OPTIONS, TABS, getTodayStr, getEndTime } from '../constants/constants'

const AddSlotsTab = ({ selectedDoctor }) => {
    const [startDate, setStartDate] = useState(getTodayStr())
    const [endDate, setEndDate] = useState(getTodayStr())
    const [selectedDays, setSelectedDays] = useState([])
    const [selectedTimes, setSelectedTimes] = useState([])
    const [isAdding, setIsAdding] = useState(false)

    const toggleDay = (day) =>
        setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
    const toggleTime = (time) =>
        setSelectedTimes(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time])
    const toggleAllTimes = () =>
        setSelectedTimes(prev => prev.length === TIME_OPTIONS.length ? [] : [...TIME_OPTIONS])
    const allDaysSelected = selectedDays.length === DAYS_OF_WEEK.length

    const estimatedSlots = useMemo(() => {
        if (!startDate || !endDate || !selectedDays.length || !selectedTimes.length) return 0
        let count = 0
        const current = new Date(startDate + 'T00:00:00')
        const end = new Date(endDate + 'T00:00:00')
        while (current <= end) {
            if (selectedDays.includes(current.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })))
                count += selectedTimes.length
            current.setDate(current.getDate() + 1)
        }
        return count
    }, [startDate, endDate, selectedDays, selectedTimes])

    const handleAddSlots = async () => {
        if (!selectedDays.length) return toast.error('Select at least one day')
        if (!selectedTimes.length) return toast.error('Select at least one time slot')
        if (startDate > endDate) return toast.error('End date must be after start date')
        setIsAdding(true)
        try {
            const result = await addDoctorSlots({ docId: selectedDoctor._id, startDate, endDate, selectedDays, timeSlots: selectedTimes })
            toast.success(result.message || 'Slots added!')
            setSelectedDays([]); setSelectedTimes([])
            setStartDate(getTodayStr()); setEndDate(getTodayStr())
        } catch { toast.error('Failed to add slots') }
        finally { setIsAdding(false) }
    }

    return (
        <div className='flex flex-col gap-5'>
            <SectionCard title='Date Range' icon={clock}>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <DatePicker
                        label='Start Date'
                        value={startDate}
                        minDate={getTodayStr()}
                        onChange={setStartDate}
                    />
                    <DatePicker
                        label='End Date'
                        value={endDate}
                        minDate={startDate}
                        onChange={setEndDate}
                    />
                </div>
            </SectionCard>

            <SectionCard
                title='Days of the Week'
                action={
                    <button onClick={() => setSelectedDays(allDaysSelected ? [] : [...DAYS_OF_WEEK])}
                        className='text-xs text-primary font-semibold hover:underline'>
                        {allDaysSelected ? 'Deselect all' : 'Select all'}
                    </button>
                }
            >
                <div className='flex flex-wrap gap-2'>
                    {DAYS_OF_WEEK.map(day => (
                        <button key={day} onClick={() => toggleDay(day)}
                            className={`flex-1 min-w-15 py-3 rounded-lg text-sm font-semibold border-2 transition-all
                                ${selectedDays.includes(day) ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                            {DAY_SHORT[day]}
                        </button>
                    ))}
                </div>
            </SectionCard>

            <SectionCard
                title={<>Time Slots <span className='ml-2 text-xs text-gray-400 font-normal'>({selectedTimes.length} selected)</span></>}
                action={
                    <button onClick={toggleAllTimes} className='text-xs text-primary font-semibold hover:underline'>
                        {selectedTimes.length === TIME_OPTIONS.length ? 'Deselect all' : 'Select all'}
                    </button>
                }
            >
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                    {TIME_OPTIONS.map(time => (
                        <button key={time} onClick={() => toggleTime(time)}
                            className={`py-2.5 px-3 rounded-lg text-sm font-semibold border-2 transition-all
                                ${selectedTimes.includes(time) ? 'bg-success/10 border-success/30 text-success' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                            {time}
                        </button>
                    ))}
                </div>
            </SectionCard>

            <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                <div className='flex flex-col gap-0.5'>
                    <p className='text-sm text-gray-500'>
                        Approximately <span className='text-primary font-bold text-base mx-1'>{estimatedSlots}</span>
                        slot{estimatedSlots !== 1 ? 's' : ''} will be created
                    </p>
                    <p className='text-xs text-gray-400'>
                        {selectedDays.length > 0
                            ? `${selectedDays.map(d => DAY_SHORT[d]).join(', ')} · ${selectedTimes.length} time${selectedTimes.length !== 1 ? 's' : ''} per day`
                            : 'No days selected yet'}
                    </p>
                </div>
                <button onClick={handleAddSlots} disabled={isAdding || estimatedSlots === 0}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all
                        ${isAdding || estimatedSlots === 0 ? 'bg-primary/40 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark active:scale-95'}`}>
                    {isAdding ? 'Adding...' : `Add ${estimatedSlots} Slot${estimatedSlots !== 1 ? 's' : ''}`}
                </button>
            </div>
        </div>
    )
}

const ManageSlotsTab = ({ slots, loadingSlots, onToggleSlot, togglingSlotId }) => {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = new Date()
        const diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        return new Date(new Date().setDate(diff))
    })

    const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const d = new Date(currentWeekStart)
        d.setDate(d.getDate() + i)
        return d.toISOString().split('T')[0]
    }), [currentWeekStart])

    const navigateWeek = (dir) => {
        const d = new Date(currentWeekStart)
        d.setDate(d.getDate() + dir * 7)
        setCurrentWeekStart(d)
    }

    const goToToday = () => {
        const today = new Date()
        const diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        setCurrentWeekStart(new Date(new Date().setDate(diff)))
    }

    const weekRangeLabel = useMemo(() => {
        const end = new Date(currentWeekStart)
        end.setDate(end.getDate() + 6)
        const fmt = (d, opts) => d.toLocaleDateString('en-US', opts)
        return currentWeekStart.getMonth() === end.getMonth()
            ? `${fmt(currentWeekStart, { month: 'long' })} ${currentWeekStart.getFullYear()}`
            : `${fmt(currentWeekStart, { month: 'short' })} – ${fmt(end, { month: 'short' })} ${end.getFullYear()}`
    }, [currentWeekStart])

    return (
        <div className='flex flex-col gap-6'>
            {/* Week Navigator */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-200 rounded-xl px-4 lg:px-6 py-3 shadow-sm gap-3'>
                <div className='flex items-center gap-3'>
                    <button onClick={goToToday}
                        className='px-3 py-1.5 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-50 transition-all'>
                        Today
                    </button>
                    <div className='flex gap-1'>
                        <button onClick={() => navigateWeek(-1)} className='p-2 hover:bg-gray-100 rounded-full transition-all'>
                            <img src={down_arrow} className='w-4 rotate-90 opacity-60' alt='prev' />
                        </button>
                        <button onClick={() => navigateWeek(1)} className='p-2 hover:bg-gray-100 rounded-full transition-all'>
                            <img src={down_arrow} className='w-4 -rotate-90 opacity-60' alt='next' />
                        </button>
                    </div>
                    <h2 className='text-base lg:text-lg font-bold text-gray-800'>{weekRangeLabel}</h2>
                </div>
                <div className='flex gap-4 items-center'>
                    {[['bg-success', 'Available'], ['bg-red-500', 'Booked']].map(([color, label]) => (
                        <div key={label} className='flex items-center gap-2'>
                            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                            <span className='text-[10px] font-bold text-gray-400 uppercase tracking-tight'>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {loadingSlots ? <LoadingSpinner message='Fetching schedule...' /> : (
                <div className='grid grid-cols-1 w-full rounded-2xl shadow-lg bg-white border border-gray-200 overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <div className='min-w-200 w-full'>
                            <div className='grid grid-cols-[repeat(7,1fr)] lg:grid-cols-[100px_repeat(7,1fr)] bg-gray-50 border-b border-gray-200 sticky top-0 z-10'>
                                <div className='hidden lg:flex items-center justify-center border-r border-gray-200 bg-gray-100/50 py-4'>
                                    <img src={clock} className='w-4 opacity-25' alt='' />
                                </div>
                                {weekDates.map((dateStr, idx) => {
                                    const isToday = getTodayStr() === dateStr
                                    const dateObj = new Date(dateStr + 'T00:00:00')
                                    return (
                                        <div key={dateStr}
                                            className={`py-3 text-center border-r last:border-r-0 border-gray-200 ${isToday ? 'bg-primary/5' : ''}`}>
                                            <p className={`font-black text-[8px] lg:text-[10px] uppercase tracking-widest ${isToday ? 'text-primary' : 'text-gray-400'}`}>
                                                {DAY_SHORT[DAYS_OF_WEEK[idx]]}
                                            </p>
                                            <p className={`text-md lg:text-lg font-bold leading-none mt-1 ${isToday ? 'text-primary' : 'text-gray-700'}`}>
                                                {dateObj.getDate()}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className='divide-y divide-gray-100 bg-white'>
                                {TIME_OPTIONS.map(time => (
                                    <div key={time} className='grid grid-cols-[repeat(7,1fr)] lg:grid-cols-[100px_repeat(7,1fr)] group'>
                                        <div className='hidden lg:flex items-center justify-center border-r border-gray-200 bg-gray-50/50 group-hover:bg-gray-100/80 transition-colors py-3 px-1'>
                                            <span className='text-[10px] lg:text-xs font-semibold text-gray-400 text-center whitespace-nowrap'>
                                                {time}
                                            </span>
                                        </div>

                                        {weekDates.map(dateStr => {
                                            const slot = slots.find(s => s.date === dateStr && s.time === time)
                                            return (
                                                <div key={dateStr}
                                                    className='p-1.5 border-r last:border-r-0 border-gray-100 min-h-16 bg-white group-hover:bg-gray-50/30 transition-all'>
                                                    {slot ? (
                                                        <button
                                                            onClick={() => onToggleSlot(slot._id)}
                                                            disabled={togglingSlotId === slot._id}
                                                            className={`w-full h-full rounded-xl p-2 flex flex-col justify-between border-2 transition-all active:scale-95 text-left
                                                    ${togglingSlotId === slot._id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                                                    ${slot.isAvailable
                                                                    ? 'bg-success/10 border-success/25 hover:bg-success/20 hover:border-success/40'
                                                                    : 'bg-red-50 border-red-200 hover:bg-red-100'}`}
                                                        >
                                                            <div className='flex justify-between items-start gap-1'>
                                                                <span className={`text-[9px] font-black tracking-wide leading-none ${slot.isAvailable ? 'text-success' : 'text-red-600'}`}>
                                                                    {slot.isAvailable ? 'AVAILABLE' : 'BOOKED'}
                                                                </span>
                                                                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${slot.isAvailable ? 'bg-success' : 'bg-red-500'}`} />
                                                            </div>

                                                            <span className='text-[8px] font-medium text-gray-400 whitespace-nowrap mt-auto pt-1'>
                                                                {time} – {getEndTime(time)}
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <div className='w-full h-full flex items-center justify-center opacity-10'>
                                                            <div className='w-1 h-1 rounded-full bg-gray-400' />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const TimeSlots = () => {
    const [doctors, setDoctors] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [activeTab, setActiveTab] = useState('Add Slots')
    const [loadingDoctors, setLoadingDoctors] = useState(true)
    const [slots, setSlots] = useState([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [togglingSlotId, setTogglingSlotId] = useState(null)

    useEffect(() => {
        fetchAllDoctors()
            .then(data => setDoctors(data))
            .catch(() => toast.error('Failed to load doctors'))
            .finally(() => setLoadingDoctors(false))
    }, [])

    const fetchSlots = useCallback(async () => {
        if (!selectedDoctor) return
        setLoadingSlots(true)
        try {
            const data = await getDoctorSlots(selectedDoctor._id)
            setSlots(data || [])
        } catch { toast.error('Failed to load slots'); setSlots([]) }
        finally { setLoadingSlots(false) }
    }, [selectedDoctor])

    useEffect(() => {
        if (activeTab === 'Manage Slots' && selectedDoctor) fetchSlots()
    }, [activeTab, selectedDoctor, fetchSlots])

    const handleToggleSlot = async (slotId) => {
        setTogglingSlotId(slotId)
        try {
            const result = await toggleSlot(slotId)
            setSlots(prev => prev.map(s => s._id === slotId ? { ...s, isAvailable: result.slot.isAvailable } : s))
            toast.success(result.message)
        } catch { toast.error('Failed to update slot') }
        finally { setTogglingSlotId(null) }
    }

    return (
        <div className='w-full h-screen overflow-auto px-4 lg:px-12 py-8 bg-gray-50/30 pb-20'>
            <div className='mb-6'>
                <h1 className='text-3xl lg:text-4xl font-black'>Schedule Management</h1>
                <p className='text-sm text-gray-400 mt-0.5'>Schedule and manage appointment availability for each doctor.</p>
            </div>

            <div className='flex flex-col gap-6'>
                {/* Doctor Selector */}
                <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-5'>
                    <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2'>Select Doctor</label>
                    {loadingDoctors ? <LoadingSpinner message='Loading doctors...' /> : (
                        <Listbox value={selectedDoctor} onChange={(doc) => { setSelectedDoctor(doc); setSlots([]) }}>
                            <div className='relative'>
                                <ListboxButton className='flex justify-between items-center w-full border border-border bg-white px-3 py-2.5 rounded-lg text-sm cursor-pointer text-left'>
                                    <span className={selectedDoctor ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                                        {selectedDoctor ? `${selectedDoctor.name} — ${selectedDoctor.department}` : 'Choose a doctor to manage their time slots...'}
                                    </span>
                                    <img src={down_arrow} className='w-3 opacity-50' alt='' />
                                </ListboxButton>
                                <ListboxOptions className='absolute z-20 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-xl py-1 text-sm'>
                                    {doctors.map(doc => (
                                        <ListboxOption key={doc._id} value={doc}
                                            className={({ selected }) => `px-3 py-2.5 cursor-pointer transition-colors rounded-lg mx-1 ${selected ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-50'}`}>
                                            <span className='font-medium'>{doc.name}</span>
                                            <span className='text-gray-400 ml-2 text-xs'>— {doc.department}</span>
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    )}
                </div>

                {selectedDoctor && (
                    <>
                        {/* Tab Bar */}
                        <div className='flex px-1 w-fit border-b border-gray-300'>
                            {TABS.map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 text-sm font-semibold transition-all
                                        ${activeTab === tab ? 'text-primary border-b-2 border-primary -mb-px' : 'text-gray-500 hover:text-gray-700'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'Add Slots' && <AddSlotsTab selectedDoctor={selectedDoctor} />}
                        {activeTab === 'Manage Slots' && (
                            <ManageSlotsTab
                                slots={slots}
                                loadingSlots={loadingSlots}
                                onToggleSlot={handleToggleSlot}
                                togglingSlotId={togglingSlotId}
                            />
                        )}
                    </>
                )}

                {!selectedDoctor && !loadingDoctors && (
                    <div className='bg-white border border-dashed border-gray-300 rounded-xl p-12 lg:p-20 flex flex-col items-center justify-center gap-3'>
                        <img src={clock} className='w-12 opacity-20' alt='' />
                        <p className='text-gray-400 font-medium text-center'>Select a doctor to manage their schedule</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TimeSlots