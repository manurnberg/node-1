import { User } from "../interfaces/usersInterface";
import usersModel from "../models/usersModel";

export const getUsers = async () => {
    try {
        const cursor = usersModel.find().cursor();
        return cursor;
    } catch (error) {
        return {error: new Error('Not found')};
    }
    
}

export const getUser = async (id: String): Promise<User | null> => {
    try {
        const user = await usersModel.findById(id);
        return user ? user : Promise.reject(new Error('User not found'));
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const user = await usersModel.findOne({email: email});
        return user ? user : Promise.reject(new Error('User not found'));
    } catch (error) {
        return Promise.reject(error);
    }
}

export const createUser = async (user: User) => {
    try {
        const newUser = new usersModel(user);
        await newUser.save();
        return newUser;
    } catch (error) {
        return new Error('User not created');
    }  
}

export const updateUser = async (id: string, userUpdate: User): Promise<User | null> => {
    try {
        console.log(id);
        console.log(userUpdate);
        const user = await usersModel.findByIdAndUpdate(id, userUpdate, {new: true});
        return user ? user : Promise.reject(new Error('User not updated')); ;
    } catch (error) {
        return Promise.reject(error);
    }
}