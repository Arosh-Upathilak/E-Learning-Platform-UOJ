import fileModel from "../models/fileModel.js";

//create a file
const createFile = async (req, res) => {
  try {
    const { fileUniqueName, fileName, fileTitle,  fileType, fileUrl, filePath, fileSize,description,instructorName, subject } = req.body;
    if (  !fileName || !fileTitle || !fileType || !fileUrl || !fileSize || !subject) {
      return res.status(400).json({ message: "All the fields are required" });
    }
    const fileExists = await fileModel.findOne({ fileUniqueName });
    if (fileExists) {
      return res.status(400).json({ message: "File already exists" });
    }
    const newfile = await fileModel.create({
      fileUniqueName,
      fileName,
      fileTitle,
      fileType,
      fileUrl,
      filePath,
      fileSize,
      description,
      instructorName,
      subject,
      user: req.user.userId,
    });
    await newfile.save();
    return res.status(201).json({ message: "File created successfully", newfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//delete a file
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await fileModel.findByIdAndDelete(id);
    if (!file) {
      return res.status(400).json({ message: "File does not exist" });
    }
    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//find file using user id
const findFileByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await fileModel.find({ user: id });
    if (!file) {
      return res.status(400).json({ message: "File does not exist" });
    }
    return res.status(200).json({ message: "File fetched successfully", file });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//find all files
const findAllFiles = async (req, res) => {
  try {
    const files = await fileModel.find();
    if (!files) {
      return res.status(400).json({ message: "Files does not exist" });
    }
    return res.status(200).json({ message: "Files fetched successfully", files });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {createFile, deleteFile, findFileByUserId, findAllFiles}