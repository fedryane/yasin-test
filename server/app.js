// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const db = require('./config/db');

// // import routes
// const guestRoutes = require('./routes/guest');
// const authRoutes = require('./routes/auth');
// const paymentRoutes = require('./routes/payment');

// const app = express();
// const PORT = 3000;

// // midleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // API
// app.use('/api/guest', guestRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/payment', paymentRoutes);

// app.get('/', (req, res) => {
//     res.send('Guest Book API is running');
// });

// // server running...
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
