import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Create a new quote (Technician)
router.post('/', authenticate, authorize(['TECHNICIAN']), async (req: AuthRequest, res) => {
    const { clientName, clientAddress, clientEmail } = req.body;

    try {
        const quote = await prisma.quote.create({
            data: {
                technicianId: req.user!.id,
                clientName,
                clientAddress,
                clientEmail,
                status: 'DRAFT',
            },
        });
        res.status(201).json(quote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create quote' });
    }
});

// Add parts to a quote (Technician)
// Enforces 35% markup server-side
router.post('/:id/parts', authenticate, authorize(['TECHNICIAN']), async (req, res) => {
    const { id } = req.params;
    const { name, partNumber, supplier, basePrice, quantity } = req.body;

    try {
        const quote = await prisma.quote.findUnique({ where: { id } });
        if (!quote || quote.status === 'SIGNED') {
            return res.status(400).json({ error: 'Quote not found or already signed (immutable)' });
        }

        const markupPrice = basePrice * 1.35;

        const part = await prisma.part.create({
            data: {
                quoteId: id,
                name,
                partNumber,
                supplier,
                basePrice,
                markupPrice,
                quantity,
            },
        });

        // Update quote total (simple sum for now, can be optimized)
        await updateQuoteTotal(id);

        res.status(201).json(part);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add part' });
    }
});

// Add labor to a quote (Technician)
router.post('/:id/labor', authenticate, authorize(['TECHNICIAN']), async (req, res) => {
    const { id } = req.params;
    const { description, hourlyRate, hours } = req.body;

    try {
        const quote = await prisma.quote.findUnique({ where: { id } });
        if (!quote || quote.status === 'SIGNED') {
            return res.status(400).json({ error: 'Quote not found or already signed' });
        }

        const labor = await prisma.labor.create({
            data: {
                quoteId: id,
                description,
                hourlyRate,
                hours,
                total: hourlyRate * hours,
            },
        });

        await updateQuoteTotal(id);
        res.status(201).json(labor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add labor' });
    }
});

// Add fee to a quote (Technician)
router.post('/:id/fees', authenticate, authorize(['TECHNICIAN']), async (req, res) => {
    const { id } = req.params;
    const { name, amount } = req.body;

    try {
        const quote = await prisma.quote.findUnique({ where: { id } });
        if (!quote || quote.status === 'SIGNED') {
            return res.status(400).json({ error: 'Quote not found or already signed' });
        }

        const fee = await prisma.fee.create({
            data: {
                quoteId: id,
                name,
                amount,
            },
        });

        await updateQuoteTotal(id);
        res.status(201).json(fee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add fee' });
    }
});

// Capture signature and lock quote
router.post('/:id/sign', authenticate, authorize(['TECHNICIAN']), async (req, res) => {
    const { id } = req.params;
    const { signature } = req.body; // Base64 signature

    try {
        const quote = await prisma.quote.findUnique({ where: { id } });
        if (!quote || quote.status === 'SIGNED') {
            return res.status(400).json({ error: 'Quote not found or already signed' });
        }

        await prisma.quote.update({
            where: { id },
            data: {
                signature,
                signedAt: new Date(),
                status: 'SIGNED',
            },
        });

        res.json({ message: 'Quote signed and locked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to sign quote' });
    }
});

async function updateQuoteTotal(quoteId: string) {
    const parts = await prisma.part.findMany({ where: { quoteId } });
    const labor = await prisma.labor.findMany({ where: { quoteId } });
    const fees = await prisma.fee.findMany({ where: { quoteId } });

    const partsTotal = parts.reduce((sum: number, p: any) => sum + (p.markupPrice * p.quantity), 0);
    const laborTotal = labor.reduce((sum: number, l: any) => sum + l.total, 0) || 0;
    const feesTotal = fees.reduce((sum: number, f: any) => sum + f.amount, 0) || 0;

    const total = partsTotal + laborTotal + feesTotal;

    await prisma.quote.update({
        where: { id: quoteId },
        data: { totalAmount: total },
    });
}

export default router;
