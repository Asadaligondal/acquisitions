export const cookies = {
    getOptions: () => ({
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour
            }),
    set: (res, name, value, options = {}) => {
        res.cookie(name, value, { ...cookies.getOptions(), ...options });
    },
    clear: (res, name, options = {}) => {
        res.clearCookie(name, { ...cookies.getOptions(), ...options });
    },
    get: (req, name) =>{
        return req.cookies[name];
    }

};