import axios from 'axios'
import api from './api'
import { useState } from 'react'

export const getAToken = () => localStorage.getItem("adminToken") || ""

export const getDashData = async () => {
    try {
        const { data } = await api.get('/api/admin/dashboard')
        return data.dashData
    } catch (error) {
        console.error(error.message)
    }
}