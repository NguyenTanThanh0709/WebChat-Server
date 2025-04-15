import { Router, Request, Response, NextFunction } from "express";
import { getUser } from "../controllers/user";

const router: Router = Router();

router.get('/user', (req: Request, res: Response, next: NextFunction) => {
    getUser(req, res)      
});



export default router;

