import express from "express";
import cors from "cors";
import RegisterRoute from './Routes/Register.js'
const app = express();


app.use(cors());
app.use(express.json());

// routes
app.use("/api/user",RegisterRoute)



export default app;
