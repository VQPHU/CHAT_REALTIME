import { useAuthStore } from '@/store/useAuthStore'
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
    const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
    const [starting, setStarting ] = useState(true);
    const init = async () => {
        // có thể xảy ra khi refresh trang
        if (!accessToken) {
            await refresh();
        }

        if(accessToken && !user ){
            await fetchMe();
        }
        setStarting(false);
    }
    useEffect(()=> {
        init();
    }, []);

    if(starting || loading){
        return <div className='flex h-screen items-center justify-center'>Đang tải trang</div>
    }
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
