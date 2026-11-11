
import supabase from '../config/supabase.js';
import validator from 'validator';

// LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }

        res.json({
            success: true,
            token: data.session.access_token,
            userId: data.user.id
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.json({
            success: false,
            message: 'Login failed'
        });
    }
};


// REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { name, password, email } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'Please enter a valid email'
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: 'Please enter a strong password'
            });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name
                }
            }
        });

        if (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }

        res.json({
            success: true,
            message: 'Registration successful',
            token: data.session?.access_token || null,
            userId: data.user?.id
        });

    } catch (error) {
        console.error('Registration error:', error.message);
        res.json({
            success: false,
            message: 'Registration failed'
        });
    }
};

export { loginUser, registerUser };
