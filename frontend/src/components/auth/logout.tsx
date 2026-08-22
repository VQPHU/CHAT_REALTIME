import React from 'react'
import { Button } from '../ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { useNavigate } from 'react-router';

const logout = () => {
    const { signOut } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/sign-in")
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Button onClick={handleLogout}>
            Logout
        </Button>
    )
}

export default logout
