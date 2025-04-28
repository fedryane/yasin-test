const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./guestbook.db');

// inject manual create admin
const email = 'admin@gmail.com';
const password = 'password123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
        console.error('Gagal menghash password:', err);
        return;
    }

    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function(err) {
        if (err) {
            console.error('Gagal insert user admin:', err.message);
        } else {
            console.log('✅ Admin user berhasil dibuat!');
        }
        db.close();
    });
});
