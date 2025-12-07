import User from "../models/User.js";
import jwt from "jsonwebtoken";
//registering
export const registerUser=async (req, res)=>{
    try{
        const{name, email, password, role}=req.body;
        //checking if the user already exists
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        //create new user
        const user= new User({name, email, password, role});
        await user.save();

        res.status(201).json({message:"user registered successfully!"});
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
};
//Login user
export const loginUser=async (req, res)=>{
    try{
        const{email, password, role}=req.body;
        
        // Handle hardcoded admin login
        if(email === 'admin@pharmacy.com' && password === 'admin123'){
            const token = jwt.sign(
                {id:'admin', role:'admin'},
                process.env.JWT_SECRET || 'fallback-secret',
                {expiresIn:"1d"}
            );
            return res.status(200).json({
                message:"Login successful",
                token,
                user:{id:'admin', name:'Admin', email:'admin@pharmacy.com', role:'admin'},
            });
        }
        
        // Handle hardcoded pharmacist logins
        const pharmacists = [
            {email: 'sarah@pharmacy.com', name: 'Dr. Sarah Johnson'},
            {email: 'michael@pharmacy.com', name: 'Dr. Michael Chen'}
        ];
        
        const pharmacist = pharmacists.find(p => p.email === email);
        if(pharmacist && password === 'pharmacist123'){
            const token = jwt.sign(
                {id:pharmacist.email, role:'pharmacist'},
                process.env.JWT_SECRET || 'fallback-secret',
                {expiresIn:"1d"}
            );
            return res.status(200).json({
                message:"Login successful",
                token,
                user:{id:pharmacist.email, name:pharmacist.name, email:pharmacist.email, role:'pharmacist'},
            });
        }
        
        return res.status(400).json({message:"Invalid credentials"});
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
};