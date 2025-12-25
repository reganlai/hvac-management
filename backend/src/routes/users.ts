import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Only managers can create technicians
router.post('/', authenticate, authorize(['MANAGER']), async (req: AuthRequest, res) => {
    const { email, password, firstName, lastName, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: role || 'TECHNICIAN',
            },
        });

        res.status(201).json({
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        });
    } catch (error) {
        res.status(400).json({ error: 'User already exists or invalid data' });
    }
});

// Managers can reset passwords
router.post('/:id/reset-password', authenticate, authorize(['MANAGER']), async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(400).json({ error: 'User not found' });
    }
});

// Managers can disable accounts
router.patch('/:id/deactivate', authenticate, authorize(['MANAGER']), async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user.update({
            where: { id },
            data: { active: false },
        });
        res.json({ message: 'Account deactivated' });
    } catch (error) {
        res.status(400).json({ error: 'User not found' });
    }
});

export default router;
