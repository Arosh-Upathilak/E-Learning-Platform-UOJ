import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    IsAdmin : {
        type: Boolean,
        default: false
    },
    department : {
        type: String,
        default: ''
    },
    semester : {
        type: String,
        default: ''
    },
    otp:{
        type: String
    },
    otpExpiration:{
        type: Date
    },
    isVerify:{
        type: Boolean,
        default: false
    }

},{timestamps : true})


const userModel = mongoose.model('User',userSchema);
export default userModel;