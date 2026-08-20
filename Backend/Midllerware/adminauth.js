import jwt from 'jsonwebtoken';

const adminauth = (req, res, next) => {
    try {

        const token = req.cookies.adminToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.admin = {
            id: decoded.id,
            role: decoded.role
        };

        req.adminId = decoded.id;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin token"
        });

    }
};

export default adminauth;