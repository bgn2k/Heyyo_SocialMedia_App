import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
/**
 * Register User
 */
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body

        const salt = await bcrypt.genSalt()
        const pswdHash = await bcrypt.hash(password, salt)
        const newUser = new User({
            firstName,
            lastName,
            email,
            password : pswdHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile : Math.floor(Math.random() * 10000),
            impressions : Math.floor(Math.random() * 10000)
        })
        const savedUser = await newUser.save()
        res.status(201).json(savedUser )
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}
/**
 * Login User
 */
export const login = async (req, res) => {
try {
    const {email, password} = req.body
    //Fetch user from mongoDB
    const user = await User.findOne({email : email})
    //If not user return error
    if(!user){
        return res.status(400).json({message : 'User does not exist'})
    }
    //if user then validate password
    const isMatch = await bcrypt.compare(password, user.password)
    //if not valid pswd return error
    if(!isMatch){
        return res.status(400).json({message : 'Invalid Credentials'})
    }
    //Create token
    const token = jwt.sign({id : user._id}, process.env.JWT_SECRET)
    //Delete password from fetched user
    delete user.password
    //Return success and user to UI
    res.status(200).json({token, user})
} catch (error) {
    res.status(500).json({error : error.message})
}
}