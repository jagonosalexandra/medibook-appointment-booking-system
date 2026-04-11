// admin/src/pages/TimeSlots.jsx
import { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { fetchAllDoctors } from '../services/doctorService'
import { addDoctorSlots, getDoctorSlots, toggleSlot } from '../services/adminService'
import down_arrow from '../assets/icons/down_arrow.svg'
import clock from '../assets/icons/clock.svg'

// ── Constants ────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' }

const TIME_OPTIONS = [
    '08:00 AM', '09:00 AM',
    '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM',
]

const TABS = ['Add Slots', 'Manage Slots']

const getTodayStr = () => new Date().toISOString().split('T')[0]

// ── Component ────────────────────────────────────────────────────────────────

const TimeSlots = () => {
    // Shared state
    const [doctors, setDoctors] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [activeTab, setActiveTab] = useState('Add Slots')
    const [loadingDoctors, setLoadingDoctors] = useState(true)

    // Add Slots form state
    const [startDate, setStartDate] = useState(getTodayStr())
    const [endDate, setEndDate] = useState(getTodayStr())
    const [selectedDays, setSelectedDays] = useState([])
    const [selectedTimes, setSelectedTimes] = useState([])
    const [isAdding, setIsAdding] = useState(false)

    // Manage Slots state
    const [slots, setSlots] = useState([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [togglingSlotId, setTogglingSlotId] = useState(null)

    // ── Fetch doctors ──────────────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAllDoctors()
                setDoctors(data)
            } catch {
                toast.error('Failed to load doctors')
            } finally {
                setLoadingDoctors(false)
            }
        }
        load()
    }, [])

    // ── Fetch slots when switching to Manage tab ───────────────────────────────
    useEffect(() => {
        if (activeTab !== 'Manage Slots' || !selectedDoctor) return
        fetchSlots()
    }, [activeTab, selectedDoctor])

    const fetchSlots = async () => {
        setLoadingSlots(true)
        try {
            const data = await getDoctorSlots(selectedDoctor._id)
            setSlots(data || [])
        } catch {
            toast.error('Failed to load slots')
            setSlots([])
        } finally {
            setLoadingSlots(false)
        }
    }

    // ── Day toggle ────────────────────────────────────────────────────────────
    const toggleDay = (day) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    // ── Time toggle ───────────────────────────────────────────────────────────
    const toggleTime = (time) => {
        setSelectedTimes(prev =>
            prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
        )
    }

    // ── Select all / none for times ───────────────────────────────────────────
    const toggleAllTimes = () => {
        setSelectedTimes(prev =>
            prev.length === TIME_OPTIONS.length ? [] : [...TIME_OPTIONS]
        )
    }

    // ── Add Slots submit ──────────────────────────────────────────────────────
    const handleAddSlots = async () => {
        if (!selectedDoctor) return toast.error('Please select a doctor')
        if (selectedDays.length === 0) return toast.error('Please select at least one day')
        if (selectedTimes.length === 0) return toast.error('Please select at least one time slot')
        if (!startDate || !endDate) return toast.error('Please select a date range')
        if (startDate > endDate) return toast.error('End date must be after start date')

        setIsAdding(true)
        try {
            const result = await addDoctorSlots({
                docId: selectedDoctor._id,
                startDate,
                endDate,
                selectedDays,
                timeSlots: selectedTimes,
            })
            toast.success(result.message || 'Slots added successfully!')
            // Reset form
            setSelectedDays([])
            setSelectedTimes([])
            setStartDate(getTodayStr())
            setEndDate(getTodayStr())
        } catch {
            toast.error('Failed to add slots')
        } finally {
            setIsAdding(false)
        }
    }

    // ── Toggle slot availability ──────────────────────────────────────────────
    const handleToggleSlot = async (slotId) => {
        setTogglingSlotId(slotId)
        try {
            const result = await toggleSlot(slotId)
            // Update local state so UI reflects immediately without refetch
            setSlots(prev =>
                prev.map(s => s._id === slotId ? { ...s, isAvailable: result.slot.isAvailable } : s)
            )
            toast.success(result.message)
        } catch {
            toast.error('Failed to update slot')
        } finally {
            setTogglingSlotId(null)
        }
    }

    // ── Estimated slot count preview ──────────────────────────────────────────
    const estimatedSlots = useMemo(() => {
        if (!startDate || !endDate || selectedDays.length === 0 || selectedTimes.length === 0) return 0
        let count = 0
        const start = new Date(startDate + 'T00:00:00')
        const end = new Date(endDate + 'T00:00:00')
        let current = new Date(start)
        while (current <= end) {
            const dayName = current.toLocaleDateString('en-US', { weekday: 'long' })
            if (selectedDays.includes(dayName)) count += selectedTimes.length
            current.setDate(current.getDate() + 1)
        }
        return count
    }, [startDate, endDate, selectedDays, selectedTimes])

    // Inside TimeSlots component
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
        return new Date(today.setDate(diff));
    });

    // Helper to get all 7 dates of the current week
    const weekDates = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(currentWeekStart);
            d.setDate(d.getDate() + i);
            return d.toISOString().split('T')[0];
        });
    }, [currentWeekStart]);

    const navigateWeek = (direction) => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + (direction * 7));
        setCurrentWeekStart(newDate);
    };

    const goToToday = () => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        setCurrentWeekStart(new Date(new Date().setDate(diff)));
    };

    const weekRangeLabel = useMemo(() => {
        const start = currentWeekStart;
        const end = new Date(currentWeekStart);
        end.setDate(end.getDate() + 6);
        const options = { month: 'short', year: 'numeric' };
        if (start.getMonth() === end.getMonth()) {
            return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getFullYear()}`;
        }
        return `${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.toLocaleDateString('en-US', { month: 'short' })} ${end.getFullYear()}`;
    }, [currentWeekStart]);

    const getEndTime = (startTime) => {
        // startTime example: "08:00 AM"
        const [time, period] = startTime.split(' ');
        let [hour, minute] = time.split(':').map(Number);

        let endHour = hour + 1;
        let endPeriod = period;

        // Handle 11 AM -> 12 PM
        if (hour === 11 && period === 'AM') {
            endPeriod = 'PM';
        }
        // Handle 12 PM -> 01 PM
        else if (hour === 12) {
            endHour = 1;
        }
        // Handle 11 PM -> 12 AM (if applicable)
        else if (hour === 11 && period === 'PM') {
            endPeriod = 'AM';
        }

        // Format with leading zero if needed
        const formattedHour = endHour < 10 ? `0${endHour}` : endHour;
        const formattedMinute = minute < 10 ? `0${minute}` : minute;

        return `${formattedHour}:${formattedMinute} ${endPeriod}`;
    };

    // ────────────────────────────────────────────────────────────────────────────

    return (
        <div className='w-full h-screen overflow-y-auto bg-gray-50/30 pb-20'>

            {/* ── PAGE HEADER ─────────────────────────────────────────────────────── */}
            <div className='px-12 py-6'>
                <h1 className='text-4xl font-black'>Time Slot Management</h1>
                <p className='text-sm text-gray-400 mt-0.5'>
                    Schedule and manage appointment availability for each doctor.
                </p>
            </div>

            <div className='px-12 py-8 flex flex-col gap-6'>

                {/* ── DOCTOR SELECTOR ─────────────────────────────────────────────── */}
                <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-5'>
                    <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2'>
                        Select Doctor
                    </label>
                    {loadingDoctors ? (
                        <p className='text-sm text-gray-400'>Loading doctors...</p>
                    ) : (
                        <Listbox
                            value={selectedDoctor}
                            onChange={(doc) => {
                                setSelectedDoctor(doc)
                                setSlots([])
                                setFilterDate('all')
                            }}
                        >
                            <div className='relative max-w-lg'>
                                <ListboxButton className='flex justify-between items-center w-full border border-border bg-white px-3 py-2.5 rounded-lg text-sm cursor-pointer text-left'>
                                    <span className={selectedDoctor ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                                        {selectedDoctor
                                            ? `${selectedDoctor.name} — ${selectedDoctor.department}`
                                            : 'Choose a doctor to manage their time slots...'}
                                    </span>
                                    <img src={down_arrow} className='w-3 opacity-50' alt='' />
                                </ListboxButton>

                                <ListboxOptions className='absolute z-20 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-xl py-1 text-sm'>
                                    {doctors.map(doc => (
                                        <ListboxOption
                                            key={doc._id}
                                            value={doc}
                                            className={({ selected }) =>
                                                `px-3 py-2.5 cursor-pointer transition-colors rounded-lg mx-1
                        ${selected ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-50'}`
                                            }
                                        >
                                            <span className='font-medium'>{doc.name}</span>
                                            <span className='text-gray-400 ml-2 text-xs'>— {doc.department}</span>
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    )}
                </div>

                {/* ── TABS ────────────────────────────────────────────────────────── */}
                {selectedDoctor && (
                    <>
                        <div className='flex gap-1 bg-gray-100 rounded-xl p-1 w-fit'>
                            {TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all
                    ${activeTab === tab
                                            ? 'bg-white text-primary shadow-sm border border-gray-200'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* ── TAB 1: ADD SLOTS ──────────────────────────────────────────── */}
                        {activeTab === 'Add Slots' && (
                            <div className='flex flex-col gap-5'>

                                {/* Date Range */}
                                <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden'>
                                    <div className='flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50'>
                                        <img src={clock} className='w-4 opacity-60' alt='' />
                                        <span className='text-sm font-semibold text-primary-dark'>Date Range</span>
                                    </div>
                                    <div className='p-5 grid grid-cols-2 gap-5'>
                                        <div className='flex flex-col gap-1.5'>
                                            <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                                                Start Date
                                            </label>
                                            <input
                                                type='date'
                                                value={startDate}
                                                min={getTodayStr()}
                                                onChange={e => setStartDate(e.target.value)}
                                                className='border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-2 focus:outline-primary'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1.5'>
                                            <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                                                End Date
                                            </label>
                                            <input
                                                type='date'
                                                value={endDate}
                                                min={startDate}
                                                onChange={e => setEndDate(e.target.value)}
                                                className='border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-2 focus:outline-primary'
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Days of Week */}
                                <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden'>
                                    <div className='flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50'>
                                        <span className='text-sm font-semibold text-primary-dark'>Days of the Week</span>
                                        <button
                                            onClick={() => setSelectedDays(
                                                selectedDays.length === DAYS_OF_WEEK.length ? [] : [...DAYS_OF_WEEK]
                                            )}
                                            className='text-xs text-primary font-semibold hover:underline'
                                        >
                                            {selectedDays.length === DAYS_OF_WEEK.length ? 'Deselect all' : 'Select all'}
                                        </button>
                                    </div>
                                    <div className='p-5 flex gap-2'>
                                        {DAYS_OF_WEEK.map(day => (
                                            <button
                                                key={day}
                                                onClick={() => toggleDay(day)}
                                                className={`flex-1 py-3 rounded-lg text-sm font-semibold border-2 transition-all
                          ${selectedDays.includes(day)
                                                        ? 'bg-primary/10 border-primary/30 text-primary'
                                                        : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {DAY_SHORT[day]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Slots */}
                                <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden'>
                                    <div className='flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50'>
                                        <span className='text-sm font-semibold text-primary-dark'>
                                            Time Slots
                                            <span className='ml-2 text-xs text-gray-400 font-normal'>
                                                ({selectedTimes.length} selected)
                                            </span>
                                        </span>
                                        <button
                                            onClick={toggleAllTimes}
                                            className='text-xs text-primary font-semibold hover:underline'
                                        >
                                            {selectedTimes.length === TIME_OPTIONS.length ? 'Deselect all' : 'Select all'}
                                        </button>
                                    </div>
                                    <div className='p-5 grid grid-cols-4 gap-3'>
                                        {TIME_OPTIONS.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => toggleTime(time)}
                                                className={`py-2.5 px-3 rounded-lg text-sm font-semibold border-2 transition-all
                          ${selectedTimes.includes(time)
                                                        ? 'bg-success/10 border-success/30 text-success'
                                                        : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary + Submit */}
                                <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex items-center justify-between'>
                                    <div className='flex flex-col gap-0.5'>
                                        <p className='text-sm text-gray-500'>
                                            This will create approximately
                                            <span className='text-primary font-bold text-base mx-1'>{estimatedSlots}</span>
                                            slot{estimatedSlots !== 1 ? 's' : ''}
                                        </p>
                                        <p className='text-xs text-gray-400'>
                                            {selectedDays.length > 0
                                                ? `${selectedDays.map(d => DAY_SHORT[d]).join(', ')} · ${selectedTimes.length} time${selectedTimes.length !== 1 ? 's' : ''} per day`
                                                : 'No days selected yet'}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleAddSlots}
                                        disabled={isAdding || estimatedSlots === 0}
                                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all
                      ${isAdding || estimatedSlots === 0
                                                ? 'bg-primary/40 cursor-not-allowed'
                                                : 'bg-primary hover:bg-primary-dark active:scale-95'
                                            }`}
                                    >
                                        {isAdding ? 'Adding...' : `Add ${estimatedSlots} Slot${estimatedSlots !== 1 ? 's' : ''}`}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── TAB 2: MANAGE SLOTS ───────────────────────────────────────── */}
                        {activeTab === 'Manage Slots' && (
                            <div className='flex flex-col gap-6'>
                                {/* WEEK NAVIGATOR BAR */}
                                <div className='flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-3 shadow-sm'>
                                    <div className='flex items-center gap-4'>
                                        <button
                                            onClick={goToToday}
                                            className='px-4 py-1.5 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-50 transition-all'
                                        >
                                            Today
                                        </button>
                                        <div className='flex items-center gap-1'>
                                            <button onClick={() => navigateWeek(-1)} className='p-2 hover:bg-gray-100 rounded-full transition-all'>
                                                <img src={down_arrow} className='w-4 rotate-90 opacity-60' alt='prev' />
                                            </button>
                                            <button onClick={() => navigateWeek(1)} className='p-2 hover:bg-gray-100 rounded-full transition-all'>
                                                <img src={down_arrow} className='w-4 -rotate-90 opacity-60' alt='next' />
                                            </button>
                                        </div>
                                        <h2 className='text-lg font-bold text-gray-800 ml-2'>{weekRangeLabel}</h2>
                                    </div>

                                    <div className='flex gap-6 items-center'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-3 h-3 rounded-full bg-success' />
                                            <span className='text-[10px] font-bold text-gray-400 uppercase'>Available</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-3 h-3 rounded-full bg-red-500' />
                                            <span className='text-[10px] font-bold text-gray-400 uppercase'>Booked</span>
                                        </div>
                                    </div>
                                </div>

                                {loadingSlots ? (
                                    <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-16 flex items-center justify-center'>
                                        <p className='text-gray-400 italic'>Fetching clinical schedule...</p>
                                    </div>
                                ) : (
                                    <div className='bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden'>
                                        {/* CALENDAR GRID HEADER */}
                                        <div className='grid grid-cols-[100px_repeat(7,1fr)] bg-gray-50 border-b border-gray-200 sticky top-0 z-10'>
                                            <div className='p-4 border-r border-gray-200 flex items-center justify-center bg-gray-100/50'>
                                                <img src={clock} className='w-4 opacity-40' alt='' />
                                            </div>
                                            {weekDates.map((dateStr, idx) => {
                                                const dateObj = new Date(dateStr + 'T00:00:00');
                                                const isToday = new Date().toISOString().split('T')[0] === dateStr;
                                                return (
                                                    <div key={dateStr} className={`p-3 text-center border-r last:border-r-0 border-gray-200 ${isToday ? 'bg-primary/5' : ''}`}>
                                                        <p className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-primary' : 'text-gray-400'}`}>
                                                            {DAYS_OF_WEEK[idx]}
                                                        </p>
                                                        <p className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-gray-700'}`}>
                                                            {dateObj.getDate()}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* CALENDAR GRID BODY */}
                                        <div className='relative overflow-x-auto'>
                                            {TIME_OPTIONS.map((time) => (
                                                <div key={time} className='grid grid-cols-[100px_repeat(7,1fr)] border-b border-gray-100 last:border-b-0 group'>
                                                    <div className='p-4 flex items-center justify-center border-r border-gray-200 bg-gray-50/30 group-hover:bg-gray-100 transition-colors'>
                                                        <span className='text-xs font-bold text-gray-500 whitespace-nowrap'>{time}</span>
                                                    </div>

                                                    {weekDates.map(dateStr => {
                                                        // Logic: Find a slot that matches this exact Day and Time
                                                        const slot = slots.find(s => s.date === dateStr && s.time === time);

                                                        return (
                                                            <div key={dateStr} className='p-1 border-r last:border-r-0 border-gray-100 min-h-21.25 bg-white group-hover:bg-gray-50/20 transition-all'>
                                                                {slot ? (
                                                                    <button
                                                                        onClick={() => handleToggleSlot(slot._id)}
                                                                        disabled={togglingSlotId === slot._id}
                                                                        className={`w-full h-full rounded-lg p-2 flex flex-col justify-between border-2 transition-all active:scale-95 text-left
                                                    ${togglingSlotId === slot._id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                                                    ${slot.isAvailable
                                                                                ? 'bg-success/10 border-success/20 hover:bg-success/20'
                                                                                : 'bg-red-50 border-red-100 hover:bg-red-100'}
                                                `}
                                                                    >
                                                                        <div className='flex justify-between items-start w-full'>
                                                                            <span className={`text-[10px] font-black tracking-tight ${slot.isAvailable ? 'text-success-dark' : 'text-red-700'}`}>
                                                                                {slot.isAvailable ? 'AVAILABLE' : 'BOOKED'}
                                                                            </span>

                                                                            <div className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${slot.isAvailable ? 'bg-success' : 'bg-red-500'}`} />
                                                                        </div>

                                                                        <span className='text-[8px] font-medium text-gray-400 uppercase self-end mt-auto'>
                                                                            {time} - {getEndTime(time)}
                                                                        </span>
                                                                    </button>
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center opacity-10">
                                                                        <div className="w-1 h-1 rounded-full bg-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* ── EMPTY STATE — no doctor selected ────────────────────────────── */}
                {!selectedDoctor && (
                    <div className='bg-white border border-dashed border-gray-300 rounded-xl p-20 flex flex-col items-center justify-center gap-3'>
                        <img src={clock} className='w-12 opacity-20' alt='' />
                        <p className='text-gray-400 font-medium'>Select a doctor to manage their schedule</p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default TimeSlots