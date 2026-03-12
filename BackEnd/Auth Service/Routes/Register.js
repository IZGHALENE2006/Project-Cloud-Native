import express from 'express'
const route = express.Router()
import { AddnewAdmin,AllAdmins } from '../controlles/RegisterAdmin.js'
import { Login } from '../controlles/Login.js'

//Route Register 
route.post('/Register',AddnewAdmin)
route.post('/Login',Login)
route.get('/Admins',AllAdmins)

export default route