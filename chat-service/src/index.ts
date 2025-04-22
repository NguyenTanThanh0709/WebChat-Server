import express, {Express, Request,Response} from 'express'
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import bodyParser from 'body-parser';
import { notFound, errorHandler } from "./middleware/index.middleware";
import api from "./api/index.api";
import { connectToDB } from './config/mongoose';
import messageRoutes from './api/message.route'; // đường dẫn tuỳ theo cấu trúc thư mục


const app:Express = express()

app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your front-end URL
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],  // Allow specific HTTP methods if necessary
    credentials: true,  // Allow cookies or other credentials to be sent
  }));
app.use(express.json())
app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.json());

connectToDB()
app.use("/", api);
app.use('/api/message', messageRoutes);


app.use(notFound);
app.use(errorHandler);

app.listen(8081, ()=>{
    console.log(`Server is running on port ${8081}`)
})