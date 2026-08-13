import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const register = async (req, res) => { 
 
    try { 
        console.log("1. Register API called");

        const { fullName, email, phoneNumber, password, role } = req.body; 

        console.log("2. Body received:", req.body);

        if (!fullName || !email || !phoneNumber || !password || !role) { 
            return res.status(400).json({ 
                message: "Something is missing", 
                success: false 
            }); 
        }; 

        console.log("3. Validation passed");

        const user = await User.findOne({ email }); 

        console.log("4. User checked:", user);

        if (user) { 
            return res.status(400).json({
                message: "User already exists with this email",
                success: false,
            });
        }; 

        console.log("5. Creating password");

        const hashPassword = await bcrypt.hash(password, 10); 

        console.log("6. Password hashed");

        await User.create({ 
            fullName, 
            email, 
            phoneNumber, 
            password: hashPassword, 
            role, 
        });

        console.log("7. User created");

        return res.status(201).json({ 
            message: "Account create Sucessfully", 
            success: true, 
        }); 
          
    } catch (error) { 
        console.log("REGISTER ERROR:", error);
    }
}

export const login = async (req,res)=>{
    try{

        const {email,password,role}=req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message:"something is missing",
                success:false
            })
        };

        let user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"Incorrect email or Password",
                success:false,
            })
        }

        const isPasswordMatch=await bcrypt.compare(password,user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Incorrect email or password",
                success:false,
            })
        };

        if(role !==user.role){
            return res.status(400).json({
                message:"Account doesn't exit with current role",
                success:false,
            })
        };

        const tokenData={
            userId:user._id

        }

        const token=await jwt.sign(tokenData,process.env.SECRECT_KEY,{expiresIn:"1d"});

       user={
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            profile:user.profile
        }

        return res.status(200).cookie("token", token, {maxAge: 1 * 24 * 60 * 60 * 1000,httpOnly:true,sameSite:"strict"}).json({
            message:`welcome back ${user.fullName}`,
            user,
            success:true,
        });

    }catch(error){
        console.log(error)
    }
}

export const logout = async (req, res) => {
    console.log("LOGOUT API CALLED");

    try {
        return res.status(200).cookie("token", "", {
            maxAge: 0
        }).json({
            message: "Logout Sucessfully",
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

export const updateProfile=async(req,res)=>{
    
    try{

     const {fullName,email,phoneNumber,bio,skills}=req.body;
     if(!fullName || !email || !phoneNumber || !bio ||!skills){
        return res.status(400).json({
            message:"something is missing",
            success:false,
        })
     }

     const skillsArray=skills.split(",");
     const userId=req.id;
     let user=await User.findById(userId);
     if(!user){
        return res.status(400).json({
            message:"User not found",
            success:false,
        })
     }

     user.fullName=fullName,
     user.email=email,
     user.phoneNumber=phoneNumber,
     user.profile.bio=bio,
     user.profile.skills=skillsArray

     await user.save();

      user={
        _id:user._id,
        fullName:fullName,
        email:user.email,
        phoneNumber:user.phoneNumber,
        role:user.role,
        profile:user.profile,
     }

     return res.status(200).json({
        message:"Profile Updated Sucessfully",
        user,
        success:true
     })

    }catch(error){
      console.log(error);
    }
}