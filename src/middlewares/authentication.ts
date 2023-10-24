import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import { User } from "../interfaces/usersInterface";
import { loadSecretKey } from "../utils/secretsLoader";

const secretKeyPath = '/Users/matiasnurnberg/Desktop/NodeJs/node-advance-api/src/etc/jwt_secret.txt';

declare global {
    namespace Express {
      interface Request {
        user: User; // Ajusta el tipo según tu estructura de usuario
      }
    }
  }


export const authenticationToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    const secretKey = await loadSecretKey(secretKeyPath);

    if(!token) return res.status(401).json({message: 'not authorized'});

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
        if(err) return res.status(403).json({message:'invalid token'});

        req.user = decoded;
        next();    
    });

}
