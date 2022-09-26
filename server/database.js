import mongoose from 'mongoose';
async function database() {
	await mongoose.connect('mongodb://localhost:27017/GameLib-DB');
	console.log('Connected to MongoDB');
}

export { database };
