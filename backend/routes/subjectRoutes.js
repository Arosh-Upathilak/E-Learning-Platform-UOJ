import express from 'express';
import  {createSubject, deleteSubject, updateSubject, getSubject, listSubjects, listAllSubjects} from '../controllers/subjectControllers.js';
import authenticateToken  from '../middelwares/authMiddleware.js';

const subjectRouter = express.Router();

subjectRouter.post('/createSubject',authenticateToken, createSubject);
subjectRouter.delete('/deleteSubject',authenticateToken, deleteSubject);
subjectRouter.put('/updateSubject/:id',authenticateToken, updateSubject);
subjectRouter.get('/getSubject',authenticateToken, getSubject);
subjectRouter.get('/listSubjects',authenticateToken, listSubjects);
subjectRouter.get('/listAllSubjects',authenticateToken, listAllSubjects);

export default subjectRouter;