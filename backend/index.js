import express from 'express';
import connectDB from "./db/db.js";
import dotenv from 'dotenv';
import userRoute from "./routes/user.route.js";
import cors from 'cors';
import accountRoute from "./routes/account.route.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
    cors({
    origin: 'http://localhost:5173'
})
);
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running at ${process.env.PORT}`);
        })
        app.on('error', (error) => {
            console.log('Error', error);
            throw error;
        })
    })
    .catch((err) => {
        console.log('MONGO DB connection error !!!', err);
    });

app.use('/api/v1/user',userRoute);
app.use('/api/v1/account',accountRoute);
