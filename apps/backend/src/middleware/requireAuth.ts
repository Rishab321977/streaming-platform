import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    user?: {
        id: string;
    }
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    const token = authHeader.split(" ")[1] as string

    try {
        const decode = jwt.verify(token, process.env.NEXTAUTH_SECRET as string) as {sub: string}
        req.user = {id: decode.sub}
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }
}