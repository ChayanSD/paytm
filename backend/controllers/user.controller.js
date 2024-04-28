import {User} from '../models/user.model.js';
import zod from 'zod';
import jwt from "jsonwebtoken";
import { Account } from '../models/account.model.js';

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

    //------create new accoutn with random balances----//

   await Account.create({
        userId,
        balance : 1 + Math.random() * 10000
    });

    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '1d'});

    return res.status(200).json({
        message: "User created successfully",
        token
    })

}

const loginBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});
const loginUser = async (req, res) => {
    const {success} = loginBody.safeParse(req.body);

    if (!success) {
        return res.status(400).json({message: 'Invalid data'});
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (!user) {
        return res.status(401).json({
            message: "Incorrect username/password"
        })
    }

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET);

        res.json({
            token: token
        })

    }

    return res.status(200).json({
        message: "User logged in successfully"
    })
}

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});
const updateUser = async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
}

const getCurrentUser = async(req,res)=>{
   
    try {
        const user = await User.findById(req.userId);

        const account = await Account.findOne(
            {
                userId : req.userId
            }
        )
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { _id, username, firstName, lastName } = user;

        return res.status(200).json({
            _id,
            username,
            firstName,
            lastName,
            balance : account.balance 
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllUsers = async (req, res) => {
    const filter = req.query.filter || "";
    try {
        const users = await User.find({
            $or: [{
                firstName: {
                    "$regex": filter
                }
            }, {
                lastName: {
                    "$regex": filter
                }
            }]
        })
        
       return res.json({
            message : "Successfull",
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        })
    } catch (error) {
        console.log(error)
    }
    
}


export {
    registerUser,
    loginUser,
    updateUser,
    getAllUsers,
    getCurrentUser
}