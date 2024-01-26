import {User} from '../models/user.model.js';
export const userController = async (req, res) => {
   const {name, email, password} = req.body;
    res.send('Hello from user controller');
}
