import {Router, Request, Response, NextFunction} from 'express';
import {CastError} from 'mongoose';

import User from './users.model';
import { json } from 'body-parser';

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
        res.json(user);
    })
    .catch(error => {
        console.error({error});
        res.json({message: 'Something whent wrong!'})
    })
})

router.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const user = new User({_id, ...req.body});
    
    const update = user.getPutUpdate();

    User.findByIdAndUpdate(
        {_id},
        update,
        {new: true, useFindAndModify: false, multipleCastError: true, runValidators: true}
    )
    .then(value => {
        if(value) {
            res.json(value)
        } else {
            res.sendStatus(404);
        }
    })
    .catch(error => {
        console.error({error});
        const errors = error.errors;
        const errorKeys = Object.keys(error.errors)
        const errorObject: any = {error: {}}
        
        errorKeys.forEach(key => {
            errorObject.error[key] = errors[key].properties.message;
        })

        res.json(errorObject);
    })
})

export default router;