import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

const router = Router();
const getJwtSecret = () => process.env.JWT_SECRET || 'supersecret';

// Internal-only login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`[Auth] Login attempt for: ${email}`);
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log(`[Auth] User not found: ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.active) {
            console.log(`[Auth] User account inactive: ${email}`);
            return res.status(401).json({ error: 'Account inactive' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`[Auth] Password match for ${email}: ${isMatch}`);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const secret = getJwtSecret();
        console.log(`[Auth] Using secret (first 3 chars): ${secret.substring(0, 3)}...`);
        const token = jwt.sign(
            { id: user.id, role: user.role },
            secret,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        console.error('[Auth] Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
