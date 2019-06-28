import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";
import {jwtSecret} from "../config";
import {getTokenFromAuthorization} from "../shared/utils/account.utils";
import {emptyAuthorizationCode, expiredAccessToken, noAuthorizationKey, unauthorizedAccess} from "../shared/errorCodes";
import {has} from 'lodash';

const userAuthorizationKey = 'USER-KEY';
const headerAuthorizationKey = userAuthorizationKey.toLowerCase();
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!has(req.headers, headerAuthorizationKey)) {
        return res.status(401).json(noAuthorizationKey(userAuthorizationKey));
    }

    if (!req.headers[headerAuthorizationKey]) {
        return res.status(401).json(emptyAuthorizationCode());
    }
    const token = getTokenFromAuthorization(req.headers[headerAuthorizationKey] || '');
    jwt.verify(token, jwtSecret, (err: Error, decoded: any) => {
        if (err) {
            if (err.message === 'jwt expired') {
                return res.status(401).json(expiredAccessToken());
            } else {
                return res.status(401).json(unauthorizedAccess());
            }
        }
        req.user = decoded;
        next();
    });
};

export default authMiddleware;
