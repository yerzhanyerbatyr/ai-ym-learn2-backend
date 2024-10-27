import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config(); 
const connectToMongoDB = async (): Promise<void> => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

export default connectToMongoDB;