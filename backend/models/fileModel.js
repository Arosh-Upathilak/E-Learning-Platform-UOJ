import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    fileUniqueName :{
        type: String,
        required: true,
        unique: true,
    },
    fileName:{
        type: String,
        required: true,
    },
    fileTitle:{
        type: String,
        required: true,
    },
    fileType:{
        type: String,
        required: true,
    },
    fileUrl:{
        type: String,
        required: true,
    },
    filePath:{
        type: String,
    },
    fileSize:{
        type: String,
        required: true,
    },
    subject:{
        type:String,
        required: true,
    },
    description:{
        type:String,
    },
    instructorName:{
        type: String,
        required: true,
        default: "",
    },
    department:{
        type: String,
        required: true,
        default: "",
    },
    semester:{
        type: String,
        required: true,
        default: "",
    },
    subjectId:{
        type: String,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
 
},{timestamps : true});

const fileModel = mongoose.model('File', fileSchema);
export default fileModel;