import mongoose from 'mongoose';

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected !! DB HOST ${mongoose.connection.host}`);

    }catch (err){
        console.log('MONGO ERROR',err);
        process.exit(1);
    }
}

export default connectDB;