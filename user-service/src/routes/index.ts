import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import routerGroup from "./group";
import verifyToken from '../middlewares/verifyToken';
const rootRouter: Router = Router();


rootRouter.use('/auth', authRoutes);
rootRouter.use('/user', userRoutes);
rootRouter.use('/group', routerGroup);
export default rootRouter;
