import express from 'express'
const route = express.Router()

import { AddCars ,GetCar,DeleteCar,UpdateCar} from '../controlles/cars.js'
import upload from '../auth/upload.js'
import { auth } from '../mideleware.js' 

// Add Car
route.post('/Add', auth, upload.single('image'), AddCars)

// Get All Cars
route.get('/get', auth, GetCar)

// Delete Car
route.delete('/Delete/:id', auth, DeleteCar)

// Update Car
route.put('/Update/:id', auth,upload.single('image'), UpdateCar)

export default route