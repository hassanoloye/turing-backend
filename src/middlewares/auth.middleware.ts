import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";
import {jwtSecret} from "../config";
import {getTokenFromAuthorization} from "../shared/utils/account.utils";


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'Missing token. Expects token in header with key as Authorization'
        });
    }
    const token = getTokenFromAuthorization(req.headers.authorization) || '';
    jwt.verify(token, jwtSecret, (err: Error, decoded: any) => {
        if (err) {
            if (err.message === 'jwt expired') {
                return res.status(401).json({
                    message: 'Access token has expired. You are required to login again!'
                });
            } else {
                return res.status(401).json({
                    message: 'Authentication failed. Invalid access token!'
                });
            }
        }
        req.user = decoded;
        next();
    });
};

export default authMiddleware;
