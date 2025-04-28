const db = require('../config/db');

const Guest = {
    create: (nama, pesan, callback) => {
        const sql = `INSERT INTO guests (nama, pesan) VALUES (?, ?)`;
        db.run(sql, [nama, pesan], callback);
    },
    getAll: (callback) => {
        const sql = `SELECT * FROM guests ORDER BY timestamp DESC`;
        db.all(sql, [], callback);
    }
};

module.exports = Guest;
