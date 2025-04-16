import express, {Express, Request,Response} from 'express'
import { PORT } from './secrets'
import cors from 'cors';  // Import the CORS middleware
import rootRouter from './routes'
import { PrismaClient } from './generated/prisma/client'

const app:Express = express()
app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your front-end URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods if necessary
    credentials: true,  // Allow cookies or other credentials to be sent
  }));
app.use(express.json())
app.use('/api', rootRouter)
export const prismaClient = new PrismaClient({
    log:['query'],
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})