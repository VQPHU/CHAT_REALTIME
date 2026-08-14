export const authMe = async (req, res) => {
    try {
    const user = req.user;
    return res.status(200).json({
        message: "lấy thông tin thành công",
        user
    });
    }catch (error) {
        console.error('lỗi khi gọi authMe', error);
        return res.status(500).json({
            message: "lỗi khi lấy thông tin"
        });
    }
}