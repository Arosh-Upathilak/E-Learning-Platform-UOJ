import express from 'express';
import {createFile, deleteFile, findFilebyUserId,findFilebyFileId, findAllFiles} from '../controllers/fileControllers.js';
import authenticateToken  from '../middelwares/authMiddleware.js';

const fileRouter = express.Router();

fileRouter.post('/createfile', authenticateToken, createFile);
fileRouter.delete('/deletefile/:id', authenticateToken, deleteFile);
fileRouter.get('/findFileByUserId', authenticateToken, findFilebyUserId);
fileRouter.get('/findFileByFileId/:id', authenticateToken, findFilebyFileId);
fileRouter.get('/findAllFiles', authenticateToken, findAllFiles);

export default fileRouter;