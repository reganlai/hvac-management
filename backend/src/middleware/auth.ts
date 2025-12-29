import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/auth.js';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: 'TECHNICIAN' | 'MANAGER';
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const secret = getJwtSecret();
        console.log(`[Auth] Verifying token (length: ${token.length}) with secret (first 3: ${secret.substring(0, 3)}...)`);
        const decoded = jwt.verify(token, secret) as { id: string; role: 'TECHNICIAN' | 'MANAGER' };
        req.user = decoded;
        next();
    } catch (error: any) {
        console.error(`[Auth] Token verification failed for token length ${token?.length}: ${error.message}`);
        return res.status(401).json({ error: `Unauthorized: ${error.message}` });
    }
};

export const authorize = (roles: Array<'TECHNICIAN' | 'MANAGER'>) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
