require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    bcryptRounds: 10,
    roles: {
        USER: 'user',
        ADMIN: 'admin'
    }
};