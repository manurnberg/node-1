import { Request, Response } from "express";
import productsModel from "../models/productsModel";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await productsModel.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({error: 'Server error'})
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const newProduct = new productsModel(req.body);
        await newProduct.save();

        res.status(201).json({message: 'OK'});
    } catch (error) {
        res.status(500).json({message: 'Product not created'});
    }

    
}