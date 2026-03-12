import express from 'express';
import { 
  addClient, 
  getClients, 
  getClientById, 
  updateClient, 
  deleteClient 
} from '../Controlles/clients.js';
import { verifyToken } from '../mideleware.js'; // adjust path

const router = express.Router();

router.post('/add', verifyToken, addClient);
router.get('/get', verifyToken, getClients);
router.get('/get/:id', verifyToken, getClientById);
router.put('/update/:id', verifyToken, updateClient);
router.delete('/delete/:id', verifyToken, deleteClient);

export default router;