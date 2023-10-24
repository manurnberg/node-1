import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '../interfaces/productsInterface';

const productSchema = new Schema({
    name: String,
    price: Number
});

export default mongoose.model<Product>('Product', productSchema);