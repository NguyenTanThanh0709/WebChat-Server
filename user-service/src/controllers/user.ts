import {Request,Response} from 'express'

export const getUser = async (req:Request, res:Response): Promise<void> => {
    res.json({ message: 'get user' });
}

