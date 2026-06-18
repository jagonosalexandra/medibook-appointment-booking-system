import React from 'react'
import Button from './Button'

const StepNav = ({ onBack, onNext, nextLabel = 'Next', nextDisabled = false, backLabel = 'Back' }) => (
    <div className='w-full flex justify-between items-center gap-4 mt-8'>
        <div className='w-full max-w-xs'>
            <Button label={backLabel} variant='secondary' onClick={onBack} fullWidth />
        </div>
        <div className='w-full max-w-xs'>
            <Button
                label={nextLabel}
                variant={nextDisabled ? 'disabled' : 'primary'}
                onClick={onNext}
                fullWidth
                disabled={nextDisabled}
            />
        </div>
    </div>
)

export default StepNav