import api from '@/lib/axios';

export const authService = {
    signUp: async (username: string, password: string, email: string, firstName: string, lastName: string) => {
        const res = await api.post('/auth/sign-up', { username, password, email, firstName, lastName }, { withCredentials: true });
        return res.data;
    },

    signIn: async (username: string, password: string) => {
        const res = await api.post('/auth/sign-in', { username, password }, { withCredentials: true });
        return res.data;
    },

    signOut: async () => {
        return api.post('/auth/sign-out', {}, {withCredentials: true});
    },
};
