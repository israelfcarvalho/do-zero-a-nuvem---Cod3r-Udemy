import {Router, Request, Response, NextFunction} from 'express';
import User from './users.model';

const router = Router();

router.get('/users', (req: Request, res: Response, next: NextFunction) => {
    User.findAll().then(users => {
        res.json(users)
    })
});


router.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id);

    User.findById(id).then(users => {
        if(users.length > 0) {
            res.json(users[0]);
        }

        res.send(404);  
    })
})

export default router;