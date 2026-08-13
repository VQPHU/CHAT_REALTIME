import bcrypt from "bcrypt";
import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import cypto from "crypto";
import { Session } from "../models/Session.js";

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days 

export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;
        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({ message: "không thể thiếu username, password, email, firstName hoặc lastName" });
        }

        // kiểm tra xem username hoặc email đã tồn tại trong cơ sở dữ liệu chưa
        const duplicateUser = await User.findOne({ $or: [{ username }, { email }] });
        if (duplicateUser) {
            return res.status(409).json({ message: "username hoặc email đã tồn tại" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // tạo user mới
        const newUser = await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`,
        });
        await newUser.save();

        // return 
        return res.sendStatus(204);
    } catch (error) {
        console.error('lỗi khi tạo người dùng', error);
        res.status(500).json({ message: "lỗi khi tạo người dùng" });
    }
};

export const signIn = async (req, res) => {
    try {
        // lấy input từ body 
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "không thể thiếu username hoặc password" });
        }

        // lấy hash password từ cơ sở dữ liệu và so sánh với password người dùng nhập vào
        // 1 kiểm tra xem username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "username hoặc password không đúng" });
        }
        // 2 kiểm tra password
        const passwordCompare = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordCompare) {
            return res.status(401).json({ message: "username hoặc password không đúng" });
        }

        // nếu trùng khớp thì tạo access token với JWT
        const accessToken = jwt.sign({ userId: user._id, }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

        // tạo refresh token 
        const refreshToken = cypto.randomBytes(64).toString('hex');

        // tạo session mới để luu refresh token vào cơ sở dữ liệu
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL);
        const session = new Session({
            userId: user._id,
            refreshToken,
            expiresAt
        });
        await session.save();

        // trả  fresh token về client thông qua cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // chỉ gửi cookie qua HTTPS trong môi trường production
            sameSite: 'strict', // ngăn chặn CSRF
            maxAge: REFRESH_TOKEN_TTL, // thời gian sống của cookie
        });

        // trả access token về trong response
        return res.status(200).json({ message: "Đăng nhập thành công", accessToken });

    } catch (error) {
        console.error('lỗi khi đăng nhập', error);
        res.status(500).json({ message: "lỗi khi đăng nhập" });
    }
};

export const signOut = async (req, res) => {
    try {
        // lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;

        if (token) {
            // xóa refresh token trong session
            await Session.deleteOne({ refreshToken: token });

            // xoá cookie
            res.clearCookie("refreshToken");
        }
        return res.sendStatus(204);

    } catch (error) {
        console.error('lỗi khi đăng xuất', error);
        res.status(500).json({ message: "lỗi khi đăng xuất" });
    }
}