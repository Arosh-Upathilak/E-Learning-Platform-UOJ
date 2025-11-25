import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const authenticateToken = (req,res,next)=>{
    const JWT_SECRET = process.env.JWT_SECRET;
    if(!req.cookies.token){
        return res.status(401).json({message: "Unauthorized"});
    }
    const token = req.cookies.token;

    try{
        const decoded = jwt.verify(token, JWT_SECRET);  
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({message: "Unauthorized"});
    }
}

export default authenticateToken;