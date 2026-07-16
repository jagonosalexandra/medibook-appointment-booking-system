import React from 'react'
import PageHeader from '../components/PageHeader'
import about from '../assets/images/about.jpg'
import rivera from '../assets/images/rivera.jpg'
import chen from '../assets/images/chen.jpg'
import wilson from '../assets/images/wilson.jpg'
import jenkins from '../assets/images/jenkins.jpg'
import lobby from '../assets/images/lobby.jpeg'
import consultation_room from '../assets/images/consultation_room.jpg'
import pediatric_unit from '../assets/images/pediatric_unit.jpg'
import diagnostic_suite from '../assets/images/diagnostic_suite.jpg'
import abim from '../assets/images/abim.svg'
import fsmb from '../assets/images/fsmb.svg'
import golden_seal from '../assets/images/golden_seal.png'
import hipaa from '../assets/images/hipaa.png'

const TEAM = [
    { img: rivera, name: 'Dr. Elena Rivera', role: 'Chief Medical Officer' },
    { img: chen, name: 'Dr. Marcus Chen', role: 'Lead Specialist' },
    { img: jenkins, name: 'Sarah Jenkins, NP', role: 'Nurse Practitioner' },
    { img: wilson, name: 'James Wilson', role: 'Clinic Administrator' },
]

const FACILITIES = [
    { img: lobby, label: 'The Welcome Lobby' },
    { img: consultation_room, label: 'Consultation Rooms' },
    { img: diagnostic_suite, label: 'Diagnostics Suite' },
    { img: pediatric_unit, label: 'Pediatric Unit' },
]

const CERTIFICATIONS = [abim, fsmb, hipaa, golden_seal]

const About = () => {
    return (
        <div>
            <PageHeader
                title='About'
                subtitle='Merging compassionate care with modern technology to build a healthier community, one patient at a time.'
            />

            <div className='grid grid-cols-1 lg:grid-cols-[3fr_2fr] items-center gap-8 lg:gap-12 px-6 lg:px-24 py-12 lg:py-16 bg-white'>
                <img
                    className='w-full rounded-lg object-cover aspect-video lg:aspect-auto'
                    src={about}
                    alt='Rivera Healthcare Clinic'
                />
                <div>
                    <p className='text-sm font-bold text-primary-dark'>Our Legacy of Care</p>
                    <p className='font-black text-3xl sm:text-4xl lg:text-5xl leading-tight mt-2'>
                        Empowering Healthier Communities
                    </p>
                    <p className='text-gray-600 leading-relaxed lg:max-w-2xl my-4'>
                        Founded on the principle that quality healthcare should be accessible and seamless,
                        Rivera Healthcare Clinic began as a small community practice with a big vision. What
                        started as a commitment to local families has grown into a tech-forward medical center,
                        now powered by MediBook.
                        <span className='block mt-3'>
                            Our mission is to provide comprehensive, evidence-based medical services while
                            fostering a personal connection with every patient. We don't just treat symptoms;
                            we care for people.
                        </span>
                    </p>
                </div>
            </div>

            <div className='px-6 lg:px-24 py-12 lg:py-16'>
                <p className='text-2xl lg:text-3xl font-bold text-center mb-10 lg:mb-12'>Our Team</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {TEAM.map(({ img, name, role }) => (
                        <div key={name} className='flex flex-col rounded-lg bg-white border border-border shadow-lg overflow-hidden'>
                            <img className='w-full aspect-square object-cover object-top' src={img} alt={`${name} - ${role}`} />
                            <div className='py-4'>
                                <p className='text-center font-bold text-lg'>{name}</p>
                                <p className='text-center text-primary font-bold text-sm'>{role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='px-6 lg:px-24 py-12 lg:py-16 bg-white'>
                <p className='text-2xl lg:text-3xl font-bold text-center mb-10 lg:mb-12'>Facilities</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {FACILITIES.map(({ img, label }) => (
                        <div
                            key={label}
                            className='flex flex-col border-2 border-transparent rounded-lg overflow-hidden shadow-sm hover:border-primary hover:scale-105 transition-all cursor-default'
                        >
                            <img className='w-full aspect-4/3 object-cover' src={img} alt={label} />
                            <p className='font-bold text-md px-3 py-2.5 bg-white'>{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='px-6 lg:px-24 py-12 lg:py-16'>
                <p className='text-2xl lg:text-3xl font-bold text-center mb-10 lg:mb-12'>Certifications</p>
                <div className="flex flex-nowrap w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-200px),transparent_100%)] lg:mask-[linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)]">
                    <div className='flex items-center justify-center md:justify-start [&_img]:mx-8 animate-infinite-scroll shrink-0'>
                        {CERTIFICATIONS.map((logo, i) => (
                            <img key={i} className='w-28 sm:w-36 lg:w-48 h-auto object-contain' src={logo} alt='Certification' />
                        ))}
                    </div>
                    <div className='flex items-center justify-center md:justify-start [&_img]:mx-8 animate-infinite-scroll shrink-0' aria-hidden>
                        {CERTIFICATIONS.map((logo, i) => (
                            <img key={i} className='w-28 sm:w-36 lg:w-48 h-auto object-contain' src={logo} alt='Certification' />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About