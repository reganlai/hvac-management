import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import quoteRoutes from './routes/quotes.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quotes', quoteRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(Number(port), '0.0.0.0', () => {
    console.log(`HVAC Backend listening on all interfaces at port ${port}`);
});
