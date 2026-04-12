const DEPARTMENTS = [
    "General Practice",
    "Pediatrics",
    "Cardiology",
    "Obstetrics & Gynecology",
    "Neurology",
    "Orthopedics"
]

const DOC_STATUS = ["All Statuses", "Active", "Inactive"]
const APPOINTMENT_STATUS = ["All Statuses", "Confirmed", "Cancelled", "Pending"]
const DEPARTMENT_FILTER = [
    "All Departments", 
    "General Practice", 
    "Pediatrics", 
    "Cardiology", 
    "Obstetrics & Gynecology", 
    "Neurology", 
    "Orthopedics"
]

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_SHORT = { 
    Monday: 'Mon', 
    Tuesday: 'Tue', 
    Wednesday: 'Wed', 
    Thursday: 'Thu', 
    Friday: 'Fri', 
    Saturday: 'Sat', 
    Sunday: 'Sun' 
}
const TIME_OPTIONS = [
    '08:00 AM', '09:00 AM', 
    '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', 
    '03:00 PM', '04:00 PM'
]
const TABS = ['Add Slots', 'Manage Slots']

const getTodayStr = () => new Date().toISOString().split('T')[0]
const getEndTime = (startTime) => {
    const [time, period] = startTime.split(' ')
    let [hour] = time.split(':').map(Number)
    let endHour, endPeriod
    if (hour === 11 && period === 'AM') { endHour = 12; endPeriod = 'PM' }
    else if (hour === 12 && period === 'PM') { endHour = 1; endPeriod = 'PM' }
    else if (hour === 11 && period === 'PM') { endHour = 12; endPeriod = 'AM' }
    else { endHour = hour + 1; endPeriod = period }
    return `${String(endHour).padStart(2, '0')}:00 ${endPeriod}`
}

export {
    DEPARTMENTS,
    DEPARTMENT_FILTER,
    DOC_STATUS,
    APPOINTMENT_STATUS,
    DAYS_OF_WEEK,
    DAY_SHORT,
    TIME_OPTIONS,
    TABS,
    getTodayStr,
    getEndTime
}