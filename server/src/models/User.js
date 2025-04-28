const db = require('../config/db');

const User = {
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], callback);
    }
};

module.exports = User;
