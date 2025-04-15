import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import verifyToken from '../middlewares/verifyToken';
const rootRouter: Router = Router();


rootRouter.use('/auth', authRoutes);
rootRouter.use('/user',verifyToken, userRoutes);
export default rootRouter;
