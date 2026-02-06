const bcrypt = require('bcrypt');
const { bcryptRounds } = require('../config/auth.js');

// Hashes a plain text password
async function hashPassword(password) {
    return await bcrypt.hash(password, bcryptRounds);
};

// Compares a plain text password with an existing hash
async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
};

module.exports = {
    hashPassword,
    comparePassword
};