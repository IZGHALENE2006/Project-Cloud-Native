import express from "express";
import cors from "cors";
import ClientRoute from './Routes/Clients.Route.js'
const app = express();


app.use(cors());
app.use(express.json());

// routes
app.use("/Client",ClientRoute)



export default app;
