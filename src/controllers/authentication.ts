import jwt from 'jsonwebtoken';
import { getUser } from '../db/users';
import { JWT_SECRET } from '../util/envVariables';
import { UserToken } from '../util/commonTypes';
import { Request, Response, NextFunction } from "express";

export const handleLogin = async (username: string, password: string) => {
    const {error, document} = await getUser(username);
    if(error || !document) {
        return { error: 'User not found' };
    }
    if (password === document.password){
        return { token: jwt.sign({ username }, JWT_SECRET) };
    }
    return { error: 'Invalid Password' };
}

export const verifyTokenMiddleware = (req: Request, res: Response, next:NextFunction) => {
    const authToken = req.headers.authorization;
    if(!authToken){
        res.send('Unauthorized');
        return;
    }
    const token = authToken.replace('Bearer ', '');
    try {
        const payload = jwt.verify(token, JWT_SECRET) as UserToken;
        req.body.username = payload.username;
        next();
    } catch (error) {
        res.send(error);
        return;
    }
};