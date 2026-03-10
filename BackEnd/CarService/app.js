import express from "express";
import cors from "cors";
import CarRoute from './Routes/car.route.js'
const app = express();


app.use(cors());
app.use(express.json());

// routes
app.use("/Car",CarRoute)



export default app;
