import subjectModel from '../models/subjectModel.js';

// create a subject
const createSubject = async (req,res) =>{
    try{
        const {subjectCode, subjectTitle,  description, department, semester, instructorName} = req.body;
        if(!subjectTitle || !subjectCode || !department || !semester){
            return res.status(400).json({ message: "All the fields are required" });
        }
        const subjectExixts = await subjectModel.findOne({subjectCode});
        if(subjectExixts){
            return res.status(400).json({ message: "Subject already exists" });
        }
        const subject = await subjectModel.create({
            subjectCode,
            subjectTitle,
            description,
            department,
            semester,
            instructorName,
            user: req.user.userId,
        });

        await subject.save();
        return res.status(201).json({ message: "Subject created successfully", subject });
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}

//delete a subject
const deleteSubject = async (req, res) =>{
    try{
        const {id} = req.params;
        const subject = await subjectModel.findByIdAndDelete(id);
        if(!subject){
            return res.status(400).json({ message: "Subject does not exist" });
        }
        return res.status(200).json({ message: "Subject deleted successfully" });
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}


// update a subject
const updateSubject = async (req, res) =>{
    try{
        const {id} = req.params;
        const {subjectCode, subjectTitle, description, department, semester, instructorName} = req.body;
        const subject = await subjectModel.findByIdAndUpdate(id, {
            subjectCode,
            subjectTitle,
            description,
            department,
            semester,
            instructorName,
            user: req.user._id,
        });
        if(!subject){
            return res.status(400).json({ message: "Subject does not exist" });
        }
        return res.status(200).json({ message: "Subject updated successfully" });
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}


//get a subject
const getSubject = async (req, res) =>{
    try{
        const {id} = req.params;
        const subject = await subjectModel.findById(id);
        if(!subject){
            return res.status(400).json({ message: "Subject does not exist" });
        }
        return res.status(200).json({ message: "Subject fetched successfully", subject });
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}

//list a subjects
const listSubjects = async (req, res) =>{
    try{
        const subjects = await subjectModel.find({user: req.user._id});
        return res.status(200).json({ message: "Subjects fetched successfully", subjects });
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}

//list all subjects
const listAllSubjects = async (req, res) =>{
    try{
        const subjects = await subjectModel.find();
        return res.status(200).json({ message: "Subjects fetched successfully", subjects });
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}

export {createSubject, deleteSubject, updateSubject, getSubject, listSubjects, listAllSubjects}