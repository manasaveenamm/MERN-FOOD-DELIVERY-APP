
import supabase from '../config/supabase.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.json({
                success: false,
                message: 'Not Authorized. Login again.'
            });
        }

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.json({
                success: false,
                message: 'Invalid or expired token. Login again.'
            });
        }

        req.user = data.user;

        // Keep compatibility with existing controllers temporarily
        req.body = req.body || {};
        req.body.userId = data.user.id;

        next();

    } catch (error) {
        console.error('Authentication error:', error.message);

        return res.json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

export default authMiddleware;
