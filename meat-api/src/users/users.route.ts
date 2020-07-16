import {Router, Request, Response, NextFunction} from 'express';
import User from './users.model';

const router = Router();

router.get('/users', (req: Request, res: Response, next: NextFunction) => {
    User.find().then(users => {
        res.json(users)
    })
});


router.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    User.findById(id).then(user => {
        if(user) {
            res.json(user);
        }

        res.send(404);  
    })
})

router.post('/users', (req: Request, res: Response, next: NextFunction) => {
   const user = new User(req.body);

    user.save()
    .then(user => {
        const _user = user.toObject();
        delete _user.password;

        console.log({user});

        res.json(_user);
    })
    .catch(error => {
        console.log({error});
        res.json({message: 'Something whent wrong!'})
    })
})

export default router;