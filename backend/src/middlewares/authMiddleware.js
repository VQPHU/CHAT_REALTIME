import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

// authentication - xác minh user là ai
export const protectedRoute = async (req, res, next) => {
    try {
        // lấy token từ header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: "không có token"
            });
        }

        // xác nhận token có hợp lệ hay không
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        // tìm user
        const user = await User
            .findById(decoded.userId)
            .select('-hashedPassword');

        if (!user) {
            return res.status(404).json({
                message: "không tìm thấy user"
            });
        }

        // trả user về trong req
        req.user = user;

        next();

    } catch (error) {
        console.error(
            'lỗi khi xác minh JWT trong authMiddleware',
            error
        );

        return res.status(500).json({
            message: "lỗi khi xác minh"
        });
    }
};