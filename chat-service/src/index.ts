import express, {Express, Request,Response} from 'express'
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/index.middleware";
import api from "./api/index.api";
import { connectToDB } from './config/mongoose';


const app:Express = express()

app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your front-end URL
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],  // Allow specific HTTP methods if necessary
    credentials: true,  // Allow cookies or other credentials to be sent
  }));
app.use(express.json())
app.use(morgan("dev"));
app.use(helmet());


connectToDB()
app.use("/", api);
app.use(notFound);
app.use(errorHandler);

app.listen(8081, ()=>{
    console.log(`Server is running on port ${8081}`)
})