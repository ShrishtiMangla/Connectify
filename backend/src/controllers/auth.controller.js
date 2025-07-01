import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { upsertStreamUser } from '../lib/stream.js';



export async function signup(req,res) {

    const { fullName, email, password } = req.body;

    try{
        if(!email || !password || !fullName) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        if(password.length <6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        
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

        //save data on stream aw well
       
        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            })
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log("Error creating stream user:", error);
        }
        
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
    try {
        const{email,password} = req.body;
        
        if(!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await user.matchPassword(password);

        if(!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '30d'});

        res.cookie("jwt",token,{
            maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
            httpOnly: true, //prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production" //true if in production (makes site more secure https)
        });

        res.status(200).json({success:true , user});

    }catch (error) {
        console.error("Error in login controller:" ,error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export function logout(req,res) {
    res.clearCookie("jwt")
    res.status(200).json({ success:true ,message: "Logged out successfully" });
}

export async function onboard (req, res) {
    try {
        const userId = req.user._id; // Assuming req.user is set by protectRoute middleware
        const { fullName, bio, nativeLanguage , learningLanguage , location} = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({ message: "Please fill all the fields",
                missingFields:[
                    !fullName && "fullName",
                    !bio && "bio",  
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ],
             });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true   
        } , { new: true });// new:true returns the updated user

        if(!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        //update stream user as well

        res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}