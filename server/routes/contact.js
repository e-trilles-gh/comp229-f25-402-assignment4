import express from 'express';
import {
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
    deleteAllContacts,
    createContact
} from '../controllers/contact.js';
import authMiddleware from '../middlewares/auth.js';

// Router /projects
const router = express.Router();

// HTTP verbs for RESTful APIs GET, POST, PUT, DELETE
router.get('/', authMiddleware, getAllContacts);
router.get('/:id', authMiddleware, getContactById);
router.post('/', authMiddleware,createContact);
router.put('/:id', authMiddleware, updateContact);
router.delete('/:id', authMiddleware, deleteContact);
router.delete('/', authMiddleware, deleteAllContacts);

export default router;