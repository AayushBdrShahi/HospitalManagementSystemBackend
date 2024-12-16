import express from 'express'

import { loginDoctor } from '../contollers/doctorController.js'

const doctorRouter =  express.Router()

doctorRouter.post('/login',loginDoctor);

export default doctorRouter