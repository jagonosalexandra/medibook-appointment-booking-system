import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../components/Button'
import InputField from '../components/InputField'
import { adminLogin } from '../services/authService'

const Login = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            await adminLogin(username, password)
            toast.success("Login successful!")
            navigate('/')
        } catch (error) {
            toast.error(error.message || "Login failed")
            console.error(error)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center'>
            <div className='flex flex-col gap-8 m-auto items-start px-6 py-8 min-w-90 border border-gray-200 rounded-xl shadow-lg'>
                <h1 className='text-3xl text-primary font-semibold mx-auto'>Admin Login</h1>

                <div className='w-full'>
                    <InputField
                        label='Username'
                        type='text'
                        value={username}
                        onChange={(value) => setUsername(value)}
                        required
                    />
                    <InputField
                        label='Password'
                        type='password'
                        value={password}
                        onChange={(value) => setPassword(value)}
                        required
                    />
                </div>

                <Button
                    label='Login'
                    variant='primary'
                    type='submit'
                    fullWidth
                />
            </div>
        </form>
    )
}

export default Login