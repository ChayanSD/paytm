import {Account} from "../models/account.model.js";
import mongoose from "mongoose";
//Experimental
import z from "zod";

const getBalance = async (req, res) => {
    const account = await Account.findOne(
        {
            userId : req.userId
        }
    )

    res.json({
        balance : account.balance
    })
};

const transactionZod = z.object({
    amount : z.number(),
    to : z.string() 
})

const transferMoney = async (req, res)=>{
    const session =await mongoose.startSession();
     session.startTransaction();
    
    // const {amount , to} = req.body;
    const {success} = transactionZod.safeParse(req.body);

    if (!success) {
        return res.status(400).json({message: 'Invalid data'});
    }

    const account = await Account.findOne({
        userId : req.userId
    }).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({message : "Insufficient Balance"})
    }

    const toAccount = await Account.findOne({
        userId : to
    }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({message : "Incorrect Account"})
    }

    await Account.updateOne({
        userId : req.userId
    },
    {
        $inc: {
            balance : - amount
        }
    }).session(session);

    await Account.updateOne({
        userId : to
    },
    {
        $inc: {
            balance : amount
        }
    }).session(session);

    //commit the transaction
    await session.commitTransaction();

    return res.status(200).json({
        message : "Transfer successfull"
    })

}


export {
    getBalance,
    transferMoney
}
