const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className='flex flex-col items-center justify-center gap-3 h-screen w-full'>
      <div className='w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin' />
      <p className='text-sm text-gray-400'>{message}</p>
    </div>
  )
}

export default LoadingSpinner