import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/store';

export const useAuthStore = create<AuthState>((set, get) => ({
    // set để update state, get để lấy state hiện tại
    accessToken: null,
    user: null,
    loading: false,
    clearState: () => {
        set({ accessToken: null, user: null, loading: false })
    },

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });

            // Gọi API
            await authService.signUp(
                username,
                password,
                email,
                firstName,
                lastName
            );

            toast.success(
                'Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.'
            );
        } catch (error) {
            console.error(error);
            toast.error('Đăng ký không thành công');
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (username, password) => {
        try {
            set({ loading: true });
            const { accessToken } = await authService.signIn(username, password);
            set({ accessToken });
            toast.success('chào mừng bạn quay lại');
        } catch (error) {
            console.error(error);
            toast.error('Đăng nhập không thành công');
        };

    },

    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success("Đăng xuất thành công")
        } catch (error) {
            console.error(error);
            toast.error("Lỗi xảy ra khi logout. Hãy thử lại")
        }
    }
}));