import express from 'express'
const route = express.Router()
import { AddnewAdmin } from '../controlles/RegisterAdmin.js'
import { Login } from '../controlles/Login.js'

//Route Register 
route.post('/Register',AddnewAdmin)
route.post('/Login',Login)

export default route