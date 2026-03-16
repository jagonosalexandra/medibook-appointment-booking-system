import general_practice from '../assets/icons/general_practice.svg'
import pediatrics from '../assets/icons/pediatrics.svg'
import cardiology from '../assets/icons/cardiology.svg'
import obstetrics from '../assets/icons/obstetrics.svg'
import neurology from '../assets/icons/neurology.svg'
import orthopedics from '../assets/icons/orthopedics.svg'

const DEPARTMENTS = [
  { id: 'general', name: 'General Practice', icon: general_practice, desc: 'Primary care, routine checkups, and general wellness consultation.' },
  { id: 'pedia', name: 'Pediatrics', icon: pediatrics, desc: 'Comprehensive healthcare for infants, children, and adolescents.' },
  { id: 'cardio', name: 'Cardiology', icon: cardiology, desc: 'Specialized heart care, diagnostics, and cardiovascular treatments.' },
  { id: 'obgyn', name: 'Obstetrics & Gynecology', icon: obstetrics, desc: 'Comprehensive reproductive health, pregnancy care, and women’s wellness services.' },
  { id: 'neuro', name: 'Neurology', icon: neurology, desc: 'Diagnosis and treatment of brain, spinal cord, and nervous system disorders.' },
  { id: 'ortho', name: 'Orthopedics', icon: orthopedics, desc: 'Expert care for bones, joints, ligaments, and muscle conditions.' },
];

export default DEPARTMENTS