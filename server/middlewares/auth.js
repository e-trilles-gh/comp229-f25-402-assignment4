import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

    if (!token) {
        // 401 HTTP status code for unauthorized
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export default authMiddleware;