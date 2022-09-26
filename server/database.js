dotenv.config();
import mongoose from 'mongoose';
import dotenv from 'dotenv';

async function database() {
	await mongoose.connect(process.env.MONGO_URL);
	console.log('Connected to MongoDB');
}

export { database };
