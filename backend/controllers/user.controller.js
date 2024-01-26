import {User} from '../models/user.model.js';
import zod from 'zod';
import jwt from "jsonwebtoken";

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});
const registerUser = async (req, res) => {
    const {success} = signupBody.safeParse(req.body);

    if (!success) {
        return res.status(400).json({message: 'Invalid data'});
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    const userId = await user._id;

    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '1d'});

    return res.status(200).json({
        message: "User created successfully",
        token
    })

}

export {
    registerUser,
}