import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export async function signup(req,res) {

    const { fullName, email, password } = req.body;

    try{
        if(!email || !password || !fullName) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        if(password.length <6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        //john@gmail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "Email already exists, please use a different one" });
        }

        const idx = Math.floor(Math.random() * 100)+1 ; //generate a number between 1 and 100

        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`; 

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar,
        });
        //TODO: save data on steam db
        
        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: '30d'});

        res.cookie("jwt",token,{
            maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
            httpOnly: true, //prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production" //true if in production (makes site more secure https)
        })

        res.status(201).json({success:true , user:newUser});

    }catch (error){
        console.error("Error in signup controller:" ,error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function login(req,res) {
    res.send("login route");
}

export function logout(req,res) {
    res.send("logout route");
}