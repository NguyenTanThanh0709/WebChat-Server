import { Router, Request, Response, NextFunction } from "express";
import { login, register } from "../controllers/auth";

const router: Router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    login(req, res).catch(next);        
});

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    register(req, res).catch(next);
});

export default router;

