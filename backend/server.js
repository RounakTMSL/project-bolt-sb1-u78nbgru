const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(express.json());

app.post('/api/payment', (req, res) => {
    const { amount, method } = req.body;
    console.log('Payment received:', amount, method);
    res.json({ status: 'Payment received successfully' });
});
