import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import { User } from "../interfaces/usersInterface";
import { loadSecretKey } from "../utils/secretsLoader";

const secretKeyPath = '/Users/matiasnurnberg/Desktop/NodeJs/node-advance-api/src/etc/jwt_secret.txt';

declare global {
    namespace Express {
      interface Request {
        user: User;
      }
    }
  }

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
    const secretKey = await loadSecretKey(secretKeyPath);
    const token = req.headers.authorization;
    (!token) ? res.status(401).json({error: 'Missing Token'}):
    jwt.verify(token, secretKey, (err:any, decode) => {
        (err)? res.status(401).json({error: 'Invalid Token'}):
        req.user = decode as User;
        next();
    });
}

export const decodeToken = async (token: string) => {
    try {
        const decodeToken = JSON.parse(atob(token.split('.')[1]));
        console.log(decodeToken)
        const {email} = decodeToken;
        return email;
    } catch (error) {
        return new Error('Token not decoded')
    }
    
}