import express from 'express';
import { getProducts } from '../controllers/productsController';

export const productsRouter = express.Router();

productsRouter.get('/users', getProducts );
