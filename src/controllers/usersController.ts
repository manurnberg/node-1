import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import usersModel from "../models/usersModel";
import  * as usersRepository from "../repository/usersRepository";
import { loadSecretKey } from "../utils/secretsLoader";
import { hashPassword, compareHash } from "../utils/hashStrategy";
import { User } from "../interfaces/usersInterface";
import { transporter } from "../utils/emailTransporter";
import { decodeToken } from "../middlewares/authorization";

const secretKeyPath = '/Users/matiasnurnberg/Desktop/NodeJs/node-advance-api/src/etc/jwt_secret.txt';

const asyncIterableFromCursor = (cursor: any) => ({
    [Symbol.asyncIterator]: () => ({
      next: async () => {
        const user = await cursor.next();
        return { done: user === null, value: user };
      },
    }),
  });

export const getUsers = async (req: Request, res: Response) => {
    try {
        const cursor = await usersRepository.getUsers();
        const users = [];

        for await (const user of asyncIterableFromCursor(cursor)){
            users.push(user);
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: 'Server error'})
    }   
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await usersRepository.getUser(req.params.id);
        res.status(200).json({data: user});
    } catch (error) {
        res.status(400).json({error: 'Not found'});
    }   
}

export const createUser = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const { password } = req.body
        let newUser = req.body
        const { hash, salt } = await hashPassword(password);
        newUser.password = hash;
        newUser.salt = salt;
        newUser = usersRepository.createUser(newUser);
        (!newUser) ?
        res.status(404).json({error: 'user not created'}) :
        res.status(201).json({message: 'OK'});

        
    } catch (error) {
        res.status(500).json({message: 'User not created'});
    }   
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        let user = await usersRepository.getUser(req.params.id);
        (!user)? res.status(400).json({error: 'Not found'}):
        user = await usersRepository.updateUser(req.params.id, req.body);
        res.status(200).json({data: user});

    } catch (error) {
        res.status(500).json({message: 'User not updated'});
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { deletedCount } = await usersModel.deleteOne({_id: req.params.id});
    (deletedCount !== 1) ?
    res.status(404).json({error:'register not found'}):
    res.status(200).json({message: 'register deleted'})
}

export const userLogin = async (req: Request, res: Response) => {
    const secretKey = await loadSecretKey(secretKeyPath);
    const { email, password } = req.body;
    const user = await usersRepository.getUserByEmail(email);
    if (!user?.password) {res.status(404).json({error:'user not found'});}
    else{
       const passwordMatch =  await compareHash(password, user.password);

       if(passwordMatch)
        {const token = jwt.sign({ email : email }, secretKey, {expiresIn: '1h'});

    res.status(200).json({token});}
    }
}

export const sendResetPasswordEmail = async (req: Request, res: Response) => {
    const email = req.body.email;
    try {
        const user = await usersRepository.getUserByEmail(email);
        if(user !== null){
        const secretKey = await loadSecretKey(secretKeyPath);
        const token = jwt.sign({ id : user._id }, secretKey, {expiresIn: '1h'});
            
        const emailOptions = {
            from: 'manurnbergy@gmail.com',
            to: email,
            subject: 'Generate new password',
            text:`Haz clic en el siguiente enlace para restablecer tu contraseña: http://localhost:3000/reset-password?token=${token}`
        }
    
        transporter.sendMail(emailOptions,(error:any, info) => {
            (!error) ? res.send('email sended successfully'):
            res.status(500).json({error: error})
        });
    }
    } catch (error) {
        throw new Error('User not found');
    }
}

export const resetUserPassword = async (req: Request, res: Response) => {
    try {
        const userEmail = await decodeToken(req.headers.authorization!);
        const newPassword = req.body.password
        const { hash, salt } = await hashPassword(newPassword);
        
        let user = await usersRepository.getUserByEmail(userEmail);
        
        if(user === null) {res.status(400).json({error: 'Not found'})
        } else {
        console.log(user._id)
        user.password = hash;
        user.salt = salt;
        console.log(user)
        user = await usersRepository.updateUser(user._id, user);
        res.status(200).json({message:'Ok'});
        }
    } catch (error) {
        res.status(500).json({message: 'User not updated'});
    }
}
