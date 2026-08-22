import { useAuthStore } from '@/store/useAuthStore'
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
    const { accessToken, user, loading } = useAuthStore();
    if (!accessToken) {
        return (
            <Navigate
                to="sign-in"
                replace // người dùng sẽ không thể ấn nút quay lại trang trước 
            />
        )
    }

    return (
        <Outlet>
        </Outlet>
    )
}

export default ProtectedRoute
