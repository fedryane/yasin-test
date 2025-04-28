const db = require('../config/db');

const Payment = {
    create: (data, callback) => {
        const sql = `INSERT INTO payments (nama_lengkap, email, nomor_telepon, jumlah_pembayaran, metode_pembayaran) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [
            data.nama_lengkap,
            data.email,
            data.nomor_telepon,
            data.jumlah_pembayaran,
            data.metode_pembayaran
        ], callback);
    }
};

module.exports = Payment;
