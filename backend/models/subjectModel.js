import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  subjectTitle: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  department: {
    type: String,
    default: "",
  },
  semester: {
    type: String,
    default: "",
  },
  instructorName:{
    type: String,
    default: "",
  },
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
},{timestamps : true});

const subjectModel = mongoose.model('Subject', subjectSchema);

export default subjectModel;
